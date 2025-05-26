class ChatService {
  constructor() {
    this.baseURL = import.meta.env.PROD ? "" : "http://localhost:3001"
    this.apiURL = `${this.baseURL}/api`
  }

  async sendMessage(message) {
    const response = await fetch(`${this.apiURL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro na comunicação com o servidor")
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

  async getCategories() {
    const response = await fetch(`${this.apiURL}/categories`)
    if (!response.ok) {
      throw new Error("Erro ao buscar categorias")
    }
    return response.json()
  }

  async getQuestionsByCategory(category) {
    const response = await fetch(`${this.apiURL}/questions/${category}`)
    if (!response.ok) {
      throw new Error("Erro ao buscar perguntas")
    }
    return response.json()
  }

  async getStats() {
    const response = await fetch(`${this.apiURL}/stats`)
    if (!response.ok) {
      throw new Error("Erro ao buscar estatísticas")
    }
    return response.json()
  }
}

export { ChatService }
