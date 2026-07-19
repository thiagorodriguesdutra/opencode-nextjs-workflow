---
name: ui-motion
description: Padrões de microinteração e timing de animação (easing, duração, estados de hover/focus/active) inspirados em Emil Kowalski. Use ao implementar transições, animações de componente, ou quando uma interação parecer "crua"/abrupta. Não use para decisões de layout ou cor (use frontend-design).
---

# Design Engineering

> Quando invocada sem pergunta específica, responda apenas: "Pronto para ajudar a construir interfaces que parecem certas, com base na filosofia de design engineering de Emil Kowalski. Para aprofundar: [animations.dev](https://animations.dev/)."

---

## Filosofia Central

- **Gosto é treinado.** Estude por que boas interfaces funcionam. Faça engenharia reversa de animações.
- **Detalhes invisíveis somam.** O usuário não percebe cada detalhe — percebe o conjunto. Mil vozes quase inaudíveis cantando afinadas.
- **Beleza é alavanca.** Em software bom o suficiente em todo lugar, estética diferencia.

---

## Formato de Review (Obrigatório)

Sempre use tabela markdown:

| Antes                                 | Depois                                          | Por quê                             |
|---------------------------------------|-------------------------------------------------|-------------------------------------|
| `transition: all 300ms`               | `transition: transform 200ms ease-out`          | Nunca use `all`                     |
| `scale(0)` na entrada                 | `scale(0.95) + opacity: 0`                      | Nada surge do nada                  |
| `ease-in` em dropdown                 | `ease-out` + curva custom                       | `ease-in` começa devagar            |
| Sem `:active` no botão                | `scale(0.97)` no `:active`                      | Feedback imediato                   |
| `transform-origin: center` em popover | `var(--radix-popover-content-transform-origin)` | Escala do trigger (modal: centrado) |

---

## Decisão de Animação (em ordem)

### 1. Deve animar?

| Frequência                              | Decisão                          |
|-----------------------------------------|----------------------------------|
| 100+x/dia (atalhos, command palette)    | **Sem animação. Jamais.**        |
| Dezenas/dia (hover, navegação em lista) | Remover ou reduzir drasticamente |
| Ocasional (modais, drawers, toasts)     | Animação padrão                  |
| Raro / primeira vez (onboarding)        | Pode adicionar deleite           |

Raycast não tem animação de abrir/fechar. Esse é o comportamento ideal para algo usado centenas de vezes por dia.

### 2. Qual easing usar?

```
Entrando/saindo?       → ease-out
Movendo na tela?       → ease-in-out
Hover/cor?             → ease
Movimento constante?   → linear
```

**Nunca use `ease-in` em UI.** Começa devagar — o exato momento em que o usuário está prestando atenção.

**Use curvas customizadas** (as nativas do CSS são fracas):
```css
--ease-out:     cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out:  cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer:  cubic-bezier(0.32, 0.72, 0, 1);
```
Recursos: [easing.dev](https://easing.dev/) · [easings.co](https://easings.co/)

### 3. Qual duração?

| Elemento                    | Duração   |
|-----------------------------|-----------|
| Feedback de botão           | 100–160ms |
| Tooltips, popovers pequenos | 125–200ms |
| Dropdowns, selects          | 150–250ms |
| Modais, drawers             | 200–500ms |

**Regra: UI fica abaixo de 300ms.** Spinner mais rápido → app parece mais rápido, mesmo com o mesmo tempo de carga.

---

## Componentes: Detalhes que Importam

**Botões:** `transform: scale(0.97)` no `:active`. 100–160ms ease-out. Resposta imediata ao toque.

**Entrada de elementos:** Nunca `scale(0)`. Use `scale(0.95) + opacity: 0`. Nada surge do nada no mundo real. **`@starting-style`:** anima entrada sem JS — `@starting-style { opacity: 0; transform: translateY(100%); }` dentro da regra do elemento.

**Popovers:** `transform-origin` no trigger via variável do Radix/Base UI. **Modais ficam centralizados** — não têm trigger fixo.

**Tooltips:** Delay na primeira abertura. Depois que um tooltip está aberto, os adjacentes abrem instantaneamente (`transition-duration: 0ms` com `data-instant`).

**Blur em crossfades difíceis:** `filter: blur(2px)` durante a transição elimina a sobreposição visual de dois estados. Mantenha abaixo de 20px (pesado no Safari).

**Assimetria enter/exit:** Entrada pode ser mais lenta (decisão do usuário), saída sempre rápida (resposta do sistema).
```css
/* Pressionado: deliberado */
.button:active .overlay { transition: clip-path 2s linear; }
/* Solto: rápido */
.overlay { transition: clip-path 200ms ease-out; }
```

**Stagger:** 30–80ms entre itens. Mais do que isso parece lento. Nunca bloqueie interação durante stagger.

---

## clip-path como Ferramenta de Animação

`clip-path: inset(top right bottom left)` — cada valor "come" a borda do elemento.

**Casos de uso:**
- **Reveal de texto/imagem:** `inset(0 100% 0 0)` → `inset(0 0 0 0)` da esquerda para direita
- **Hold-to-delete:** overlay de cor com 2s linear no `:active`, 200ms ease-out ao soltar
- **Tabs com transição perfeita:** duplique a lista de tabs, estilize a cópia como "ativa", anime o clip na troca
- **Slider de comparação:** clipe na imagem superior, ajuste pelo arraste — sem DOM extra

---

## Springs

Use quando: drag com momentum, elementos que devem parecer "vivos", gestures interrompíveis.

```js
// Configuração recomendada (Apple-style):
{ type: "spring", duration: 0.5, bounce: 0.2 }

// Física manual:
{ type: "spring", stiffness: 100, damping: 10 }
```

Bounce sutil: 0.1–0.3. Evite bounce em UI séria. Vantagem real: springs mantêm velocidade quando interrompidos — CSS keyframes reiniciam do zero.

---

## Performance

- **Anime apenas `transform` e `opacity`.** Outras propriedades triggeram layout/paint.
- **Não use CSS variables para posição em drag.** Muda em todos os filhos. Use `element.style.transform` direto.
- **Motion (ex-Framer Motion) `x`/`y` não são acelerados por hardware.** Use `transform: "translateX()"` para suavidade sob carga.
- **CSS animations > JS sob carga.** Rodam off-thread. Use CSS para animações predefinidas, JS para as dinâmicas/interrompíveis.
- **WAAPI:** controle programático com performance de CSS.
```js
element.animate(
  [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }],
  { duration: 1000, fill: 'forwards', easing: 'cubic-bezier(0.77, 0, 0.175, 1)' }
);
```

---

## Acessibilidade

```css
@media (prefers-reduced-motion: reduce) {
  /* Mantenha opacity/cor. Remova transforms e movimentos. */
}

@media (hover: hover) and (pointer: fine) {
  /* Hover states — evita falso positivo em touch */
}
```

---

## Checklist de Review

| Problema                              | Correção                                    |
|---------------------------------------|---------------------------------------------|
| `transition: all`                     | Especificar propriedade exata               |
| `scale(0)` na entrada                 | `scale(0.95) + opacity: 0`                  |
| `ease-in` em UI                       | `ease-out` ou curva customizada             |
| `transform-origin: center` em popover | Variável do Radix/Base UI                   |
| Animação em ação de teclado           | Remover                                     |
| Duração > 300ms em UI                 | Reduzir para 150–250ms                      |
| Hover sem media query                 | `@media (hover: hover) and (pointer: fine)` |
| Keyframes em elemento dinâmico        | CSS transitions (interrompíveis)            |
| Motion `x`/`y` sob carga              | Usar `transform: "translateX()"`            |
| Entrada e saída na mesma velocidade   | Saída mais rápida que entrada               |
| Todos os elementos aparecem juntos    | Stagger 30–80ms entre itens                 |
