<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen transition-colors duration-300">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">ChatBot IA</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Assistente Virtual Inteligente</p>
            </div>
          </div>
          
          <!-- Theme Toggle -->
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
      </header>

      <!-- Chat Container -->
      <main class="max-w-4xl mx-auto px-4 py-6">
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
              <p class="text-gray-500 dark:text-gray-400">Digite sua mensagem abaixo para começar nossa conversa.</p>
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
                <p class="text-sm">{{ message.text }}</p>
                <span class="text-xs opacity-70 mt-1 block">
                  {{ formatTime(message.timestamp) }}
                </span>
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
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">IA está digitando...</span>
                </div>
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
                placeholder="Digite sua mensagem..."
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                :disabled="isTyping"
                @keydown.enter="sendMessage"
              />
              <button
                type="submit"
                :disabled="!currentMessage.trim() || isTyping"
                class="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p class="text-lg font-semibold text-green-500">Online</p>
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
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

// Reactive data
const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const isDarkMode = ref(false)
const messagesContainer = ref(null)
const messageInput = ref(null)

// Simulated AI responses
const aiResponses = {
  greetings: [
    'Olá! Como posso ajudar você hoje?',
    'Oi! É um prazer falar com você!',
    'Olá! Estou aqui para ajudar. O que você gostaria de saber?',
    'Oi! Como você está? Em que posso ser útil?'
  ],
  help: [
    'Posso ajudar com informações gerais, responder perguntas simples e ter uma conversa interessante!',
    'Estou aqui para responder suas dúvidas e conversar sobre diversos assuntos.',
    'Posso fornecer informações, esclarecer dúvidas e manter uma conversa agradável!'
  ],
  time: [
    `Agora são ${new Date().toLocaleTimeString('pt-BR')}.`,
    `O horário atual é ${new Date().toLocaleTimeString('pt-BR')}.`
  ],
  weather: [
    'Não tenho acesso a dados meteorológicos em tempo real, mas espero que esteja um dia agradável!',
    'Infelizmente não posso verificar o clima atual, mas espero que esteja fazendo um bom tempo!'
  ],
  technology: [
    'Tecnologia é fascinante! Estou sempre aprendendo sobre novas inovações.',
    'A tecnologia evolui rapidamente. Há algo específico sobre tech que você gostaria de discutir?',
    'Adoro falar sobre tecnologia! É um campo em constante evolução.'
  ],
  default: [
    'Interessante! Conte-me mais sobre isso.',
    'Entendo. Há algo específico que você gostaria de saber?',
    'Que pergunta interessante! Vou pensar sobre isso.',
    'Hmm, essa é uma boa questão. O que mais você gostaria de discutir?',
    'Obrigado por compartilhar isso comigo!',
    'Isso é muito interessante! Você pode elaborar mais?'
  ],
  goodbye: [
    'Foi um prazer conversar com você! Até logo!',
    'Tchau! Espero falar com você novamente em breve!',
    'Até mais! Tenha um ótimo dia!',
    'Adeus! Foi ótimo conversar com você!'
  ]
}

// Generate AI response based on user input
const generateAIResponse = (userMessage) => {
  const message = userMessage.toLowerCase()
  
  if (message.includes('olá') || message.includes('oi') || message.includes('hello')) {
    return getRandomResponse('greetings')
  } else if (message.includes('ajuda') || message.includes('help')) {
    return getRandomResponse('help')
  } else if (message.includes('hora') || message.includes('tempo') || message.includes('time')) {
    return getRandomResponse('time')
  } else if (message.includes('clima') || message.includes('weather')) {
    return getRandomResponse('weather')
  } else if (message.includes('tecnologia') || message.includes('tech') || message.includes('programação')) {
    return getRandomResponse('technology')
  } else if (message.includes('tchau') || message.includes('bye') || message.includes('adeus')) {
    return getRandomResponse('goodbye')
  } else {
    return getRandomResponse('default')
  }
}

const getRandomResponse = (category) => {
  const responses = aiResponses[category]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Send message function
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isTyping.value) return

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

  // Simulate AI thinking time
  setTimeout(async () => {
    const aiResponse = {
      id: Date.now() + 1,
      text: generateAIResponse(messageText),
      sender: 'ai',
      timestamp: new Date()
    }
    
    messages.value.push(aiResponse)
    isTyping.value = false
    
    await nextTick()
    scrollToBottom()
  }, Math.random() * 2000 + 1000) // Random delay between 1-3 seconds
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

// Initialize theme from localStorage
onMounted(() => {
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
})
</script>
