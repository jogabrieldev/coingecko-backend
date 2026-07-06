# CoinGecko Integration Backend 🚀

Este repositório armazena exclusivamente o back-end de uma aplicação de análise e gerenciamento de portfólio de criptomoedas. O servidor consome a API da CoinGecko (plano Demo) e atua como uma camada inteligente de processamento de dados, preparando a estrutura que será consumida futuramente pelo front-end.

O projeto foi construído utilizando **Node.js**, **Express** e **TypeScript**, aplicando conceitos de arquitetura limpa (Clean Architecture / Ports and Adapters) para garantir isolamento de infraestrutura, facilidade de testes e escalabilidade.

---

## 🛠️ Tecnologias e Ferramentas

* **Node.js** (Ambiente de execução)
* **Express** (Framework HTTP para rotas e controllers)
* **TypeScript** (Sintaxe estrita e tipagem estática)
* **Axios** (Cliente HTTP para integração com a API externa)
* **tsx** (Execução e monitoramento em tempo real no ambiente de desenvolvimento)
* **Dotenv** (Gerenciamento seguro de variáveis de ambiente)

---

## 📂 Estrutura de Pastas

A arquitetura do projeto divide as responsabilidades do ecossistema de forma isolada:

```text
src/
├── config/          # Instância global do Axios e chaves de API
├── adapters/        # Camada de infraestrutura externa (Integração direta CoinGecko)
├── controller/      # Interceptadores HTTP do Express (Validação de req/res)
├── routes/          # Mapeamento e distribuição de endpoints da API
└── server.ts        # Inicialização do servidor Express e Middlewares