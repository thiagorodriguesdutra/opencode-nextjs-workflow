---
name: security
description: Boas práticas mínimas de segurança para apps TypeScript com Next.js 16+. Cobre segredos, autenticação, Server Actions, DAL, inputs e dependências. Baseado no OWASP Top 10 2025 e na documentação oficial do Next.js. Use ao implementar autenticação, Server Actions, camada de acesso a dados (DAL), ou ao revisar segurança antes de deploy.
---

# Segurança Mínima (TypeScript + Next.js 16)

## Aviso TypeScript
Tipos TypeScript não existem em runtime. Um `interface User` não valida nada vindo da rede, banco ou input do usuário. Toda validação de dados externos usa `zod` com `.parse()` — não interfaces.

## Segredos
- Nunca coloque API keys ou tokens no frontend — prefixos `NEXT_PUBLIC_` embutem o valor no bundle
- Chamadas a APIs externas passam pelo backend; o frontend chama seu próprio endpoint
- Apenas o Data Access Layer acessa `process.env` com secrets — nenhum outro módulo
- `.env` e `.env*.local` sempre no `.gitignore`

## Data Access Layer (DAL)
- Centralize todo acesso a dados em módulos marcados com `import 'server-only'`
- O DAL realiza as verificações de autenticação e autorização — não os componentes
- Retorne DTOs com apenas os campos necessários — nunca o objeto bruto do banco
- Aplique o mesmo padrão para leituras e mutações

```ts
// data/posts.ts
import 'server-only'
import { auth } from '@/lib/auth'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const post = await db.post.findUnique({ where: { id: postId } })
  if (post.authorId !== session.user.id) throw new Error('Forbidden')

  await db.post.delete({ where: { id: postId } })
}
```

## Autenticação e autorização
- A verificação de auth no nível da page não se estende às Server Actions — re-verifique dentro de cada action
- JWTs em cookies `HttpOnly; Secure; SameSite=Strict`, nunca em `localStorage`
- Access tokens expiram em no máximo 15 minutos; refresh tokens rodam rotação a cada uso
- Sempre verifique ownership no nível da query — não apenas se o usuário está autenticado, mas se ele é dono do recurso (IDOR)

## Proxy (Next.js 16)
> No Next.js 16, Middleware foi renomeado para **Proxy** (`proxy.ts`). A funcionalidade é a mesma.

Proxy serve para redirects otimistas e modificação de headers — **não é solução de autenticação nem de session management**. Verificações de auth completas ficam no DAL ou nas Server Actions.

```ts
// proxy.ts — apenas redirect otimista, não substitui auth real
export function proxy(request: NextRequest) {
  const token = request.cookies.get('AUTH_TOKEN')
  if (!token) return NextResponse.redirect(new URL('/login', request.url))
  return NextResponse.next()
}
```

## Server Actions
- Trate toda Server Action como endpoint POST público — valide auth e autorização dentro de cada uma
- Nunca retorne o record completo do banco — filtre para apenas o que o cliente precisa
- Mutações acontecem via Server Actions, nunca como side effect durante rendering
- Delegue lógica de auth e banco para o DAL; a action fica fina

```ts
// ERRADO: retorna record completo
export async function updateUser(data: FormData) {
  return db.user.update({ ... }) // expõe campos internos ao cliente
}

// CERTO: retorna só o necessário
export async function updateUser(data: FormData) {
  await db.user.update({ ... })
  return { success: true }
}
```

### Origens permitidas (CSRF)

```ts
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

### Closures em Server Actions
Variáveis capturadas no escopo externo de uma Server Action são serializadas, enviadas ao cliente e de volta ao servidor na invocação. O Next.js as encripta automaticamente, mas **nunca capture dados sensíveis** (tokens, hashes, secrets) em closures — prefira buscá-los novamente no servidor dentro da action.

```ts
// ERRADO: secret capturado em closure vai para o cliente (mesmo encriptado)
export default async function Page() {
  const internalSecret = await getInternalSecret()

  async function doAction() {
    'use server'
    use(internalSecret) // serializado e enviado ao cliente
  }
}

// CERTO: busca o valor novamente dentro da action
export default async function Page() {
  async function doAction() {
    'use server'
    const internalSecret = await getInternalSecret() // permanece no servidor
  }
}
```

## Rate limiting (sem libs externas)
Endpoints de auth (login, reset de senha, OTP) e operações custosas precisam de rate limiting. Para o básico, um `Map` em memória no próprio servidor é suficiente em single-instance:

```ts
// lib/rate-limit.ts
const attempts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= max) return false

  entry.count++
  return true
}
```

```ts
// app/actions.ts — uso na Server Action
export async function login(data: FormData) {
  const ip = headers().get('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(`login:${ip}`, 5, 60_000)) {
    throw new Error('Too many attempts. Try again in 1 minute.')
  }
  // ...
}
```

> **Limitação conhecida**: `Map` em memória reseta com cada deploy e não funciona em múltiplas instâncias. Para produção com escala, use Redis. Para o básico, resolve.

## Taint API (proteção extra contra vazamento)
O React expõe APIs experimentais para marcar objetos e valores que nunca devem chegar ao cliente. Ative em `next.config.js` e aplique no DAL:

```js
// next.config.js
module.exports = { experimental: { taint: true } }
```

```ts
import { experimental_taintObjectReference } from 'react'

const user = await db.user.findUnique({ where: { id } })
experimental_taintObjectReference('Nunca passe o user bruto ao cliente', user)
```

Isso causa erro em build/runtime se o objeto tainted for passado para um Client Component. **Não substitui filtrar os dados no DAL** — é uma camada extra de detecção.

## Inputs e queries
- Validação client-side é UX, não segurança — repita no servidor com `zod`
- Limite o tamanho do body da requisição no servidor
- Queries sempre parametrizadas via ORM ou prepared statements — sem concatenação com input do usuário
- `DOMPurify` antes de renderizar HTML gerado por usuário
- Sem `eval()`, `new Function()`, `child_process.exec()` ou `dangerouslySetInnerHTML` com input do usuário

## Uploads
- Aceite apenas formatos explícitos (ex: JPG/PNG)
- Valide o tipo real pelos bytes do arquivo, não pela extensão
- Nunca renderize SVGs de usuário inline

## Dependências
- Versões exatas: `"axios": "1.7.2"` em vez de `"^1.7.2"`
- `npm ci` em produção e CI
- `package-lock.json` sempre commitado
- Rode `npm audit` antes de entregar

## Headers
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
```

> **Atenção com CSP e scripts inline**: se a aplicação usa scripts inline (comum com RSC), `default-src 'self'` vai quebrá-los. Nesse caso, implemente **nonces** — gere um valor aleatório por request e passe-o tanto no header CSP quanto no atributo `nonce` dos scripts.

- CORS com `origin` explícita — nunca `*` em endpoints autenticados
- Sem stack traces expostos em produção
