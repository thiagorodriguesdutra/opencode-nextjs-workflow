---
description: Marca a etapa como concluída no roadmap e arquiva a pasta da mudança.
agent: build
model: opencode-go/deepseek-v4-flash
subtask: true
---

Etapa: $ARGUMENTS

1. Em `docs/ROADMAP.md`, marque a etapa correspondente como concluída (`[x]`). Não reescreva o roadmap inteiro.

2. Mova a pasta da etapa para `docs/changes/archive/[YYYY-MM-DD]-[nome-da-etapa]/`, usando a data de hoje.

   Antes de mover, verifique se o destino já existe:

   ```bash
   rg --files docs/changes/archive/ | rg "^docs/changes/archive/[YYYY-MM-DD]-[nome-da-etapa]"
   ```

   - **Se não existe:** mova normalmente com `git mv` (preserva histórico) ou `mv`.
   - **Se já existe:** não decida sozinho qual versão prevalece nem sobrescreva.
     Pare e reporte o conflito ao usuário, sugerindo um sufixo numérico
     (`[YYYY-MM-DD]-[nome-da-etapa]-2`) como próximo passo. Só prossiga
     depois de confirmação.

Reporte em 1 linha o que foi feito (ou o conflito encontrado, se houve).
