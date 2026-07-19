---
description: Exploração livre do código ou de uma dúvida técnica, com critério de saída declarado e limite de passos.
agent: build
model: opencode-go/qwen3.7-plus
subtask: true
---

Dúvida ou área a investigar: $ARGUMENTS

## Antes de começar, declare o critério de saída

Em uma frase: o que precisa ser verdade para você considerar a investigação concluída? Exemplos: "entendi onde a autenticação valida o token" ou "sei por que esse endpoint retorna 500 nesse caso específico". Escreva isso primeiro, depois explore.

## Limite

No máximo ~15-20 passos (cada leitura de arquivo, busca, ou execução de comando conta como um passo). Se você bater nesse limite sem atingir o critério de saída, pare e reporte o que descobriu até agora em vez de continuar indefinidamente. Investigação sem fim é o jeito mais comum de estourar contexto sem produzir nada útil.

## Saída

```
## Critério de saída
[o que foi declarado no início]

## Descobertas
[o que foi encontrado, direto ao ponto]

## Status
ATINGIDO — [resposta à dúvida original]
ou
PARCIAL — [o que falta, e por que parou]
```

Não implemente nada durante a investigação. Se a investigação revelar que há trabalho a fazer, termine aqui e sugira `/plan-feature` ou prompt direto, dependendo da complexidade do que foi descoberto.
