"use client"

import { useState, useEffect } from "react"
import { Search, Calculator, AlertTriangle } from "lucide-react"
import Select from "react-select"
import { ProcessService } from "../services/ProcessService"

const EstimatorForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    tipoAcao: "",
    tribunal: "",
    instancia: "1ª instância",
    complexidade: "media",
  })

  const [tiposAcao, setTiposAcao] = useState([])
  const [tribunais, setTribunais] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  const processService = new ProcessService()

  useEffect(() => {
    loadFormData()
  }, [])

  const loadFormData = async () => {
    try {
      setLoadingData(true)

      const [tiposResponse, tribunaisResponse] = await Promise.all([
        processService.getTiposAcao(),
        processService.getTribunais(),
      ])

      setTiposAcao(
        tiposResponse.tipos.map((tipo) => ({
          value: tipo.nome,
          label: tipo.nome,
          categoria: tipo.categoria,
          complexidade: tipo.complexidade_tipica,
        })),
      )

      setTribunais(
        tribunaisResponse.tribunais.map((tribunal) => ({
          value: tribunal.codigo,
          label: `${tribunal.nome} (${tribunal.codigo})`,
          tipo: tribunal.tipo,
          estado: tribunal.estado,
        })),
      )
    } catch (error) {
      console.error("Erro ao carregar dados do formulário:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.tipoAcao || !formData.tribunal) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    onSubmit(formData)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "white",
      color: state.isSelected ? "white" : "#374151",
    }),
  }

  if (loadingData) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <Calculator className="w-6 h-6 text-primary-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Dados do Processo</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Ação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ação *</label>
          <Select
            options={tiposAcao}
            value={tiposAcao.find((option) => option.value === formData.tipoAcao)}
            onChange={(option) => handleInputChange("tipoAcao", option?.value || "")}
            placeholder="Selecione o tipo de ação..."
            styles={customSelectStyles}
            isSearchable
            noOptionsMessage={() => "Nenhuma opção encontrada"}
          />
          <p className="text-xs text-gray-500 mt-1">Ex: Ação de Alimentos, Dano Moral, Divórcio, etc.</p>
        </div>

        {/* Tribunal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tribunal *</label>
          <Select
            options={tribunais}
            value={tribunais.find((option) => option.value === formData.tribunal)}
            onChange={(option) => handleInputChange("tribunal", option?.value || "")}
            placeholder="Selecione o tribunal..."
            styles={customSelectStyles}
            isSearchable
            noOptionsMessage={() => "Nenhum tribunal encontrado"}
          />
          <p className="text-xs text-gray-500 mt-1">Tribunal onde o processo será/está tramitando</p>
        </div>

        {/* Instância */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instância</label>
          <select
            value={formData.instancia}
            onChange={(e) => handleInputChange("instancia", e.target.value)}
            className="input-field"
          >
            <option value="1ª instância">1ª Instância</option>
            <option value="2ª instância">2ª Instância</option>
            <option value="Superior">Tribunal Superior</option>
          </select>
        </div>

        {/* Complexidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Complexidade do Caso</label>
          <select
            value={formData.complexidade}
            onChange={(e) => handleInputChange("complexidade", e.target.value)}
            className="input-field"
          >
            <option value="baixa">Baixa - Caso simples, poucos documentos</option>
            <option value="media">Média - Caso padrão</option>
            <option value="alta">Alta - Caso complexo, muitas provas</option>
            <option value="muito_alta">Muito Alta - Caso excepcional</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">A complexidade pode influenciar significativamente o tempo</p>
        </div>

        {/* Botão Submit */}
        <button
          type="submit"
          disabled={loading || !formData.tipoAcao || !formData.tribunal}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="loading-spinner mr-2"></div>
              Processando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Estimar Tempo
            </>
          )}
        </button>

        {/* Aviso */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Importante:</p>
              <p>
                As estimativas são baseadas em dados históricos e podem variar conforme as especificidades do caso,
                carga de trabalho do tribunal e outros fatores externos.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EstimatorForm
