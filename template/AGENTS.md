# Convenções do Projeto

## Proibições Globais

| Nunca                           | Usar em vez disso                          |
|---------------------------------|--------------------------------------------|
| `rm`, `rm -rf`, `rmdir`         | `trash <arquivo>` ou `gio trash <arquivo>` |
| Cores hard-coded                | Tokens de `globals.css`                    |
| Import direto de `lucide-react` | `@/components/icons.tsx`                   |
| Crie comentários no código      | Apenas se for absolutamente necessário     |

---

## Comandos

- `npm run tree`: mostra a estrutura do projeto
- `npm run colors:check`: verifica se existe cores hardcoded
- `npx tsc --noEmit`: verifica se os tipos TypeScript estão corretos
- `npm run test`: executa os testes

---

## Idiomas
- Código e variáveis: **inglês**
- Commits, eventos de analytics, logs, mensagens ao usuário, rotas: português BR (ex: `/painel`)
- Comentários: curtos e em português BR

---

## Commits
Formato: `type(scope): descrição em português BR`

Tipos: `feat` `fix` `refactor` `perf` `test` `docs` `style` `build` `ci` `chore` `revert`

Exemplo: `fix: corrigi bug de quebrava o layout`

---

## Logging
Usar logger centralizado em `@/lib/logger.ts`. Sem lib externa.

## Analytics
Usar Umami para tracking de eventos e métricas. O objetivo é usar o Umami Cloud Free Tier.

---

## Placeholders
Para mockar imagens, usar Placehold. Ex: `https://placehold.co/600x400/png`, `https://placehold.co/600x400?font=roboto`

---

## Skills Disponíveis
- `frontend-design` — componentes e layout
- `ui-motion` — animações
- `tailwind-mobile-first` — mobile-first com Tailwind CSS
- `nextjs-patterns` — padrões Next.js
- `nextjs-seo` — SEO e metadata
- `security` — segurança mínima (auth, Server Actions, DAL)
- `writing` — padrões de escrita

---

## Pesquisas
Ordem obrigatória, não pule etapas:
1. **`rg`** — busca local sempre primeiro (`rg --files` para arquivos, `find` só para permissões/datas)
2. **Skills** — verifique se há skill disponível para o tema antes de buscar externamente
3. **Conhecimento próprio** — conceitos estáveis não precisam de busca; duvide apenas de APIs que mudam entre versões
4. **`webfetch`** — quando você tem a URL exata (doc oficial, changelog, issue específica)
5. **`websearch`** — busca aberta; só disponível com `OPENCODE_ENABLE_EXA=1`; inclua o ano na query
