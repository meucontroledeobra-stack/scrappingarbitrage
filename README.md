# 📡 API-OS

API RESTful desenvolvida com **Node.js**, **TypeScript**, **Express**, **PostgreSQL**, **Redis** e **TypeORM**, projetada para aplicações que exigem autenticação com JWT, operações seguras e escalabilidade.

---

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [Redis](https://redis.io/)
- [Jest](https://jestjs.io/) (para testes)
- [dotenv](https://github.com/motdotla/dotenv) (env vars)

---

## 📁 Estrutura do Projeto

src/
├── app/
│ └── shared/
│ └── migrations/ # Migrations do TypeORM
├── main/
│ ├── config/ # Arquivos de configuração (DB, Redis, etc)
│ └── index.ts # Arquivo principal da aplicação
└── index.ts # Entrada alternativa para testes com Redis

---

## 🛠️ Scripts Disponíveis

| Comando                 | Descrição                                                |
| ----------------------- | -------------------------------------------------------- |
| `yarn dev`              | Inicia a API em modo de desenvolvimento com hot reload   |
| `yarn build`            | Compila os arquivos TypeScript para JavaScript (`/dist`) |
| `yarn start`            | Executa a versão compilada da API                        |
| `yarn dev:db`           | Inicia apenas a configuração do banco de dados           |
| `yarn dev:redis`        | Inicia uma execução com foco na conexão Redis            |
| `yarn migration:create` | Cria uma nova migration (`CreateTableAnnotation`)        |
| `yarn migration:run`    | Executa as migrations pendentes                          |
| `yarn migration:revert` | Reverte a última migration executada                     |
| `yarn test`             | Executa os testes em modo silencioso                     |
| `yarn test:verbose`     | Executa os testes com detalhes                           |
| `yarn test:coverage`    | Gera o relatório de cobertura                            |
| `yarn test:watch`       | Executa testes em modo contínuo                          |

---

## 📦 Variáveis de Ambiente

Crie um arquivo `.env` na raiz com as variáveis necessárias:

```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/database
REDIS_URL=redis://localhost:6379
JWT_SECRET=sua_chave_secreta

🧪 Testes
Este projeto utiliza o Jest para testes unitários. Para executá-los:

yarn test
Para obter um relatório de cobertura:
yarn test:coverage

🚧 Requisitos
Node.js ≥ 18
PostgreSQL ≥ 12
Redis ≥ 6
Yarn (recomendado)

📄 Licença
Este projeto está licenciado sob a MIT License.

```
