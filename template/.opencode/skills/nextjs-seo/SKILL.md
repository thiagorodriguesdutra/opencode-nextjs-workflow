---
name: nextjs-seo
description: Checklist e correções de SEO para apps Next.js com App Router — metadata, sitemap, robots.txt, Core Web Vitals e acesso de crawlers de IA. Use ao auditar ou corrigir SEO em projetos Next.js. Não use para decisões de estrutura de rotas ou Server Components (use nextjs-patterns).
---

## Auditoria rápida (só local — arquivos do projeto)

1. `rg --files -g '{sitemap,robots,manifest,layout,opengraph-image,icon}.*' app` — confirma quais arquivos de metadata existem, por rota
2. `rg -n "keywords:" app` — pega o meta `keywords` esquecido (Google ignora, mas é sinal de config desatualizada)
3. `rg -n "generateMetadata|export const metadata" app` — mapeia onde a metadata é definida, por rota
4. Ler o conteúdo de `app/robots.ts`/`app/sitemap.ts` (se existirem) para checar as regras antes de publicar

## app/layout.tsx — metadata raiz

```ts
import type { Metadata, Viewport } from 'next';

// viewport/themeColor precisam ser export separado — não funcionam dentro de `metadata`
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://seu-site.com'),
  title: { default: 'Título do Site', template: '%s | Nome do Site' },
  description: 'Descrição atraente com palavras-chave alvo', // sem campo `keywords` — Google ignora
  openGraph: { type: 'website', url: 'https://seu-site.com', images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};
```

## app/sitemap.ts

```ts
import type { MetadataRoute } from 'next';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: 'https://seu-site.com' },
    ...posts.map(p => ({ url: `https://seu-site.com/blog/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
```

`lastModified` deve refletir a data real (CMS/git), nunca `new Date()` a cada build — lastmod inconsistente faz o Google ignorá-lo. Pule `changeFrequency`/`priority` — ignorados.

## app/robots.ts

```ts
import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/admin/'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: 'GPTBot', disallow: '/' },
    ],
    sitemap: 'https://seu-site.com/sitemap.xml',
  };
}
```

- Nunca bloqueie `/_next/` (CSS/JS crítico para renderização); `host` é ignorada pelo Google — use canonical/301s.
- Grupos nomeados (ex: `GPTBot`) não herdam as regras do `*` (RFC 9309) — repita `disallow` em cada grupo; `GPTBot: disallow '/'` é opt-out de treinamento, não bloqueia citação (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot` seguem liberados pelo `*`).

Para metadata por rota, use `generateMetadata({ params })` no arquivo da rota — `params` é uma `Promise`, lembre de `await`; defina `alternates.canonical` ali também.

## Renderização e cache

- Prefira SSG/SSR ou `"use cache"` (com `cacheLife`) para conteúdo indexável — nunca CSR em páginas de SEO.
- Rotas dinâmicas (`[slug]`): implemente `generateStaticParams` para pré-renderizar em build. Com `cacheComponents: true`, retornar `[]` agora lança erro (`empty-generate-static-params`) — sempre retorne ao menos um param.
- Escopos `"use cache"` não podem ler `cookies()/headers()/searchParams` (use `"use cache: private"` se precisar, mas nunca é pré-renderizado nem entra no shell estático de SEO).
- Escolha `cacheLife` pela frequência de mudança: `days` para blog/docs, `max` para páginas legais/institucionais.

## Core Web Vitals (metas, percentil 75 em campo)

LCP < 2.5s · INP < 200ms (substituiu FID em 2024) · CLS < 0.1 — desempate, não ranking; não medido localmente, mas causas comuns são checáveis:

- LCP: imagem grande acima da dobra sem `next/image` → `rg -L "next/image" app --type tsx` como triagem
- CLS: `<img>`/`Image` sem `width`/`height` fixos → `rg -n "<img " app --type tsx`
- INP: JS excessivo no cliente → `rg -c "'use client'" app --type tsx | wc -l` como proxy grosseiro

## Erros comuns

- Misturar `next-seo` com Metadata API (use só Metadata API); faltar `metadataBase` (quebra URLs relativas)
- `not-found.tsx` sem `robots: { index: false }` na metadata da rota → 404 pode ser indexado como página válida (soft-404); `rg -n "not-found" app` para localizar
- Googlebot/Bingbot já recebem metadata bloqueante por padrão (`htmlLimitedBots`) — não é preciso configurar nada. Risco real só existe se você customizou `htmlLimitedBots` junto com `cacheComponents: true`: há um mismatch documentado (vercel/next.js #93401) onde o shell prerenderizado usa streaming mas requests em runtime não — `rg -n "htmlLimitedBots" next.config.*` para checar se isso se aplica ao projeto.

Para JSON-LD, OG dinâmico ou GEO/AEO: gere código sob demanda, sem inventar métricas não confirmadas por Google/web.dev.
