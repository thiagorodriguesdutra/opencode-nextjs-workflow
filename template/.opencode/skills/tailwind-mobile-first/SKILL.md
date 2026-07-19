---
name: tailwind-mobile-first
description: Guia completo de design responsivo mobile-first com Tailwind CSS v4 (2026). Use esta skill ao construir interfaces web com Tailwind que precisam funcionar bem em dispositivos móveis, tablets e desktops. Cobre breakpoints, tipografia fluida, espaçamento fluido, container queries nativas, navegação mobile, alvos de toque acessíveis e otimização de performance. Não use para decisões de paleta de cores ou hierarquia visual (use frontend-design) — foco aqui é comportamento responsivo e breakpoints.
---

# Design Responsivo Mobile-First com Tailwind CSS

## Filosofia Central

Design mobile-first é o **padrão da indústria para 2025/2026**. Com o tráfego mobile superando consistentemente 60% do tráfego global e a indexação mobile-first do Google, comece sempre pelo mobile.

**Regra de ouro**: Utilitários sem prefixo se aplicam a TODOS os tamanhos de tela. Prefixos de breakpoint se aplicam naquele tamanho E ACIMA.

```tsx
// CORRETO: mobile-first (melhoria progressiva)
<div className="text-sm md:text-base lg:text-lg">Começa pequeno, cresce para cima</div>

// INCORRETO: desktop-first (degradação graciosa)
<div className="lg:text-lg md:text-base text-sm">Mais código, mais bugs</div>
```

---

## Breakpoints do Tailwind

| Prefixo | Largura mín. | Dispositivos alvo |
|---------|--------------|-------------------|
| (nenhum)| 0px          | Todos os celulares (base) |
| `sm:`   | 640px        | Celulares grandes, tablets pequenos |
| `md:`   | 768px        | Tablets (retrato) |
| `lg:`   | 1024px       | Tablets (paisagem), laptops |
| `xl:`   | 1280px       | Desktops |
| `2xl:`  | 1536px       | Desktops grandes |

---

## Tipografia Fluida

Use `clamp()` para escala suave sem saltos abruptos entre breakpoints. Sempre combine `vw` com `rem` para respeitar o zoom do usuário (conformidade WCAG).

```css
@theme {
  --text-fluid-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-fluid-2xl:  clamp(1.5rem, 1.1rem + 2vw, 2rem);
  --text-fluid-4xl:  clamp(2.25rem, 1rem + 6.25vw, 3.5rem);
}
```

```tsx
<h1 className="text-fluid-4xl font-bold leading-tight">Título Principal</h1>
<p className="text-fluid-base leading-relaxed max-w-prose">Corpo do texto</p>
```

Para hierarquia via breakpoints tradicionais: `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`.

---

## Espaçamento Fluido

```css
@theme {
  --spacing-fluid-md:      clamp(1rem, 0.75rem + 1.25vw, 2rem);
  --spacing-fluid-section: clamp(4rem, 2rem + 10vw, 8rem);
}
```

```tsx
<section className="py-fluid-section px-fluid-md">
  <div className="max-w-7xl mx-auto">
    <div className="grid gap-fluid-md grid-cols-1 md:grid-cols-2 lg:grid-cols-3">{/* Cards */}</div>
  </div>
</section>
```

---

## Alvos de Toque Acessíveis (WCAG 2.2 — SC 2.5.8)

| Nível        | Tamanho mínimo | Uso |
|--------------|---------------|-----|
| WCAG 2.2 AA  | 24×24px       | Mínimo absoluto |
| Recomendado  | 44×44px       | Apple, Google, Microsoft |
| Ótimo        | 48×48px       | Ações críticas |

```tsx
<button className="min-h-11 min-w-11 p-2.5">
  <svg className="h-6 w-6">...</svg>
  <span className="sr-only">Ação</span>
</button>

// Espaçamento mínimo entre alvos: gap-3 (12px)
<nav className="flex gap-3">
  <Link href="/" className="min-h-11 px-4 py-2.5">Início</Link>
  <Link href="/sobre" className="min-h-11 px-4 py-2.5">Sobre</Link>
</nav>
```

---

## Container Queries (Nativas desde Tailwind v4)

Desde o Tailwind v4, container queries são **nativas** — não é mais necessário instalar `@tailwindcss/container-queries` (isso era v3). `@container` habilita o contêiner; filhos usam variantes `@sm:`, `@md:` etc.

```tsx
<article className="@container">
  <div className="flex flex-col @sm:flex-row gap-4 p-4 bg-white rounded-xl shadow-sm">
    <Image
      src={thumb}
      alt="Descrição"
      width={192}
      height={192}
      className="w-full @sm:w-32 @lg:w-48 aspect-video @sm:aspect-square object-cover rounded-lg"
    />
    <div className="flex-1 min-w-0">
      <h3 className="text-base @md:text-lg font-semibold truncate">Título</h3>
      <p className="text-sm @md:text-base text-gray-600 line-clamp-2 mt-2">Descrição adaptável...</p>
    </div>
  </div>
</article>
```

**Novo na v4.3:** `@container-size` estabelece contêiner de query por largura **e altura** (útil para dashboards, painéis redimensionáveis). Por padrão `@container` só cobre largura (`inline-size`). Não existem variantes nativas de altura (`@min-h-*`) — use valor arbitrário:

```tsx
<div className="@container-size">
  <div className="[@container_(height>384px)]:flex-row flex flex-col">{/* responde à altura do pai */}</div>
</div>
```

| Use Container Queries | Use Viewport Queries |
|----------------------|---------------------|
| Componentes reutilizáveis, cards, widgets | Layouts de página inteira, navbars, heros |

---

## Layouts Responsivos

```tsx
// Grid com breakpoints progressivos
<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />

// Auto-fit (sem breakpoints necessários)
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6" />

// Holy Grail: header + sidebar + main + aside + footer
<div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
  <header className="sticky top-0 z-50 h-16 bg-white border-b" />
  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_280px]">
    <nav className="hidden md:block border-r p-4" />
    <main className="p-4 md:p-6 lg:p-8" />
    <aside className="hidden lg:block border-l p-4" />
  </div>
  <footer className="bg-gray-900 text-white py-8" />
</div>
```

---

## Navegação Mobile

```tsx
const [open, setOpen] = useState(false)

<nav className="relative">
  <ul className="hidden md:flex items-center gap-6">
    <li><Link href="/" className="py-2 hover:text-blue-600">Início</Link></li>
  </ul>
  <button
    className="md:hidden min-h-11 min-w-11 p-2"
    aria-expanded={open}
    aria-controls="menu-mobile"
    aria-label="Abrir menu"
    onClick={() => setOpen(!open)}
  >
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
  <div id="menu-mobile" className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t ${open ? '' : 'hidden'}`}>
    <ul className="py-2">
      <li><Link href="/" className="block px-4 py-3 min-h-11 hover:bg-gray-50">Início</Link></li>
    </ul>
  </div>
</nav>

// Navegação inferior estilo app
<nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t safe-area-pb">
  <ul className="flex justify-around">
    <li><Link href="/" className="flex flex-col items-center min-h-14 min-w-14 px-3 py-2 text-xs">Início</Link></li>
  </ul>
</nav>
<main className="pb-20 md:pb-0">Conteúdo</main>
```

---

## Safe Area — Dispositivos com Notch/Dynamic Island

**Sempre inclua fallback no `env()`** — navegadores sem suporte ignoram a declaração inteira se não houver segundo argumento, deixando o padding indefinido em vez de cair para 0.

```css
@utility safe-area-pt { padding-top: env(safe-area-inset-top, 0px); }
@utility safe-area-pb { padding-bottom: env(safe-area-inset-bottom, 0px); }
@utility safe-area-p {
  padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px)
           env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
}
```

Requer `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` — sem `viewport-fit=cover` os insets ficam sempre zero.

---

## Imagens e Vídeo Responsivos (Next.js)

Este projeto usa Next.js — **não escreva `<img>`/`srcset` manual**; use sempre `next/image` (ver skill `nextjs-patterns`, item 11). O componente já gera `srcset`/`sizes` e otimização automaticamente.

```tsx
// Hero / LCP — nunca lazy, sempre preload + dimensões (preload é boolean, não string)
<Image src={hero} alt="Descrição" fill sizes="100vw" preload={true} />

// Abaixo da dobra — lazy por padrão
<Image src={thumb} alt="Descrição" width={400} height={300} />
```

Regras que continuam valendo independente do framework: nunca fazer lazy-load da imagem LCP; sempre declarar dimensões (evita CLS); usar `sizes` correto por contexto (`100vw` para full-bleed, valor fixo para colunas).

```tsx
// aspect-ratio evita CLS mesmo antes do vídeo carregar
<div className="aspect-video overflow-hidden rounded-lg bg-black">
  <video className="w-full h-full object-cover" playsInline preload="metadata">
    <source src="/video.mp4" type="video/mp4" />
  </video>
</div>
```

---

## Listas de Verificação

### Tamanhos de Tela para Testar
320px · 375px · 414px · 768px · 1024px · 1280px · 1440px · 1920px

### Checklist de Qualidade
- [ ] Texto legível em todos os tamanhos
- [ ] Alvos de toque mínimo 44px no mobile
- [ ] Sem scroll horizontal em nenhuma viewport
- [ ] `next/image` usado em vez de `<img>` manual, com dimensões declaradas
- [ ] Imagem LCP com `preload={true}`, nunca lazy
- [ ] Formulários e modais utilizáveis no mobile
- [ ] `env(safe-area-inset-*)` sempre com fallback

---

## Resumo de Boas Práticas

| Prática | Implementação |
|---------|--------------|
| Mobile-first | Utilitários sem prefixo primeiro, depois `sm:`, `md:`, `lg:` |
| Alvos de toque | `min-h-11 min-w-11` (44px mínimo) |
| Tipografia/espaçamento fluido | `clamp(min, preferido, max)` com `rem + vw` em `@theme` |
| Container queries | `@container` (largura) / `@container-size` (largura + altura) — nativo desde v4 |
| Safe areas | `env(safe-area-inset-*, 0px)` — sempre com fallback |
| Imagens (Next.js) | `next/image` com `preload`/dimensões, nunca `<img>` manual |
| Meta viewport | `width=device-width, initial-scale=1, viewport-fit=cover` |
