# Validação — globals.css

> **Arquivo alvo:** `src/styles/globals.css`
> **Documento de estudo:** [`estudo-globals-css.md`](../../../03-refatoracao/src/styles/estudo-globals-css.md)
> **Documento de implementação:** [`implementacao-globals-css.md`](../../../04-implementacao/src/styles/implementacao-globals-css.md)
> **Data:** 2026-04-13
> **Validador:** GitHub Copilot

---

## 1. Resumo Executivo

A implementação das Fases 1 e 2 do estudo foi realizada com alto grau de aderência ao plano documentado. O build da aplicação foi confirmado sem erros (`✓ Compiled successfully`, `✓ Generating static pages 6/6`). Nenhuma regressão funcional foi identificada. A Fase 3 (modularização em arquivos) foi corretamente adiada por bloqueador técnico válido (`postcss-import` ausente). Foi identificada uma divergência técnica de baixa severidade não documentada na implementação (comportamento de `line-height` no override do Swiper) e um problema de formatação no `index.md`.

---

## 2. Status Final da Validação

**✅ APROVADO COM RESSALVAS**

| Ressalva                                                                       | Severidade      | Ação recomendada                        |
| ------------------------------------------------------------------------------ | --------------- | --------------------------------------- |
| `@apply text-base` introduz `line-height: 1.5rem` não presente no original     | Baixa           | Documentar ou avaliar se é desejável    |
| `index.md` com linha corrompida (separador `\|---\|` embutido na última linha) | Baixa           | Corrigir formatação da tabela           |
| Fase 3 pendente (modularização de CSS)                                         | Aceita          | Aguardar instalação de `postcss-import` |
| Decisão sobre manutenção/remoção do sistema `.btn-*`                           | Pendente humana | Validar com responsável do projeto      |

---

## 3. Principais Aderências

### ✅ Fase 1 — Organização e limpeza (4/4 itens)

| Item do estudo                                                      | Implementado? | Verificação                                                                                                |
| ------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| Comentários de seção no topo do arquivo                             | ✅ Sim        | Presentes em globals.css (6 seções: DIRECTIVES, BASE, TYPOGRAPHY, COMPONENTS, VENDORS, e headers internos) |
| Remoção de `.btn-tertiary` (dead code confirmado por grep)          | ✅ Sim        | Ausente em globals.css; grep em `src/**/*.{tsx,ts}` confirma: 0 referencias ativas                         |
| TODO documentando pendência do sistema `.btn-*`                     | ✅ Sim        | Comentário `/* TODO:` presente antes do bloco `.btn`                                                       |
| Converter `font-size: 1rem` → `@apply text-base` no override Swiper | ✅ Sim        | `@apply text-white text-base` presente na regra `.swiper-button-prev::after, .swiper-button-next::after`   |

### ✅ Fase 2 — Tokens e migração de animações (3/3 itens)

| Item do estudo                                                                                   | Implementado? | Verificação                                                                                |
| ------------------------------------------------------------------------------------------------ | ------------- | ------------------------------------------------------------------------------------------ |
| Tokens de tipografia no `tailwind.config.js` (`display-1`, `display-2`, `display-3`, `pretitle`) | ✅ Sim        | Presentes em `theme.extend.fontSize` com valores corretos                                  |
| Classes `.h1`, `.h2`, `.h3`, `.pretitle` atualizadas para usar tokens                            | ✅ Sim        | Validado linha a linha em globals.css                                                      |
| `@keyframes float` e classes `.animate-float*` migradas para o config do Tailwind                | ✅ Sim        | Definidos em `theme.extend.keyframes` e `theme.extend.animation`; removidos do globals.css |

### ✅ Fase 3 — Adiamento justificado

- Estudo previa a modularização como Fase 3 (opcional).
- Implementação documenta corretamente que `postcss-import` está ausente, tornando a modularização insegura sem pré-requisito.
- Decisão de adiar é tecnicamente sólida e foi registrada.

---

## 4. Principais Desvios e Lacunas

### D1 — `@apply text-base` introduz `line-height` não presente no original

**Tipo:** Desvio técnico não documentado na implementação  
**Severidade:** Baixa

**Análise técnica:**

|                               | Original                              | Novo                                                |
| ----------------------------- | ------------------------------------- | --------------------------------------------------- |
| Regra                         | `@apply text-white; font-size: 1rem;` | `@apply text-white text-base;`                      |
| CSS gerado para `font-size`   | `font-size: 1rem`                     | `font-size: 1rem` (idêntico)                        |
| CSS gerado para `line-height` | _(não definida neste seletor)_        | `line-height: 1.5rem` (adicionada pelo `text-base`) |

O `text-base` no Tailwind v3 gera `font-size: 1rem` **e** `line-height: 1.5rem`. O CSS anterior definia apenas `font-size`. Para pseudo-elementos `::after` usados como ícones do Swiper, a adição de `line-height` é visualmente inócua — o Swiper dimensiona seus botões por `width`/`height` e `font-size`. Contudo, é um delta comportamental real não mencionado no documento de implementação.

**Impacto visual:** Nenhum esperado.  
**Recomendação:** Documentar o comportamento no implementação ou, se necessário precisar do original, substituir por:

```css
@apply text-white;
font-size: 1rem; /* match original: sem line-height override */
```

### D2 — `index.md` com linha corrompida

**Tipo:** Problema de formatação documental  
**Severidade:** Baixa

A última linha do `index.md` sofreu o mesmo tipo de corrupção que ocorreu anteriormente no `history.md` (separador `| --- |` embutido no meio de uma linha de dados da tabela). O conteúdo informativo está correto, apenas a formatação Markdown está quebrada.

**Ação:** Corrigir a tabela no `index.md` após a validação.

---

## 5. Riscos de Regressão

### RSK-1 — Animações `animate-float*` migrando de CSS global para utilidades Tailwind

**Probabilidade de regressão:** Muito baixa  
**Raciocínio:**

- Antes: `.animate-float` era definido diretamente no CSS (sem layer).
- Depois: `.animate-float` é gerado pelo Tailwind como `@layer utilities`.
- Os nomes das classes permanecem idênticos.
- O `BackgroundDogs.tsx` usa os nomes como strings literais, confirmados por grep (3 matches, linhas 65, 67, 68).
- O `tailwind.config.js` inclui `./src/components/**/*.{js,ts,jsx,tsx}` no `content`, garantindo que o scanner encontre e inclua as classes.
- O CSS gerado é semanticamente idêntico ao original.
- Build passou sem erros. ✅

**Observação complementar:** As classes de animação são aplicadas a elementos `<image>` SVG em `BackgroundDogs.tsx`. O uso de `className` em elementos SVG é válido, e CSS `@keyframes` com `transform: translateY()` funciona em SVG em todos os browsers modernos. Este é um pré-existente que o estudo sinalizou corretamente: o risco não foi introduzido pela refatoração.

### RSK-2 — Tokens de tipografia como utilitários Tailwind (`text-display-*`, `text-pretitle`)

**Probabilidade de regressão:** Nula  
**Raciocínio:**

- Os tokens são usados apenas via `@apply` dentro de `globals.css`, nunca diretamente em componentes.
- A verificação por grep em `src/**/*.{tsx,ts}` para `text-display` e `text-pretitle` retornou **0 matches** em componentes.
- Portanto, não há risco de colisão de nomes ou uso inadvertido.
- O `@apply` nos custom classes (`.h1`, `.h2`, `.h3`, `.pretitle`) resolve corretamente porque o config já registra os tokens.

### RSK-3 — `lineHeight` embutida no token `display-1` vs. ausência nos demais

**Probabilidade de regressão:** Nula  
**Raciocínio:**

- `display-1: ["4.375rem", { lineHeight: "4.875rem" }]` — `xl:text-display-1` gera `font-size` + `line-height` simultaneamente. Isso substitui o `xl:leading-[4.875rem]` que estava explícito no estudo original. Comportamento idêntico preservado. ✅
- `display-2: "2.75rem"` — gera apenas `font-size`. O `.h2` mantém `leading-[120%]` explícito. ✅
- `display-3: "2rem"` — equivalente a `text-[2rem]`: gera apenas `font-size`. O `.h3` mantém `leading-[110%]` explícito. ✅
- `pretitle: "2.875rem"` — gera apenas `font-size`. O `.pretitle` mantém `leading-[110%]` explícito. ✅

---

## 6. Avaliação de Testes

**Estado:** Sem testes (pré-existente — projeto não possui infraestrutura de testes).

O estudo e a implementação reconhecem esse estado e não comprometem a testabilidade futura. As mudanças realizadas são estáticas (CSS/config), sem impacto em lógica ou comportamento de componentes. Não geram necessidade de testes unitários imediatos.

**Recomendação futura:**

Quando Jest + Testing Library for introduzido, os tokens de tipografia e o sistema de classes semânticas (`.h1`, `.h2` etc.) são candidatos a:

- Testes de snapshot de componentes que usam essas classes (ex.: `Hero.tsx`, `Upcoming.tsx`)
- Visual regression tests via Storybook/Chromatic quando o Storybook for adicionado

---

## 7. Avaliação de Storybook

**Estado:** Sem Storybook (pré-existente — projeto não possui Storybook configurado).

As mudanças não introduzem impedimentos ao Storybook futuro. Os tokens de tipografia adicionados ao `tailwind.config.js` serão automaticamente disponíveis no Tailwind do Storybook quando ele for configurado, sem nenhuma configuração adicional.

---

## 8. Avaliação da Documentação

| Documento                      | Estado                  | Observação                                                              |
| ------------------------------ | ----------------------- | ----------------------------------------------------------------------- |
| `estudo-globals-css.md`        | ✅ Coerente             | Mapeia corretamente os 4 problemas centrais; proposta faseada clara     |
| `implementacao-globals-css.md` | ✅ Existente com lacuna | Não documenta o efeito `line-height` do `@apply text-base` (ver D1)     |
| `index.md`                     | ⚠️ Corrompido           | Última linha com separador `\|---\|` embutido no meio da linha de dados |
| `history.md`                   | ✅ Correto              | Formatação válida após correção anterior                                |

---

## 9. Conclusão Técnica

A refatoração do `globals.css` foi executada com disciplina: aderência ao plano do estudo, build limpo, sem regressões identificadas e documentação gerada em todas as etapas. A implementação demonstrou critério técnico ao identificar o bloqueador da Fase 3 e documentar o adiamento.

As ressalvas levantadas são de **baixa severidade** e não comprometem a estabilidade do projeto. O item D1 (`text-base` + `line-height`) merece apenas uma nota de conhecimento — não requer ação imediata. O item D2 (`index.md` corrompido) será corrigido neste ciclo.

**Parecer final: ✅ APROVADO COM RESSALVAS (baixa severidade)**

---

## 10. Pendências Pós-Validação

| Pendência                                                         | Responsável              | Prioridade |
| ----------------------------------------------------------------- | ------------------------ | ---------- |
| Corrigir formatação do `index.md`                                 | Copilot                  | Imediata   |
| Definir destino do sistema `.btn-*` (manter, remover, documentar) | Humano                   | Baixa      |
| Instalar `postcss-import` para viabilizar Fase 3                  | Humano/Copilot           | Baixa      |
| Corrigir typo `text-segundary` em `About.tsx` (pré-existente)     | Copilot (próxima tarefa) | Normal     |

---

## 11. Arquivos Impactados (referência)

| Arquivo                                        | Status                         | Como foi impactado                                                                           |
| ---------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `src/styles/globals.css`                       | ✅ Modificado e validado       | Seções comentadas; `.btn-tertiary` removido; tokens usados via `@apply`; animações removidas |
| `tailwind.config.js`                           | ✅ Modificado e validado       | Tokens `display-1/2/3`, `pretitle` adicionados; keyframes e animations adicionados           |
| `src/components/background/BackgroundDogs.tsx` | ✅ Não modificado (validado)   | Continua usando `animate-float*` — agora servidos pelo config Tailwind                       |
| Demais componentes consumidores                | ✅ Não modificados (validados) | Continuam usando classes semânticas `.h1`, `.h2`, `.h3`, `.h4`, `.pretitle` sem mudança      |
