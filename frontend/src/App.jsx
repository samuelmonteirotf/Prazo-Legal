"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import EstimatorForm from "./components/EstimatorForm"
import ResultCard from "./components/ResultCard"
import ComparisonChart from "./components/ComparisonChart"
import StatsCard from "./components/StatsCard"
import { ProcessService } from "./services/ProcessService"
import { Scale, Clock, TrendingUp, AlertCircle } from "lucide-react"

function App() {
  const [estimativa, setEstimativa] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [stats, setStats] = useState(null)

  const processService = new ProcessService()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const statsData = await processService.getStats()
      setStats(statsData)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    }
  }

  const handleEstimate = async (formData) => {
    setLoading(true)
    setError("")
    setEstimativa(null)

    try {
      const result = await processService.estimateTime(formData)
      setEstimativa(result)
    } catch (error) {
      console.error("Erro ao estimar tempo:", error)
      setError(error.message || "Erro ao processar estimativa. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <Scale className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Estimador de Tempo de Processo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Obtenha estimativas precisas do tempo de tramitação de processos judiciais com base no tipo de ação e
            tribunal escolhido
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon={<Scale className="w-6 h-6" />}
              title="Estimativas Disponíveis"
              value={stats.resumo.totalEstimativas}
              description="Tipos de processo mapeados"
              color="blue"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Tribunais Cobertos"
              value={stats.resumo.totalTribunais}
              description="Instâncias e jurisdições"
              color="green"
            />
            <StatsCard
              icon={<Clock className="w-6 h-6" />}
              title="Tempo Médio Geral"
              value={stats.resumo.tempoMedioGeral?.texto || "N/A"}
              description="Todas as ações"
              color="purple"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <EstimatorForm onSubmit={handleEstimate} loading={loading} />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="card text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Processando estimativa...</p>
              </div>
            )}

            {estimativa && !loading && (
              <div className="space-y-6 animate-fade-in">
                <ResultCard estimativa={estimativa} />

                {estimativa.comparativo && estimativa.comparativo.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativo por Tipo de Ação</h3>
                    <ComparisonChart data={estimativa.comparativo} />
                  </div>
                )}

                {/* Observações */}
                {estimativa.observacoes && (
                  <div className="card bg-blue-50 border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">⚠️ Observações Importantes</h4>
                    <ul className="space-y-2">
                      {estimativa.observacoes.map((obs, index) => (
                        <li key={index} className="text-blue-800 text-sm flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {obs}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!estimativa && !loading && (
              <div className="card text-center">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Pronto para Estimar</h3>
                <p className="text-gray-600">
                  Preencha o formulário ao lado para obter uma estimativa do tempo de tramitação do seu processo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Como Funciona</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                • <strong>Dados Históricos:</strong> Baseado em estatísticas reais dos tribunais
              </p>
              <p>
                • <strong>Múltiplos Fatores:</strong> Considera tipo de ação, tribunal e complexidade
              </p>
              <p>
                • <strong>Atualização Constante:</strong> Base de dados atualizada regularmente
              </p>
              <p>
                • <strong>Estimativa Orientativa:</strong> Para planejamento e expectativas realistas
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚖️ Tribunais Suportados</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                • <strong>Estaduais:</strong> TJSP, TJRJ, TJMG, TJRS, TJPR, TJSC
              </p>
              <p>
                • <strong>Trabalhistas:</strong> TRT1, TRT2, TRT3, TRT4
              </p>
              <p>
                • <strong>Federais:</strong> TRF1, TRF2, TRF3, TRF4
              </p>
              <p>
                • <strong>Superiores:</strong> STJ, STF
              </p>
              <p>
                • <strong>Especiais:</strong> JEF, Juizados Especiais
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2024 Estimador de Tempo de Processo. Desenvolvido para a comunidade jurídica brasileira.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            ⚠️ As estimativas são orientativas e baseadas em dados históricos. Consulte sempre um advogado para análise
            específica do seu caso.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
