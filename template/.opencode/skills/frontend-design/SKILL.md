---
name: frontend-design
description: Diretrizes de estética visual e decisões de design (cores, tipografia, hierarquia, layout) para interfaces production-grade. Use ao criar um componente ou página nova do zero e decisões visuais ainda não foram tomadas. Não use para ajustar responsividade (use tailwind-mobile-first) ou para animações (use ui-motion).
---

## Design Thinking

Antes de escrever código, entender o contexto e definir uma direção estética clara:

- **Propósito:** Que problema essa interface resolve? Quem usa?
- **Tom:** Escolher uma direção e executar com precisão. Exemplos: brutalmente minimal, maximalista, retro-futurista, orgânico/natural, luxuoso/refinado, editorial/magazine, brutalista/cru, art déco/geométrico, industrial/utilitário. Usar como inspiração — a direção escolhida deve ser própria do contexto.
- **Diferencial:** O que torna essa interface inesquecível? O que o usuário vai lembrar?

**Regra:** Maximalismo bold e minimalismo refinado funcionam igualmente bem. O que não funciona é falta de intenção.

---

## Implementação

Produzir código funcional e production-grade que seja:

- Visualmente marcante e coeso com a direção estética definida
- Meticulosamente refinado em cada detalhe
- Compatível com a stack do projeto (verificar `AGENTS.md`)

---

## Diretrizes de Estética

**Tipografia**
- Evitar fontes genéricas: Inter, Roboto, Arial, system fonts, Space Grotesk
- Escolher fontes com caráter próprio — uma display distintiva + uma body refinada
- A tipografia deve reforçar o tom da interface

**Cor e Tema**
- Usar CSS variables para consistência
- Paletas dominantes com acentos precisos superam paletas tímidas e distribuídas igualmente
- Comprometer-se com uma paleta — não neutralizar a cor com medo

**Movimento**
- Animações em momentos de alto impacto: entrada da página com staggered reveals (animation-delay)
- Hover states que surpreendem
- CSS-only quando possível; Motion library para React quando disponível
- Micro-interações espalhadas aleatoriamente valem menos que uma entrada bem orquestrada

**Composição Espacial**
- Layouts inesperados: assimetria, sobreposição, fluxo diagonal, elementos que quebram o grid
- Espaço negativo generoso OU densidade controlada — nunca meio-termo sem intenção

**Fundos e Detalhes Visuais**
- Criar atmosfera e profundidade — evitar cores sólidas sem textura
- Recursos disponíveis: gradient meshes, noise textures, padrões geométricos, transparências em camadas, sombras dramáticas, bordas decorativas, grain overlays

---

## Proibições

- Paletas de gradiente roxo em fundo branco
- Layouts e padrões de componente previsíveis
- Design genérico sem caráter específico ao contexto
- Fontes da lista proibida acima

---

## Complexidade de Implementação

Casar a complexidade do código com a visão estética:

- **Designs maximalistas:** animações elaboradas, efeitos extensos, camadas visuais
- **Designs minimalistas/refinados:** contenção, precisão, atenção a espaçamento e tipografia, detalhes sutis

Elegância vem de executar bem a visão — não de adicionar mais elementos.
