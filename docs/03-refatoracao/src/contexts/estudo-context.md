# Estudo — `src/contexts/context.tsx`

> Data: 2026-04-13
> Tipo: estudo de arquivo + proposta de refatoração
> Arquivo analisado: `src/contexts/context.tsx`
> Foco: God Object, acoplamento de contexto, testabilidade, modularidade, Controller / Page / View
> Status: rascunho

---

## 1. Contexto do arquivo

`context.tsx` é o único arquivo de contexto global do projeto. Ele é registrado em `src/app/layout.tsx` via `<PuppiesProvider>`, que envolve o `<body>` inteiro — ou seja, **todo o projeto é fornecido por este único contexto**.

O arquivo exporta:

- `PuppiesContext` — o objeto de contexto React
- `PuppiesProvider` — o componente provedor

O `PuppiesProvider` é instanciado diretamente no root layout, antes de `<Header />`, `{children}` e `<Footer />`.

Consumidores ativos rastreados no projeto:

| Componente        | O que consome                                  |
| ----------------- | ---------------------------------------------- |
| `Header.tsx`      | `handleClearSearch`                            |
| `Hero.tsx`        | `handleClearSearch`                            |
| `Searchbar.tsx`   | `handleSubmit`                                 |
| `SexSearch.tsx`   | `puppies`, `selectedSex`, `setSelectedSex`     |
| `ColorSearch.tsx` | `puppies`, `selectedColor`, `setSelectedColor` |
| `PuppiesList.tsx` | `filteredPuppies`, `isLoading`, `error`        |
| `Upcoming.tsx`    | `filterBySex`                                  |
| `Parents.tsx`     | `parents`                                      |
| `Faq.tsx`         | `faqItems`                                     |

Total: **9 consumidores** — todos componentes de apresentação (camada View), **nenhum** sendo container ou page.

---

## 2. Objetivo aparente do arquivo

Ser o hub global de estado e dados da aplicação: prover dados mock de filhotes, pais e FAQ, gerenciar estado de filtro e busca, e disponibilizar ações de UI para qualquer componente registrado sob o provider.

---

## 3. Inventário técnico do arquivo

### Dados inicializados (estado estático — nunca muda)

- `puppies: Puppy[]` — lido de `puppies-mock.json` via `useState(() => ...)`
- `parents: Parent[]` — lido de `parents-mock.json` via `useState(() => ...)`
- `faqItems: FaqItem[]` — lido de `faq-mock.json` via `useState(() => ...)`

### Estado de UI / filtro

- `showPuppiesList: boolean` — controla visibilidade da lista de filhotes
- `selectedSex: string` — valor selecionado no filtro de sexo (draft)
- `selectedColor: string` — valor selecionado no filtro de cor (draft)
- `appliedFilters: Filters` — snapshot dos filtros efetivamente aplicados

### Valores derivados

- `filteredPuppies: Puppy[]` — calculado via `useMemo` sobre `appliedFilters`
- `isLoading: false` — constante hard-coded (não é estado)
- `error: string | null = null` — constante hard-coded (não é estado)

### Callbacks

- `handleSubmit` — aplica os filtros draft e exibe a lista
- `handleClearSearch` — limpa filtros e oculta a lista
- `filterBySex(sex: string): Puppy[]` — função auxiliar que filtra por sexo (sem `appliedFilters`)

### Saída

- `contextValue: PuppiesContextValue` — objeto com tudo acima, memoizado

---

## 4. Dependências e acoplamentos

### Imports diretos

| Módulo                           | Tipo             |
| -------------------------------- | ---------------- |
| `react`                          | framework        |
| `@/types`                        | tipos do projeto |
| `@/utils/mock/puppies-mock.json` | dado estático    |
| `@/utils/mock/parents-mock.json` | dado estático    |
| `@/utils/mock/faq-mock.json`     | dado estático    |

### Acoplamento com consumidores

O contexto não conhece seus consumidores diretamente, mas é fortemente acoplado a todos eles de forma **indireta e implícita**: qualquer mudança na interface `PuppiesContextValue` pode quebrar silenciosamente múltiplos componentes. Sem testes, esse risco é amplificado.

### Acoplamento com root layout

`PuppiesProvider` é instanciado diretamente em `layout.tsx`, tornando o root layout dependente de uma implementação específica de contexto. Isso dificulta testes do layout isoladamente.

---

## 5. Fluxo de dados e responsabilidades

```
[JSON mocks]
   ↓ importação estática no módulo
[PuppiesProvider]
   ├── inicializa dados: puppies, parents, faqItems   │
   ├── gerencia estado de UI: showPuppiesList
   ├── gerencia estado de draft: selectedSex, selectedColor
   ├── gerencia estado de filtros aplicados: appliedFilters
   ├── deriva: filteredPuppies (useMemo)
   ├── constantes falsas: isLoading=false, error=null
   ├── ações: handleSubmit, handleClearSearch
   └── lógica de domínio: filterBySex
         ↓
[PuppiesContext.Provider]
   ↓ consumido em useContext() por 9 componentes de apresentação
   ├── Header      → handleClearSearch
   ├── Hero        → handleClearSearch
   ├── Searchbar   → handleSubmit
   ├── SexSearch   → puppies, selectedSex, setSelectedSex
   ├── ColorSearch → puppies, selectedColor, setSelectedColor
   ├── PuppiesList → filteredPuppies, isLoading, error
   ├── Upcoming    → filterBySex
   ├── Parents     → parents
   └── Faq         → faqItems
```

A responsabilidade do provider é ao mesmo tempo: **repositório de dados**, **gerenciador de estado de UI**, **fonte de verdade para filtros**, **motor de filtro** e **provedor de actions**. Isso viola o Princípio da Responsabilidade Única (SRP).

---

## 6. Problemas encontrados

### P1 — God Object: contexto com múltiplas responsabilidades distintas

O `PuppiesProvider` incorpora ao menos **5 responsabilidades ortogonais**:

1. Fonte de dados (puppies, parents, faqItems)
2. Estado de UI (showPuppiesList)
3. Estado de draft de filtros (selectedSex, selectedColor)
4. Estado de filtros aplicados (appliedFilters) e dado derivado (filteredPuppies)
5. Lógica de domínio não filtrada (filterBySex)

Qualquer mudança em um domínio re-renderiza todos os consumidores.

### P2 — `isLoading` e `error` são constantes, não estado

```tsx
// context.tsx
const isLoading = false;
const error: string | null = null;
```

Não são `useState`. Expostos no contrato de contexto como se fossem reativos. Se algum dia a fonte de dados mudar para async, será necessário refatorar o contexto inteiro. São também mencionados no array de dependências do `useMemo` de `contextValue`, o que é enganoso e indica que alguém pode ter assumido que são estados reativos.

### P3 — `filterBySex` não pertence ao contexto

`filterBySex` é uma função pura que filtra um array com base em um parâmetro. Não tem efeito colateral, não precisa referenciar estado global. Está no contexto provavelmente por conveniência, mas poderia ser uma função utilitária em `utils/functions/`. Atualmente obriga `Upcoming.tsx` a depender de todo o contexto só para chamar uma função.

### P4 — `parents` e `faqItems` não têm relação semântica com filtro de filhotes

`parents` é consumido por `Parents.tsx` — um componente completamente independente da busca.
`faqItems` é consumido por `Faq.tsx` — idem.
Ambos poderiam ser carregados por cada componente individualmente, ou por contextos separados menores, sem passar pelo mesmo provider que gerencia filtros de filhotes.

### P5 — Criação insegura do contexto com `{} as PuppiesContextValue`

```tsx
export const PuppiesContext = createContext<PuppiesContextValue>(
   {} as PuppiesContextValue,
);
```

O uso de `{} as PuppiesContextValue` bypassa o sistema de tipos. Se qualquer componente consumir `PuppiesContext` fora do provider, receberá `{}` em vez de um erro. O padrão seguro é usar `undefined` como valor default e criar um custom hook que verifica e lança erro:

```tsx
const PuppiesContext = createContext<PuppiesContextValue | undefined>(
   undefined,
);
export function usePuppies() {
   const ctx = useContext(PuppiesContext);
   if (!ctx)
      throw new Error("usePuppies deve ser usado dentro de PuppiesProvider");
   return ctx;
}
```

### P6 — Dispatchers `setSelectedSex` e `setSelectedColor` expostos diretamente

Expor `Dispatch<SetStateAction<string>>` como parte da API pública do contexto quebra encapsulamento. Componentes como `SexSearch` e `ColorSearch` recebem acesso irrestrito ao estado — podem definir qualquer string diretamente, sem validação. O ideal seria expor apenas ações semânticas (`onSexChange(sex: string)`, `onColorChange(color: string)`), que podem evoluir com validação futuramente.

### P7 — `appliedFilters` como estado snapshot vs. draft (confusão de contratos)

O contexto mantém dois conjuntos de dados de filtro:

- **Draft**: `selectedSex`, `selectedColor` — o que o usuário está selecionando no momento
- **Aplicado**: `appliedFilters` — só atualizado em `handleSubmit`

Esse design é intencional (o filtro só é aplicado ao clicar em buscar), mas o contrato é implícito. `selectedSex` e `selectedColor` aparecem expostos no contexto junto com `filteredPuppies`, sem documentação da distinção draft vs. aplicado. Isso é confuso para quem mantém o código.

### P8 — Lógica de ordenação duplicada entre `PuppiesList.tsx` e `Upcoming.tsx`

```tsx
// PuppiesList.tsx
[...filteredPuppies].sort(
   (a, b) =>
      (b.availability === true ? 1 : 0) - (a.availability === true ? 1 : 0),
);

// Upcoming.tsx
[...list].sort((a, b) => (b.availability ? 1 : 0) - (a.availability ? 1 : 0));
```

A mesma lógica de ordenação por disponibilidade está duplicada em dois componentes. Poderia ser extraída para `utils/functions/` ou como uma função pura reutilizável.

### P9 — `faq-mock.json` com conteúdo placeholder de projeto errado

```json
{ "title": "How long does a construction project usually take?" }
```

FAQs em inglês sobre construção civil. Conteúdo claramente copiado de template de outro projeto. Não afeta o código do contexto em si, mas evidencia que `faqItems` é dado não revisado sendo exposto em produção via contexto global.

### P10 — `parentIds` no mock não refletido nos tipos

`puppies-mock.json` inclui `parentIds: ["p1", "p2"]` em cada filhote, mas a interface `Puppy` em `src/types/index.ts` não inclui esse campo. Isto é sinal de divergência entre dado e tipo — o tipo está desatualizado ou o campo não foi integrado ainda.

### P11 — Acoplamento de apresentação ao contexto — 9 componentes com `useContext`

Todos os 9 consumidores são componentes visuais da camada de apresentação. Nenhum componente de apresentação recebe dados via props. Isso:

- torna impossível renderizar `Parents`, `Faq`, `Searchbar`, `PuppiesList` etc. isoladamente (em Storybook, por exemplo)
- obriga o uso de `PuppiesProvider` em qualquer teste que render esses componentes
- cria re-renders desnecessários: uma mudança em `selectedSex` pode causar re-render em `Parents.tsx` e `Faq.tsx` mesmo que eles só precisem de `parents`/`faqItems`

### P12 — `useMemo` com dependências constantes enganosas

```tsx
const contextValue = useMemo<PuppiesContextValue>(
  () => ({ ..., isLoading, error, setSelectedSex, setSelectedColor, ... }),
  [..., isLoading, error, setSelectedSex, setSelectedColor, ...]
);
```

`isLoading` e `error` são constantes — nunca mudam, nunca causarão re-memo. `setSelectedSex` e `setSelectedColor` são referências estáveis do `useState` — também nunca mudam. Incluí-los no array de dependências é ruído que engana futuros mantenedores.

---

## 7. Riscos técnicos e arquiteturais

| #   | Risco                                                                                                                  | Severidade | Probabilidade              |
| --- | ---------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------- |
| R1  | Se a fonte de dados mudar para async, o provider inteiro precisa ser reescrito (isLoading/error como constantes)       | Alta       | Média                      |
| R2  | Mudança no contrato de `PuppiesContextValue` quebra silenciosamente 9 componentes                                      | Alta       | Alta                       |
| R3  | `{} as PuppiesContextValue` pode causar erros de runtime difíceis de rastrear se o provider não envolver um consumidor | Média      | Baixa                      |
| R4  | Re-renders snecessários em toda a árvore quando qualquer valor do contexto muda (ex: digitar no filtro)                | Média      | Alta                       |
| R5  | Impossibilidade de testar ou documentar com Storybook qualquer componente sem montar o provider completo               | Alta       | Certeza (já ocorre)        |
| R6  | FAQ em inglês sobre construção civil pode ir para produção                                                             | Média      | Alta (já presente no mock) |
| R7  | `parentIds` no JSON sem tipo torna o dado inacessível via TypeScript                                                   | Baixa      | Alta (já presente)         |

---

## 8. Impacto em escalabilidade, modularidade e legibilidade

### Escalabilidade

O contexto monolítico escala mal. A cada nova feature que precisa de estado global, existe a tendência natural de adicionar mais campos ao mesmo `PuppiesContextValue`. Isso já aconteceu com `faqItems` e `parents` que logicamente não deveriam estar junto com estado de filtro.

A adição de qualquer dado novo (ex: núm. de contato configurável, preferências de usuário) vai inflar ainda mais o God Object.

### Modularidade

A modularidade zero dos componentes de apresentação é uma consequência direta da ausência de props. `Parents.tsx`, `Faq.tsx`, `Header.tsx` — todos são não-reutilizáveis em outros contextos por causa do acoplamento.

### Legibilidade

O arquivo em si é relativamente legível — tem ~125 linhas e usa os hooks corretamente. O problema de legibilidade é arquitetural: **a responsabilidade do arquivo não é óbvia pelo nome**. `context.tsx` poderia ser qualquer contexto — o nome não comunica que é o hub central de estado de toda a aplicação.

---

## 9. Impacto em testes (Jest/Cypress)

### Estado atual: sem testes

O projeto não possui infraestrutura de testes.

### Impacto do problema atual

Qualquer teste de unidade ou de componente que precise renderizar `PuppiesList`, `Searchbar`, `SexSearch`, `ColorSearch`, `Header`, `Hero`, `Upcoming`, `Parents` ou `Faq` precisará necessariamente instanciar o `PuppiesProvider` completo com os mocks. Isso:

- acopla todos os testes de componente ao provider
- impede testes focados no comportamento visual isolado
- torna difícil simular estados como `isLoading=true` ou `error="..."` porque esses valores são constantes hard-coded no provider

### O que seria necessário para testar bem:

```tsx
// Ideal — componente puro:
<PuppiesList puppies={[...]} isLoading={false} error={null} />

// Realidade atual — obriga wrapper:
<PuppiesProvider>
  <PuppiesList />
</PuppiesProvider>
```

Para testar `filterBySex`, `handleSubmit` ou `handleClearSearch`, seria necessário renderizar o provider inteiro e simular interações, pois não há extração dessas funções para utilitários testáveis isoladamente.

---

## 10. Impacto em Storybook

### Estado atual: sem Storybook

O projeto ainda não tem Storybook instalado.

### Impacto do problema atual

Todos os 9 componentes que consomem `PuppiesContext` **não podem ter stories criadas diretamente** sem um decorator que envolva com o `PuppiesProvider`. Isso:

- significa que para cada story seria necessário um wrapper customizado com dados mockados
- impede isolamento de estados visuais (ex: card de filhote disponível vs. indisponível)
- torna `Parents` e `Faq` — seções que são independentes semanticamente — dependentes do mesmo provider de filtro de filhotes

### O que seria necessário:

Antes de criar stories, os componentes precisariam ser desacoplados do contexto para receberem props. Ou alternativamente, criar um `PuppiesProviderDecorator` e aceitar a limitação.

---

## 11. Proposta de refatoração

A proposta segue uma estratégia **incremental de 3 fases**, preservando o comportamento funcional atual em cada fase.

---

### Fase 1 — Quick wins (sem impacto comportamental, zero risco de regressão)

**1.1 — Criar um custom hook `usePuppiesContext`**

Substituir o uso direto de `useContext(PuppiesContext)` por um hook seguro:

```tsx
// src/contexts/context.tsx
export function usePuppiesContext(): PuppiesContextValue {
   const ctx = useContext(PuppiesContext);
   if (!ctx)
      throw new Error(
         "usePuppiesContext deve ser usado dentro de PuppiesProvider",
      );
   return ctx;
}
```

Impacto: todos os consumidores passam a usar `usePuppiesContext()` em vez de `useContext(PuppiesContext)`. Melhora detectabilidade de erros.

**1.2 — Extrair `filterBySex` para utilitário puro**

```tsx
// src/utils/functions/puppies.ts
export function filterPuppiesBySex(puppies: Puppy[], sex: string): Puppy[] {
   if (sex === "all") return puppies;
   return puppies.filter((p) => p.sex === sex);
}
```

Remover `filterBySex` do contexto e do `PuppiesContextValue`. Atualizar `Upcoming.tsx` para importar a função diretamente.

**1.3 — Extrair ordenação por disponibilidade para utilitário puro**

```tsx
// src/utils/functions/puppies.ts
export function sortByAvailability(puppies: Puppy[]): Puppy[] {
   return [...puppies].sort(
      (a, b) => (b.availability ? 1 : 0) - (a.availability ? 1 : 0),
   );
}
```

Remover duplicação de `PuppiesList.tsx` e `Upcoming.tsx`.

**1.4 — Limpar array de dependências do `useMemo` de `contextValue`**

Remover `isLoading`, `error`, `setSelectedSex` e `setSelectedColor` do array de dependências — são valores estáveis e não geram re-memo.

**1.5 — Adicionar `parentIds` ao tipo `Puppy`**

```tsx
// src/types/index.ts
export interface Puppy {
   // ...
   parentIds?: string[];
}
```

---

### Fase 2 — Divisão do contexto em responsabilidades separadas (médio risco, alto impacto)

**Motivação:** separar dado estático de estado de UI e de estado de filtro.

**Proposta de split em 2 contextos:**

```
PuppiesDataContext
  - puppies: Puppy[]         ← dado que nunca muda
  - parents: Parent[]        ← dado que nunca muda
  - faqItems: FaqItem[]      ← dado que nunca muda

SearchContext (renomear para algo mais semântico)
  - showPuppiesList
  - selectedSex / setSelectedSex (ou onSexChange)
  - selectedColor / setSelectedColor (ou onColorChange)
  - appliedFilters
  - filteredPuppies
  - handleSubmit
  - handleClearSearch
```

Alternativa mais conservadora: manter contexto único, mas separar os tipos e documentar claramente os domínios:

```tsx
// PuppiesContextValue separado em domínios
interface PuppiesContextValue {
   data: PuppiesData; // puppies, parents, faqItems
   filters: FilterState; // selectedSex, selectedColor, appliedFilters, etc.
   actions: FilterActions; // handleSubmit, handleClearSearch
   derived: DerivedState; // filteredPuppies
}
```

**Impacto da Fase 2:** requer atualização de todos os 9 consumidores.

---

### Fase 3 — Desacoplamento completo dos componentes de apresentação (alto impacto, preparação para Storybook e testes)

**Objetivo:** tornar todos os componentes visuais **puros** (receber dados via props).

**Estratégia:**

1. Criar versões "container" de cada componente que continuam acessando contexto
2. Criar versões "presentational" que recebem dados via props e não conhecem contexto
3. Migrar consumidores gradualmente

**Exemplo para `Parents.tsx`:**

```tsx
// ParentsSection.tsx (container) — acessa contexto
export function ParentsSection() {
   const { parents } = usePuppiesDataContext();
   return <ParentsList parents={parents} />;
}

// ParentsList.tsx (presentacional) — recebe props
export function ParentsList({ parents }: { parents: Parent[] }) {
   // renderização pura, testável, storied
}
```

**Componentes candidatos à extração:**

- `Parents.tsx` → `ParentsList`
- `Faq.tsx` → `FaqList`
- `PuppiesList.tsx` → já tem `PuppiesCard` como componente visual
- `Upcoming.tsx` → componente de grade/carrossel de filhotes separado

---

### Fase 4 — Preparação para substituição de dados estáticos por API (longo prazo)

Quando os dados passarem a vir de uma API:

1. Converter `isLoading` e `error` para `useState`
2. Extrair camada de data fetching (service/repository) separada do contexto
3. O contexto passa a coordenar, não a buscar dados
4. Considerar `React Query` / `SWR` para gerenciamento de cache e loading

---

## 12. Passo a passo sugerido

### Passo 1 — Criar `usePuppiesContext` (hook seguro)

- Arquivo: `src/contexts/context.tsx`
- Sem breaking change

### Passo 2 — Extrair `filterPuppiesBySex` e `sortByAvailability` para `utils/functions/puppies.ts`

- Atualizar `Upcoming.tsx` e `PuppiesList.tsx`
- Remover `filterBySex` do contexto e de `PuppiesContextValue`

### Passo 3 — Adicionar `parentIds` em `Puppy` nos tipos

- Arquivo: `src/types/index.ts`

### Passo 4 — Substituir `useContext(PuppiesContext)` por `usePuppiesContext()` em todos consumidores

- 9 arquivos afetados

### Passo 5 — Limpar dependências falsas do `useMemo` de `contextValue`

- Remove ruído do arquivo

### Passo 6 — Documentar distinção draft vs. aplicado no código

- Adicionar comentários ou renomear: `draftSex`, `draftColor` vs. `selectedSex`, `selectedColor`

### Passo 7 — Separar `PuppiesDataContext` do `SearchContext` (Fase 2)

- Pré-requisito: Passo 4 concluído (todos usando custom hook)
- Alta alteração em consumidores

### Passo 8 — Criar componentes presentacionais para `Parents`, `Faq`, `PuppiesList`

- Pré-requisito: Passo 7 concluído
- Desacopla componentes da UI para Storybook

### Passo 9 — Revisar `faq-mock.json` com conteúdo correto

- Baixo risco técnico, alto impacto em conteúdo

---

## 13. Ordem recomendada de implementação futura

| Fase   | Passos                | Complexidade | Risco | Valor            |
| ------ | --------------------- | ------------ | ----- | ---------------- |
| Fase 1 | 1, 2, 3, 4, 5, 6      | Baixa        | Baixo | Alto             |
| Fase 2 | 7                     | Média        | Médio | Alto             |
| Fase 3 | 8                     | Alta         | Médio | Muito alto       |
| Fase 4 | (planejamento futuro) | Alta         | Alto  | Crítico para API |

---

## 14. Pontos que precisam de validação humana

1. **`filterBySex` deve virar utilitário puro ou ser removido do contexto?** A proposta é removê-lo do contexto e torná-lo utilitário. Confirmar se existe algum outro consumidor não rastreado.

2. **`parents` e `faqItems` devem continuar no mesmo contexto que os filtros de filhotes?** A proposta de Fase 2 os separa. Confirmar intenção arquitetural.

3. **As seções FAQ e About serão reativadas ou removidas?** Se FAQ for removida, `faqItems` pode sair do contexto inteiramente.

4. **Os dispatchers `setSelectedSex` / `setSelectedColor` devem continuar expostos ou ser encapsulados em ações semânticas?** Encapsular em `onSexChange` / `onColorChange` é mais seguro, mas é breaking change.

5. **`isLoading` e `error` deveriam ser preparados para estado assíncrono agora (como `useState`) ou apenas quando a migração para API ocorrer?** Preparar agora tem custo baixo e evita refatoração maior depois.

6. **`parentIds` deve ser integrado à lógica de detalhe do filhote?** Atualmente o dado existe no JSON mas não é usado.

---

## 15. Conclusão

O `context.tsx` é o arquivo com o **maior potencial de melhoria arquitetural** do projeto. Ele centraliza 5 responsabilidades distintas em um único provider, acopla 9 componentes de apresentação ao contexto global, expõe lógica de domínio e constantes mascaradas como estado.

O código em si **funciona corretamente** para o estado atual do projeto. Os problemas são principalmente arquiteturais e se manifestarão como dificuldades crescentes na medida que o projeto evolua: dificuldade de testar, impossibilidade de criar stories, propensão a re-renders desnecessários, e resistência à extração de componentes reutilizáveis.

A Fase 1 proposta (quick wins) é de **baixo risco e alto retorno** — pode e deve ser executada antes de qualquer outra refatoração do projeto, pois ela cria as fundações (custom hook, utilitários puros) que todo o restante se apoiará.

A Fase 3 (desacoplamento completo) é a que habilita Storybook e Jest com componentes puros, mas requer a Fase 2 como pré-requisito.

---

_Documento criado em 2026-04-13 como parte do fluxo de Estudo → Execução → Validação do projeto filhotes-border-collie._
