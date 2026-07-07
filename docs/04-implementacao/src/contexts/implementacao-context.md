# Implementação — `src/contexts/context.tsx`

> Data: 2026-04-13
> Tipo: implementação baseada em estudo de refatoração
> Documento base: `docs/03-refatoracao/src/contexts/estudo-context.md`
> Arquivo principal implementado: `src/contexts/context.tsx`
> Foco: Fase 1 — custom hook seguro, utilitários puros, limpeza de deps, tipagem
> Status: concluído

---

## 1. Contexto da implementação

Esta implementação executa a **Fase 1 do estudo** do `context.tsx`, que classificou a refatoração como de **baixo risco e alto valor**. O objetivo foi atacar os problemas mais críticos e de menor risco sem quebrar o comportamento funcional da aplicação.

As Fases 2 e 3 (split de contexto e desacoplamento total de apresentação) foram mantidas como pendências documentadas, por exigirem decisões arquiteturais mais amplas.

---

## 2. Documento de estudo utilizado como base

[docs/03-refatoracao/src/contexts/estudo-context.md](../../../03-refatoracao/src/contexts/estudo-context.md)

---

## 3. Objetivo da implementação

- Adicionar guarda de runtime ao contexto com `usePuppiesContext()`
- Tornar `createContext` type-safe (sem `{} as PuppiesContextValue`)
- Extrair `filterBySex` e `sortByAvailability` para utilitários puros e testáveis
- Limpar as dependências falsas do `useMemo` de `contextValue`
- Adicionar `parentIds` ao tipo `Puppy`
- Remover `filterBySex` do contrato público `PuppiesContextValue`
- Atualizar os 9 consumidores para usar `usePuppiesContext()`

---

## 4. Escopo implementado

| Passo do estudo                                                                      | Status          |
| ------------------------------------------------------------------------------------ | --------------- |
| 1.1 — Criar `usePuppiesContext` com guarda de runtime                                | ✅ Implementado |
| 1.2 — Extrair `filterBySex` para `utils/functions/puppies.ts`                        | ✅ Implementado |
| 1.3 — Extrair `sortByAvailability` para `utils/functions/puppies.ts`                 | ✅ Implementado |
| 1.4 — Limpar deps falsas do `useMemo`                                                | ✅ Implementado |
| 1.5 — Adicionar `parentIds?: string[]` ao tipo `Puppy`                               | ✅ Implementado |
| Substituir `useContext(PuppiesContext)` por `usePuppiesContext()` nos 9 consumidores | ✅ Implementado |

---

## 5. Arquivos alterados

| Arquivo                                               | Tipo de alteração                                                                                                                |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `src/contexts/context.tsx`                            | Refatorado: custom hook, `createContext` com `undefined`, remoção de `filterBySex`, `isLoading`/`error` inlineados, deps limpas  |
| `src/types/index.ts`                                  | `Puppy` recebeu `parentIds?: string[]`; `filterBySex` removida de `PuppiesContextValue`                                          |
| `src/utils/functions/puppies.ts`                      | **Novo arquivo**: `filterPuppiesBySex` e `sortByAvailability`                                                                    |
| `src/components/sections/Header/Header.tsx`           | `useContext(PuppiesContext)` → `usePuppiesContext()`                                                                             |
| `src/components/sections/Hero/Hero.tsx`               | `useContext(PuppiesContext)` → `usePuppiesContext()`                                                                             |
| `src/components/sections/Searchbar/Searchbar.tsx`     | `useContext(PuppiesContext)` → `usePuppiesContext()`                                                                             |
| `src/components/sections/Searchbar/SexSearch.tsx`     | `useContext(PuppiesContext)` → `usePuppiesContext()`                                                                             |
| `src/components/sections/Searchbar/ColorSearch.tsx`   | `useContext(PuppiesContext)` → `usePuppiesContext()`                                                                             |
| `src/components/sections/InfoPuppies/PuppiesList.tsx` | `useContext(PuppiesContext)` → `usePuppiesContext()`; ordenação refatorada com `sortByAvailability`                              |
| `src/components/sections/Upcoming/Upcoming.tsx`       | `useContext(PuppiesContext)` → `usePuppiesContext()`; `filterBySex` → `filterPuppiesBySex`; `sort` inline → `sortByAvailability` |
| `src/components/sections/Parents/Parents.tsx`         | `useContext(PuppiesContext)` → `usePuppiesContext()`                                                                             |
| `src/components/sections/Faq/Faq.tsx`                 | `useContext(PuppiesContext)` → `usePuppiesContext()`                                                                             |

---

## 6. Principais decisões técnicas

### `PuppiesContext` agora é privado ao módulo

O `createContext` foi alterado de `export const` para `const` (sem export). Nenhum consumidor externo precisa do objeto de contexto diretamente — o acesso agora é feito exclusivamente via `usePuppiesContext()`. Isso encapsula o contrato e impede uso acidental fora do provider.

### `isLoading` e `error` foram inlineados no `useMemo`

Em vez de declarar `const isLoading = false` e incluir no array de deps (causando ruído de linting), os valores foram inlineados diretamente no objeto do `useMemo`:

```tsx
isLoading: false,
error: null,
```

Isso elimina as variáveis locais e o aviso do exhaustive-deps sem comprometer a clareza.

### `filterBySex` → `filterPuppiesBySex` em `utils/functions/puppies.ts`

A função era pura e não precisava estar no contexto. Ao movê-la:

- `Upcoming.tsx` deixou de depender de `filterBySex` do contexto e passou a consumir `puppies` + a função utilitária
- A função pode agora ser testada isoladamente com Jest sem precisar de provider

### `sortByAvailability` extraída como utilitário

A lógica de ordenação estava duplicada em `PuppiesList.tsx` e `Upcoming.tsx`. Agora existe em um único lugar e ambos os consumidores apontam para a mesma implementação.

---

## 7. O que foi refatorado

- `context.tsx`: `createContext` com `undefined` + guarda de tipo; `usePuppiesContext` exportado; remoção de `filterBySex`; `isLoading`/`error` inlineados; array de deps limpo
- `types/index.ts`: `Puppy.parentIds` adicionado; `filterBySex` removida de `PuppiesContextValue`
- `puppies.ts` (novo): funções puras `filterPuppiesBySex` e `sortByAvailability`
- 9 consumidores: troca `useContext` + import direto por `usePuppiesContext()`
- `PuppiesList.tsx` e `Upcoming.tsx`: ordenação refatorada para usar `sortByAvailability`
- `Upcoming.tsx`: `filterBySex` substituída por `filterPuppiesBySex(puppies, category)` + `puppies` adicionado ao lugar de `filterBySex` no contexto

---

## 8. O que foi preservado por segurança

- Comportamento funcional: filtros de sexo e cor, submit, clear, lista de filhotes, detalhe, parents, FAQ — todos preservados
- Interface `PuppiesContextValue`: apenas `filterBySex` foi removida (não havia consumidor além de `Upcoming.tsx`, que agora usa utilitário direto)
- Estados draft vs. aplicado: `selectedSex`/`selectedColor` (draft) vs. `appliedFilters` (snapshot aplicado) — comportamento mantido
- `PuppiesProvider` no layout: posicionamento não alterado (já estava corretamente dentro do `<body>`)
- `"use client"` em todos os arquivos que eram client components: preservado

---

## 9. Impacto em arquitetura e modularização

**Antes:**

- 10 arquivos com `import { PuppiesContext } from "@/contexts/context"` + `useContext(PuppiesContext)`
- `filterBySex` e duplicação de sort acoplados no provider
- Erro de type-safety silencioso no `createContext`

**Depois:**

- 9 consumidores + o próprio contexto usam apenas `usePuppiesContext()` — acesso seguro e rastreável
- Funções de domínio puras em `utils/functions/puppies.ts` — isoláveis e testáveis
- `PuppiesContext` é um detalhe de implementação — não vaza para fora do módulo
- Sem novas camadas desnecessárias — modularidade cresceu sem adicionar complexidade

---

## 10. Impacto em testes

O projeto ainda não possui infraestrutura de testes. Com este conjunto de mudanças:

**O que ficou mais testável:**

- `filterPuppiesBySex` e `sortByAvailability` são funções puras exportadas — podem ser testadas com Jest diretamente:

```ts
import {
   filterPuppiesBySex,
   sortByAvailability,
} from "@/utils/functions/puppies";

test("filtra por sexo macho", () => {
   const result = filterPuppiesBySex(mockPuppies, "macho");
   expect(result.every((p) => p.sex === "macho")).toBe(true);
});

test("ordena disponíveis primeiro", () => {
   const sorted = sortByAvailability(mockPuppies);
   expect(sorted[0].availability).toBe(true);
});
```

- `usePuppiesContext` com guard de runtime: pode ser testado com um renderHook fora do provider para confirmar que lança o erro esperado

**O que ainda exige wrapper:**

Componentes como `PuppiesList`, `Searchbar`, `Header` ainda consomem o contexto via hook e precisarão de `<PuppiesProvider>` ou de um mock de contexto nos testes de componente. Isso será resolvido na Fase 3 (desacoplamento para props puras).

---

## 11. Impacto em Storybook

Ainda não há Storybook no projeto. O impacto é equivalente ao ponto de testes: os componentes que consomem `usePuppiesContext()` ainda precisarão de um decorator com `PuppiesProvider` para ter stories. A habilitação de stories sem wrapper depende da Fase 3 (componentes puros por props).

---

## 12. Riscos, trade-offs e limitações

### Risco resolvido nesta fase

- R3 do estudo (`{} as PuppiesContextValue` → `undefined` + guard): **eliminado**
- P12 do estudo (deps enganosas no `useMemo`): **eliminado**
- P3/P8 do estudo (`filterBySex` no contexto, sort duplicado): **eliminados**
- P10 do estudo (`parentIds` ausente no tipo): **corrigido**

### Risco residual / não tratado nesta fase

- **R1** — `isLoading`/`error` agora inlinados como literais — se a fonte de dados virar async no futuro, precisarão ser convertidos para `useState`. Está documentado no estudo (Fase 4).
- **R4** — Re-renders desnecessários quando qualquer valor do contexto muda: não resolvido nesta fase. Requer Fase 2 (split de contexto).
- **R5** — Impossibilidade de stories/testes de componente sem wrapper: não resolvido nesta fase. Requer Fase 3.
- **P6** — `setSelectedSex`/`setSelectedColor` ainda expostos diretamente no contrato: não alterado para não aumentar o escopo desta fase.

### Trade-off: `PuppiesContext` deixou de ser exportado

Nenhum consumidor externo do módulo precisa do objeto contexto diretamente. Se por algum motivo futuro alguém precisar de acesso ao objeto `Context` (ex: para criar um consumer render-prop), precisaria reexportar. Dado o uso atual, o ganho de encapsulamento supera o custo.

---

## 13. Pendências e próximos passos recomendados

### Fase 2 — Divisão do contexto (próximo bloco recomendado)

- Separar `PuppiesDataContext` (dados estáticos: `puppies`, `parents`, `faqItems`) do estado de filtro/UI
- Requer atualização dos 9 consumidores (já todos usando `usePuppiesContext`, o que facilita a migration)

### Fase 3 — Desacoplamento de apresentação

- Criar versões presentacionais de `Parents`, `Faq`, `PuppiesList`, `Upcoming`
- Pré-requisito para Storybook e testes de componente sem wrapper
- Pré-requisito: Fase 2 concluída

### Fase 4 — Preparação para API

- Converter `isLoading: false` e `error: null` para estados reativos (`useState`)
- Extrair camada de data fetching separada do contexto

### Quick wins pendentes (não relacionados ao contexto)

- Corrigir conteúdo do `faq-mock.json` (ainda em inglês, sobre construção civil)
- Avaliar uso de `parentIds` no detalhe do filhote

---

## 14. Como validar

1. **Build sem erros**: `pnpm build` (ou `npm run build`) deve passar sem erros de TypeScript
2. **Comportamento do filtro**: na página `/filhotes`, selecionar sexo + cor e clicar em buscar deve filtrar a lista corretamente
3. **Limpar busca**: clicar no logo ou no botão "limpar as buscas" deve resetar os filtros
4. **Página de detalhe**: acessar `/filhotes/1` deve mostrar o filhote com carrossel de `UpcomingSection` abaixo
5. **Home**: a seção `Upcoming` na home deve exibir filhotes filtrados por categoria (Todos/Macho/Fêmea)
6. **Erro fora do provider**: se `usePuppiesContext()` for chamado fora do `PuppiesProvider`, deve lançar `Error("usePuppiesContext deve ser usado dentro de PuppiesProvider")`

---

## 15. Conclusão

A Fase 1 do estudo foi implementada integralmente em 12 arquivos, com zero alteração de comportamento funcional. O `context.tsx` saiu de um provider com contrato inseguro e função de domínio embutida para um módulo limpo com:

- acesso encapsulado via custom hook com guard de runtime
- `PuppiesContext` como detalhe de implementação (não exportado)
- funções de domínio desacopladas em utilitários testáveis
- deps do `useMemo` refletindo apenas valores reativos
- contratos de tipo alinhados com os dados reais (incluindo `parentIds`)

As Fases 2, 3 e 4 foram preservadas como próximos passos documentados, aguardando validação e planejamento para execução futura.

---

_Documento criado em 2026-04-13 como parte do fluxo de Estudo → Execução → Validação do projeto filhotes-border-collie._
