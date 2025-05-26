#  Tempo de Processo - Estimador Judicial

**Aplicação** para estimativa de tempo de tramitação de processos judiciais com base no tipo de ação e tribunal escolhido.

## Visão Geral

Este projeto combina:
- **Frontend React** - Interface moderna e intuitiva
- **Backend Node.js/Express** - API REST com base de dados robusta
- **Base de Conhecimento** - 25+ estimativas de diferentes tipos de processo
- **Integração com Tribunais** - Dados de TJSP, TJRJ, TRT, TRF, STJ, STF

### Funcionalidades

- ✅ **Estimativa Inteligente** baseada em dados históricos
- ✅ **Múltiplos Tribunais** (Estaduais, Trabalhistas, Federais, Superiores)
- ✅ **25+ Tipos de Ação** (Alimentos, Dano Moral, Divórcio, Trabalhista, etc.)
- ✅ **Análise de Complexidade** (Baixa, Média, Alta, Muito Alta)
- ✅ **Gráficos Comparativos** com Chart.js
- ✅ **Interface Responsiva** com Tailwind CSS
- ✅ **API REST Completa** com documentação

## Instalação Rápida

### 1. Clone o projeto
```bash
git clone <repository-url>
cd tempo-de-processo
```

### 2. Instale todas as dependências
```bash
npm run install:all
```

### 3. Configure as variáveis de ambiente
```bash
cp backend/.env.example backend/.env
# Edite backend/.env conforme necessário
```

### 4. Inicie o projeto completo
```bash
npm run dev
```

Isso iniciará:
- **Frontend** em http://localhost:3000
- **Backend** em http://localhost:3001

## Estrutura do Projeto

```
tempo-de-processo/
├──  frontend/                 # React Frontend
│   ├──  src/
│   │   ├──  App.jsx          # Componente principal
│   │   ├──  components/      # Componentes React
│   │   │   ├──  Header.jsx
│   │   │   ├──  EstimatorForm.jsx
│   │   │   ├──  ResultCard.jsx
│   │   │   ├──  ComparisonChart.jsx
│   │   │   └──  StatsCard.jsx
│   │   └──  services/
│   │       └──  ProcessService.js
│   ├──  index.html
│   ├──  vite.config.js
│   └──  package.json
│
├──  backend/                  # Node.js Backend
│   ├──  index.js             # Servidor Express
│   ├──  data/                # Base de dados JSON
│   │   ├──  estimativas.json # 25+ estimativas
│   │   ├──  tribunais.json   # 13 tribunais
│   │   └──  tipos-acao.json  # 15 tipos de ação
│   └──  package.json
│
├──  package.json             # Scripts do projeto raiz
├──  docker-compose.yml       # Orquestração Docker
├──  Dockerfile              # Build unificado
└──  README.md               # Este arquivo
```

## Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Inicia frontend + backend
npm run client:dev       # Apenas frontend (porta 3000)
npm run server:dev       # Apenas backend (porta 3001)
```

### Produção
```bash
npm run build           # Build completo
npm start               # Inicia em modo produção
```

##  API Endpoints

Base URL: \`http://localhost:3001/api\`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \`/health\` | Status do servidor |
| POST | \`/estimar\` | Estimar tempo de processo |
| GET | \`/tipos-acao\` | Listar tipos de ação |
| GET | \`/tribunais\` | Listar tribunais |
| GET | \`/estimativas\` | Buscar estimativas |
| GET | \`/estatisticas\` | Estatísticas gerais |

### Exemplo de Uso da API

```javascript
// Estimar tempo de processo
const response = await fetch('/api/estimar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tipoAcao: 'Ação de Alimentos',
    tribunal: 'TJSP',
    instancia: '1ª instância',
    complexidade: 'media'
  })
})

const data = await response.json()
console.log(data.estimativa.tempo.texto) // "6 a 12 meses"
```

##  Base de Dados

### Tribunais Suportados (13)
- **Estaduais**: TJSP, TJRJ, TJMG, TJRS, TJPR, TJSC
- **Trabalhistas**: TRT1, TRT2
- **Federais**: TRF2, TRF3
- **Superiores**: STJ, STF
- **Especiais**: JEF

### Tipos de Ação (15)
- Ação de Alimentos
- Dano Moral
- Revisão Contratual
- Inventário Judicial
- Divórcio (Consensual/Litigioso)
- Ação Trabalhista
- Mandado de Segurança
- Ação de Cobrança
- Ação Previdenciária
- Ação de Despejo
- Ação Penal
- Habeas Corpus
- Ação de Usucapião
- Ação Monitória

### Estimativas (25+)
Cada estimativa inclui:
- Tempo mínimo e máximo em meses
- Tribunal específico
- Instância (1ª, 2ª, Superior)
- Complexidade média
- Observações específicas

##  Interface do Usuário

### Componentes Principais

1. **EstimatorForm** - Formulário com dropdowns inteligentes
2. **ResultCard** - Exibição detalhada da estimativa
3. **ComparisonChart** - Gráfico comparativo com Chart.js
4. **StatsCard** - Cards de estatísticas
5. **Header** - Cabeçalho com navegação

### Recursos da Interface

-  **Design Responsivo** - Funciona em desktop e mobile
-  **Tailwind CSS** - Estilização moderna e consistente
-  **Gráficos Interativos** - Comparação visual de tempos
-  **Busca Inteligente** - Dropdowns com busca
-  **Loading States** - Feedback visual durante carregamento
-  **Validação** - Campos obrigatórios e validações

## Configuração Avançada

### Variáveis de Ambiente

```env
# Servidor
PORT=3001
NODE_ENV=development

# CORS (produção)
CORS_ORIGIN=https://seudominio.com

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=200

# Segurança
SESSION_SECRET=seu_secret_seguro
```

### Proxy do Frontend

O Vite está configurado para fazer proxy das chamadas \`/api\`:

`javascript
// frontend/vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
`

## Deploy com Docker

### Build e execução
```bash
# Build da imagem
docker build -t tempo-processo .

# Executar container
docker run -p 3001:3001 tempo-processo
```

### Docker Compose
```bash
# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f
```

## Funcionalidades Avançadas

### Algoritmo de Estimativa

1. **Busca por Critérios** - Filtra estimativas por tipo, tribunal e instância
2. **Cálculo de Média** - Calcula tempo médio baseado em casos similares
3. **Ajuste por Complexidade** - Aplica multiplicadores baseados na complexidade
4. **Confiabilidade** - Avalia confiança baseada no tamanho da amostra

### Análise Comparativa

- Gráfico de barras com tempos mínimos e máximos
- Destaque visual para a consulta atual
- Ordenação por tempo de tramitação
- Tooltips informativos

### Estatísticas em Tempo Real

- Total de estimativas disponíveis
- Número de tribunais cobertos
- Tempo médio geral
- Distribuição por instância e estado

## Testes

```bash
# Executar todos os testes
npm test

# Testes do backend
cd backend && npm test

# Testes do frontend
cd frontend && npm test
```

## Suporte e Contribuição

- **GitHub Issues**: Para bugs e feature requests
- **Pull Requests**: Contribuições são bem-vindas
- **Documentação**: Veja os comentários no código

## Licença

MIT License - veja o arquivo LICENSE para detalhes.

---

** Desenvolvido para a comunidade jurídica brasileira**

 **Tribunais integrados**: Estaduais, Trabalhistas, Federais e Superiores  
 **Base robusta**: 25+ estimativas baseadas em dados reais  
 **Pronto para produção**: Docker, API REST, interface responsiva
\`\`\`
