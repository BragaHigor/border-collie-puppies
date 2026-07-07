# Estudo e Proposta de Refatoração — `src/app/layout.tsx`

> Data: 2026-04-13  
> Tipo: estudo de arquivo + proposta de refatoração  
> Arquivo analisado: `src/app/layout.tsx`  
> Foco: arquitetura geral, posicionamento de provider, metadata, conformidade com App Router  
> Status: implementado (Fases 1 e 2) — Fase 3 pendente

---

## 1. Contexto do arquivo

O `layout.tsx` é o **Root Layout** do projeto — o arquivo mais alto na hierarquia do Next.js App Router. Ele define a estrutura HTML base (`<html>`, `<head>`, `<body>`), carrega fontes, configura metadata global, envolve a aplicação inteira com o `PuppiesProvider` e renderiza `Header` e `Footer` em todas as páginas.

Este arquivo é ponto de entrada obrigatório para **toda** renderização do projeto. Qualquer problema aqui afeta 100% das rotas: Home (`/`), Lista de Filhotes (`/filhotes`), Detalhe (`/filhotes/[id]`) e 404.

---

## 2. Objetivo aparente do arquivo

Servir como shell HTML da aplicação Next.js, centralizando:

1. Configuração de fontes (Poppins e Caveat via `next/font/google`).
2. Metadata global de SEO e Open Graph.
3. Provider de contexto global (`PuppiesProvider`).
4. Links de preconnect/preload no `<head>`.
5. Renderização persistente do `Header` e `Footer`.

---

## 3. Inventário técnico do arquivo

| Elemento               | Tipo / origem                | Detalhes                                                                                                     |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `metadata`             | `export const` (Next.js API) | `Metadata` com `metadataBase`, `title`, `description`, `keywords`, `openGraph`, `twitter`, `icons`, `robots` |
| `poppins`              | Instância de `Poppins`       | Fonte primária, variável CSS `--font-poppins`, 9 pesos carregados                                            |
| `caveat`               | Instância de `Caveat`        | Fonte secundária, variável CSS `--font-caveat`, 4 pesos                                                      |
| `RootLayout`           | Server Component (default)   | Função que renderiza `<html>` > `<head>` > `<body>`                                                          |
| `<PuppiesProvider>`    | Client Component wrapper     | Envolve **toda** a árvore, inclusive `<html>`                                                                |
| `<Header />`           | Client Component             | Renderizado dentro do `<body>`, antes de `{children}`                                                        |
| `<Footer />`           | Client Component             | Renderizado dentro do `<body>`, após `{children}`                                                            |
| `<head>` manual        | Tag JSX                      | Contém `<link rel="preconnect">` (2) e `<link rel="preload">`                                                |
| `@/styles/globals.css` | Import de CSS                | Estilos globais do Tailwind + classes utilitárias customizadas                                               |

**Linhas de código:** ~85 (incluindo metadata)  
**Diretiva `"use client"`:** Nenhuma (é Server Component)

---

## 4. Dependências e acoplamentos

### Imports diretos

| Import                                   | Tipo             | Observação                                                              |
| ---------------------------------------- | ---------------- | ----------------------------------------------------------------------- |
| `@/styles/globals.css`                   | CSS global       | Configura Tailwind + classes utilitárias                                |
| `@/components/sections/Header/Header`    | Client Component | Usa `useContext(PuppiesContext)` para `handleClearSearch`               |
| `@/components/sections/Footer/Footer`    | Client Component | Usa `generateWhatsappLink`, SVGs hardcoded, efeito `shuffledSvgs`       |
| `@/contexts/context` (`PuppiesProvider`) | Client Component | God Object — concentra dados de filhotes, pais, FAQ, filtros, callbacks |
| `next` (`Metadata`)                      | Tipo             | API de metadata do Next.js                                              |
| `next/font/google` (`Caveat`, `Poppins`) | Otimização       | Fontes Google self-hosted pelo Next.js                                  |

### Quem consome este layout

Todas as rotas do projeto:

- `(home)/page.tsx` → Home
- `(contents)/layout.tsx` → Sub-layout de conteúdos
- `(contents)/filhotes/page.tsx` → Lista de filhotes
- `(contents)/filhotes/[id]/page.tsx` → Detalhe do filhote
- `not-found.tsx` → Página 404

### Acoplamento indireto via PuppiesProvider

O `PuppiesProvider` carrega **todos** os dados e estados da aplicação (filhotes, pais, FAQ, filtros, callbacks). Ao ser posicionado no root layout, todo componente filho pode consumir esse contexto, criando acoplamento transitivo entre layout e toda a lógica de negócio.

---

## 5. Fluxo de dados e responsabilidades

```
RootLayout (Server Component)
  │
  ├── metadata (estático, exportado para Next.js)
  ├── fontes (poppins, caveat) → CSS variables no <body>
  │
  └── PuppiesProvider ("use client") ← ENVOLVE <html>
       │
       ├── <html lang="pt-BR">
       │    ├── <head> (manual: preconnect, preload)
       │    └── <body>
       │         ├── <Header /> ← consome PuppiesContext
       │         ├── {children} ← rotas filhas
       │         └── <Footer /> ← independente do context
       │
       └── Contexto disponível para TODA a árvore
```

**Responsabilidades atuais do arquivo:**

1. ✅ Definir estrutura HTML (`<html>`, `<head>`, `<body>`)
2. ✅ Exportar metadata global de SEO
3. ✅ Configurar fontes
4. ⚠️ Posicionar provider global (posição incorreta)
5. ⚠️ Adicionar tags manuais no `<head>` (desnecessário com `next/font`)
6. ✅ Renderizar Header e Footer persistentes

---

## 6. Problemas encontrados

### P1 — `PuppiesProvider` envolvendo `<html>` (Severidade: Alta)

**Código atual:**

```tsx
<PuppiesProvider>
   <html lang="pt-BR">...</html>
</PuppiesProvider>
```

**Padrão correto (documentação oficial do Next.js):**

```tsx
<html lang="pt-BR">
   <body>
      <ThemeProvider>{children}</ThemeProvider>
   </body>
</html>
```

**Referência:** A documentação oficial do Next.js (Wrap Server Layout with a Client Context Provider) mostra que providers devem ficar **dentro do `<body>`**, nunca envolvendo `<html>`. Colocar um Client Component (`"use client"`) como wrapper do `<html>` viola a separação entre Server Components e Client Components e pode causar **hydration mismatch** no React 19.

**Impactos:**

- Risco real de hydration mismatch (React 19 é mais rigoroso).
- O `<html>` e `<head>` ficam dentro da boundary de um Client Component, impedindo otimizações de streaming do Next.js.
- Todo o SSR do root layout é comprometido porque o provider `"use client"` força hidratação client-side.

---

### P2 — Tags `<head>` manuais desnecessárias (Severidade: Média)

**Código atual:**

```tsx
<head>
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
   <link rel="preload" as="image" href="/assets/logo-site/logo.png" />
</head>
```

**Problemas identificados:**

1. **Preconnect para Google Fonts é desnecessário.** O `next/font/google` faz download das fontes em build time e as serve localmente (self-hosted). Não há requisição para `fonts.googleapis.com` ou `fonts.gstatic.com` em runtime. Esses `<link>` são resíduos de uma abordagem anterior (CDN) e hoje são **código morto funcional**.

2. **A documentação oficial do Next.js diz explicitamente:** _"You should **not** manually add `<head>` tags such as `<title>` and `<meta>` to root layouts. Instead, you should use the Metadata API which automatically handles advanced requirements such as streaming and de-duplicating `<head>` elements."_

3. **O preload da logo** pode ter valor legítimo para LCP, mas deveria ser tratado via Metadata API (`icons`) ou `next/head`-like APIs do App Router, não via tag manual.

---

### P3 — Fontes com variáveis CSS aplicadas no `<body>` em vez do `<html>` (Severidade: Baixa)

**Código atual:**

```tsx
<body className={`${poppins.variable} ${caveat.variable} antialiased`}>
```

**Padrão documentado pelo Next.js:**

```tsx
<html lang="en" className={inter.className}>
   <body>{children}</body>
</html>
```

A documentação oficial do Next.js aplica as classes de fonte no `<html>`. Embora aplicar no `<body>` funcione na maioria dos casos (CSS variables cascateiam), a aplicação no `<html>` é mais consistente com a documentação oficial e garante que qualquer estilo aplicado fora do `<body>` (como meta tags renderizadas pelo Next.js no streaming) também tenha acesso às variáveis.

**Nota:** Este é um problema de baixa severidade. A abordagem atual funciona. A correção é recomendada por consistência com a documentação oficial.

---

### P4 — Header e Footer fixos em todas as rotas (Severidade: Baixa-Média)

O `Header` e o `Footer` são renderizados **dentro do root layout**, o que significa que aparecem em **todas as páginas**, incluindo a 404.

**Implicações:**

- A 404 (`not-found.tsx`) renderiza seu próprio conteúdo mas herda Header e Footer do root layout, potencialmente criando inconsistência visual (Header absoluto sobre o conteúdo centralizado da 404).
- Não há flexibilidade para páginas que eventualmente não precisem de Header/Footer.
- Caso futuro: landing pages, telas de manutenção ou autenticação precisariam de layouts sem Header/Footer.

**Trade-off:** Para o escopo atual do projeto (poucas rotas, todas com Header e Footer), isso é aceitável. Mas deve ser considerado para escalabilidade.

---

### P5 — PuppiesProvider como God Object no root layout (Severidade: Alta)

O `PuppiesProvider` concentra:

| Dado / Estado         | Usado pelo Header? | Usado pelo Footer? | Necessário globalmente?       |
| --------------------- | ------------------ | ------------------ | ----------------------------- |
| `puppies`             | Não                | Não                | Não (só em rotas de filhotes) |
| `parents`             | Não                | Não                | Não (só na Home)              |
| `faqItems`            | Não                | Não                | Não (desabilitado)            |
| `filteredPuppies`     | Não                | Não                | Não (só em `/filhotes`)       |
| `isLoading` / `error` | Não                | Não                | Sempre `false` / `null`       |
| `handleSubmit`        | Não                | Não                | Não                           |
| `handleClearSearch`   | **Sim**            | Não                | Só pelo Header                |
| `showPuppiesList`     | Não                | Não                | Nunca consumido               |
| `selectedSex/Color`   | Não                | Não                | Só no Searchbar               |
| `appliedFilters`      | Não                | Não                | Internamente                  |
| `filterBySex`         | Não                | Não                | Só no Upcoming                |

**Conclusão:** O Header consome **apenas** `handleClearSearch` do contexto. O Footer **não consome** o contexto. Apesar disso, todo o PuppiesProvider (com todos os dados e estados) é instanciado no root layout e envolve toda a aplicação.

Isso é um exemplo clássico de **God Object** e viola o princípio de Interface Segregation (ISP). Os consumidores recebem muito mais do que precisam.

---

### P6 — `process.env.SITE_URL!` sem fallback (Severidade: Baixa)

```tsx
metadataBase: new URL(process.env.SITE_URL!),
```

O operador `!` (non-null assertion) silencia o TypeScript, mas se `SITE_URL` não estiver definida, o `new URL(undefined!)` lançará um erro em runtime. Não há fallback nem validação.

**Risco:** Em ambiente de desenvolvimento sem `.env` configurado, o build pode falhar silenciosamente ou com erro pouco informativo.

---

### P7 — Todos os 9 pesos da Poppins são carregados (Severidade: Baixa)

```tsx
weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
```

São **9 variações de peso** carregadas. Na prática, o projeto usa apenas um subconjunto (identificados em `globals.css`: `font-bold` = 700, `font-semibold` = 600, `font-medium` = 500, `font-primary` sem peso específico = 400, `text-sm font-medium` = 500).

Pesos realmente usados: **400, 500, 600, 700** (possivelmente 300 para textos leves).

Carregar 9 pesos aumenta o tamanho do bundle de fontes desnecessariamente, mesmo que o `next/font` faça subset e self-hosting.

---

## 7. Riscos técnicos e arquiteturais

| #   | Risco                                                                                                       | Probabilidade | Impacto |
| --- | ----------------------------------------------------------------------------------------------------------- | ------------- | ------- |
| R1  | Hydration mismatch por Provider fora do `<body>`                                                            | Média         | Alto    |
| R2  | Perda de otimizações de streaming SSR por Client boundary no root                                           | Confirmado    | Médio   |
| R3  | Re-renders desnecessários em Header/Footer por mudança de estado no PuppiesProvider                         | Alta          | Baixo   |
| R4  | Build failure se `SITE_URL` não estiver definida                                                            | Média         | Baixo   |
| R5  | Bundle de fontes maior que o necessário (9 pesos)                                                           | Confirmado    | Baixo   |
| R6  | Preconnect/preload no `<head>` manual cria falsa segurança (requisições para CDN que não existe em runtime) | Confirmado    | Baixo   |
| R7  | Impossibilidade de testar Header/Footer isoladamente (dependem do PuppiesProvider)                          | Confirmado    | Alto    |
| R8  | Impossibilidade de criar stories de Storybook para Header sem mock completo do Provider                     | Confirmado    | Médio   |

---

## 8. Impacto em escalabilidade, modularidade e legibilidade

### Escalabilidade

- **Negativo:** O God Object Provider no root layout significa que qualquer novo dado ou estado adicionado ao contexto impacta toda a aplicação.
- **Negativo:** A falta de splitting de providers impede otimização granular de re-renders.
- **Negativo:** Header e Footer fixos no root layout limitam flexibilidade para novos tipos de página.

### Modularidade

- **Negativo:** O layout acopla diretamente: fontes + metadata + provider + header + footer. São 5 responsabilidades distintas num único arquivo.
- **Neutro:** O arquivo em si é legível e organizado, mas suas dependências criam acoplamento excessivo.

### Legibilidade

- **Positivo:** O código é limpo, bem formatado e fácil de entender.
- **Negativo:** Os `<link>` manuais no `<head>` podem confundir desenvolvedores que conhecem o Next.js App Router (parece Pages Router).
- **Negativo:** O posicionamento do Provider fora do `<html>` é contra-intuitivo para quem lê a documentação oficial.

---

## 9. Impacto em testes (Jest/Cypress)

### Jest / Testing Library

- **Root layout não é testável unitariamente** no estado atual:
   - Depende de `next/font/google` (precisa de mock).
   - Depende de `PuppiesProvider` (precisa de mock ou provider de teste).
   - Depende de `Header` e `Footer` (componentes completos).
- **Header não é testável isoladamente** sem providenciar o `PuppiesContext` (usa `useContext` direto).
- **Footer é testável** isoladamente (não depende do contexto), mas depende de `generateWhatsappLink`.

### Cypress

- Testes E2E não são impactados diretamente pelo root layout (Cypress renderiza a aplicação completa).
- Porém, o Header acoplado ao context dificulta **component testing** via Cypress.

### Recomendações para testabilidade

1. Header deveria receber `onClearSearch` como prop (desacoplar do context).
2. Provider deveria ser mockável via wrapper de teste.
3. Layout deveria ter fallback seguro para `SITE_URL` para não quebrar em ambiente de teste.

---

## 10. Impacto em Storybook

- **Root layout não terá story** (layouts do Next.js não são componentes visuais isoláveis).
- **Header:** Impossível criar story sem mock do `PuppiesContext`. Após desacoplamento (receber props), seria trivial.
- **Footer:** Pode ter story, mas precisa de mock de `generateWhatsappLink` para controlar o link.
- **Fontes:** Storybook precisará configurar as mesmas CSS variables (`--font-poppins`, `--font-caveat`) via decorator global para que os componentes renderizem corretamente.

---

## 11. Proposta de refatoração

### Visão geral

Refatorar o root layout para:

1. Posicionar o Provider corretamente dentro do `<body>`.
2. Remover tags `<head>` manuais desnecessárias.
3. Mover variáveis de fonte para `<html>`.
4. Reduzir pesos de fonte carregados.
5. Adicionar fallback para `SITE_URL`.
6. Preparar a separação do Provider (escopo de bloco futuro).

### Princípios orientadores

- **Conformidade com documentação oficial do Next.js** (validado via Context7 MCP).
- **Princípio da Menor Surpresa** (código deve seguir padrões esperados).
- **Incrementalidade** (cada mudança isolada e reversível).
- **Preservação de comportamento** (nenhuma mudança visual ou funcional para o usuário).

---

## 12. Passo a passo sugerido

### Fase 1 — Quick wins (curto prazo, baixo risco)

#### Passo 1.1 — Mover PuppiesProvider para dentro do `<body>`

**De:**

```tsx
<PuppiesProvider>
   <html lang="pt-BR">
      <head>...</head>
      <body>
         <Header />
         {children}
         <Footer />
      </body>
   </html>
</PuppiesProvider>
```

**Para:**

```tsx
<html lang="pt-BR">
   <head>...</head>
   <body className={...}>
      <PuppiesProvider>
         <Header />
         {children}
         <Footer />
      </PuppiesProvider>
   </body>
</html>
```

**Risco:** Baixo. O provider continua envolvendo Header, children e Footer. Apenas desloca para dentro do `<body>`.  
**Impacto em testes:** Nenhum (melhora, na verdade).  
**Impacto visual:** Nenhum.

---

#### Passo 1.2 — Remover `<head>` manual com preconnect e preload

**Remover completamente:**

```tsx
<head>
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
   <link rel="preload" as="image" href="/assets/logo-site/logo.png" />
</head>
```

**Justificativa:**

- Preconnect para Google Fonts é inútil com `next/font/google` (fontes são self-hosted em build time).
- Preload da logo pode ser preservado se for crítico para LCP, mas deveria migrar para a Metadata API ou ser gerenciado pelo componente `Image` com `priority` (que o `Header` já faz: `<Image ... priority />`).

**Risco:** Baixo. O preconnect não faz nada. O preload da logo já é coberto pelo `priority` no `<Image>` do Header.  
**Impacto visual:** Nenhum.  
**Impacto em performance:** Levemente positivo (remove requisições DNS desnecessárias para CDN não utilizada).

---

#### Passo 1.3 — Mover variáveis de fonte para `<html>`

**De:**

```tsx
<html lang="pt-BR">
   ...
   <body className={`${poppins.variable} ${caveat.variable} antialiased`}>
```

**Para:**

```tsx
<html lang="pt-BR" className={`${poppins.variable} ${caveat.variable}`}>
   ...
   <body className="antialiased">
```

**Risco:** Muito baixo. CSS variables cascateiam de `<html>` para `<body>` e filhos.  
**Impacto visual:** Nenhum.

---

#### Passo 1.4 — Adicionar fallback para `SITE_URL`

**De:**

```tsx
metadataBase: new URL(process.env.SITE_URL!),
```

**Para:**

```tsx
metadataBase: new URL(process.env.SITE_URL ?? "https://filhotes-encinas-braga.vercel.app"),
```

**Nota:** O valor de fallback deve ser confirmado com o responsável pelo projeto (o domínio atual parece ter typo: `fihlotes` vs `filhotes`). Usar um valor padrão seguro é melhor que uma non-null assertion.

**Risco:** Muito baixo.  
**Impacto:** Previne erro em runtime em ambiente sem `.env`.

---

### Fase 2 — Otimizações (curto-médio prazo, baixo risco)

#### Passo 2.1 — Reduzir pesos de fonte Poppins

**De:**

```tsx
weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
```

**Para (pesos realmente usados no projeto):**

```tsx
weight: ["400", "500", "600", "700"],
```

**Validação necessária:** Auditar `globals.css` e componentes para confirmar que pesos 100, 200, 300, 800, 900 não são usados em nenhum lugar. Análise preliminar indica que não são.

**Risco:** Baixo (requer validação de que nenhum componente usa pesos extremos).  
**Impacto:** Redução do bundle de fontes (~50% menos font files).

---

### Fase 3 — Reestruturação arquitetural (médio prazo, risco moderado)

#### Passo 3.1 — Extrair Provider wrapper para componente dedicado

Criar `src/app/providers.tsx`:

```tsx
"use client";
import { PuppiesProvider } from "@/contexts/context";

export function Providers({ children }: { children: React.ReactNode }) {
   return <PuppiesProvider>{children}</PuppiesProvider>;
}
```

Isso prepara o terreno para:

- Adicionar novos providers sem poluir o root layout.
- Futuramente dividir o PuppiesProvider em contextos menores.
- Facilitar mock em testes.

**Risco:** Muito baixo (apenas extração de componente).

---

#### Passo 3.2 — Desacoplar Header do PuppiesContext

**Problema:** O Header consome `PuppiesContext` apenas para `handleClearSearch`. Isso:

- Acopla o Header ao God Object.
- Impede teste isolado e story de Storybook.

**Proposta:** O Header deveria receber `onClearSearch` como prop, injetada por um container/wrapper:

```tsx
// Header puro
export function Header({ onClearSearch }: { onClearSearch: () => void }) { ... }

// Wrapper conectado ao context (usado no layout)
export function ConnectedHeader() {
   const { handleClearSearch } = useContext(PuppiesContext);
   return <Header onClearSearch={handleClearSearch} />;
}
```

**Nota:** Este passo faz parte do bloco 2 (refatoração do Header) e será detalhado no estudo correspondente. Aqui é registrado como dependência do layout.

**Risco:** Moderado (requer teste visual para garantir aderência).

---

#### Passo 3.3 — Splitting do PuppiesProvider (dependência do Bloco 1 — contexto)

O split completo do `PuppiesProvider` em contextos menores (`PuppiesDataContext`, `SearchContext`, etc.) é pré-requisito para o posicionamento ideal de providers no layout:

- `SearchContext` → pode envolver apenas as rotas de `/filhotes`.
- `PuppiesDataContext` → pode envolver apenas as rotas que consomem dados.
- O root layout ficaria com providers **mínimos** (tema, fontes, etc.).

**Nota:** Este passo será detalhado no estudo do `contexts/context.tsx`.

---

## 13. Ordem recomendada de implementação futura

| Ordem | Passo | Descrição                              | Dependência           | Risco    |
| ----- | ----- | -------------------------------------- | --------------------- | -------- |
| 1     | 1.1   | Mover Provider para dentro do `<body>` | Nenhuma               | Baixo    |
| 2     | 1.2   | Remover `<head>` manual                | Nenhuma               | Baixo    |
| 3     | 1.3   | Mover variáveis de fonte para `<html>` | Nenhuma               | Baixo    |
| 4     | 1.4   | Fallback para `SITE_URL`               | Nenhuma               | Baixo    |
| 5     | 2.1   | Reduzir pesos da Poppins               | Auditoria de pesos    | Baixo    |
| 6     | 3.1   | Extrair `Providers` wrapper            | Passo 1.1             | Baixo    |
| 7     | 3.2   | Desacoplar Header do context           | Estudo do Header      | Moderado |
| 8     | 3.3   | Splitting do PuppiesProvider           | Estudo do context.tsx | Alto     |

**Passos 1-4 podem ser implementados em um único PR (quick wins).**  
**Passos 5-6 em um segundo PR.**  
**Passos 7-8 dependem dos estudos dos respectivos arquivos.**

---

## 14. Pontos que precisam de validação humana

1. **Valor correto do `SITE_URL` para fallback.** O domínio que aparece no `not-found.tsx` é `fihlotes-encinas-braga.vercel.app` (com typo). Qual é o domínio real de produção?

2. **O preload da logo (`/assets/logo-site/logo.png`) é realmente necessário?** O Header já usa `<Image priority />`, que instrui o Next.js a fazer preload automaticamente. Confirmar se a remoção do preload manual é segura.

3. **Quais pesos da Poppins são realmente usados?** A análise preliminar sugere 400, 500, 600, 700. Confirmar que nenhuma parte do design usa pesos extremos (100, 200, 300, 800, 900).

4. **O Header e Footer devem aparecer na página 404?** Atualmente aparecem (por herança do root layout). Se não deverem, será necessário reestruturar.

5. **O Provider global deve continuar no root layout ou pode ser movido para route groups específicos?** Isso depende da decisão de splitting do PuppiesProvider (Bloco 1 — contexto).

---

## 15. Conclusão

O `layout.tsx` é um arquivo relativamente pequeno mas com **alto impacto arquitetural**. Os problemas mais graves — Provider fora do `<body>` e `<head>` manual desnecessário — são **quick wins** de baixo risco que corrigem violações diretas da documentação oficial do Next.js, validadas via Context7 MCP.

A refatoração proposta é **incremental e faseada**: os 4 primeiros passos (Fase 1) podem ser implementados em um único PR sem risco de regressão funcional ou visual. As fases seguintes dependem de estudos complementares dos arquivos `context.tsx` e `Header.tsx`.

O arquivo está bem escrito e organizado, mas suas dependências (PuppiesProvider como God Object, Header acoplado ao context) são os verdadeiros problemas. O layout em si é mais vítima do que causa — a refatoração de Fase 3 só faz sentido após endereçar as dependências nos estudos dos blocos correspondentes.
