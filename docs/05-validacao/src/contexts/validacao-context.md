# Validação — `src/contexts/context.tsx`

> Data: 2026-04-13
> Tipo: validação final de implementação de refatoração
> Documento base de estudo: `docs/03-refatoracao/src/contexts/estudo-context.md`
> Documento base de implementação: `docs/04-implementacao/src/contexts/implementacao-context.md`
> Arquivo validado: `src/contexts/context.tsx`
> Foco: validar implementação — aderência ao estudo, riscos de regressão, testes, Storybook, documentação
> Status: validação concluída

---

## 1. Contexto da validação

Esta validação audita a Fase 1 da refatoração do `context.tsx`, implementada com base no estudo de refatoração documentado. O objetivo é verificar se:

- a implementação seguiu rigorosamente o estudo;
- o comportamento funcional foi preservado;
- não foram introduzidos riscos de regressão;
- testes e Storybook foram adequadamente considerados;
- a documentação está coerente com o código real.

O arquivo analisado é o hub global de estado do projeto. Qualquer desvio aqui pode afetar os 9 consumidores e toda a UX da aplicação.

---

## 2. Documento de estudo utilizado como base

[docs/03-refatoracao/src/contexts/estudo-context.md](../../../03-refatoracao/src/contexts/estudo-context.md)

---

## 3. Documento de implementação utilizado como base

[docs/04-implementacao/src/contexts/implementacao-context.md](../../../04-implementacao/src/contexts/implementacao-context.md)

---

## 4. Objetivo da validação

Confirmar que:

1. os 5 passos da Fase 1 foram implementados corretamente;
2. os 9 consumidores foram migrados para `usePuppiesContext()`;
3. `filterBySex` foi removida do contexto e do tipo de forma segura;
4. `filterPuppiesBySex` e `sortByAvailability` em `utils/functions/puppies.ts` são corretas e coerentes com o uso;
5. `parentIds` foi adicionado ao tipo `Puppy`;
6. as dependências do `useMemo` estão corretas;
7. o código não apresenta erros TypeScript;
8. a documentação reflete a realidade.

---

## 5. Escopo validado

| Item                                                          | Validado |
| ------------------------------------------------------------- | -------- |
| `src/contexts/context.tsx`                                    | ✅       |
| `src/types/index.ts`                                          | ✅       |
| `src/utils/functions/puppies.ts`                              | ✅       |
| `src/components/sections/Header/Header.tsx`                   | ✅       |
| `src/components/sections/Hero/Hero.tsx`                       | ✅       |
| `src/components/sections/Searchbar/Searchbar.tsx`             | ✅       |
| `src/components/sections/Searchbar/SexSearch.tsx`             | ✅       |
| `src/components/sections/Searchbar/ColorSearch.tsx`           | ✅       |
| `src/components/sections/InfoPuppies/PuppiesList.tsx`         | ✅       |
| `src/components/sections/Upcoming/Upcoming.tsx`               | ✅       |
| `src/components/sections/Parents/Parents.tsx`                 | ✅       |
| `src/components/sections/Faq/Faq.tsx`                         | ✅       |
| `src/utils/mock/puppies-mock.json`                            | ✅       |
| `docs/04-implementacao/src/contexts/implementacao-context.md` | ✅       |
| `docs/00-index/index.md`                                      | ✅       |
| `docs/00-index/history.md`                                    | ✅       |

---

## 6. Arquivos lidos e considerados

Todos os 16 arquivos listados no escopo acima foram lidos na íntegra. Adicionalmente foram verificados (por completude do contexto):

- `src/components/sections/InfoPuppies/PuppiesCarousel.tsx` — não consome contexto, usa props
- `src/components/sections/InfoPuppies/PuppiesInfo.tsx` — não consome contexto, usa props

---

## 7. Comparativo entre estudo e implementação

### Passo 1.1 — `usePuppiesContext` com guarda de runtime

**Proposta do estudo:**

```tsx
const PuppiesContext = createContext<PuppiesContextValue | undefined>(
   undefined,
);
export function usePuppiesContext() {
   const ctx = useContext(PuppiesContext);
   if (!ctx) throw new Error("...");
   return ctx;
}
```

**Implementado:**

```tsx
const PuppiesContext = createContext<PuppiesContextValue | undefined>(
   undefined,
);

export function usePuppiesContext(): PuppiesContextValue {
   const ctx = useContext(PuppiesContext);
   if (!ctx) {
      throw new Error(
         "usePuppiesContext deve ser usado dentro de PuppiesProvider",
      );
   }
   return ctx;
}
```

**Status:** ✅ Aderente. Supera o mínimo proposto — o tipo de retorno `PuppiesContextValue` foi explicitado, o que é boa prática.

---

### Passo 1.2 — `filterBySex` → `filterPuppiesBySex` em `utils/functions/puppies.ts`

**Proposta do estudo:** extrair para utilitário puro testável.

**Implementado:**

```ts
export function filterPuppiesBySex(puppies: Puppy[], sex: string): Puppy[] {
   if (sex === "all") return puppies;
   return puppies.filter((p) => p.sex === sex);
}
```

**Status:** ✅ Aderente — função pura, exportada, sem estado, sem side effects.

**Observação:** veja achado A1 (seção 14) sobre case sensitivity.

---

### Passo 1.3 — `sortByAvailability` em `utils/functions/puppies.ts`

**Proposta do estudo:** extrair lógica de ordenação duplicada entre `PuppiesList.tsx` e `Upcoming.tsx`.

**Implementado:**

```ts
export function sortByAvailability(puppies: Puppy[]): Puppy[] {
   return [...puppies].sort(
      (a, b) => (b.availability ? 1 : 0) - (a.availability ? 1 : 0),
   );
}
```

**Status:** ✅ Aderente. Spread defensivo presente, sem mutação do array original.

---

### Passo 1.4 — Limpar deps falsas do `useMemo` de `contextValue`

**Proposta do estudo:** remover `isLoading`, `error`, `setSelectedSex`, `setSelectedColor` do array de dependências.

**Implementado:**

```tsx
const contextValue = useMemo<PuppiesContextValue>(
   () => ({
      puppies,
      parents,
      faqItems,
      filteredPuppies,
      isLoading: false,
      error: null,
      handleSubmit,
      handleClearSearch,
      showPuppiesList,
      selectedSex,
      setSelectedSex,
      selectedColor,
      setSelectedColor,
   }),
   [
      puppies,
      parents,
      faqItems,
      filteredPuppies,
      handleSubmit,
      handleClearSearch,
      showPuppiesList,
      selectedSex,
      selectedColor,
   ],
);
```

**Status:** ✅ Aderente. `isLoading` e `error` foram inlineados como literais; `setSelectedSex` e `setSelectedColor` foram corretamente omitidos das deps (referências estáveis do `useState`). Array de deps reflete apenas valores reativos reais.

---

### Passo 1.5 — `parentIds?: string[]` adicionado ao tipo `Puppy`

**Proposta do estudo:** alinhar tipo com o dado real do JSON.

**Implementado:**

```ts
export interface Puppy {
   id: string;
   name: string;
   sex: "macho" | "fêmea";
   color: string;
   dateOfBirth: string;
   images: Images;
   availability: boolean;
   parentIds?: string[];
}
```

**Verificação nos dados:** `puppies-mock.json` confirma `"parentIds": ["p1", "p2"]` em todas as 8 entradas.

**Status:** ✅ Aderente. Opcional (`?:`) por segurança, alinhado com dado real.

---

### Migração dos 9 consumidores

| Componente        | Antes                                               | Depois                                                              | Status |
| ----------------- | --------------------------------------------------- | ------------------------------------------------------------------- | ------ |
| `Header.tsx`      | `useContext(PuppiesContext)`                        | `usePuppiesContext()`                                               | ✅     |
| `Hero.tsx`        | `useContext(PuppiesContext)`                        | `usePuppiesContext()`                                               | ✅     |
| `Searchbar.tsx`   | `useContext(PuppiesContext)`                        | `usePuppiesContext()`                                               | ✅     |
| `SexSearch.tsx`   | `useContext(PuppiesContext)`                        | `usePuppiesContext()`                                               | ✅     |
| `ColorSearch.tsx` | `useContext(PuppiesContext)`                        | `usePuppiesContext()`                                               | ✅     |
| `PuppiesList.tsx` | `useContext(PuppiesContext)` + sort inline          | `usePuppiesContext()` + `sortByAvailability`                        | ✅     |
| `Upcoming.tsx`    | `useContext(PuppiesContext)` + `filterBySex` do ctx | `usePuppiesContext()` + `filterPuppiesBySex` + `sortByAvailability` | ✅     |
| `Parents.tsx`     | `useContext(PuppiesContext)`                        | `usePuppiesContext()`                                               | ✅     |
| `Faq.tsx`         | `useContext(PuppiesContext)`                        | `usePuppiesContext()`                                               | ✅     |

**Status geral da migração:** ✅ 9/9 consumidores migrados.

---

## 8. O que foi implementado corretamente

Todos os 5 passos da Fase 1 foram implementados conforme proposto:

- **Encapsulamento do contexto:** `PuppiesContext` é `const` privada ao módulo — não exportada. Nenhum consumidor pode acessar o objeto de contexto diretamente.
- **Type safety:** `createContext<PuppiesContextValue | undefined>(undefined)` elimina o `{} as PuppiesContextValue` que era type-unsafe.
- **Guard de runtime:** `usePuppiesContext()` lança `Error` descritivo quando chamado fora do provider.
- **Utilitários puros e testáveis:** `filterPuppiesBySex` e `sortByAvailability` estão em `utils/functions/puppies.ts`, sem acoplamento a estado.
- **Deps do useMemo:** apenas valores reativos no array — sem ruído de constantes ou refs estáveis.
- **Tipo `Puppy`:** alinhado com dado real do JSON.
- **`filterBySex` removida:** do contexto, do tipo e dos consumidores — sem referência morta.
- **Zero erros TypeScript** nos 12 arquivos afetados (erros do Swiper CSS são pré-existentes e fora do escopo).

---

## 9. O que não foi implementado ou divergiu

Nenhum passo da Fase 1 foi omitido.

As seguintes pendências eram **explicitamente fora do escopo da Fase 1** e estão corretamente registradas na implementação como próximos passos:

| Item                                                       | Razão de não incluir                        |
| ---------------------------------------------------------- | ------------------------------------------- |
| Split de contexto em `DataContext` + `SearchContext`       | Fase 2 — escopo separado                    |
| Desacoplamento de componentes visuais para props           | Fase 3 — requer Fase 2 primeiro             |
| `isLoading`/`error` como `useState`                        | Fase 4 — aguarda decisão de migração de API |
| Correção do `faq-mock.json`                                | Quick win — não é refatoração de código     |
| Uso de `parentIds` no detalhe do filhote                   | Pendência de feature — não é escopo de ctx  |
| Remoção de `setSelectedSex`/`setSelectedColor` do contrato | Fase 3 — requer ações semânticas            |

---

## 10. Riscos de regressão identificados

### R1 — `filterPuppiesBySex` com comparação case-sensitive (Baixo)

**Descrição:** O utilitário compara `p.sex === sex` diretamente, sem `.toLowerCase()`. O filtro interno do contexto usa `.toLowerCase()` em ambos os lados.

**Condição de disparo:** Se alguém chamar `filterPuppiesBySex(puppies, "Macho")` (com M maiúsculo), o resultado será array vazio silenciosamente.

**Impact atual:** Zero — `Upcoming.tsx` usa `CATEGORY_CONFIG` com valores `"macho"` e `"fêmea"` (lowercase) que matcham exatamente `Puppy.sex`.

**Severidade:** Baixo. Sem impacto funcional imediato, risco de manutenção futuro.

---

### R2 — `filterPuppiesBySex` não trata `""` (empty string) como "todos" (Baixo)

**Descrição:** Se chamado com `""`, retorna `puppies.filter((p) => p.sex === "")` → array vazio. Contraste com o filtro do contexto que trata `""` como "sem filtro = mostrar todos".

**Condição de disparo:** Apenas se alguém chamar `filterPuppiesBySex(puppies, "")` — o que não acontece hoje.

**Severidade:** Baixo. Risco de contrato implícito não documentado.

---

### R3 — `isLoading` e `error` como literais (Médio — risco de manutenção)

**Descrição:** `isLoading: false` e `error: null` estão inlineados como literais no `useMemo`. Se a fonte de dados mudar para async (API, CMS), esses valores precisam se tornar `useState`. Como são literais constantes, não há feedback visual de compilação — o código "vai parecer funcionar" mas `isLoading` nunca será `true`.

**Condição de disparo:** Migração para API assíncrona sem refatoração correspondente da Fase 4.

**Severidade:** Médio como risco de manutenção. Zero como risco de regressão para o estado atual (dados mock estáticos).

**Mitigação existente:** Documentado explicitamente na implementação e no estudo como Fase 4 pendente.

---

### R4 — Erros de Swiper CSS pré-existentes (Informativo)

**Descrição:** `Upcoming.tsx`, `Faq.tsx`, `Parents.tsx` e `PuppiesCarousel.tsx` têm erros de `Cannot find module` para `swiper/css` e `swiper/css/pagination`.

**Introduzido nesta refatoração:** Não — erros pré-existentes confirmados. Nenhum arquivo novo importando Swiper CSS foi criado.

**Severidade:** Informativo. Zero impacto no escopo desta validação.

---

## 11. Avaliação de testes

### Estado atual

O projeto **não possui infraestrutura de testes**. Não há arquivos `.test.ts`, `.test.tsx`, `.spec.ts` ou `.spec.tsx` em nenhuma parte do workspace.

### O que a refatoração habilitou (sem implementar ainda)

Com a extração para `utils/functions/puppies.ts`, dois fluxos críticos passam a ser testáveis diretamente com Jest sem nenhuma dependência de provider ou componente:

```ts
// Exemplos diretos possíveis após esta fase:
test("filterPuppiesBySex retorna todos quando sex === 'all'", () => {
   expect(filterPuppiesBySex(mockList, "all")).toHaveLength(mockList.length);
});

test("filterPuppiesBySex filtra por sexo exato", () => {
   expect(
      filterPuppiesBySex(mockList, "macho").every((p) => p.sex === "macho"),
   ).toBe(true);
});

test("sortByAvailability coloca disponíveis antes dos indisponíveis", () => {
   const sorted = sortByAvailability(mockList);
   expect(sorted[0].availability).toBe(true);
   expect(sorted[sorted.length - 1].availability).toBe(false);
});

test("usePuppiesContext lança erro fora do provider", () => {
   expect(() => renderHook(() => usePuppiesContext())).toThrow(
      "usePuppiesContext deve ser usado dentro de PuppiesProvider",
   );
});
```

### Lacunas de cobertura

| Fluxo                                                 | Coberto | Prioridade |
| ----------------------------------------------------- | ------- | ---------- |
| `filterPuppiesBySex` — caso "all"                     | ❌      | Alta       |
| `filterPuppiesBySex` — caso sex específico            | ❌      | Alta       |
| `filterPuppiesBySex` — case sensitivity               | ❌      | Média      |
| `sortByAvailability` — ordenação por disponibilidade  | ❌      | Alta       |
| `usePuppiesContext` — guard fora do provider          | ❌      | Alta       |
| Filtro de filhotes em `context.tsx`                   | ❌      | Alta       |
| Comportamento de `handleSubmit` / `handleClearSearch` | ❌      | Alta       |
| `PuppiesList` — renderização com dados                | ❌      | Média      |
| `Upcoming` — filtro por categoria                     | ❌      | Média      |

**Avaliação:** A ausência de testes é risco residual **aceito e documentado**. A Fase 1 não introduziu impedimentos para testes — ao contrário, reduziu barreiras ao isolar funções puras. A infraestrutura de testes (Jest + Testing Library) deve ser criada como próxima etapa do roadmap de qualidade.

---

## 12. Avaliação de Storybook

O projeto **não possui Storybook**. Nenhuma story foi criada nesta fase.

### O que a refatoração impactou em relação ao Storybook

- Os 9 consumidores validados **ainda consomem `usePuppiesContext()`** — todos continuam acoplados ao provider.
- Para criar stories funcionais para `PuppiesList`, `Searchbar`, `Parents`, `Faq`, `Upcoming`, ainda seria necessário ou:
   - um decorator com `<PuppiesProvider>` envolvendo o componente
   - ou a Fase 3 (desacoplamento para props puras)
- **Componentes sem acoplamento ao contexto** (`PuppiesCard`, `PuppiesCarousel`, `PuppiesInfo`) **já são elegíveis para stories** — recebem `Puppy` via props. Oportunidade de quick win para Storybook **independente das próximas fases do contexto**.

**Avaliação:** Storybook não bloqueado por esta fase. Fase 1 não piora nem melhora a situação de Storybook para componentes acoplados. A Fase 3 é o pré-requisito real para stories sem decorator.

---

## 13. Avaliação da documentação

### `implementacao-context.md`

Lido integralmente. Está coerente com o código real em todos os pontos críticos:

- Os 5 passos implementados batem com o código verificado
- A lista de arquivos alterados está completa e correta
- As decisões técnicas (inlining de `isLoading`/`error`, `PuppiesContext` privado) estão justificadas
- Os riscos residuais (R1, R4, R5 do estudo) estão explicitados
- A seção "Como validar" reflete comportamentos reais e testáveis

**Um ponto de atenção:** a seção 4 do documento de implementação lista `setSelectedSex`/`setSelectedColor` como não alterados "para não aumentar o escopo". Confirma-se no código que ambos ainda estão expostos no contrato — coerente.

### `estudo-context.md`

O estudo identificou 12 problemas (P1-P12) e 7 riscos (R1-R7). A Fase 1 tratou:

- P3 (filterBySex fora do lugar): ✅ resolvido
- P5 (createContext inseguro): ✅ resolvido
- P8 (sort duplicado): ✅ resolvido
- P10 (parentIds ausente no tipo): ✅ resolvido
- P12 (deps enganosas no useMemo): ✅ resolvido
- R3 (risco de {} as PuppiesContextValue): ✅ eliminado

Pendentes conforme esperado: P1, P2, P4, P6, P7, P9, P11 → fases 2, 3 e 4.

### `docs/00-index/index.md`

Contém entrada para `implementacao-context.md`. ✅ Coerente.

### `docs/00-index/history.md`

Contém entrada para `implementacao-context.md` com resumo adequado. ✅ Coerente.

**Observação:** nenhuma das entradas do índice ou histórico menciona a criação de `utils/functions/puppies.ts` como documento separado, mas isso não é necessário — é um arquivo de código, não uma documentação.

---

## 14. Resíduos técnicos ou inconsistências

### A1 — `filterPuppiesBySex`: comparação case-sensitive vs. lowercase da `Puppy.sex` (Baixo)

O utilitário usa comparação direta sem normalização, enquanto o filtro do contexto normaliza com `.toLowerCase()`. O contrato não está documentado. Se o sentinel `"all"` um dia virar `"All"` ou `"ALL"`, o retorno silencioso de array vazio confundirá o desenvolvedor.

**Recomendação:** Adicionar comentário de contrato ao utilitário ou alinhar com lowercase explícito:

```ts
// sex deve ser "all", "macho" ou "fêmea" (case-sensitive)
export function filterPuppiesBySex(puppies: Puppy[], sex: string): Puppy[] {
```

### A2 — `ArticlesInfoProps` em `PuppiesInfo.tsx` (Baixo — fora do escopo desta fase)

A interface do componente `PuppiesInfo` ainda usa `ArticlesInfoProps` como nome — herança de nomenclatura de outro projeto. Não foi escopo desta fase tratar, mas é resíduo de naming pendente.

### A3 — `faq-mock.json` com conteúdo placeholder em inglês (Médio — fora do escopo)

Conforme P9 do estudo, o conteúdo do FAQ está em inglês sobre construção civil. Não foi corrigido nesta fase. Risco real de ir para produção com conteúdo incorreto.

---

## 15. Parecer final

### ✅ APROVADO COM RESSALVAS

**Justificativa:**

A Fase 1 da refatoração do `context.tsx` foi **implementada integralmente e com qualidade**, aderindo a todos os passos do estudo. O código ficou mais seguro, mais modular e mais testável. Nenhum comportamento funcional foi quebrado.

As ressalvas são de natureza de manutenção e evolução futura, não de correção imediata:

| Ressalva                                                               | Severidade | Urgência       |
| ---------------------------------------------------------------------- | ---------- | -------------- |
| `filterPuppiesBySex` sem normalização de case e sem tratamento de `""` | Baixo      | Baixa          |
| `isLoading`/`error` como literais — risco ao migrar para API           | Médio      | Baixa (Fase 4) |
| Ausência total de testes                                               | Alto       | Próximo bloco  |
| Storybook ausente para componentes ainda acoplados ao contexto         | Médio      | Após Fase 3    |
| `faq-mock.json` com conteúdo incorreto                                 | Médio      | Quick win      |
| `ArticlesInfoProps` — naming incorreto em `PuppiesInfo.tsx`            | Baixo      | Próximo bloco  |

---

## 16. Pendências e recomendações

### Imediato (quick wins — sem bloqueio de fase)

1. Corrigir conteúdo do `faq-mock.json` — substituir FAQ em inglês por conteúdo correto sobre Border Collie
2. Renomear `ArticlesInfoProps` para `PuppiesInfoProps` em `PuppiesInfo.tsx`
3. Adicionar contrato de tipos inline em `filterPuppiesBySex` (comentário JSDoc ou validação defensiva)

### Próximo bloco — Infraestrutura de testes

4. Criar setup de Jest + Testing Library compatível com Next.js App Router
5. Implementar testes unitários para `filterPuppiesBySex` e `sortByAvailability`
6. Implementar teste de guard do `usePuppiesContext()` fora do provider
7. Considerar `PuppiesCard`, `PuppiesCarousel`, `PuppiesInfo` como primeiros alvos de stories no Storybook (já são props-pures)

### Fase 2 — Split de contexto

8. Separar `PuppiesDataContext` (puppies, parents, faqItems — estáticos) de `SearchContext` (filtros, UI state, ações)
9. Atualizar os 9 consumidores para usar o hook correto por responsabilidade
10.   Reduzir re-renders desnecessários em `Parents.tsx` e `Faq.tsx`

### Fase 3 — Desacoplamento de apresentação

11. Criar versões presentacionais de `PuppiesList`, `Upcoming`, `Parents`, `Faq`
12. Habilitar stories no Storybook sem decorator de provider para esses componentes

### Fase 4 — Preparação para API assíncrona

13. Converter `isLoading: false` e `error: null` para `useState` reativos
14. Extrair camada de data fetching separada do provider

---

## 17. Como validar manualmente

1. **Build sem erros TypeScript:**

   ```bash
   pnpm build
   ```

   Deve passar sem erros de compilação (erros Swiper CSS são pré-existentes e não bloqueiam o build).

2. **Filtro de filhotes funcional:**
   - Acessar `/filhotes`
   - Selecionar sexo e cor → clicar em buscar
   - A lista deve filtrar corretamente

3. **Limpar busca:**
   - Clicar no logo no Header ou no botão de limpar
   - Filtros devem ser resetados, lista de filhotes oculta

4. **Seção Upcoming na Home:**
   - Acessar `/`
   - Clicar nas abas "Todos / Macho / Fêmea"
   - Os filhotes devem ser filtrados por categoria
   - Filhotes disponíveis devem aparecer antes dos indisponíveis

5. **Guard fora do provider:**
   - Temporariamente remover `<PuppiesProvider>` do root layout e acessar qualquer rota
   - O app deve lançar o erro descritivo `"usePuppiesContext deve ser usado dentro de PuppiesProvider"`

6. **Verificar erros TypeScript:**
   - Nenhum erro em `context.tsx`, `types/index.ts`, `puppies.ts` e nos 9 consumidores
   - Erros Swiper CSS pré-existentes em `Upcoming.tsx`, `Faq.tsx`, `Parents.tsx`, `PuppiesCarousel.tsx` são conhecidos e inofensivos

---

## 18. Conclusão

A refatoração da Fase 1 do `context.tsx` está **aprovada com ressalvas de baixa urgência**. A implementação seguiu integralmente o estudo, entregou melhorias mensuráveis de type safety, encapsulamento, modularização e testabilidade, sem nenhum comportamento funcional quebrado.

As ressalvas mapeadas não são bloqueadoras para a continuidade do projeto. O roadmap das Fases 2, 3 e 4 está documentado e pronto para ser executado.

O próximo bloco de trabalho recomendado é a instalação e configuração da infraestrutura de testes (Jest + Testing Library), aproveitando que `filterPuppiesBySex` e `sortByAvailability` já são funções puras testáveis isoladamente — criando valor imediato de cobertura com esforço mínimo.

---

_Documento criado em 2026-04-13 como parte do fluxo de Estudo → Execução → Validação do projeto filhotes-border-collie._
