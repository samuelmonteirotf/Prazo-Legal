class ProcessService {
  constructor() {
    this.baseURL = import.meta.env.PROD ? "" : "http://localhost:3001"
    this.apiURL = `${this.baseURL}/api`
  }

  async estimateTime(data) {
    const response = await fetch(`${this.apiURL}/estimar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro na comunicação com o servidor")
    }

    return response.json()
  }

  async getTiposAcao() {
    const response = await fetch(`${this.apiURL}/tipos-acao`)
    if (!response.ok) {
      throw new Error("Erro ao buscar tipos de ação")
    }
    return response.json()
  }

  async getTribunais(filters = {}) {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${this.apiURL}/tribunais?${params}`)
    if (!response.ok) {
      throw new Error("Erro ao buscar tribunais")
    }
    return response.json()
  }

  async getEstimativas(filters = {}) {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${this.apiURL}/estimativas?${params}`)
    if (!response.ok) {
      throw new Error("Erro ao buscar estimativas")
    }
    return response.json()
  }

  async getStats() {
    const response = await fetch(`${this.apiURL}/estatisticas`)
    if (!response.ok) {
      throw new Error("Erro ao buscar estatísticas")
    }
    return response.json()
  }

  async checkHealth() {
    const response = await fetch(`${this.apiURL}/health`)
    if (!response.ok) {
      throw new Error("Servidor indisponível")
    }
    return response.json()
  }
}

export { ProcessService }
