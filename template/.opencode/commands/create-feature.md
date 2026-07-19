---
description: Implementa a etapa ativa em docs/changes/, verifica conformidade, atualiza a spec de domínio e arquiva a mudança.
agent: build
model: opencode-go/kimi-k3
subtask: true
permission:
  task:
    "*": deny
    "reviewer": allow
    "verifier": allow
---

Etapa a implementar: $ARGUMENTS (ou a etapa ativa em `docs/changes/`, se houver só uma)

## Passo 1 — Implementar

Use `plan.md` ou `tasks.md` da etapa como a única fonte de escopo. Não implemente nada fora do que está listado — se notar algo que precisa ser feito mas não está na lista, pare e reporte em vez de expandir o escopo sozinho.

Antes de marcar qualquer task como concluída, invoque `@verifier`. Se ele reportar falhas, corrija e rode de novo até "Tudo passou."

## Passo 2 — Checkpoint antes da revisão

Antes de invocar o `@reviewer`, crie um ponto de restauração:

```bash
git add -A
git commit -m "checkpoint: [etapa] — pré-revisão"
```

Esse commit existe só para dar um ponto de `git reset` seguro caso o `@reviewer` bloqueie — **não é o commit final da feature**. Se o `@reviewer` aprovar, ele pode ser mantido como está ou re-escrito com `git commit --amend` para uma mensagem final decente antes do Passo 5. Se não houver nada para commitar (working tree já limpo), pule este passo.

## Passo 3 — Verificar conformidade

Diff da etapa:
!`git diff HEAD~1 HEAD`

Invoque `@reviewer` passando a etapa e esse diff acima.

**Se o `@reviewer` retornar BLOQUEADO:** o checkpoint do Passo 2 é o estado seguro para corrigir a partir dele. Não descarte o trabalho — corrija o que o reviewer apontou, então repita o Passo 2 (novo checkpoint) e o Passo 3 (nova revisão). Se as correções derem errado e for necessário descartar tudo desde o checkpoint:

```bash
git reset --hard HEAD   # volta pro checkpoint, descarta tentativas de correção malsucedidas
```

Isso nunca apaga o checkpoint em si — só reverte edições feitas depois dele.

## Passo 4 — Atualizar a spec de domínio

Em `docs/specs/[dominio].md`:
- Se o domínio já tem spec, aplique as mudanças (ADDED/MODIFIED/REMOVED) que a etapa propôs.
- Se uma decisão arquitetural relevante foi tomada durante a implementação (algo que não estava óbvio na proposta original), registre em uma seção `## Decisões` dentro dessa mesma spec, perto do requisito que ela afeta. Não crie arquivo separado para isso — a spec do domínio é o único lugar de verdade.
- Se o domínio não tem spec ainda, crie `docs/specs/[dominio].md` com os requisitos que essa etapa estabeleceu, no formato GIVEN/WHEN/THEN.

## Passo 5 — Finalizar

Invoque `/finalize-feature $ARGUMENTS` para marcar a etapa como concluída no roadmap e arquivar a pasta.

## Saída final

Reporte em 3-5 linhas: o que foi implementado, qual spec foi atualizada, e se houve alguma decisão registrada. Não repita o conteúdo inteiro dos arquivos — quem quiser detalhe abre o arquivo.
