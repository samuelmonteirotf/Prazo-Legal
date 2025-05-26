import { Clock, TrendingUp, AlertCircle, CheckCircle, Info, Building } from "lucide-react"

const ResultCard = ({ estimativa }) => {
  const getConfiabilidadeColor = (confiabilidade) => {
    switch (confiabilidade) {
      case "alta":
        return "text-green-600 bg-green-100"
      case "media":
        return "text-yellow-600 bg-yellow-100"
      case "baixa":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getConfiabilidadeIcon = (confiabilidade) => {
    switch (confiabilidade) {
      case "alta":
        return <CheckCircle className="w-4 h-4" />
      case "media":
        return <AlertCircle className="w-4 h-4" />
      case "baixa":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getComplexidadeLabel = (complexidade) => {
    const labels = {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
      muito_alta: "Muito Alta",
    }
    return labels[complexidade] || complexidade
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-green-100 rounded-lg mr-3">
          <Clock className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Estimativa de Tempo</h2>
          <p className="text-sm text-gray-500">Baseada em {estimativa.estimativa.baseAmostral} casos similares</p>
        </div>
      </div>

      {/* Resultado Principal */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{estimativa.estimativa.tempo.texto}</div>
          <p className="text-gray-600">Tempo estimado de tramitação</p>
        </div>
      </div>

      {/* Detalhes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Tipo de Ação</h4>
          <p className="text-gray-600">{estimativa.estimativa.tipoAcao}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Tribunal</h4>
          <p className="text-gray-600">{estimativa.estimativa.tribunal}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Instância</h4>
          <p className="text-gray-600">{estimativa.estimativa.instancia}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Complexidade</h4>
          <p className="text-gray-600">{getComplexidadeLabel(estimativa.estimativa.complexidade)}</p>
        </div>
      </div>

      {/* Confiabilidade */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 text-gray-500 mr-2" />
          <span className="font-medium text-gray-900">Confiabilidade:</span>
        </div>
        <div
          className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConfiabilidadeColor(estimativa.estimativa.confiabilidade)}`}
        >
          {getConfiabilidadeIcon(estimativa.estimativa.confiabilidade)}
          <span className="ml-1 capitalize">{estimativa.estimativa.confiabilidade}</span>
        </div>
      </div>

      {/* Informações do Tribunal */}
      {estimativa.tribunal && (
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-gray-500 mr-2" />
            <h4 className="font-medium text-gray-900">Informações do Tribunal</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Tipo:</span>
              <p className="text-gray-600">{estimativa.tribunal.tipo}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Estado:</span>
              <p className="text-gray-600">{estimativa.tribunal.estado}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Região:</span>
              <p className="text-gray-600">{estimativa.tribunal.regiao}</p>
            </div>
          </div>

          {estimativa.tribunal.caracteristicas && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Volume:</span>
                <p className="text-gray-600 capitalize">
                  {estimativa.tribunal.caracteristicas.volume_processos?.replace("_", " ")}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Digitalização:</span>
                <p className="text-gray-600 capitalize">{estimativa.tribunal.caracteristicas.digitalizacao}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Celeridade:</span>
                <p className="text-gray-600 capitalize">{estimativa.tribunal.caracteristicas.celeridade}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Range de Tempo */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📊 Detalhamento</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Tempo Mínimo:</span>
            <p className="text-blue-700">{estimativa.estimativa.tempo.min} meses</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Tempo Máximo:</span>
            <p className="text-blue-700">{estimativa.estimativa.tempo.max} meses</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultCard
