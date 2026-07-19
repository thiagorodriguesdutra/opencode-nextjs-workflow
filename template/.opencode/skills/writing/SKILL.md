---
name: writing
description: Padrões de escrita clara baseados nos princípios de Zinsser — clareza, concisão, simplicidade. Use para mensagens de commit, mensagens de erro, documentação e qualquer comunicação técnica escrita. Não use para código ou nomes de variáveis (isso é convenção do projeto, não estilo de escrita).
---

# Padrões de Escrita
Baseado em "Como Escrever Bem" de William Zinsser.

## Princípios Fundamentais

### Clareza
- Uma ideia por frase
- Frases curtas (menos de 25 palavras)
- Voz ativa ("Corrigimos" em vez de "foi corrigido")

### Concisão
- Cada palavra precisa justificar sua presença
- Elimine palavras redundantes
- Delete o que não acrescenta

### Simplicidade
- Palavras simples no lugar de complexas
- Concreto em vez de abstrato
- Específico em vez de vago

## Padrões

### Mensagens de Commit
```
<verbo> <o quê>
```
- `Adiciona autenticação de usuário`
- `Corrige validação de pagamento`
- `Refatora consultas ao banco de dados`

Nunca: "Corrige coisas", "Atualizações", "Claude Code"

### Mensagens de Erro
```
<O que aconteceu>. <O que fazer>.
```
- `Usuário não encontrado. Verifique o e-mail.`
- `Pagamento falhou. Tente novamente ou entre em contato com o suporte.`

### Documentação
1. O que faz (uma frase)
2. Por que existe (um parágrafo)
3. Como usar (passos claros)
4. Exemplos (se necessário)

## Evite
- Voz passiva
- Palavras redundantes ("a fim de" → "para")
- Jargão sem explicação
- Linguagem evasiva ("talvez", "possivelmente")
- Parágrafos longos (mais de 5 frases)

## Teste a Sua Escrita
- Dá para cortar 30%?
- Cada palavra é necessária?
- Você diria isso a um amigo?
- Alguém consegue entender lendo por cima?
