const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const path = require("path")
const _ = require("lodash")
require("dotenv").config()

// Dados estáticos
const estimativasData = require("./data/estimativas.json")
const tribunaisData = require("./data/tribunais.json")
const tiposAcaoData = require("./data/tipos-acao.json")

const app = express()
const PORT = process.env.PORT || 8080

// 🚀 Importante para Railway (permite ler IP real atrás de proxy)
app.set("trust proxy", 1)

// Caminho para build do frontend
const frontendPath = path.join(__dirname, "frontend/dist")

// Segurança
app.use(helmet())

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    error: "Muitas tentativas. Tente novamente em 15 minutos."
  }
})
app.use("/api/", limiter)

// CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://seudominio.com", "https://www.seudominio.com"]
      : ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}
app.use(cors(corsOptions))

// Body parser
app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }))

// Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Funções auxiliares
function calcularTempoMedio(estimativas) {
  const tempos = estimativas.map(est => ({
    min: est.tempo_min_meses,
    max: est.tempo_max_meses
  }))
  const minMedio = Math.round(_.meanBy(tempos, "min"))
  const maxMedio = Math.round(_.meanBy(tempos, "max"))
  return { min: minMedio, max: maxMedio, texto: `${minMedio} a ${maxMedio} meses` }
}

function buscarEstimativas(tipoAcao, tribunal, instancia) {
  const filtros = {}
  if (tipoAcao) filtros.tipo_acao = tipoAcao
  if (tribunal) filtros.tribunal = tribunal
  if (instancia) filtros.instancia = instancia

  return estimativasData.filter(est =>
    Object.keys(filtros).every(key =>
      est[key]?.toLowerCase().includes(filtros[key].toLowerCase())
    )
  )
}

function obterComparativo(tipoAcao) {
  const estimativasPorTipo = _.groupBy(estimativasData, "tipo_acao")
  return Object.entries(estimativasPorTipo).map(([tipo, ests]) => ({
    tipo,
    tempo: calcularTempoMedio(ests),
    isSelected: tipo.toLowerCase() === tipoAcao?.toLowerCase()
  }))
}

// Rotas da API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  })
})

app.get("/api/tipos-acao", (req, res) => {
  res.json({ tipos: tiposAcaoData, total: tiposAcaoData.length })
})

app.get("/api/tribunais", (req, res) => {
  const { estado, tipo } = req.query
  let filtrados = tribunaisData
  if (estado) filtrados = filtrados.filter(t => t.estado?.toLowerCase() === estado.toLowerCase())
  if (tipo) filtrados = filtrados.filter(t => t.tipo?.toLowerCase() === tipo.toLowerCase())
  res.json({ tribunais: filtrados, total: filtrados.length })
})

app.post("/api/estimar", (req, res) => {
  const { tipoAcao, tribunal, instancia, complexidade } = req.body
  if (!tipoAcao) {
    return res.status(400).json({ error: "Tipo de ação é obrigatório", code: "MISSING_TIPO_ACAO" })
  }

  const estimativas = buscarEstimativas(tipoAcao, tribunal, instancia)
  if (!estimativas.length) {
    return res.status(404).json({
      error: "Nenhuma estimativa encontrada",
      code: "NO_ESTIMATES_FOUND"
    })
  }

  const tempoMedio = calcularTempoMedio(estimativas)
  const multiplicadores = { baixa: 0.8, media: 1.0, alta: 1.3, muito_alta: 1.6 }
  if (complexidade && tempoMedio) {
    const mult = multiplicadores[complexidade] || 1
    tempoMedio.min = Math.round(tempoMedio.min * mult)
    tempoMedio.max = Math.round(tempoMedio.max * mult)
    tempoMedio.texto = `${tempoMedio.min} a ${tempoMedio.max} meses`
  }

  const comparativo = obterComparativo(tipoAcao)

  res.json({
    estimativa: {
      tipoAcao,
      tribunal,
      instancia,
      complexidade,
      tempo: tempoMedio,
      confiabilidade: estimativas.length >= 3 ? "alta" : estimativas.length >= 2 ? "media" : "baixa",
      baseAmostral: estimativas.length
    },
    comparativo: comparativo.slice(0, 8),
    timestamp: new Date().toISOString()
  })
})

app.get("/api/estimativas", (req, res) => {
  const { tipo, tribunal, instancia, limit = 50 } = req.query
  let estimativas = estimativasData
  if (tipo) estimativas = estimativas.filter(est => est.tipo_acao?.toLowerCase().includes(tipo.toLowerCase()))
  if (tribunal) estimativas = estimativas.filter(est => est.tribunal?.toLowerCase().includes(tribunal.toLowerCase()))
  if (instancia) estimativas = estimativas.filter(est => est.instancia?.toLowerCase() === instancia.toLowerCase())

  res.json({
    estimativas: estimativas.slice(0, Number(limit)),
    total: estimativas.length
  })
})

app.get("/api/estatisticas", (req, res) => {
  const totalEstimativas = estimativasData.length
  const totalTribunais = tribunaisData.length
  const totalTiposAcao = tiposAcaoData.length
  const porInstancia = _.countBy(estimativasData, "instancia")
  const porEstado = _.countBy(estimativasData, "estado")
  const tempoMedioGeral = calcularTempoMedio(estimativasData)
  const tiposMaisComuns = _(estimativasData)
    .countBy("tipo_acao")
    .toPairs()
    .orderBy([1], ["desc"])
    .take(10)
    .fromPairs()
    .value()

  res.json({
    resumo: { totalEstimativas, totalTribunais, totalTiposAcao, tempoMedioGeral },
    distribuicao: { porInstancia, porEstado, tiposMaisComuns },
    ultimaAtualizacao: new Date().toISOString()
  })
})

// 404 somente para API
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Rota não encontrada", code: "NOT_FOUND" })
})

// ⚠️ Serve frontend APENAS após as rotas da API
if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendPath))
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"))
  })
}

// Tratamento de erros globais
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err)
  res.status(500).json({ error: "Erro interno do servidor", code: "INTERNAL_ERROR" })
})

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📊 ${estimativasData.length} estimativas | ${tribunaisData.length} tribunais | ${tiposAcaoData.length} tipos de ação`)
})
