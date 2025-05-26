const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const path = require("path")
const _ = require("lodash")
const moment = require("moment")
require("dotenv").config()

// Importar dados
const estimativasData = require("./data/estimativas.json")
const tribunaisData = require("./data/tribunais.json")
const tiposAcaoData = require("./data/tipos-acao.json")

const app = express()
const PORT = process.env.PORT || 3001

// Middleware de segurança
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // máximo 200 requests por IP por janela de tempo
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

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))
}

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Funções auxiliares
function calcularTempoMedio(estimativas) {
  if (!estimativas || estimativas.length === 0) return null

  const tempos = estimativas.map((est) => ({
    min: est.tempo_min_meses,
    max: est.tempo_max_meses,
  }))

  const minMedio = Math.round(_.meanBy(tempos, "min"))
  const maxMedio = Math.round(_.meanBy(tempos, "max"))

  return {
    min: minMedio,
    max: maxMedio,
    texto: `${minMedio} a ${maxMedio} meses`,
  }
}

function buscarEstimativas(tipoAcao, tribunal, instancia) {
  const filtros = {}

  if (tipoAcao) filtros.tipo_acao = tipoAcao
  if (tribunal) filtros.tribunal = tribunal
  if (instancia) filtros.instancia = instancia

  return estimativasData.filter((est) => {
    return Object.keys(filtros).every((key) => est[key] && est[key].toLowerCase().includes(filtros[key].toLowerCase()))
  })
}

function obterComparativo(tipoAcao, tribunal) {
  // Buscar estimativas similares para comparação
  const estimativasPorTipo = _.groupBy(estimativasData, "tipo_acao")
  const comparativo = []

  Object.keys(estimativasPorTipo).forEach((tipo) => {
    const estimativas = estimativasPorTipo[tipo]
    const tempoMedio = calcularTempoMedio(estimativas)

    if (tempoMedio) {
      comparativo.push({
        tipo: tipo,
        tempo: tempoMedio,
        isSelected: tipo.toLowerCase() === tipoAcao?.toLowerCase(),
      })
    }
  })

  return _.orderBy(comparativo, ["tempo.min"], ["asc"])
}

// Rotas da API

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  })
})

// Listar tipos de ação
app.get("/api/tipos-acao", (req, res) => {
  try {
    res.json({
      tipos: tiposAcaoData,
      total: tiposAcaoData.length,
    })
  } catch (error) {
    console.error("Erro ao buscar tipos de ação:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    })
  }
})

// Listar tribunais
app.get("/api/tribunais", (req, res) => {
  try {
    const { estado, tipo } = req.query
    let tribunaisFiltrados = tribunaisData

    if (estado) {
      tribunaisFiltrados = tribunaisFiltrados.filter((t) => t.estado?.toLowerCase() === estado.toLowerCase())
    }

    if (tipo) {
      tribunaisFiltrados = tribunaisFiltrados.filter((t) => t.tipo?.toLowerCase() === tipo.toLowerCase())
    }

    res.json({
      tribunais: tribunaisFiltrados,
      total: tribunaisFiltrados.length,
    })
  } catch (error) {
    console.error("Erro ao buscar tribunais:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    })
  }
})

// Estimar tempo de processo
app.post("/api/estimar", (req, res) => {
  try {
    const { tipoAcao, tribunal, instancia, complexidade } = req.body

    if (!tipoAcao) {
      return res.status(400).json({
        error: "Tipo de ação é obrigatório",
        code: "MISSING_TIPO_ACAO",
      })
    }

    // Buscar estimativas
    const estimativas = buscarEstimativas(tipoAcao, tribunal, instancia)

    if (estimativas.length === 0) {
      return res.status(404).json({
        error: "Nenhuma estimativa encontrada para os critérios informados",
        code: "NO_ESTIMATES_FOUND",
        sugestao: "Tente com critérios mais amplos ou consulte um advogado especializado",
      })
    }

    // Calcular tempo médio
    const tempoMedio = calcularTempoMedio(estimativas)

    // Ajustar por complexidade
    if (complexidade && tempoMedio) {
      const multiplicadores = {
        baixa: 0.8,
        media: 1.0,
        alta: 1.3,
        muito_alta: 1.6,
      }

      const mult = multiplicadores[complexidade] || 1.0
      tempoMedio.min = Math.round(tempoMedio.min * mult)
      tempoMedio.max = Math.round(tempoMedio.max * mult)
      tempoMedio.texto = `${tempoMedio.min} a ${tempoMedio.max} meses`
    }

    // Obter dados comparativos
    const comparativo = obterComparativo(tipoAcao, tribunal)

    // Buscar informações do tribunal
    const tribunalInfo = tribunaisData.find(
      (t) =>
        t.codigo?.toLowerCase() === tribunal?.toLowerCase() || t.nome?.toLowerCase().includes(tribunal?.toLowerCase()),
    )

    // Log da consulta
    console.log(`Estimativa solicitada: ${tipoAcao} - ${tribunal} | Resultado: ${tempoMedio?.texto}`)

    res.json({
      estimativa: {
        tipoAcao,
        tribunal,
        instancia,
        complexidade,
        tempo: tempoMedio,
        confiabilidade: estimativas.length >= 3 ? "alta" : estimativas.length >= 2 ? "media" : "baixa",
        baseAmostral: estimativas.length,
      },
      tribunal: tribunalInfo,
      comparativo: comparativo.slice(0, 8), // Limitar a 8 itens
      observacoes: [
        "Estimativas baseadas em dados históricos e podem variar",
        "Complexidade do caso pode influenciar significativamente o tempo",
        "Recursos e instâncias superiores aumentam o prazo",
        "Consulte sempre um advogado para análise específica",
      ],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao processar estimativa:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    })
  }
})

// Buscar estimativas por filtros
app.get("/api/estimativas", (req, res) => {
  try {
    const { tipo, tribunal, instancia, limit = 50 } = req.query

    let estimativas = estimativasData

    if (tipo) {
      estimativas = estimativas.filter((est) => est.tipo_acao?.toLowerCase().includes(tipo.toLowerCase()))
    }

    if (tribunal) {
      estimativas = estimativas.filter((est) => est.tribunal?.toLowerCase().includes(tribunal.toLowerCase()))
    }

    if (instancia) {
      estimativas = estimativas.filter((est) => est.instancia?.toLowerCase() === instancia.toLowerCase())
    }

    // Limitar resultados
    estimativas = estimativas.slice(0, Number.parseInt(limit))

    res.json({
      estimativas,
      total: estimativas.length,
      filtros: { tipo, tribunal, instancia },
    })
  } catch (error) {
    console.error("Erro ao buscar estimativas:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    })
  }
})

// Estatísticas gerais
app.get("/api/estatisticas", (req, res) => {
  try {
    const totalEstimativas = estimativasData.length
    const totalTribunais = tribunaisData.length
    const totalTiposAcao = tiposAcaoData.length

    // Estatísticas por instância
    const porInstancia = _.countBy(estimativasData, "instancia")

    // Estatísticas por estado
    const porEstado = _.countBy(estimativasData, "estado")

    // Tempo médio geral
    const tempoMedioGeral = calcularTempoMedio(estimativasData)

    // Tipos de ação mais comuns
    const tiposMaisComuns = _.chain(estimativasData)
      .countBy("tipo_acao")
      .toPairs()
      .orderBy([1], ["desc"])
      .take(10)
      .fromPairs()
      .value()

    res.json({
      resumo: {
        totalEstimativas,
        totalTribunais,
        totalTiposAcao,
        tempoMedioGeral,
      },
      distribuicao: {
        porInstancia,
        porEstado,
        tiposMaisComuns,
      },
      ultimaAtualizacao: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    res.status(500).json({
      error: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    })
  }
})

// Em produção, serve o frontend para todas as rotas não-API
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  })
}

// Middleware para rotas não encontradas (apenas para APIs)
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    code: "NOT_FOUND",
    availableRoutes: [
      "GET /api/health",
      "GET /api/tipos-acao",
      "GET /api/tribunais",
      "POST /api/estimar",
      "GET /api/estimativas",
      "GET /api/estatisticas",
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
  console.log(`📊 Base de dados carregada:`)
  console.log(`   • ${estimativasData.length} estimativas`)
  console.log(`   • ${tribunaisData.length} tribunais`)
  console.log(`   • ${tiposAcaoData.length} tipos de ação`)
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
  console.log(`⚖️ API estimativas: http://localhost:${PORT}/api/estimar`)
  if (process.env.NODE_ENV === "production") {
    console.log(`🌐 Frontend: http://localhost:${PORT}`)
  }
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
