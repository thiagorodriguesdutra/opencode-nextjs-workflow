---
name: nextjs-patterns
description: Padrões para Next.js 16+ App Router — Server Components, streaming, Server Actions, rotas paralelas e interceptadas, caching. Use ao estruturar rotas, decidir client vs server component, ou implementar Server Actions. Não use para auditoria de SEO (use nextjs-seo).
---

# Next.js App Router

## Modos de Renderização

| Modo | Onde | Quando usar |
|---|---|---|
| Server Component | Servidor | Busca de dados, segredos, processamento pesado |
| Client Component | Browser | Interatividade, hooks, APIs do browser |
| Static | Build time | Conteúdo que raramente muda |
| Dynamic | Request time | Dados personalizados ou em tempo real |
| Streaming | Progressivo | Páginas grandes, fontes de dados lentas |

## Convenções de Arquivo

```
app/
├── layout.tsx          # Wrapper de UI compartilhado
├── page.tsx            # UI da rota
├── loading.tsx         # UI de carregamento (Suspense)
├── error.tsx           # Error boundary
├── not-found.tsx       # UI 404
├── route.ts            # Endpoint de API
├── template.tsx        # Layout re-montado
├── default.tsx         # Fallback de rota paralela
├── proxy.ts            # Antigo `middleware.ts`
└── opengraph-image.tsx # Geração de imagens OpenGraph
```

---

## Padrões

### 1. Server Component com Busca de Dados

```tsx
// app/products/page.tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex gap-8">
      <FilterSidebar />
      <Suspense key={JSON.stringify(params)} fallback={<ProductListSkeleton />}>
        <ProductList category={params.category} page={Number(params.page) || 1} />
      </Suspense>
    </div>
  )
}

// components/ProductList.tsx — Server Component
export async function ProductList({ category, page }: Filters) {
  const { products, totalPages } = await fetch(
    `${process.env.API_URL}/products?${new URLSearchParams({ category, page })}`,
    { next: { tags: ['products'] } }
  ).then(r => r.json())

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </>
  )
}
```

### 2. Client Component

```tsx
'use client'

export function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <button
        onClick={() => startTransition(async () => {
          const result = await addToCart(productId)
          if (result.error) setError(result.error)
        })}
        disabled={isPending}
      >
        {isPending ? 'Adicionando...' : 'Adicionar ao carrinho'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
```

### 3. Server Actions

```ts
'use server'

export async function addToCart(productId: string) {
  const sessionId = (await cookies()).get('session')?.value
  if (!sessionId) redirect('/login')

  try {
    await db.cart.upsert({
      where: { sessionId_productId: { sessionId, productId } },
      update: { quantity: { increment: 1 } },
      create: { sessionId, productId, quantity: 1 },
    })
    revalidateTag('cart')
    return { success: true }
  } catch {
    return { error: 'Falha ao adicionar item' }
  }
}
```

### 4. Rotas Paralelas

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children, analytics, team }: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <div className="dashboard-grid">
      <main>{children}</main>
      <aside>{analytics}</aside>
      <aside>{team}</aside>
    </div>
  )
}
// app/dashboard/@analytics/page.tsx e @team/page.tsx buscam seus próprios dados
```

### 5. Rotas Interceptadas (Padrão Modal)

```
app/
├── @modal/
│   ├── (.)photos/[id]/page.tsx  ← intercepta e exibe como modal
│   └── default.tsx
├── photos/[id]/page.tsx         ← página completa (acesso direto/refresh)
└── layout.tsx                   ← renderiza {children} + {modal}
```

### 6. Streaming com Suspense

```tsx
export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await getProduct(id) // bloqueia — carrega primeiro

  return (
    <div>
      <ProductHeader product={product} />

      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={id} />         {/* API lenta — streama */}
      </Suspense>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations productId={id} /> {/* ML, lento — streama */}
      </Suspense>
    </div>
  )
}
```

### 7. Route Handlers

```ts
// app/api/products/route.ts
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category')
  const products = await db.product.findMany({
    where: category ? { category } : undefined,
    take: 20,
  })
  return NextResponse.json(products)
}

// app/api/products/[id]/route.ts
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(product)
}
```

---

### 8. Proxy (ex-Middleware)

```ts
// proxy.ts — na raiz 
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Redirecionar, reescrever, modificar headers
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*', // filtra quais rotas ativam o proxy
}
```

---

### 9. Cache Components (`use cache`)

```ts
// next.config.ts
const nextConfig = { cacheComponents: true }

// Componente ou função cacheável
import { cacheLife, cacheTag } from 'next/cache'

async function ProductList() {
  'use cache'
  cacheLife('hours')       // perfis: seconds, minutes, hours, days, max
  cacheTag('products')     // para invalidação por tag

  const products = await db.products.findMany()
  return <List items={products} />
}

// Invalidação on-demand (dentro de Server Action):
revalidateTag('products')
```

---

### 10. next/image

```tsx
// Next.js 16 — preload é boolean, não string (não combine com loading ou fetchPriority)
<Image src={hero} preload={true} onLoad={...} />
```

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: { qualities: [25, 50, 75, 100] },
}
```

---

## Caching

```ts
// ⚠ fetch com cache/revalidate/tags não tem efeito dentro do Proxy
// ⚠ Com cacheComponents: true, route segment configs (dynamic, revalidate, fetchCache) são substituídos por 'use cache' + cacheLife

fetch(url, { cache: 'no-store' })              // sempre fresco
fetch(url, { cache: 'force-cache' })           // estático para sempre
fetch(url, { next: { revalidate: 60 } })       // ISR — revalida a cada 60s
fetch(url, { next: { tags: ['products'] } })   // invalidação por tag

// Dentro de Server Action:
revalidateTag('products')
revalidatePath('/products')
```

---

## Regras

**Faça:**
- Comece com Server Components — adicione `'use client'` só quando necessário
- Busque dados onde são usados (colocação)
- Use `Suspense` para dados lentos — habilita streaming
- Use Server Actions para mutações com progressive enhancement

**Não faça:**
- Não use hooks (`useState`, `useEffect`) em Server Components
- Não busque dados em Client Components — use Server Components ou React Query
- Não ignore estados de carregamento — sempre forneça `loading.tsx` ou `Suspense`
- Não aninhe layouts desnecessariamente — cada layout adiciona à árvore de componentes
- Não use Proxy para fetching de dados lentos ou gerenciamento de sessão completo — use para redirects/headers/reescrita rápida
- Não use `priority` ou `onLoadingComplete` em `next/image` — use `preload` e `onLoad`
