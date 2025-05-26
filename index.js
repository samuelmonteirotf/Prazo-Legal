const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const stringSimilarity = require("string-similarity")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const knowledgeBase = require("./knowledgeBase.json")

const app = express()
const PORT = process.env.PORT || 3001

// Middleware de segurança
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela de tempo
  message: {
    error: "Muitas tentativas. Tente novamente em 15 minutos.",
  },
})
app.use("/api/", limiter)

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://seudominio.com", "https://www.seudominio.com"]
      : ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }))

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Função para encontrar a melhor resposta
function findBestMatch(userMessage) {
  if (!userMessage || typeof userMessage !== "string") {
    return null
  }

  const normalizedUserMessage = userMessage.toLowerCase().trim()

  // Primeiro, procura por palavras-chave específicas
  const keywordMatches = knowledgeBase.filter((item) => {
    const keywords = item.keywords || []
    return keywords.some((keyword) => normalizedUserMessage.includes(keyword.toLowerCase()))
  })

  if (keywordMatches.length > 0) {
    // Retorna o primeiro match por palavra-chave (prioridade alta)
    return keywordMatches[0]
  }

  // Se não encontrou por palavra-chave, usa similaridade de string
  let bestMatch = null
  let highestSimilarity = 0

  knowledgeBase.forEach((item) => {
    const similarity = stringSimilarity.compareTwoStrings(normalizedUserMessage, item.pergunta.toLowerCase())

    if (similarity > highestSimilarity && similarity > 0.3) {
      highestSimilarity = similarity
      bestMatch = item
    }
  })

  return bestMatch
}

// Função para gerar resposta contextual
function generateContextualResponse(userMessage, match) {
  if (!match) {
    return {
      reply:
        "Desculpe, não encontrei uma resposta específica para sua pergunta. Posso ajudar com informações sobre:\n\n" +
        "• Instalação de Certificados A1 (Windows/Mac)\n" +
        "• Instalação de Certificados A3 Físico\n" +
        "• Configuração do Vidaas (Computador/Celular)\n" +
        "• Configuração no PJe\n" +
        "• Configuração no Projudi\n\n" +
        "Por favor, reformule sua pergunta ou entre em contato com nosso suporte técnico.",
      confidence: 0,
      category: "fallback",
    }
  }

  return {
    reply: match.resposta,
    confidence: 1,
    category: match.categoria || "geral",
    relatedTopics: match.topicos_relacionados || [],
  }
}

// Rotas da API

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
  })
})

// Endpoint principal do chatbot
app.post("/api/message", (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({
        error: "Mensagem é obrigatória",
        code: "MISSING_MESSAGE",
      })
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        error: "Mensagem deve ser uma string não vazia",
        code: "INVALID_MESSAGE",
      })
    }

    if (message.length > 500) {
      return res.status(400).json({
        error: "Mensagem muito longa (máximo 500 caracteres)",
        code: "MESSAGE_TOO_LONG",
      })
    }

    const bestMatch = findBestMatch(message)
    const response = generateContextualResponse(message, bestMatch)

    // Log da interação (sem dados sensíveis)
    console.log(`Pergunta: "${message.substring(0, 50)}..." | Confiança: ${response.confidence}`)

    res.json({
      ...response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro no processamento da mensagem:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    })
  }
})

// Endpoint para listar categorias disponíveis
app.get("/api/categories", (req, res) => {
  try {
    const categories = [...new Set(knowledgeBase.map((item) => item.categoria))]
    res.json({
      categories,
      total: categories.length,
    })
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    })
  }
})

// Endpoint para buscar perguntas por categoria
app.get("/api/questions/:category", (req, res) => {
  try {
    const { category } = req.params
    const questions = knowledgeBase
      .filter((item) => item.categoria === category)
      .map((item) => ({
        id: item.id,
        pergunta: item.pergunta,
        categoria: item.categoria,
      }))

    res.json({
      category,
      questions,
      total: questions.length,
    })
  } catch (error) {
    console.error("Erro ao buscar perguntas:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    })
  }
})

// Endpoint para estatísticas
app.get("/api/stats", (req, res) => {
  try {
    const totalQuestions = knowledgeBase.length
    const categories = [...new Set(knowledgeBase.map((item) => item.categoria))]

    const categoryStats = categories.map((cat) => ({
      category: cat,
      count: knowledgeBase.filter((item) => item.categoria === cat).length,
    }))

    res.json({
      totalQuestions,
      totalCategories: categories.length,
      categoryBreakdown: categoryStats,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    })
  }
})

// Middleware para rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    code: "NOT_FOUND",
    availableRoutes: [
      "GET /api/health",
      "POST /api/message",
      "GET /api/categories",
      "GET /api/questions/:category",
      "GET /api/stats",
    ],
  })
})

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  console.error("Erro não tratado:", error)
  res.status(500).json({
    error: "Erro interno do servidor",
    code: "INTERNAL_ERROR",
  })
})

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📚 Base de conhecimento carregada com ${knowledgeBase.length} itens`)
  console.log(`🔗 Health check disponível em: http://localhost:${PORT}/api/health`)
  console.log(`🤖 API do chatbot em: http://localhost:${PORT}/api/message`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Recebido SIGTERM. Encerrando servidor graciosamente...")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("Recebido SIGINT. Encerrando servidor graciosamente...")
  process.exit(0)
})
