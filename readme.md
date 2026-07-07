# CoinGecko Integration Backend 🚀

Este repositório armazena exclusivamente o back-end de uma aplicação de análise e gerenciamento de portfólio de criptomoedas. O servidor consome a API da CoinGecko (plano Demo) e atua como uma camada inteligente de processamento de dados, aplicando cache e regras de negócio próprias antes de expor a informação para o front-end.

O projeto foi construído utilizando **Node.js**, **Express** e **TypeScript**, aplicando conceitos de arquitetura em camadas (Adapter → Service → Controller) para garantir isolamento de infraestrutura, testabilidade e escalabilidade.

---

## 🛠️ Tecnologias e Ferramentas

* **Node.js** (Ambiente de execução)
* **Express** (Framework HTTP para rotas e controllers)
* **TypeScript** (Sintaxe estrita e tipagem estática)
* **Axios** (Cliente HTTP para integração com a API externa)
* **node-cache** (Cache em memória com TTL diferenciado por tipo de dado)
* **tsx** (Execução e monitoramento em tempo real no ambiente de desenvolvimento)
* **Dotenv** (Gerenciamento seguro de variáveis de ambiente)

---

## 📂 Estrutura de Pastas

```text
src/
├── config/          # Instância do Axios (client CoinGecko) e camada de cache
├── adapters/        # Infraestrutura externa — chamadas HTTP puras à CoinGecko + cache
├── services/        # Regras de negócio — processamento e análise dos dados
├── controller/       # Interceptadores HTTP do Express (validação de req/res)
├── routes/          # Mapeamento e distribuição de endpoints da API
└── server.ts        # Inicialização do servidor Express e Middlewares
```

### Por que essa separação?
- **Adapter**: só sabe conversar com a CoinGecko. Se a API externa mudar de formato ou eu trocar de provedor de dados um dia, só essa camada muda.
- **Service**: só sabe de regra de negócio. Não faz requisição HTTP nem sabe o que é `req`/`res` — recebe dados já prontos e aplica lógica (filtros, ordenações, cálculos).
- **Controller**: só orquestra. Valida entrada, chama o service ou o adapter, formata a resposta.

Essa separação existe porque **nem todo dado da CoinGecko precisa de tratamento** — em alguns casos o controller fala direto com o adapter (dado puro/passthrough); em outros, passa pelo service, quando existe uma regra de negócio real aplicada em cima do dado bruto.

---

## 🧠 Análises e Regras de Negócio Implementadas

O objetivo do backend não é só repassar o que a CoinGecko retorna — algumas informações são **derivadas** e calculadas a partir do dado bruto:

### 1. Top Gainers & Losers (`/api/market/top-movers`)
A CoinGecko possui um endpoint nativo para isso (`/coins/top_gainers_losers`), mas ele é **exclusivo de planos pagos**. A solução implementada:
1. Busca o `/coins/markets` (já cacheado)
2. Filtra moedas sem variação 24h válida (dado nulo/indisponível não entra no ranking)
3. Ordena por `price_change_percentage_24h`
4. Retorna as `N` maiores altas e as `N` maiores quedas

Essa regra reaproveita o cache do `/coins/markets` — não gera nenhuma chamada extra à API externa.

### 2. Dominância de Mercado (`/api/market/global`)
Diferente do que se poderia imaginar, a dominância de mercado (% do market cap total que Bitcoin/Ethereum representam) **já vem calculada pela própria CoinGecko** no campo `market_cap_percentage` do endpoint `/global` — não é necessário somar market caps manualmente.

### 3. Estratégia de Cache por Volatilidade
Nem todo dado muda na mesma velocidade, então cada tipo de informação tem um TTL próprio:

| Tipo de dado | TTL | Justificativa |
|---|---|---|
| Preços / market list | 30s | Preço muda o tempo todo |
| Top movers | 30s | Derivado do market list, mesma frequência |
| Detalhes de moeda | 120s | Descrição/links praticamente não mudam |
| Gráfico histórico | 300s (5min) | Não há motivo pra recalcular a cada 30s |
| Dados globais | 60s | Dominância/market cap total se movem devagar |
| Plataformas / categorias | 3600s (1h) | Dado quase estático |

Isso reduz drasticamente o consumo de chamadas à CoinGecko: se 100 usuários abrirem o dashboard no mesmo minuto, a CoinGecko recebe **uma única chamada real**, não 100.

---

## 📡 Endpoints Disponíveis

Todos expostos sob o prefixo `/api`.

| Método | Rota | Descrição | Cache |
|---|---|---|---|
| GET | `/market/global` | Market cap total, volume 24h e dominância BTC/ETH | 60s |
| GET | `/market/trending` | Moedas/categorias mais buscadas nas últimas 24h | 60s |
| GET | `/market/categories` | Categorias de mercado (DeFi, AI, Gaming...) por market cap | 1h |
| GET | `/market/top-movers` | Top gainers/losers (regra de negócio própria) | 30s |
| GET | `/prices` | Preço rápido de BTC, ETH e SOL em USD/BRL | 30s |
| GET | `/price/token?network=&contract=` | Preço de um token via endereço de contrato | 60s |
| GET | `/coins/markets?vs_currency=&ids=` | Lista de moedas com preço, market cap e variação | 30s |
| GET | `/coins/:id` | Detalhes completos de uma moeda | 120s |
| GET | `/coins/:id/chart?vs_currency=&days=` | Histórico de preço para gráfico | 5min |
| GET | `/platforms` | Blockchains/redes suportadas | 1h |


---

## ✅ Status do Projeto

- [x] Integração completa com CoinGecko (Demo Plan)
- [x] Arquitetura em camadas (Adapter → Service → Controller → Routes)
- [x] Cache com TTL diferenciado por volatilidade de dado
- [x] Regra de negócio de top gainers/losers implementada e isolada na camada de service
- [x] Todos os 10 endpoints testados manualmente via Postman
- [ ] Front-end (próxima etapa)
- [ ] Testes automatizados (unitários no service, integração nos endpoints)

---

## 🚀 Como rodar localmente

```bash
npm install
```

Crie um `.env` na raiz:
```
PORT=3000
COINGECKO_API_KEY=sua_chave_demo_aqui
```

```bash
npm run dev
```

Servidor disponível em `http://localhost:3000`.