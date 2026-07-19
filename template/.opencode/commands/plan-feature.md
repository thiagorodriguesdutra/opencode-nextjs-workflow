---
description: Planeja uma feature média ou complexa antes de implementar. Gera artefatos em docs/changes/[etapa]/ e, para features complexas, passa por review do subagente reviewer antes de liberar para implementação.
agent: plan
model: opencode-go/qwen3.7-plus
subtask: false
---

Feature a planejar: $ARGUMENTS

## Passo 1 — Entender antes de propor

Leia `docs/ROADMAP.md` para saber onde isso se encaixa. Se a feature toca um domínio que já tem spec em `docs/specs/[dominio].md`, leia essa spec — ela é a fonte de verdade do comportamento atual, e qualquer proposta precisa declarar explicitamente o que MODIFICA, ADICIONA ou REMOVE em relação a ela.

Você está no modo `plan`: não tem permissão de escrita. Use isso para explorar o código relevante sem risco de tocar nada por engano.

## Passo 2 — Classifique a complexidade

- **Média**: escopo claro, um domínio principal, poucas decisões técnicas em aberto → gere só `docs/changes/[etapa]/plan.md` (proposta + tasks no mesmo arquivo).
- **Complexa**: múltiplos domínios, decisão arquitetural relevante, ou ambiguidade real → gere `docs/changes/[etapa]/proposal.md` e `docs/changes/[etapa]/tasks.md` separados.

Não escolha complexa por excesso de cautela. Se você está em dúvida, é média.

## Passo 3 — Conteúdo

`plan.md` (feature média):
```markdown
# [Nome da etapa]

## Por quê
[motivação em 2-3 frases]

## O que muda
[bullet list — ADICIONA / MODIFICA / REMOVE em relação à spec, se houver]

## Tasks
- [ ] 1.1 ...
- [ ] 1.2 ...
```

`proposal.md` + `tasks.md` (feature complexa) seguem a mesma lógica, separados em dois arquivos, com `design.md` opcional só se houver decisão técnica não trivial a documentar antes de implementar.

## Passo 4 — Review (apenas para features complexas)

Se a feature foi classificada como **complexa**, invoque `@reviewer` para checar se as tasks são suficientes e coerentes com a spec existente. Se o reviewer bloquear, ajuste e rode de novo. Só anuncie "pronto para implementação" depois de veredicto APROVADO.

Se a feature foi classificada como **média**, anuncie diretamente "pronto para implementação"
