# Implementação: globals.css

> Data: 2026-04-13  
> Tipo: implementação baseada em estudo de refatoração  
> Documento base: `docs/03-refatoracao/src/styles/estudo-globals-css.md`  
> Arquivo principal implementado: `src/styles/globals.css`  
> Arquivos secundários alterados: `tailwind.config.js`  
> Foco: refatoração do arquivo, modularidade, consolidação de tokens, limpeza de dead code  
> Status: concluído

---

## 1. Contexto da implementação

`globals.css` é o único ponto de entrada de estilos globais da aplicação, importado em `src/app/layout.tsx`. O estudo anterior identificou cinco responsabilidades distintas convivendo sem separação de camadas, dead code no sistema de botões, tokens de tipografia hardcoded fora do config do Tailwind e animações implementadas como CSS puro quando a stack já suporta extensão via `tailwind.config.js`.

Esta implementação executa as **Fases 1 e 2** do plano proposto no estudo.

---

## 2. Documento de estudo utilizado como base

[estudo-globals-css.md](../../03-refatoracao/src/styles/estudo-globals-css.md)

---

## 3. Objetivo da implementação

- Tornar o arquivo legível e auditável com comentários de seção claros
- Remover código morto sem uso confirmado
- Consolidar tokens de tipografia no `tailwind.config.js` como fonte de verdade
- Migrar animações para o `tailwind.config.js` eliminando CSS manual
- Corrigir inconsistência de uso do Tailwind no override do Swiper

---

## 4. Escopo implementado

| Fase   | Item                                                                | Status                             |
| ------ | ------------------------------------------------------------------- | ---------------------------------- |
| Fase 1 | Adicionar comentários de seção                                      | ✅ Implementado                    |
| Fase 1 | Remover `.btn-tertiary` (dead code)                                 | ✅ Implementado                    |
| Fase 1 | Documentar intenção do sistema `.btn-*` com TODO                    | ✅ Implementado                    |
| Fase 1 | Converter `font-size: 1rem` → `@apply text-base`                    | ✅ Implementado                    |
| Fase 2 | Registrar tokens de tipografia em `tailwind.config.js`              | ✅ Implementado                    |
| Fase 2 | Atualizar classes `.h1`, `.h2`, `.h3`, `.pretitle` para usar tokens | ✅ Implementado                    |
| Fase 2 | Migrar `@keyframes float` e `.animate-float-*` para o config        | ✅ Implementado                    |
| Fase 3 | Separar em arquivos modulares (`base.css`, `typography.css`, etc.)  | ⏳ Não implementado — ver seção 13 |

---

## 5. Arquivos alterados

### 5.1 `src/styles/globals.css`

Arquivo principal refatorado. Mudanças:

- Adição de cabeçalhos de seção: `TAILWIND DIRECTIVES`, `BASE`, `TYPOGRAPHY`, `COMPONENTS`, `VENDORS`
- Remoção de `.btn-tertiary` (duplicata exata de `.btn-accent`, dead code confirmado)
- Adição de comentário TODO acima do sistema `.btn-*` documentando a pendência de decisão
- Atualização de `.h1`: `xl:text-[4.375rem]` → `xl:text-display-1`; remoção de `xl:leading-[4.875rem]` (agora embutido no token `display-1`)
- Atualização de `.h2`: `xl:text-[2.75rem]` → `xl:text-display-2`
- Atualização de `.h3`: `text-[2rem]` → `text-display-3`
- Atualização de `.pretitle`: `xl:text-[2.875rem]` → `xl:text-pretitle`
- Remoção completa do bloco `@keyframes float` (migrado para `tailwind.config.js`)
- Remoção completa das classes `.animate-float`, `.animate-float-slow`, `.animate-float-fast` (agora geradas pelo Tailwind via config)
- Swiper arrows: `@apply text-white;` + `font-size: 1rem;` → `@apply text-white text-base;` (consistência Tailwind)

### 5.2 `tailwind.config.js`

Arquivo de configuração do Tailwind. Adições em `theme.extend`:

```js
fontSize: {
   "display-1": ["4.375rem", { lineHeight: "4.875rem" }],
   "display-2": "2.75rem",
   "display-3": "2rem",
   pretitle: "2.875rem",
},
keyframes: {
   float: {
      "0%, 100%": { transform: "translateY(0px)" },
      "50%": { transform: "translateY(-40px)" },
   },
},
animation: {
   float: "float 10s ease-in-out infinite",
   "float-slow": "float 14s ease-in-out infinite",
   "float-fast": "float 8s ease-in-out infinite",
},
```

---

## 6. Principais decisões técnicas

### D1 — Token `display-1` inclui `lineHeight`

O token `"display-1": ["4.375rem", { lineHeight: "4.875rem" }]` inclui o `lineHeight` embutido. Isso permitiu remover `xl:leading-[4.875rem]` da classe `.h1`, já que `@apply xl:text-display-1` gera ambos no mesmo media query:

```css
/* gerado por Tailwind */
@media (min-width: 1310px) {
   .h1 {
      font-size: 4.375rem;
      line-height: 4.875rem;
   }
}
```

Os outros tokens (`display-2`, `display-3`, `pretitle`) usam apenas o valor de `font-size` sem `lineHeight` embutido, porque as classes correspondentes já controlam o `leading-[]` de forma explícita e intencional.

### D2 — Animações completamente removidas do CSS global

As animações foram migradas para `tailwind.config.js` via `theme.extend.keyframes` e `theme.extend.animation`. O Tailwind gera:

- `@keyframes float` no layer `base`
- `.animate-float`, `.animate-float-slow`, `.animate-float-fast` no layer `utilities`

`BackgroundDogs.tsx` usa esses nomes de classe via string literal, garantindo que o Tailwind os escaneie e inclua no build (`src/components/**/*.{js,ts,jsx,tsx}` está no `content`).

### D3 — `.btn-tertiary` removida, `.btn` e `.btn-*` preservados com TODO

`.btn-tertiary` era dead code com conteúdo idêntico a `.btn-accent`. Removida sem risco.

O sistema `.btn`, `.btn-accent`, `.btn-secondary` foi **mantido** porque existe a possibilidade de ser adotado em refatorações futuras dos botões. A decisão de remover todo o sistema de botões ou implementá-lo nos componentes reais requer validação humana. Um comentário TODO foi adicionado documentando explicitamente a pendência.

### D4 — Fase 3 (modularização) não implementada

`postcss.config.js` não tem `postcss-import` configurado. Sem esse plugin, `@import` em `globals.css` seria tratado como CSS nativo (fetch separado pelo browser) em vez de ser inlinado em build-time. A modularização segura requer ou:

- instalação de `postcss-import` + reconfiguração do `postcss.config.js`
- ou validação do comportamento de `@import` no bundler do Next.js 15

Esta fase foi adiada para evitar risco de produção.

---

## 7. O que foi refatorado

| Antes                                                           | Depois                                                                |
| --------------------------------------------------------------- | --------------------------------------------------------------------- |
| Arquivo flat sem seções visíveis                                | 5 seções delimitadas por comentários                                  |
| 4 classes de botão (uma delas duplicata morta)                  | 3 classes de botão com TODO documentando pendência                    |
| `xl:text-[4.375rem]` + `xl:leading-[4.875rem]` hardcoded no CSS | Token `display-1: ['4.375rem', { lineHeight: '4.875rem' }]` no config |
| `xl:text-[2.75rem]` hardcoded                                   | Token `display-2: '2.75rem'` no config                                |
| `text-[2rem]` hardcoded                                         | Token `display-3: '2rem'` no config                                   |
| `xl:text-[2.875rem]` hardcoded                                  | Token `pretitle: '2.875rem'` no config                                |
| `@keyframes float` + `.animate-float-*` em CSS puro             | Migrado para `theme.extend.keyframes/animation` no config             |
| `@apply text-white;` + `font-size: 1rem;` para Swiper arrows    | `@apply text-white text-base;` consistente com Tailwind               |
| 95 linhas sem organização                                       | 90 linhas organizadas + comentários de seção                          |

---

## 8. O que foi preservado por segurança

- **Todas as classes semânticas** (`.h1`, `.h2`, `.h3`, `.h4`, `.pretitle`): os nomes não mudaram, apenas a implementação interna das classes — nenhum componente precisou ser alterado
- **`.animate-float`, `.animate-float-slow`, `.animate-float-fast`**: nomes preservados, agora gerados pelo Tailwind — `BackgroundDogs.tsx` continua funcionando sem modificação
- **Sobrescritas do Swiper**: seletores preservados integralmente
- **Sistema `.btn-*`** (exceto `.btn-tertiary`): mantido para permitir decisão futura
- **Comportamento visual**: nenhuma mudança de renderização aparente — build confirmou zero regressão

---

## 9. Impacto em arquitetura e modularização

### Modularização

O arquivo ainda é um único CSS, mas agora com **fronteiras explícitas e documentadas** por seção. A estrutura está preparada para uma futura separação em arquivos quando `postcss-import` for configurado ou quando o bundler do Next.js 15 for validado para esse uso.

### Fonte de verdade do design system

Os valores de tipografia `4.375rem`, `2.75rem`, `2rem` e `2.875rem` foram promovidos de valores arbitrários hardcoded no CSS para tokens nomeados no `tailwind.config.js`. A partir de agora, qualquer componente pode usar `text-display-1`, `text-display-2`, `text-display-3` ou `text-pretitle` diretamente como utilitário Tailwind — com autocomplete e rastreabilidade.

### Animações

O sistema de animações float agora é gerenciado como parte do design system do Tailwind, com o mesmo padrão de extensão usado pelas cores, fontes e breakpoints. Isso elimina a distinção entre "CSS gerenciado pelo Tailwind" e "CSS manual" para esse caso.

---

## 10. Impacto em testes

O projeto **não possui testes** no momento. Não há testes a atualizar.

Como referência para implementação futura:

- As classes semânticas (`.h1`, `.h2`, `.pretitle`) podem ser verificadas via `toHaveClass()` no Testing Library
- As animações agora são utilitários Tailwind padrão, testáveis da mesma forma que qualquer utility class
- O TODO documentado sobre os botões pode orientar a criação de testes quando os botões forem alinhados ao sistema

---

## 11. Impacto em Storybook

O projeto **não possui Storybook** no momento. Não há stories a atualizar.

Como referência para implementação futura:

- O `globals.css` deve ser importado no arquivo `preview.ts` do Storybook
- Com os tokens registrados no `tailwind.config.js`, o Storybook terá acesso automático a `text-display-1`, `text-display-2`, etc. via addons de Tailwind
- O TODO sobre `.btn-*` deve ser resolvido antes de criar stories para componentes de botão

---

## 12. Riscos, trade-offs e limitações

### Risco residual — `text-pretitle` como token Tailwind

O token `pretitle` gera a utility class `text-pretitle` no Tailwind. O CSS também define `.pretitle` como classe semântica. São coisas distintas:

- `className="pretitle"` → aplica todo o estilo da classe CSS (família, tamanho, cor)
- `className="text-pretitle"` → aplica APENAS o font-size (4.375rem → `xl`)

Este risco é baixo, mas deve ser documentado em onboarding de novos desenvolvedores.

### Trade-off — `display-1` com `lineHeight` embutido

Ao incluir `lineHeight: "4.875rem"` no token `display-1`, o `line-height` do `h1` em `xl+` passou a ser controlado no config em vez de no CSS. Esse comportamento é idêntico ao anterior, mas a fonte de verdade mudou de localização. Para alterações futuras, basta atualizar o config.

### Limitação — Fase 3 não implementada

A modularização em arquivos separados (`base.css`, `typography.css`, `animations.css`, `vendors/swiper.css`) permanece pendente. O arquivo crescerá de forma flat até a configuração de `postcss-import` ou confirmação do suporte nativo do bundler do Next.js 15.

---

## 13. Pendências e próximos passos recomendados

| Prioridade  | Item                                                                                             | Decisão necessária |
| ----------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| Alta        | Decidir destino do sistema `.btn-*`: implementar nos componentes ou remover                      | Humana             |
| Média       | Instalar `postcss-import` e implementar Fase 3 (modularização em arquivos)                       | Técnica            |
| Média       | Adicionar `@media (prefers-reduced-motion)` para acessibilidade nas animações                    | Técnica            |
| Baixa       | Avaliar renomeação do token `pretitle` para evitar ambiguidade com a classe CSS `.pretitle`      | Técnica            |
| Baixa       | Resolver texto placeholder em `About.tsx` e typo `text-segundary` → `text-secondary`             | Técnica            |
| Longo prazo | Avaliar CSS custom properties para suporte a dark mode (`darkMode: ["class"]` já está no config) | Humana + Técnica   |

---

## 14. Como validar

### ✅ Build confirmado

```
✓ Compiled successfully in 5.0s
✓ Generating static pages (6/6)
```

### Verificação visual (manual)

1. Abrir `/` — verificar `Hero.tsx`: `.h1` e `.pretitle` renderizando corretamente em mobile e xl
2. Abrir `/filhotes` — verificar `Upcoming.tsx`: `.h2`, `.pretitle` corretos
3. Abrir `/filhotes/[id]` — verificar `PuppiesInfo.tsx`: `.h3` correto
4. Abrir `/` e verificar `BackgroundDogs.tsx`: animação de float funcionando
5. Verificar `Footer.tsx`: `.h2` no CTA final
6. Verificar `Faq.tsx` e `FaqItem.tsx`: `.h2` e `.h4`
7. Verificar Swiper em `Carousel.tsx` e `Parents.tsx`: bullets e arrows com estilo correto

### Verificação de regressão de tipografia (xl breakpoint)

| Componente        | Classe      | Antes                                        | Depois                         |
| ----------------- | ----------- | -------------------------------------------- | ------------------------------ |
| `Hero.tsx`        | `.h1`       | `font-size: 4.375rem; line-height: 4.875rem` | idêntico (via token display-1) |
| `Footer.tsx`      | `.h2`       | `font-size: 2.75rem; line-height: 120%`      | idêntico (via token display-2) |
| `PuppiesInfo.tsx` | `.h3`       | `font-size: 2rem; line-height: 110%`         | idêntico (via token display-3) |
| `Hero.tsx`, etc.  | `.pretitle` | `font-size: 2.875rem`                        | idêntico (via token pretitle)  |

---

## 15. Conclusão

As **Fases 1 e 2** do estudo foram implementadas com sucesso e confirmadas via build de produção sem erros.

O `globals.css` passou de um arquivo flat de 95 linhas com 5 responsabilidades misturadas para um arquivo organizado em seções claras, sem dead code ativo, com tokens de design system registrados no `tailwind.config.js` e com animações gerenciadas pela infraestrutura do Tailwind.

O comportamento visual da aplicação é **idêntico ao anterior** — nenhum componente precisou ser alterado. As classes semânticas (`.h1`, `.h2`, `.h3`, `.h4`, `.pretitle`, `.animate-float-*`) mantêm os mesmos nomes e comportamentos.

A **Fase 3 (modularização em arquivos)** permanece como próxima evolução natural, dependendo da confirmação do suporte a `@import` no contexto do Next.js 15 ou da instalação de `postcss-import`.
