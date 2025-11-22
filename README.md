# LUFLIX - Plataforma de Treinamentos

Aplicação completa estilo Netflix construída com Next.js 16 (App Router) para distribuir treinamentos corporativos, controlar acesso de usuários e emitir certificados automaticamente.

## Destaques
- Autenticação segura com NextAuth + BCrypt (credenciais) e middleware protegendo rotas.
- Perfis distintos (Admin/Funcionário) com guarda de sessão e autorização em nível de módulo.
- CRUD completo de módulos e vídeos com formulários validados (Zod) e server actions.
- Player responsivo (React Player) capaz de reproduzir links do YouTube ou Google Drive e registrar progresso automaticamente.
- Painel do funcionário com layout inspirado na Netflix (cards responsivos, grid, banner de "continuar assistindo").
- Emissão automática de certificados em PDF (PDFKit) ao concluir todos os vídeos de um módulo, com armazenamento em `storage/certificates` e endpoint para download seguro.
- Busca contextual (admin vê tudo, funcionário vê apenas módulos liberados).
- Painel administrativo com controle granular de acesso por usuário e visualização de progresso por módulo.
- Estilização dark moderna com Tailwind CSS, cards com vidro fosco, botões arredondados e player em proporção 16:9.

## Estrutura de Pastas
```
app/
├─ src/
│  ├─ app/                # Rotas (auth, admin, employee, módulos, APIs)
│  ├─ auth/               # Configurações NextAuth + guards
│  ├─ certificates/       # Geração de PDFs
│  ├─ components/         # UI reutilizável, layouts, formulários, player
│  ├─ config/             # Configurações globais e navegação
│  ├─ controllers/        # Camada de orquestração Prisma
│  ├─ lib/                # Prisma client e utilitários
│  ├─ models/             # Schemas Zod/validações
│  ├─ modules/            # Regras de segurança/domínio
│  ├─ types/              # Augmentations do NextAuth
│  ├─ views/              # Telas compostas (admin e funcionário)
│  └─ videos/             # Helpers específicos de vídeos
├─ prisma/schema.prisma   # Modelagem do banco
├─ storage/certificates   # PDFs gerados (ignorados no git)
└─ README.md
```

## Stack
- **Next.js 16** (App Router, Server Actions, Route Handlers)
- **TypeScript + ESLint**
- **Tailwind CSS v4**
- **NextAuth** (session JWT)
- **Prisma ORM** (MySQL)
- **React Hook Form + Zod**
- **React Player** (YouTube/Drive)
- **PDFKit** (certificados)

## Pré-requisitos
- Node.js 18+
- Banco MySQL acessível (o `.env.example` já aponta para o host informado: `186.209.113.112`).
- Permissão de escrita na pasta `storage/certificates` para salvar os PDFs emitidos.

## Configuração
1. **Instale dependências**
   ```bash
   npm install
   ```
2. **Configure variáveis de ambiente**
   - Copie `.env.example` para `.env` e ajuste `NEXTAUTH_SECRET` caso necessário.
3. **Gere o Prisma Client**
   ```bash
   npm run prisma:generate
   ```
4. **Rode as migrações no MySQL** (ajuste se desejar outro schema)
   ```bash
   npm run prisma:migrate
   ```
5. **Popule dados de teste** (cria um admin e um funcionário com módulo inicial)
   ```bash
   npm run db:seed
   ```
6. **Suba o servidor**
   ```bash
   npm run dev
   ```

Acesse `http://localhost:3000`. A aplicação redireciona usuários autenticados automaticamente para o dashboard correto.

### Credenciais de teste criadas pelo seed
| Perfil      | E-mail                  | Senha            |
|-------------|-------------------------|------------------|
| Admin       | `admin@luflix.com`      | `admin123`       |
| Funcionário | `funcionario@luflix.com`| `colaborador123` |

## Fluxo Principal
1. Usuário acessa `/login`, realiza autenticação via NextAuth.
2. Middleware garante que `/admin` só seja acessado por administradores e `/employee`/`/modules/*` apenas por funcionários liberados.
3. **Admin**: cria/edita módulos, anexa vídeos (YouTube/Drive), concede acesso por usuário e acompanha progresso em tempo real.
4. **Funcionário**: vê somente módulos liberados, continua o último módulo em destaque, reproduz vídeos em player embutido e tem progresso registrado automaticamente.
5. Ao concluir todos os vídeos de um módulo, um certificado em PDF é gerado e armazenado. O funcionário pode baixar direto do dashboard ou no player.

## Segurança e Boas Práticas
- Senhas persistidas com BCrypt e nunca retornadas na API.
- Validações com Zod para todos os dados vindos de formulários/requests (IDs verificados antes de acessar conteúdo sensível).
- Prisma evita SQL Injection, e todos os acessos passam por guards (`requireAdmin`, `requireEmployee`).
- Middleware NextAuth impede burla por URL manual e garante sessão em todas as páginas privadas.
- API de certificados garante que apenas o dono ou um admin faça download.

## Scripts Disponíveis
| Script               | Descrição                                        |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Ambiente de desenvolvimento                      |
| `npm run build`      | Build para produção                              |
| `npm start`          | Servir build                                     |
| `npm run lint`       | ESLint com regras do Next + TypeScript           |
| `npm run prisma:generate` | Gera o client Prisma                        |
| `npm run prisma:migrate` | Aplica migrações (MySQL)                     |
| `npm run db:seed`    | Popula usuários/módulos de demonstração          |

## Próximos Passos Sugeridos
- Integração com webhooks de LMS ou HRIS.
- Geração avançada de relatórios (CSV/Excel) para RH.
- Suporte a uploads de vídeo próprios (S3, Cloudflare Stream).
- Notificações por e-mail quando novos módulos forem liberados.

Sinta-se à vontade para ajustar o fluxo, textos e assets conforme a identidade visual da sua empresa. Bons estudos! 🎬
