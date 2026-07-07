# Diagnóstico Completo — Front-end filhotes-border-collie

> Data: 2026-04-13
> Tipo: diagnóstico
> Escopo: projeto inteiro
> Status: em revisão

---

## 1. Visão geral do projeto

Aplicação web de catálogo de filhotes de Border Collie para o canil "Encinas & Braga". A aplicação permite:

- Visualizar filhotes disponíveis e indisponíveis com fotos, datas, sexo, cor e disponibilidade.
- Filtrar filhotes por sexo e cor via barra de busca na Hero.
- Visualizar detalhes de cada filhote individualmente (carousel de galeria + infos).
- Conhecer os pais (Ragnar e Luna) com galeria de fotos.
- Entrar em contato via WhatsApp com mensagem pré-formatada.
- Seção de FAQ (atualmente desabilitada na home).
- Seção "Sobre Nós" (atualmente desabilitada na home).

**Fato:** O projeto não possui backend. Todos os dados vêm de arquivos JSON estáticos (`puppies-mock.json`, `parents-mock.json`, `faq-mock.json`).

---

## 2. Stack e tecnologias identificadas

| Tecnologia               | Versão  | Finalidade                                                             |
| ------------------------ | ------- | ---------------------------------------------------------------------- |
| Next.js                  | 15.3.5  | Framework principal (App Router)                                       |
| React                    | 19.x    | Biblioteca de UI                                                       |
| TypeScript               | 5.x     | Tipagem estática                                                       |
| Tailwind CSS             | 3.4.1   | Framework de estilos                                                   |
| Radix UI                 | Vários  | Componentes primitivos (Select, Tabs, DropdownMenu, Popover)           |
| shadcn/ui                | —       | Geração de componentes UI baseados em Radix (config `components.json`) |
| Framer Motion            | 12.23.3 | Animações e transições                                                 |
| Swiper                   | 11.2.10 | Carousels (home + detalhes)                                            |
| date-fns                 | 4.1.0   | Formatação de datas                                                    |
| lucide-react             | 0.525.0 | Ícones (usado nos componentes ui)                                      |
| react-icons              | 5.5.0   | Ícones (usado nos componentes de negócio)                              |
| react-scroll             | 1.9.3   | Scroll suave (instalado, mas sem uso identificado no código)           |
| class-variance-authority | 0.7.1   | Variantes de classes (instalado, sem uso direto encontrado)            |
| tailwind-merge           | 3.3.1   | Merge de classes Tailwind (via `cn()`)                                 |
| tailwindcss-animate      | 1.0.7   | Plugin de animações Tailwind                                           |
| ESLint                   | 9.x     | Linter (config mínima: `next/core-web-vitals` + `next/typescript`)     |

**Ausências notáveis:**

- Nenhum framework de testes (Jest, Vitest, Testing Library) — **zero testes**.
- Nenhum Storybook.
- Nenhuma ferramenta de CI/CD configurada visível.
- Nenhum Prettier configurado.
- Nenhum Husky/commitlint/lint-staged.

---

## 3. Estrutura atual do repositório

```
/
├── public/assets/          → Imagens estáticas (logo, puppies, parents, backgrounds, icons)
├── src/
│   ├── app/
│   │   ├── layout.tsx      → Root layout (fontes, metadata, PuppiesProvider, Header, Footer)
│   │   ├── not-found.tsx   → Página 404
│   │   ├── (home)/         → Route group para Home
│   │   │   ├── page.tsx    → Re-exporta controller
│   │   │   ├── controller/ → HomeController (metadata + renderiza HomeView)
│   │   │   └── view/       → HomeView (Hero, Upcoming, Parents)
│   │   └── (contents)/     → Route group para conteúdos
│   │       ├── layout.tsx  → Layout compartilhado (Hero)
│   │       └── filhotes/
│   │           ├── page.tsx     → Re-exporta controller
│   │           ├── controller/  → PuppiesController (metadata + renderiza PuppiesView)
│   │           ├── view/        → PuppiesView (PuppiesList)
│   │           └── [id]/
│   │               ├── page.tsx     → Re-exporta controller
│   │               ├── controller/  → PuppiesDetailController (busca puppy por id, metadata dinâmica)
│   │               └── view/        → PuppiesDetailView (carousel + info + upcoming)
│   ├── components/
│   │   ├── background/     → BackgroundDogs (SVG animado)
│   │   ├── sections/       → Seções da aplicação (About, Carousel, Faq, Footer, Header, Hero, InfoPuppies, Parents, Searchbar, SkeletonGrid, Upcoming)
│   │   └── ui/             → Componentes shadcn/ui (dropdown-menu, popover, select, skeleton, tabs)
│   ├── contexts/
│   │   └── context.tsx     → PuppiesProvider (contexto global único)
│   ├── styles/
│   │   └── globals.css     → Estilos globais + classes utilitárias customizadas
│   ├── types/
│   │   └── index.ts        → Tipos globais (Puppy, Parent, FaqItem, PuppiesContextValue, Filters)
│   └── utils/
│       ├── functions/      → Utilitários (variants.ts, whatsapp.ts)
│       ├── lib/            → tailwindClassUtils.ts (cn helper)
│       └── mock/           → JSONs de dados (puppies, parents, faq)
```

**Observações:**

- O projeto usa route groups do Next.js (`(home)`, `(contents)`) — demonstra conhecimento de organização do App Router.
- As páginas seguem um padrão **Controller / View** (page.tsx re-exporta controller, controller importa view).
- Não existe a camada "Page" intermediária (o controller faz o papel de Page + Controller combinado).

---

## 4. Arquitetura atual identificada

### Padrão Controller / View

O projeto adota parcialmente o padrão Controller / Page / View:

- **page.tsx** → arquivo de rota do Next.js, re-exporta default e metadata/generateMetadata do controller.
- **controller/index.tsx** → componente Server Component (async), lida com metadata e, no caso de `[id]`, busca dados do mock para passar à view.
- **view/index.tsx** → componente `"use client"`, renderiza a UI.

**Problema identificado:** Os controllers de `/filhotes` e `(home)` são Server Components que não fazem nada além de renderizar a view. A lógica de dados está no contexto global, não no controller. Apenas o controller de `[id]` efetivamente processa dados (busca puppy por ID).

### Fluxo de dados

```
[JSON Mocks] → PuppiesProvider (Context Global) → Componentes "use client"
                                                 ↗ (via useContext)
```

- Todos os dados são carregados no `PuppiesProvider` no root layout.
- Componentes acessam dados via `useContext(PuppiesContext)`.
- Não há fetch, API, services, adapters ou camadas de acesso a dados.
- Filtragem acontece na memória do client (useMemo no context).

### Rendering

- **Controllers** são Server Components (podem ser async).
- **Views** são Client Components (`"use client"`).
- O `PuppiesProvider` envolve **toda a aplicação** (inclusive Header e Footer) e é `"use client"`, fazendo com que o entire tree de children perca a capacidade de ser Server Component efetivamente no que diz respeito à hidratação.

---

## 5. Como as páginas funcionam hoje

### Home (`/(home)`)

1. `page.tsx` re-exporta `HomeController`.
2. `HomeController` define metadata estática e renderiza `<HomeView />`.
3. `HomeView` (`"use client"`) renderiza: `<Hero />`, `<UpcomingSection />`, `<ParentsSection />`.
4. Seções `<AboutSection />` e `<FaqSection />` estão **comentadas**.

**Problema:** `HomeView` renderiza `<Hero />` **e** o layout `(contents)` também renderiza `<Hero />`. Quando o usuário navega para `/filhotes`, o Hero aparece. Na home, o Hero vem do `HomeView`. Isso resulta em **duplicação condicional** do Hero.

### Lista de Filhotes (`/(contents)/filhotes`)

1. O layout `(contents)` renderiza `<Hero />` acima do children.
2. `page.tsx` re-exporta `ArticlesController` (nomenclatura inconsistente — diz "Articles").
3. Controller renderiza `<PuppiesView />`.
4. View renderiza `<PuppiesList />`.
5. `PuppiesList` consome `filteredPuppies` do contexto e renderiza um grid de `PuppiesCard`.

### Detalhes do Filhote (`/(contents)/filhotes/[id]`)

1. Layout `(contents)` renderiza `<Hero />`.
2. `page.tsx` re-exporta `PuppiesDetailController` + `generateMetadata`.
3. Controller busca puppy por ID no mock JSON e passa para `<PuppiesDetailView puppies={puppy} />`.
4. View renderiza `PuppiesCarousel` + `PuppiesInfo` + `UpcomingSection`.

### 404

Página básica bem implementada, com `BackgroundDogs`, link de retorno e metadata adequada.

---

## 6. Como os componentes funcionam hoje

### Componentes de negócio (`sections/`)

| Componente        | Responsabilidade                               | Observações                                                         |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| `Hero`            | Seção hero com search                          | Consome contexto. Duplicada na home e no layout de contents.        |
| `Header`          | Logo + link home                               | Consome contexto apenas para `handleClearSearch`.                   |
| `Footer`          | Rodapé com ícones aleatórios e WhatsApp        | Duplica array de SVGs do `BackgroundDogs`.                          |
| `Searchbar`       | Barra de busca (sexo + cor + botão)            | Consome contexto. Redireciona para `/filhotes`.                     |
| `SexSearch`       | Select de sexo                                 | Consome contexto.                                                   |
| `ColorSearch`     | Select de cor                                  | Consome contexto.                                                   |
| `PuppiesList`     | Grid de filhotes filtrados                     | Consome contexto. Chama `notFound()` em caso de erro (side-effect). |
| `PuppiesCard`     | Card de filhote com badge, data, cor, WhatsApp | Props-driven, mas com lógica de formatação interna.                 |
| `PuppiesInfo`     | Info detalhada do filhote                      | Quase idêntico ao PuppiesCard (duplicação significativa).           |
| `PuppiesCarousel` | Carousel de imagens do filhote                 | Props-driven. Bem isolado.                                          |
| `Carousel`        | Carousel genérico de filhotes (Swiper)         | Usado no Upcoming. Renderiza `PuppiesCard` dentro de `SwiperSlide`. |
| `Upcoming`        | Seção "filhotes" com tabs + carousel           | Consome contexto. Filtro local por sexo.                            |
| `Parents`         | Seção pais com carousel                        | Consome contexto.                                                   |
| `About`           | Seção sobre nós                                | Desabilitada. Usa Framer Motion.                                    |
| `Faq`             | Lista de FAQ                                   | Desabilitada. Consome contexto.                                     |
| `FaqItem`         | Acordeão de FAQ individual                     | State local (isOpen).                                               |
| `SkeletonGrid`    | Grid de loading                                | Reutilizável.                                                       |
| `BackgroundDogs`  | SVGs flutuantes animados                       | Array hardcoded de 18 SVGs. Efeito só roda no client.               |

### Componentes UI (`ui/`)

Todos gerados pelo shadcn/ui. Seguem o padrão shadcn (forwardRef, cn(), Radix primitives):

- `dropdown-menu.tsx` — não é usado em nenhum lugar do código atual.
- `popover.tsx` — não é usado em nenhum lugar do código atual.
- `select.tsx` — usado pelo `SexSearch` e `ColorSearch`.
- `skeleton.tsx` — usado pelo `SkeletonGrid`.
- `tabs.tsx` — usado pelo `Upcoming`.

**Fato:** `dropdown-menu.tsx` e `popover.tsx` são código morto.

---

## 7. Como a lógica de negócio está distribuída hoje

A lógica de negócio está **quase inteiramente no `PuppiesProvider`** (Context):

1. **Carregamento de dados:** Mocks JSON importados diretamente no contexto.
2. **Filtragem de filhotes:** `filteredPuppies` é um `useMemo` baseado em `appliedFilters`.
3. **Filtro por sexo:** `filterBySex` callback no contexto.
4. **Gestão de busca:** `handleSubmit` aplica filtros, `handleClearSearch` limpa.
5. **Estados de busca:** `selectedSex`, `selectedColor`, `appliedFilters`, `showPuppiesList`.
6. **Formatação de datas:** Duplicada em `PuppiesCard` e `PuppiesInfo`.
7. **Link WhatsApp:** Lógica no utilitário `whatsapp.ts`, chamada diretamente nos componentes.

**Problemas:**

- O contexto é um **God Object** — concentra dados de filhotes, pais, FAQ, filtros, loading, erros e callbacks num único Provider.
- `isLoading` é hardcoded como `false` e `error` como `null` — nunca mudam.
- `showPuppiesList` é gerenciado no contexto mas nunca consumido pela view.
- Lógica de formatação de data está duplicada entre `PuppiesCard` e `PuppiesInfo`.

---

## 8. Como dados, serviços e integrações funcionam hoje

- **Fonte de dados:** 3 arquivos JSON estáticos em `utils/mock/`.
- **Serviços:** Não existem. Zero camada de service/adapter/repository.
- **Integração externa:** Única integração é a geração de link WhatsApp (`wa.me`), via função utilitária.
- **API:** Inexistente. Nenhum `fetch`, `axios`, `SWR`, `React Query` etc.
- **Variáveis de ambiente:** Apenas `SITE_URL` usada no `metadataBase` do root layout.
- **Autenticação/autorização:** Inexistente.

**Inferência:** O projeto está numa fase de MVP/landing page estática com dados mockados. A evolução natural seria migrar os mocks para uma API ou CMS.

---

## 9. Como estilos, UI e design system estão organizados hoje

### Tailwind CSS

- Configuração customizada com cores (`primary`, `accent`, `secondary`, `text`, `lightText`, `white`).
- Fontes customizadas via CSS variables (`--font-poppins`, `--font-caveat`).
- Breakpoints: `sm`, `md`, `lg`, `xl` (max 1310px).
- Plugin `tailwindcss-animate` habilitado.

### Classes utilitárias globais (`globals.css`)

- `.h1`, `.h2`, `.h3`, `.h4`, `.pretitle` — classes de tipografia global.
- `.btn`, `.btn-accent`, `.btn-secondary`, `.btn-tertiary` — classes de botão.
- Animações CSS customizadas: `animate-float`, `animate-float-slow`, `animate-float-fast`.
- Override de estilos do Swiper (bullets e setas).

### Padrões de estilização

- Classes Tailwind inline em todos os componentes (padrão utility-first).
- `cn()` usado apenas nos componentes shadcn/ui.
- Nenhum CSS module.
- Nenhum design token formalizado.
- **Problema:** Muitas classes Tailwind com magic numbers hardcoded (e.g., `w-[6.875rem] h-12`, `max-w-[37.5rem]`, `pt-52 xl:pt-12`).

### Iconografia

- **Duas bibliotecas de ícones concorrentes:** `react-icons` (seções) e `lucide-react` (componentes ui). Redundância.

---

## 10. Como testes e Storybook estão organizados hoje

### Testes

**Não existem.** Zero arquivos de teste. Zero configuração de Jest, Vitest, Testing Library, Cypress ou qualquer outro framework. Nenhum script de teste no `package.json`.

### Storybook

**Não existe.** Zero configuração. Nenhuma story. Nenhum addon.

---

## 11. Principais problemas encontrados

### P1 — God Object Context (Severidade: Alta)

**Arquivo:** [src/contexts/context.tsx](src/contexts/context.tsx)

O `PuppiesProvider` concentra **tudo** num único contexto:

- Dados de filhotes, pais e FAQ.
- Estado de filtros (selectedSex, selectedColor, appliedFilters).
- Callbacks de busca e limpeza.
- Estado de loading/error (ambos estáticos).
- Função `filterBySex`.

Qualquer mudança de estado causa re-render em todos os consumidores. Todos os componentes que usam `useContext(PuppiesContext)` — Hero, Header, Searchbar, SexSearch, ColorSearch, PuppiesList, Upcoming, Parents, Faq — são re-renderizados.

### P2 — Duplicação significativa de código (Severidade: Alta)

1. **`PuppiesCard` vs `PuppiesInfo`:** Lógica de formatação de data (`displayDate`), link WhatsApp, badges de sexo/disponibilidade e botão de contato são quase idênticos.
2. **Array de SVGs:** Duplicado entre `BackgroundDogs` e `Footer` (18 itens cada).
3. **Lógica de ordenação por disponibilidade:** Duplicada em `PuppiesList` e `Upcoming`.

### P3 — Uso incorreto de `<Head>` em App Router (Severidade: Alta)

**Arquivos:** [src/app/(home)/view/index.tsx](<src/app/(home)/view/index.tsx>), [src/app/(contents)/filhotes/view/index.tsx](<src/app/(contents)/filhotes/view/index.tsx>), [src/app/(contents)/filhotes/[id]/view/index.tsx](<src/app/(contents)/filhotes/[id]/view/index.tsx>)

Os Views usam `next/head` (`<Head>` do Pages Router). No Next.js App Router, `<Head>` **não funciona**. Metadata deve ser exportada no Server Component (controller/page). Os controllers já exportam metadata corretamente, então os `<Head>` nas views são **código morto que pode confundir**.

### P4 — PuppiesProvider no Root Layout fora do `<html>` (Severidade: Média)

**Arquivo:** [src/app/layout.tsx](src/app/layout.tsx#L60-L85)

```tsx
<PuppiesProvider>
   <html lang="pt-BR">...</html>
</PuppiesProvider>
```

O `PuppiesProvider` envolve o `<html>`. O padrão correto é colocar providers dentro do `<body>`.

### P5 — Ausência total de testes (Severidade: Alta)

Zero testes. Nenhuma infraestrutura de testes. Qualquer refatoração será feita "no escuro" sem rede de segurança.

### P6 — Ausência de Storybook (Severidade: Média)

Sem Storybook, não há documentação visual, catálogo de componentes nem testes visuais.

### P7 — Nomenclatura inconsistente (Severidade: Média)

- Controller de `/filhotes` se chama `ArticlesController` (herança de um projeto anterior?).
- Props chamadas `puppies` para receber um **único** filhote (e.g., `PuppiesCard({ puppies })`, `PuppiesInfo({ puppies })`). Deveria ser `puppy` (singular).
- Interface `ArticlesInfoProps` em `PuppiesInfo`.
- Texto "Blog nasceu com o propósito" na seção `About` — claramente copy de outro projeto.
- FAQ em inglês nos mocks sobre "construction project" — dados placeholder de outro domínio.

### P8 — Código morto e dependências não utilizadas (Severidade: Baixa)

- `dropdown-menu.tsx` — não é importado em nenhum componente.
- `popover.tsx` — não é importado em nenhum componente.
- `react-scroll` — instalado no package.json, sem nenhum import no código.
- `class-variance-authority` — instalado, sem uso direto encontrado (usado internamente pelo shadcn, mas não nos componentes do projeto).
- `showPuppiesList` — existe no contexto, nunca é consumido pela view.
- Seções `About` e `Faq` existem mas estão comentadas na Home.

### P9 — Duplicação do Hero (Severidade: Média)

- `HomeView` renderiza `<Hero />`.
- `(contents)/layout.tsx` renderiza `<Hero />`.
- Quando o usuário está na Home, o Hero vem do `HomeView`. Quando está em `/filhotes`, vem do layout `(contents)`.
- Isso cria duplicação do mesmo componente em dois locais diferentes.

### P10 — Magic numbers e strings hardcoded (Severidade: Média)

- Número WhatsApp hardcoded: `"5516999724070"` em `whatsapp.ts`.
- Textos de UI hardcoded nos componentes (sem i18n, sem constantes centralizadas).
- Tamanhos em px e rem hardcoded nas classNames (`pt-52`, `w-[6.875rem]`, `max-w-[37.5rem]`).
- Lista de 18 SVGs hardcoded em dois arquivos diferentes.

### P11 — Falta de error handling e edge cases (Severidade: Média)

- `PuppiesList` chama `notFound()` como side-effect dentro do render quando `error` é truthy — mas `error` nunca é truthy.
- O controller de `[id]` usa `puppy!` (non-null assertion) logo após o `if (!puppy) notFound()` — tecnicamente funcional mas desnecessário.
- Nenhum error boundary.
- Nenhum tratamento de erro para imagens que falham ao carregar.

### P12 — Acoplamento forte ao Context em componentes visuais (Severidade: Alta)

Componentes que poderiam ser puros (puramente visuais, recebendo props) estão acoplados ao contexto:

- `Hero` → usa context para `handleClearSearch`
- `Header` → usa context para `handleClearSearch`
- `PuppiesList` → usa context para `filteredPuppies`, `isLoading`, `error`
- `Upcoming` → usa context para `filterBySex`
- `Parents` → usa context para `parents`
- `Faq` → usa context para `faqItems`
- `SexSearch` e `ColorSearch` → usam context para dados e setters

Isso impede testabilidade, Storybook e reutilização.

---

## 12. Riscos técnicos e arquiteturais

| #   | Risco                                                                         | Impacto | Probabilidade |
| --- | ----------------------------------------------------------------------------- | ------- | ------------- |
| R1  | Sem testes → bugs em refatoração futura                                       | Alto    | Alta          |
| R2  | God Object context → problemas de performance com mais dados                  | Alto    | Média         |
| R3  | Dados estáticos (mocks) → dificuldade para escalar para API real              | Médio   | Alta          |
| R4  | `<Head>` não funcional → SEO pode estar comprometido em algumas views         | Médio   | Confirmado    |
| R5  | Provider fora do `<html>` → possível hydration mismatch no React 19           | Médio   | Média         |
| R6  | Número WhatsApp hardcoded → risco em mudança de número                        | Baixo   | Média         |
| R7  | FAQ e About com conteúdo placeholder de outro projeto → vazamento em produção | Médio   | Média         |
| R8  | Duas libs de ícones → bundle maior que o necessário                           | Baixo   | Confirmado    |
| R9  | Sem Prettier/Husky → inconsistência de formatação no time                     | Baixo   | Alta          |
| R10 | Acoplamento ao Context → bloqueio para Storybook e testes                     | Alto    | Confirmado    |

---

## 13. Oportunidades de melhoria

### O1 — Splitting do contexto

Dividir `PuppiesProvider` em contextos menores e especializados:

- `PuppiesDataContext` → dados brutos (puppies, parents, faqItems)
- `SearchContext` → filtros, selectedSex, selectedColor, appliedFilters, handleSubmit, handleClearSearch
- `FilteredPuppiesContext` → filteredPuppies derivado

### O2 — Desacoplamento de componentes visuais

Transformar componentes como `PuppiesCard`, `PuppiesInfo`, `PuppiesList`, `Parents`, `Hero` em componentes **puros** que recebem props. Mover o acesso ao Context para containers ou para a camada Controller/Page.

### O3 — Implementação completa do padrão Controller / Page / View

- **Controller** → Server Component, busca dados, define metadata.
- **Page** → Camada de orquestração (container), conecta dados com views.
- **View** → Componente puro, sem context, sem efeitos colaterais.

### O4 — Camada de serviços/adapters

Criar `services/` para abstrair a fonte de dados (inicialmente lendo dos mocks, depois facilmente migrar para API/CMS).

### O5 — Infraestrutura de testes

1. Configurar Jest + Testing Library para testes unitários.
2. Configurar Cypress para testes E2E.
3. Começar pela cobertura de componentes puros e utilitários.

### O6 — Setup de Storybook

1. Instalar e configurar Storybook.
2. Criar stories para componentes visuais desacoplados.
3. Usar como documentação e ferramenta de regressão visual.

### O7 — Limpeza de código morto

Remover `dropdown-menu.tsx`, `popover.tsx`, `react-scroll`, imports de `next/head` nas views, `showPuppiesList` do contexto.

### O8 — Extrair constantes e configurações

- Número WhatsApp → variável de ambiente ou config.
- Lista de SVGs → constante compartilhada.
- Textos de UI → módulo de constantes (preparação para i18n/multi-tenant).

### O9 — Eliminar duplicação

- Extrair formatação de data para utilitário compartilhado.
- Unificar lógica de badges (sexo/disponibilidade) num componente `Badge`.
- Unificar botão/link WhatsApp num componente `WhatsAppButton`.
- Unificar array de SVGs de dogs num módulo shared.

### O10 — Preparação multi-tenant

- Externalizar: branding (logo, cores, fontes), textos, número WhatsApp, dados dos filhotes.
- Configuração por tenant via arquivo de configuração ou variáveis de ambiente.
- Remover hardcode de "Encinas & Braga" dos componentes para constantes centralizadas.

---

## 14. Prioridade sugerida dos problemas

| Prioridade | Problema                                 | Justificativa                                              |
| ---------- | ---------------------------------------- | ---------------------------------------------------------- |
| 🔴 1       | P3 — `<Head>` incorreto no App Router    | Bug confirmado. Código morto que confunde. Quick fix.      |
| 🔴 2       | P7 — Nomenclatura e conteúdo placeholder | FAQ e About com texto de outro projeto. Risco de produção. |
| 🔴 3       | P4 — Provider fora do `<html>`           | Risco de hydration mismatch. Quick fix.                    |
| 🔴 4       | P8 — Código morto                        | Ruído que dificulta manutenção. Quick fix.                 |
| 🟡 5       | P1 — God Object Context                  | Base para todas as melhorias seguintes.                    |
| 🟡 6       | P12 — Acoplamento ao Context             | Pré-requisito para testes e Storybook.                     |
| 🟡 7       | P2 — Duplicação de código                | Reduzir manutenção e risco de inconsistência.              |
| 🟡 8       | P9 — Duplicação do Hero                  | Clarificar responsabilidades de layout.                    |
| 🟡 9       | P10 — Magic numbers                      | Preparação para configurabilidade.                         |
| 🟢 10      | P5 — Ausência de testes                  | Essencial para refatoração segura (paralelo às melhorias). |
| 🟢 11      | P6 — Ausência de Storybook               | Após desacoplamento dos componentes.                       |
| 🟢 12      | P11 — Error handling                     | Após ter infraestrutura de serviços.                       |

---

## 15. Quais pontos precisam de validação humana

1. **As seções About e FAQ serão reativadas?** Se sim, os textos placeholder precisam ser substituídos. Se não, devem ser removidas.
2. **O projeto evoluirá para consumir uma API real?** Isso define se a camada de services/adapters deve ser priorizada.
3. **O número de WhatsApp é fixo ou pode mudar por campanha/tenant?** Define se externalizar para env ou config.
4. **A duplicação do Hero é intencional?** Na home o Hero está no view; em `/filhotes` está no layout de `(contents)`.
5. **Há plano de multi-tenant ou multi-canil?** Isso impacta a profundidade da externalização de configurações.
6. **Quais fluxos são considerados críticos para testes E2E?** Busca + filtro → listagem → detalhe → WhatsApp?
7. **`react-scroll` será usado futuramente?** Se não, pode ser removido.
8. **O deploy é feito na Vercel?** O domínio `fihlotes-encinas-braga.vercel.app` aparece na metadata do 404 (com typo: "fihlotes" ao invés de "filhotes").

---

## Conclusão e inventário do projeto

### Inventário

| Categoria                | Itens                                                                                                                                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Páginas**              | Home (`/`), Lista de Filhotes (`/filhotes`), Detalhe do Filhote (`/filhotes/[id]`), 404                                                                                                                           |
| **Componentes de seção** | Hero, Header, Footer, Searchbar, SexSearch, ColorSearch, PuppiesList, PuppiesCard, PuppiesInfo, PuppiesCarousel, Carousel, Upcoming, Parents, About (desab.), Faq (desab.), FaqItem, BackgroundDogs, SkeletonGrid |
| **Componentes UI**       | Select, Tabs, Skeleton, DropdownMenu (não usado), Popover (não usado)                                                                                                                                             |
| **Hooks customizados**   | Nenhum                                                                                                                                                                                                            |
| **Serviços**             | Nenhum                                                                                                                                                                                                            |
| **Providers**            | PuppiesProvider (único)                                                                                                                                                                                           |
| **Utilitários**          | `cn()`, `fadeIn()`, `generateWhatsappLink()`                                                                                                                                                                      |
| **Testes**               | Nenhum                                                                                                                                                                                                            |
| **Storybook**            | Nenhum                                                                                                                                                                                                            |
| **Pontos de entrada**    | `layout.tsx` (root), `(home)/page.tsx`, `(contents)/filhotes/page.tsx`, `(contents)/filhotes/[id]/page.tsx`                                                                                                       |

### Sugestão de ordem ideal para futura refatoração

1. **Quick wins** → Remover `<Head>` das views, corrigir Provider fora do `<html>`, remover código morto.
2. **Nomenclatura** → Renomear `ArticlesController` → `PuppiesController`, corrigir prop singular `puppy`, limpar textos placeholder.
3. **Extrair constantes** → SVGs, WhatsApp number, textos de UI.
4. **Eliminar duplicação** → Criar `formatDate()`, `WhatsAppButton`, `PuppyBadge`, constante de SVGs.
5. **Splitting do Context** → Dividir `PuppiesProvider` em contextos especializados.
6. **Desacoplar componentes** → Tornar componentes visuais puros (props instead of context).
7. **Controller / Page / View completo** → Introduzir camada Page como container.
8. **Camada de serviços** → Abstrair acesso a dados.
9. **Infraestrutura de testes** → Configurar Jest + Testing Library, escrever primeiros testes unitários.
10.   **Storybook** → Configurar e criar stories dos componentes desacoplados.
11.   **Preparação multi-tenant** → Externalizar branding, textos e configurações.

---

## Próximos passos sugeridos

1. Validar com o time os pontos da seção 15 (validação humana).
2. Executar os quick wins (prioridades 1 a 4) como primeiro PR.
3. Criar ADR para a decisão de splitting do Context.
4. Planejar o desacoplamento de componentes visuais em paralelo com setup de testes.
5. Criar roadmap detalhado com milestones para a refatoração progressiva.
