# Estudo: globals.css

> Data: 2026-04-13  
> Tipo: estudo de arquivo + proposta de refatoração  
> Arquivo analisado: `src/styles/globals.css`  
> Foco: arquitetura CSS global, modularidade, escalabilidade, testabilidade, Tailwind CSS  
> Status: rascunho

---

## 1. Contexto do arquivo

`globals.css` é o único ponto de entrada de estilos globais da aplicação. Ele é importado diretamente em `src/app/layout.tsx` via:

```ts
import "@/styles/globals.css";
```

Por ser importado no `RootLayout`, suas regras se aplicam a **toda a aplicação** — home, listagem de filhotes, detalhe do filhote e eventuais páginas futuras.

O projeto utiliza **Tailwind CSS v3** com configuração em `tailwind.config.js`. As diretivas `@tailwind base`, `@tailwind components` e `@tailwind utilities` são declaradas neste arquivo, tornando-o o único responsável pela injeção dos layers do Tailwind.

---

## 2. Objetivo aparente do arquivo

O arquivo cumpre três funções distintas:

1. **Injeção do Tailwind CSS** (`@tailwind base/components/utilities`)
2. **Estilos base globais** (body, headings HTML)
3. **Classes utilitárias semânticas reutilizáveis** (`.h1`–`.h4`, `.pretitle`, `.btn`, `.btn-*`, `.animate-float-*`)
4. **Sobrescrita de estilos de terceiros** (Swiper pagination bullets e navigation arrows)

Todas essas funções convivem no mesmo arquivo, sem separação de camadas.

---

## 3. Inventário técnico do arquivo

### 3.1 Estrutura geral (95 linhas)

| Seção                | Linhas | Conteúdo                                                                            |
| -------------------- | ------ | ----------------------------------------------------------------------------------- |
| Tailwind directives  | 1–3    | `@tailwind base/components/utilities`                                               |
| Body base            | 5–7    | Aplica `bg-primary text-secondary font-primary`                                     |
| Heading HTML reset   | 9–16   | Aplica `font-primary` a `h1–h6`                                                     |
| Typography utilities | 18–36  | `.h1`, `.h2`, `.h3`, `.h4`, `.pretitle`                                             |
| Button utilities     | 38–53  | `.btn`, `.btn-accent`, `.btn-secondary`, `.btn-tertiary`                            |
| Swiper overrides     | 55–62  | Bullets com cor `accent`                                                            |
| Float animation      | 64–87  | `@keyframes float` + `.animate-float`, `.animate-float-slow`, `.animate-float-fast` |
| Swiper nav arrows    | 89–95  | `::after` branco com `font-size: 1rem`                                              |

### 3.2 Classes definidas

| Classe                | Responsabilidade                                                   |
| --------------------- | ------------------------------------------------------------------ |
| `.h1`                 | Estilo para `<h1>` — 4xl/4.375rem, bold, uppercase, text-secondary |
| `.h2`                 | Estilo para `<h2>` — 3xl/2.75rem, semibold                         |
| `.h3`                 | Estilo para `<h3>` — 2rem, medium                                  |
| `.h4`                 | Estilo para `<h4>` — text-sm text-accent                           |
| `.pretitle`           | Subtítulo decorativo — font-secondary, 4xl/2.875rem, accent-hover  |
| `.btn`                | Base do botão — min-w, h-12, rounded-full, flex, transition        |
| `.btn-accent`         | Variante de botão preta                                            |
| `.btn-secondary`      | Variante de botão dourada                                          |
| `.btn-tertiary`       | Duplicata exata de `.btn-accent`                                   |
| `.animate-float`      | Flutuação 10s                                                      |
| `.animate-float-slow` | Flutuação 14s                                                      |
| `.animate-float-fast` | Flutuação 8s                                                       |

---

## 4. Dependências e acoplamentos

### 4.1 Depende de

- **`tailwind.config.js`**: todas as classes compostas por `@apply` dependem dos tokens definidos nele:
   - Cores: `bg-primary`, `text-secondary`, `text-accent`, `bg-accent`, `bg-accent-hover`, `bg-secondary`, `bg-secondary-hover`, `text-accent-hover`
   - Fontes: `font-primary`, `font-secondary`
   - Breakpoint: `xl:` (≥ 1310px)

- **`tailwindcss-animate`** (plugin): referenciado em `tailwind.config.js`, mas não é utilizado em `globals.css`.

### 4.2 Consome (é importado por)

- `src/app/layout.tsx` — único ponto de importação.

### 4.3 Consumidores das classes definidas

| Classe CSS            | Componentes que usam                                                                   |
| --------------------- | -------------------------------------------------------------------------------------- |
| `.h1`                 | `Hero.tsx`                                                                             |
| `.h2`                 | `Footer.tsx`, `Faq.tsx`, `Upcoming.tsx`, `filhotes/[id]/view/index.tsx`                |
| `.h3`                 | `PuppiesInfo.tsx`                                                                      |
| `.h4`                 | `About.tsx`, `FaqItem.tsx`                                                             |
| `.pretitle`           | `About.tsx`, `Hero.tsx`, `Upcoming.tsx`, `Parents.tsx`, `filhotes/[id]/view/index.tsx` |
| `.btn` / `.btn-*`     | **Nenhum componente usa** (dead code confirmado)                                       |
| `.animate-float`      | `BackgroundDogs.tsx`                                                                   |
| `.animate-float-slow` | `BackgroundDogs.tsx`                                                                   |
| `.animate-float-fast` | `BackgroundDogs.tsx`                                                                   |

### 4.4 Terceiros sobrescritos

- **Swiper.js**: `.swiper-pagination-bullet` e `.swiper-button-prev/next::after`  
  Esses seletores dependem da estrutura de classes gerada pela biblioteca — acoplamento implícito.

---

## 5. Fluxo de dados e responsabilidades

`globals.css` não tem fluxo de dados no sentido funcional — é CSS puro. No entanto, exerce papel de **contrato visual global**:

1. Tailwind injeta os layers base/components/utilities.
2. As regras de `body` e `h1–h6` estabelecem o padrão visual da aplicação.
3. As classes semânticas (`.h1–.h4`, `.pretitle`, `.btn`) são aplicadas via `className` nos componentes JSX.
4. As animações float são aplicadas condicionalmente por `BackgroundDogs.tsx` com lógica JS.
5. As sobrescritas de Swiper garantem que os controles do carrossel sigam o design system.

---

## 6. Problemas encontrados

### P1 — Dead code: sistema de botões nunca utilizado

As classes `.btn`, `.btn-accent`, `.btn-secondary` e `.btn-tertiary` estão definidas mas **nenhum componente do projeto as consome**. Todo botão em `PuppiesCard.tsx`, `PuppiesInfo.tsx` e `Footer.tsx` usa classes Tailwind inline ao invés dessas classes globais.

**Impacto**: CSS gerado desnecessariamente, contrato visual implícito sem implementação.

### P2 — Duplicata semântica: `.btn-tertiary` idêntico a `.btn-accent`

```css
.btn-accent {
   @apply bg-accent hover:bg-accent-hover;
}
.btn-tertiary {
   @apply bg-accent hover:bg-accent-hover;
}
```

Ambas as classes são **idênticas** em conteúdo. `btn-tertiary` nunca é utilizada. É dead code duplicado.

### P3 — Arquivo monolítico sem separação de camadas

Todas as responsabilidades (reset base, tipografia, botões, animações, overrides de terceiros) convivem em um único arquivo. À medida que o projeto crescer, esse arquivo se tornará difícil de manter e auditar.

### P4 — Sobrescritas de Swiper frágeis e sem contexto

```css
.swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet,
.swiper-horizontal.swiper-pagination-bullets .swiper-pagination-bullet {
   @apply bg-accent;
}
```

Essas sobrescritas dependem de seletores de classes geradas pelo Swiper. Uma atualização de versão do Swiper pode silenciosamente quebrar os estilos sem nenhum aviso em build ou TypeScript. Além disso, estão no arquivo global em vez de ficarem próximas dos componentes que usam Swiper.

### P5 — Tipografia em `.h1–.h4` não é realmente configurada no nivel do Tailwind

As classes `.h1`, `.h2`, `.h3`, `.h4` e `.pretitle` definem tamanhos de fonte com valores arbitrários (`text-[4.375rem]`, `text-[2.75rem]`, `text-[2rem]`, `text-[2.875rem]`) que não estão registrados nos tokens do `tailwind.config.js`. Isso cria dois mundos: parte dos tokens no config, parte do design system no CSS global, dificultando auditoria e manutenção.

### P6 — `@keyframes float` e `.animate-float-*` são tecnicamente CSS arbitrário quando Tailwind oferece alternativas

O projeto usa `tailwindcss-animate` (registrado como plugin), mas as animações de float foram implementadas manualmente com `@keyframes` no CSS global em vez de expandir o tema via `tailwind.config.js`. Isso fragmenta a fonte de verdade das animações.

### P7 — Mixing de unit systems

O arquivo mistura `rem` absoluto (`text-[4.375rem]`, `w-[7rem]`, `h-[3rem]`), `px` via Tailwind defaults, e `%` em `leading-[120%]`. Não há padrão de unidade estabelecido.

### P8 — `font-size: 1rem` hardcoded em CSS puro para Swiper arrows

```css
.swiper-button-prev::after,
.swiper-button-next::after {
   @apply text-white;
   font-size: 1rem;
}
```

`font-size: 1rem` não está declarado via `@apply` (usando a classe `text-base`), quebrando a consistência de uso do Tailwind no arquivo.

### P9 — Texto de placeholder herdado visível no `About.tsx`

No componente `About.tsx` há texto claramente de projeto anterior ("o Blog nasceu com o propósito de unir arte, música e lifestyle") e uma classe `text-segundary` (com erro de digitação — deveria ser `text-secondary`) que não existe no `tailwind.config.js`. Embora não seja um problema de `globals.css` diretamente, a ausência de registro desse token no config impede detectar o erro estaticamente.

---

## 7. Riscos técnicos e arquiteturais

| Risco | Severidade | Descrição                                                                                                                                                |
| ----- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1    | Média      | Dead code em `.btn-*`: pode ser adicionado por engano em componentes futuros sem perceber que o design system de botões está desacoplado da prática real |
| R2    | Baixa      | Seletores Swiper frágeis: atualização da lib pode quebrar silenciosamente                                                                                |
| R3    | Média      | Valores de tipografia não registrados em tokens: impossibilita fazer mudanças consistentes no design system sem varrer manualmente o CSS                 |
| R4    | Baixa      | Mistura de unidades sem padrão: aumenta fricção cognitiva para novos desenvolvedores                                                                     |
| R5    | Alta       | Arquivo monolítico: qualquer colapso ou lint fail no arquivo paralisa toda a pipeline de estilos                                                         |

---

## 8. Impacto em escalabilidade, modularidade e legibilidade

### Escalabilidade

O arquivo crescerá linearmente com a adição de seções, componentes e estados visuais. Sem separação por responsabilidade, chegará a um estado de difícil auditoria com poucos meses de desenvolvimento.

### Modularidade

Não há modularidade: é um arquivo único flat. Componentes que dependem de estilos globais como `.animate-float-*` não têm co-localização visual — os estilos estão longe dos componentes que os consomem, dificultando entendimento e deleção segura.

### Legibilidade

O arquivo atual tem apenas 95 linhas e ainda assim mistura 5 responsabilidades distintas. Com 200+ linhas, a legibilidade se tornará um problema real sem separação por seção ou arquivo.

---

## 9. Impacto em testes (Jest/Cypress)

### Jest / Testing Library

- As classes CSS globais não são testadas diretamente.
- No entanto, classes como `.h1`, `.h2`, `.pretitle` que controlam aparência tipográfica **poderiam** ser verificadas via snapshot tests ou `toHaveClass` assertions quando o projeto tiver testes.
- O dead code em `.btn-*` cria falsa percepção de que existe um "sistema de botões testável" que, na prática, não está implementado.

### Cypress

- As animações `.animate-float-*` controladas por JS podem interferir em testes visuais (Cypress screenshots podem capturar estado intermediário da animação).
- Seria útil ter, em ambiente de test, uma forma de desabilitar animações — ex: via variável CSS `@media (prefers-reduced-motion)` ou via classe condicional.

---

## 10. Impacto em Storybook

- Qualquer componente documentado no Storybook que dependa de `.h1–.h4`, `.pretitle` ou `.animate-float-*` precisará que o `globals.css` seja importado globalmente na configuração do Storybook (`preview.ts`).
- O dead code de `.btn-*` pode criar confusão ao montar stories de botões — o desenvolvedor pode assumir que essas classes funcionam e tentar aplicá-las.
- As sobrescritas de Swiper precisarão ser importadas junto com os CSs do Swiper nas stories de `Carousel`, `Parents` e `Upcoming`.

---

## 11. Proposta de refatoração

### Visão geral

A proposta é **modularizar** o `globals.css` em camadas lógicas distintas, sem perder compatibilidade com Tailwind e sem quebrar componentes existentes.

A separação segue o princípio de **Single Responsibility**: cada arquivo de estilo tem uma responsabilidade específica.

### Estrutura proposta

```
src/styles/
├── globals.css              ← ponto de entrada (apenas imports e directives)
├── base.css                 ← reset e estilos base (body, html, headings HTML)
├── typography.css           ← classes semânticas .h1–.h4, .pretitle
├── components.css           ← classes de componentes reutilizáveis (.btn, .btn-*)
├── animations.css           ← @keyframes e .animate-float-*
└── vendors/
    └── swiper.css           ← sobrescritas de estilos do Swiper
```

O `globals.css` ficaria assim:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "./base.css";
@import "./typography.css";
@import "./components.css";
@import "./animations.css";
@import "./vendors/swiper.css";
```

### Alternativa mais simples (curto prazo)

Sem criar novos arquivos, apenas **adicionar comentários de seção** no `globals.css` atual para tornar as fronteiras explícitas e visíveis:

```css
/* ============================
   TAILWIND DIRECTIVES
   ============================ */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================
   BASE — Body & HTML elements
   ============================ */
...

/* ============================
   TYPOGRAPHY — Semantic classes
   ============================ */
...
```

Isso não resolve a modularidade, mas melhora rastreabilidade e preparação para separação futura.

---

## 12. Passo a passo sugerido

### Fase 1 — Quick wins (sem risco de regressão)

1. **Remover `.btn-tertiary`** (dead code idêntico a `.btn-accent`)
2. **Adicionar comentários de seção** no `globals.css` para delimitar responsabilidades
3. **Converter `font-size: 1rem`** no Swiper arrows para `@apply text-base` (consistência Tailwind)
4. **Documentar intenção** do sistema `.btn-*` com comentário explicando por que existe mas não é usado

### Fase 2 — Consolidação dos tokens (médio prazo)

5. **Registrar os valores de tipografia arbitrários** como tokens em `tailwind.config.js`:

   ```js
   fontSize: {
     'display-1': ['4.375rem', { lineHeight: '4.875rem' }],
     'display-2': ['2.75rem', { lineHeight: '1.2' }],
     'display-3': ['2rem', { lineHeight: '1.1' }],
     'pretitle':  ['2.875rem', { lineHeight: '1.1' }],
   }
   ```

   Isso permitiria que `.h1` usasse `text-display-1` em vez de `text-[4.375rem]`.

6. **Migrar `.animate-float-*` para `tailwind.config.js`** usando `theme.extend.animation` e `theme.extend.keyframes`, eliminando o `@keyframes` manual do CSS global.

### Fase 3 — Modularização (médio/longo prazo)

7. **Separar em arquivos** conforme estrutura proposta na seção 11
8. **Mover sobrescritas de Swiper** para junto dos componentes que as usam, ou para `vendors/swiper.css`
9. **Decidir o destino do sistema `.btn-*`**: implementar nos componentes que deveriam usá-lo, ou remover definitivamente
10.   **Introduzir `@media (prefers-reduced-motion)`** para desabilitar animações em contextos de acessibilidade

### Fase 4 — Limpeza final (longo prazo)

11. **Revisar se `.btn-*` deve ser implementado** nos botões reais (`PuppiesCard`, `PuppiesInfo`, `Footer`) para dar coerência ao design system, ou se o padrão inline do Tailwind é suficiente e o sistema `.btn-*` deve ser removido
12. **Avaliar a criação de um design token file** separado (CSS custom properties) para exportar tokens de cor, fonte e espaçamento de forma framework-agnóstica

---

## 13. Ordem recomendada de implementação futura

| Prioridade | Fase     | Ação                                                   |
| ---------- | -------- | ------------------------------------------------------ |
| 1          | Fase 1   | Remover `.btn-tertiary`                                |
| 2          | Fase 1   | Adicionar comentários de seção                         |
| 3          | Fase 1   | Converter `font-size: 1rem` para `@apply text-base`    |
| 4          | Fase 2   | Registrar tokens de tipografia no `tailwind.config.js` |
| 5          | Fase 2   | Migrar animações float para `tailwind.config.js`       |
| 6          | Fase 3   | Separar em arquivos modulares                          |
| 7          | Fase 3   | Mover sobrescritas de Swiper                           |
| 8          | Fase 3/4 | Decidir e implementar (ou remover) o sistema `.btn-*`  |
| 9          | Fase 4   | Introduzir `prefers-reduced-motion`                    |

---

## 14. Pontos que precisam de validação humana

1. **O sistema `.btn-*` deve ser mantido ou removido?**  
   Se deve ser mantido, os botões `PuppiesCard`, `PuppiesInfo`, `Footer` precisam ser refatorados para usá-lo. Se deve ser removido, a remoção é segura (dead code confirmado).

2. **A tipografia deve ser consolidada em tokens do Tailwind (config) ou permanecer em CSS global?**  
   Essa decisão define onde fica a "fonte de verdade" do design system.

3. **As animações float devem migrar para o `tailwind.config.js` ou permanecer como CSS puro?**  
   CSS puro é mais fácil de entender para devs sem contexto de Tailwind, mas o config oferece mais consistência com o restante do sistema.

4. **As sobrescritas de Swiper são permanentes ou o Swiper será customizado de outra forma no futuro?**  
   Impacta decisão de onde manter essas regras.

5. **Existe plano de introdução de dark mode?**  
   O `tailwind.config.js` tem `darkMode: ["class"]` ativado, mas `globals.css` não tem nenhum suporte a variáveis CSS para dark mode. Se dark mode for planejado, a arquitetura de `globals.css` precisará ser redesenhada com CSS custom properties.

---

## 15. Conclusão

`globals.css` é um arquivo pequeno (95 linhas) mas **tecnicamente relevante e com vários problemas que tendem a se ampliar com o crescimento do projeto**:

- **Dead code** em todo o sistema de botões (`.btn`, `.btn-accent`, `.btn-secondary`, `.btn-tertiary`), com duplicata idêntica entre `.btn-accent` e `.btn-tertiary`.
- **Monolito sem separação de camadas**: base, tipografia, componentes, animações e overrides de terceiros convivem sem fronteiras.
- **Tokens de tipografia fragmentados**: parte no `tailwind.config.js`, parte em valores arbitrários no CSS global — sem fonte de verdade única.
- **Animações implementadas como CSS manual** quando a stack já inclui `tailwindcss-animate` e suporta extensão via config.
- **Sobrescritas de Swiper frágeis** e sem co-localização com os componentes que dependem delas.

As correções de **Fase 1 são de baixo risco e alto valor imediato** — podem ser executadas a qualquer momento, independente de outras refatorações. As fases 2 e 3 têm maior impacto arquitetural e dependem de decisões de design system que precisam ser validadas com o responsável pelo projeto.

O `globals.css` está em condição de manutenção segura no curto prazo, mas **precisa de atenção antes que o projeto adicione novos componentes** para evitar proliferação de dead code e valores hardcoded desconexos do sistema de tokens.
