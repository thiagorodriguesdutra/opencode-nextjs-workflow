<div align="center">

# opencode-nextjs-workflow

**Agentes, comandos e memória persistente pro [OpenCode](https://opencode.ai), prontos pra usar.**

Sem reexplicar o projeto inteiro toda sessão.

[![npm](https://img.shields.io/npm/v/create-opencode-workflow?color=cb3837&label=npm)](https://www.npmjs.com/package/create-opencode-workflow)
[![license](https://img.shields.io/badge/license-MIT-blue)](#)

</div>

---

Setup que eu uso no OpenCode: agentes e comandos prontos + uma estrutura de `docs/` que guarda roadmap, specs e features em andamento.

## Requisitos

- Node
- [OpenCode](https://opencode.ai) instalado
- Um projeto Next.js já criado (`npx create-next-app@latest` se ainda não tiver)
- Repo git iniciado (`git init`)
- [`ripgrep`](https://github.com/BurntSushi/ripgrep#installation) (`rg`) instalado

> Esse pacote **não cria projeto**. Só planta o workflow dentro de um que já existe.

## Como usar, na ordem

```bash
# 1. dentro do teu projeto Next.js
npx opencode-nextjs-workflow
```

`2.` preenche `docs/PROJECT.md` — o que o projeto faz, stack, o que não pode mudar

```bash
# 3. abre o OpenCode na raiz do projeto
opencode
```

```
# 4. gera o roadmap a partir do PROJECT.md
/create-roadmap
```

```
# 5. planeja uma feature
/plan-feature login com google
```

```
# 6. manda implementar
/create-feature
```

Isso já é o ciclo inteiro. Repete os passos **5** e **6** pra cada feature nova.

Quer só entender algo sem implementar nada?

```
/investigate por que esse endpoint tá voltando 500
```

## O que cada comando faz de verdade

<table>
<tr>
<td><code>/create-roadmap</code></td>
<td>Lê o <code>PROJECT.md</code> e gera <code>docs/ROADMAP.md</code> com as fases do projeto. Roda uma vez só, no começo. Depois disso o roadmap é seu, edita à vontade — os outros comandos só marcam item concluído, não reescrevem ele.</td>
</tr>
<tr>
<td><code>/plan-feature [descrição]</code></td>
<td>Lê o roadmap e a spec do domínio (se existir), gera os arquivos de planejamento em <code>docs/changes/</code>. Não precisa ser algo que já tava no roadmap — pode ser qualquer ideia nova que bateu na hora. Feature simples vira um <code>plan.md</code>; feature cabeluda (vários domínios, decisão técnica difícil) vira <code>proposal.md</code> + <code>tasks.md</code> e passa por revisão antes de liberar. Ele decide isso sozinho, você não escolhe.</td>
</tr>
<tr>
<td><code>/create-feature</code></td>
<td>Implementa só o que tá nas tasks, roda teste/lint antes de marcar como feito, passa por um revisor (segurança, convenção, aderência ao planejado), atualiza a spec do domínio e risca a etapa do roadmap. Se o revisor achar problema, bloqueia e fala o que ajustar.</td>
</tr>
<tr>
<td><code>/investigate [dúvida]</code></td>
<td>Explora o código, não implementa nada, reporta o que achou. Se tem trabalho de verdade a fazer, sugere <code>/plan-feature</code> no final.</td>
</tr>
</table>

## Modelos usados por padrão

Precisa de uma conta [OpenCode Go](https://opencode.ai) ativa — tudo aqui vem configurado com modelos `opencode-go/*`. Se preferir outro provider, edita o campo `model:` no `.md` de cada um.

**Subagentes** (`mode: subagent`, ficam em `.opencode/agents/`):

| Subagente | Modelo padrão |
|---|---|
| `reviewer` | `opencode-go/kimi-k2.7-code` |
| `verifier` | `opencode-go/kimi-k2.7-code` |

**Comandos** (ficam em `.opencode/commands/`, cada um roda no seu próprio agent):

| Comando | Modelo padrão |
|---|---|
| `/create-feature` | `opencode-go/kimi-k3` |
| `/create-roadmap` | `opencode-go/deepseek-v4-flash` |
| `/finalize-feature` | `opencode-go/deepseek-v4-flash` |
| `/plan-feature` | `opencode-go/qwen3.7-plus` |
| `/investigate` | `opencode-go/qwen3.7-plus` |

## Skills inclusas

Ficam em `.opencode/skills/` e são carregadas automaticamente quando o contexto pede — não precisa chamar na mão.

`nextjs-patterns` · `nextjs-seo` · `security` · `frontend-design` · `tailwind-mobile-first` · `ui-motion` · `writing`

## Convenções do projeto

O `AGENTS.md` na raiz vem com convenções de exemplo (proibições, formato de commit, idiomas, skills disponíveis). É só referência — edita ou substitui pelas convenções reais do teu projeto. Também dá pra rodar `/init` no OpenCode, que analisa a codebase e gera um `AGENTS.md` do zero, específico pro teu projeto.

## O que instala

```
seu-projeto/
├── opencode.json       # config do OpenCode
├── AGENTS.md            # convenções de exemplo, edita à vontade
├── .opencode/          # agentes, comandos, skills
└── docs/
    ├── PROJECT.md       # você preenche
    ├── ROADMAP.md       # gerado no passo 4
    ├── specs/           # populado conforme implementa
    └── changes/         # feature em planejamento fica aqui
```

> Arquivo que já existe é pulado, não sobrescreve nada. Pra recomeçar do zero, apaga `.opencode` e `docs` na mão.

## Onde cada resposta mora

| Dúvida daqui 3 meses | Cadê |
|---|---|
| Em que fase do projeto eu tô? | `docs/ROADMAP.md` |
| O que essa feature era pra fazer mesmo? | `docs/changes/archive/[data]-[nome]/` |
| Como o sistema de pagamento se comporta hoje? | `docs/specs/pagamentos.md` |
| Por que decidimos fazer assim? | Seção "Decisões" dentro da spec do domínio |

---

Não substitui o bom senso: ajuste pequeno, conversa direto com o OpenCode sem workflow nenhum. Isso aqui é pra feature que vale documentar — trocar o texto de um botão não precisa de `/plan-feature`.
