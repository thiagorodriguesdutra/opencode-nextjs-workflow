---
description: Lê PROJECT.md e gera um ROADMAP.md inicial. Use uma vez no início do projeto, ou quando PROJECT.md mudar de forma significativa.
agent: build
model: opencode-go/deepseek-v4-flash
subtask: true
---

Leia `docs/PROJECT.md` completo.

Gere ou atualize `docs/ROADMAP.md` com esta estrutura exata:

```markdown
# Roadmap

## Fases

1. [Nome da fase] — [objetivo em uma frase]
2. ...

## Fase atual: [nome]

- [ ] [etapa] — [status: não iniciada / em andamento / bloqueada]
- [ ] ...
```

Regras:
- Fases macro: 3 a 6, nunca mais. Se PROJECT.md sugere mais que isso, agrupe.
- Etapas da fase atual: o suficiente para as próximas 2-4 semanas de trabalho de um dev solo, não o projeto inteiro detalhado.
- Não invente fase ou etapa que não tem base em PROJECT.md. Se faltar clareza para definir uma fase, escreva `[a definir]` em vez de adivinhar.

Depois de gerado, este arquivo passa a ser mantido majoritariamente à mão pelo dev. `/create-feature` só risca itens concluídos — não regenera o roadmap inteiro.
