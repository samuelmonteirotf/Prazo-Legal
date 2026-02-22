# Prazo-Legal ⚖️

**Calculadora inteligente de prazos processuais para tribunais brasileiros**

Estimador comparativo de tempo de tramitação baseado em tipo de ação, tribunal e complexidade. Feito por um dev formado em Direito para advogados que precisam de previsibilidade real.

## Tecnologias
- **Frontend**: React + Vite + Tailwind CSS + Chart.js
- **Backend**: Node.js + Express.js (API REST)
- **Banco**: JSON local (13 tribunais + 15+ tipos de ação)
- **DevOps**: Docker + docker-compose (monorepo completo)

## Funcionalidades
- Escolha de tribunal (Estadual, Trabalhista, Federal, STJ, STF etc)
- Mais de 25 estimativas ajustáveis por complexidade
- Gráficos comparativos interativos
- Totalmente responsivo (desktop + mobile)

## Integrações LegalTech
Compatível com **JusBrasil**, **Docket**, **PJe**, **e-SAJ** e **Jusfy**. Pronto pra puxar dados de processos automaticamente.

## ▶Como rodar
```bash
# Clone o repo
git clone https://github.com/samuelmonteirotf/Prazo-Legal.git
cd Prazo-Legal

# Com Docker (recomendado)
docker-compose up --build

# Ou manualmente
# Frontend: cd frontend && npm install && npm run dev
# Backend: cd backend && npm install && npm run dev