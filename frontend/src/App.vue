<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen transition-colors duration-300">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">ChatBot IA</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Certificados Digitais</p>
            </div>
          </div>
          
          <!-- Mobile Menu Button -->
          <button 
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <!-- Status & Theme Toggle -->
          <div class="hidden lg:flex items-center space-x-3">
            <div class="flex items-center space-x-2">
              <div :class="isConnected ? 'bg-green-500' : 'bg-red-500'" class="w-2 h-2 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ isConnected ? 'Online' : 'Offline' }}
              </span>
            </div>
            
            <button 
              @click="toggleTheme"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              :aria-label="isDarkMode ? 'Ativar tema claro' : 'Ativar tema escuro'"
            >
              <svg v-if="isDarkMode" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div class="flex max-w-7xl mx-auto">
        <!-- Sidebar -->
        <aside 
          :class="[
            'fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          ]"
        >
          <!-- Sidebar Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Perguntas Disponíveis</h2>
            <button 
              @click="toggleSidebar"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Sidebar Content -->
          <div class="h-full overflow-y-auto p-4">
            <div class="hidden lg:block mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Perguntas Disponíveis</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">Clique em uma pergunta para enviá-la</p>
            </div>

            <!-- Search -->
            <div class="mb-4">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar perguntas..."
                  class="w-full px-3 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loadingQuestions" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Carregando perguntas...</p>
            </div>

            <!-- Categories and Questions -->
            <div v-else class="space-y-4">
              <div v-for="category in filteredCategories" :key="category.name" class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  @click="toggleCategory(category.name)"
                  class="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-between"
                >
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">{{ category.displayName }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ category.questions.length }} perguntas</p>
                  </div>
                  <svg 
                    :class="['w-5 h-5 text-gray-400 transition-transform duration-200', expandedCategories.includes(category.name) ? 'rotate-180' : '']"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <div v-if="expandedCategories.includes(category.name)" class="border-t border-gray-200 dark:border-gray-600">
                  <div class="p-2 space-y-1">
                    <button
                      v-for="question in category.questions"
                      :key="question.id"
                      @click="sendQuickMessage(question.pergunta)"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 rounded-md transition-colors duration-200"
                    >
                      {{ question.pergunta }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div v-if="!loadingQuestions && filteredCategories.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
              </svg>
              <p class="text-gray-500 dark:text-gray-400">Nenhuma pergunta encontrada</p>
            </div>
          </div>
        </aside>

        <!-- Overlay for mobile -->
        <div 
          v-if="sidebarOpen" 
          @click="toggleSidebar"
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        ></div>

        <!-- Main Content -->
        <main class="flex-1 min-h-screen lg:ml-0">
          <div class="px-4 py-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              
              <!-- Messages Area -->
              <div 
                ref="messagesContainer"
                class="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
                @scroll="handleScroll"
              >
                <!-- Welcome Message -->
                <div v-if="messages.length === 0" class="text-center py-8">
                  <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Olá! Como posso ajudar?</h3>
                  <p class="text-gray-500 dark:text-gray-400">Pergunte sobre certificados A1, A3, Vidaas, PJe, Projudi e mais!</p>
                  <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    💡 Veja as perguntas disponíveis na lateral ou digite sua própria pergunta
                  </p>
                  
                  <!-- Quick Suggestions -->
                  <div class="mt-6 space-y-2">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Perguntas populares:</p>
                    <div class="flex flex-wrap gap-2 justify-center">
                      <button 
                        v-for="suggestion in quickSuggestions" 
                        :key="suggestion"
                        @click="sendQuickMessage(suggestion)"
                        class="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        {{ suggestion }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Messages -->
                <div 
                  v-for="message in messages" 
                  :key="message.id"
                  :class="message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'"
                >
                  <div 
                    :class="[
                      'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-none'
                    ]"
                  >
                    <p class="text-sm whitespace-pre-line">{{ message.text }}</p>
                    <div class="flex items-center justify-between mt-1">
                      <span class="text-xs opacity-70">
                        {{ formatTime(message.timestamp) }}
                      </span>
                      <span v-if="message.sender === 'ai' && message.confidence" class="text-xs opacity-70">
                        {{ Math.round(message.confidence * 100) }}% confiança
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Typing Indicator -->
                <div v-if="isTyping" class="flex justify-start">
                  <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg rounded-bl-none px-4 py-2 max-w-xs">
                    <div class="flex items-center space-x-1">
                      <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">IA está analisando...</span>
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="flex justify-center">
                  <div class="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg max-w-xs">
                    <p class="text-sm">{{ errorMessage }}</p>
                    <button @click="errorMessage = ''" class="text-xs underline mt-1">Dispensar</button>
                  </div>
                </div>
              </div>

              <!-- Input Area -->
              <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <form @submit.prevent="sendMessage" class="flex space-x-3">
                  <input
                    v-model="currentMessage"
                    ref="messageInput"
                    type="text"
                    placeholder="Digite sua pergunta sobre certificados digitais..."
                    class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    :disabled="isTyping || !isConnected"
                    @keydown.enter="sendMessage"
                    maxlength="500"
                  />
                  <button
                    type="submit"
                    :disabled="!currentMessage.trim() || isTyping || !isConnected"
                    class="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <svg v-if="!isTyping" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </button>
                </form>
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {{ currentMessage.length }}/500 caracteres
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Mensagens</p>
                    <p class="text-lg font-semibold text-blue-500">{{ messages.length }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                    <p class="text-lg font-semibold text-green-500">{{ isConnected ? 'Online' : 'Offline' }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Tema</p>
                    <p class="text-lg font-semibold text-purple-500">{{ isDarkMode ? 'Escuro' : 'Claro' }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Perguntas</p>
                    <p class="text-lg font-semibold text-orange-500">{{ totalQuestions }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'
import { ChatService } from './services/chatService.js'

// Reactive data
const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const isDarkMode = ref(false)
const isConnected = ref(true)
const errorMessage = ref('')
const messagesContainer = ref(null)
const messageInput = ref(null)
const aiResponseCount = ref(0)

// Quick suggestions for new users
const quickSuggestions = [
  'Como instalar A1?',
  'Configurar PJe',
  'Problemas com certificado',
  'Diferença A1 e A3'
]

// Chat service instance
const chatService = new ChatService()

// Send message function
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isTyping.value || !isConnected.value) return

  // Add user message
  const userMessage = {
    id: Date.now(),
    text: currentMessage.value,
    sender: 'user',
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  const messageText = currentMessage.value
  currentMessage.value = ''

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  // Show typing indicator
  isTyping.value = true
  errorMessage.value = ''

  try {
    // Call backend API
    const response = await chatService.sendMessage(messageText)
    
    const aiResponse = {
      id: Date.now() + 1,
      text: response.reply,
      sender: 'ai',
      timestamp: new Date(),
      confidence: response.confidence,
      category: response.category
    }
    
    messages.value.push(aiResponse)
    aiResponseCount.value++
    
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    
    const errorResponse = {
      id: Date.now() + 1,
      text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.',
      sender: 'ai',
      timestamp: new Date(),
      confidence: 0
    }
    
    messages.value.push(errorResponse)
    errorMessage.value = 'Erro de conexão com o servidor'
    isConnected.value = false
    
    // Try to reconnect after 5 seconds
    setTimeout(checkConnection, 5000)
  } finally {
    isTyping.value = false
    await nextTick()
    scrollToBottom()
  }
}

// Send quick message
const sendQuickMessage = (message) => {
  currentMessage.value = message
  sendMessage()
}

// Check connection to backend
const checkConnection = async () => {
  try {
    await chatService.checkHealth()
    isConnected.value = true
    errorMessage.value = ''
  } catch (error) {
    isConnected.value = false
    console.error('Falha na verificação de conexão:', error)
  }
}

// Scroll to bottom of messages
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Format time
const formatTime = (date) => {
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Toggle theme
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
}

// Handle scroll
const handleScroll = () => {
  // Could add scroll-based features here
}

// Adicione estas variáveis reativas após as existentes
const sidebarOpen = ref(false)
const searchQuery = ref('')
const loadingQuestions = ref(true)
const categories = ref([])
const expandedCategories = ref(['certificado-a1', 'problemas']) // Expandir algumas por padrão
const totalQuestions = ref(0)

// Adicione estes computed properties
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categories.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return categories.value.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.pergunta.toLowerCase().includes(query)
    )
  })).filter(category => category.questions.length > 0)
})

// Adicione estes métodos
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleCategory = (categoryName) => {
  const index = expandedCategories.value.indexOf(categoryName)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryName)
  }
}

const loadQuestions = async () => {
  try {
    loadingQuestions.value = true
    
    // Buscar categorias
    const categoriesResponse = await chatService.getCategories()
    
    // Buscar perguntas para cada categoria
    const categoryData = []
    for (const categoryName of categoriesResponse.categories) {
      try {
        const questionsResponse = await chatService.getQuestionsByCategory(categoryName)
        
        // Mapear nomes de categorias para nomes mais amigáveis
        const displayNames = {
          'certificado-a1': '📄 Certificado A1',
          'certificado-a3': '🔐 Certificado A3',
          'vidaas': '☁️ Vidaas',
          'pje': '⚖️ PJe',
          'projudi': '🏛️ Projudi',
          'problemas': '🔧 Problemas',
          'renovacao': '🔄 Renovação',
          'tipos': '📋 Tipos',
          'backup': '💾 Backup',
          'assinatura': '✍️ Assinatura'
        }
        
        categoryData.push({
          name: categoryName,
          displayName: displayNames[categoryName] || categoryName,
          questions: questionsResponse.questions
        })
      } catch (error) {
        console.error(`Erro ao carregar perguntas da categoria ${categoryName}:`, error)
      }
    }
    
    categories.value = categoryData
    totalQuestions.value = categoryData.reduce((total, cat) => total + cat.questions.length, 0)
    
  } catch (error) {
    console.error('Erro ao carregar perguntas:', error)
  } finally {
    loadingQuestions.value = false
  }
}

// Modifique o onMounted existente
onMounted(async () => {
  // Load theme preference
  const savedTheme = localStorage.getItem('darkMode')
  if (savedTheme !== null) {
    isDarkMode.value = savedTheme === 'true'
  } else {
    // Check system preference
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  // Focus input
  if (messageInput.value) {
    messageInput.value.focus()
  }
  
  // Check initial connection
  await checkConnection()
  
  // Load questions
  await loadQuestions()
  
  // Setup periodic connection check
  setInterval(checkConnection, 30000) // Check every 30 seconds
})
</script>
