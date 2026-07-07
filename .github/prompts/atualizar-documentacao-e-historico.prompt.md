---
agent: 'agent'
description: 'Atualiza index e history da documentação em /docs/00-index, corrige caminhos antigos e mantém histórico sincronizado com a estrutura atual da documentação'
---

Quero que você trate esta tarefa como uma ação de **manutenção da navegação documental e do histórico da documentação**.

Seu objetivo é **ajustar, corrigir e manter atualizados apenas os arquivos `docs/00-index/index.md` e `docs/00-index/history.md`**, garantindo que ambos reflitam corretamente a estrutura atual da pasta `/docs`, especialmente a estrutura espelhada adotada em:

`/docs/03-refatoracao`

---

## Objetivo principal

Garantir que os arquivos:

- `docs/00-index/index.md`
- `docs/00-index/history.md`

estejam sempre:

- atualizados
- consistentes com a estrutura atual da documentação
- com caminhos corretos
- sem referências legadas quebradas
- sem links apontando para a estrutura antiga

---

## Objetivos obrigatórios

1. Identificar referências antigas, quebradas, desatualizadas ou inconsistentes dentro de:

   - `docs/00-index/index.md`
   - `docs/00-index/history.md`

2. Atualizar esses dois arquivos para refletirem corretamente:

   - a estrutura atual de `/docs`
   - a estrutura espelhada de `/docs/03-refatoracao`
   - os caminhos mais recentes dos documentos existentes

3. Registrar corretamente no histórico reorganizações, renomeações, movimentações e ajustes de caminho, quando aplicável.

4. Manter a navegação documental clara, coerente, previsível e útil para consultas futuras.

---

## Regra obrigatória de atualização de caminhos antigos

Ao executar esta tarefa, você deve verificar se `docs/00-index/index.md` e `docs/00-index/history.md` ainda contêm referências para caminhos antigos, desatualizados, quebrados ou anteriores à reorganização da pasta `/docs`.

Você deve obrigatoriamente:

- identificar links e caminhos que ainda apontem para a estrutura antiga
- corrigir esses caminhos para refletir a estrutura atual real da documentação
- atualizar referências antigas para os novos caminhos espelhados em `/docs/03-refatoracao`
- evitar manter links legados apontando para documentos que foram movidos, renomeados ou reorganizados
- registrar no histórico que houve ajuste de caminhos e reorganização documental, quando aplicável

### Exemplos de correção esperada

Se antes o índice ou o histórico apontavam para algo como:

`/docs/03-refatoracao/estudo-auth-context.md`

e agora o caminho correto for:

`/docs/03-refatoracao/src/context/estudo-auth-context.md`

então você deve atualizar a referência antiga para a nova.

---

Se antes o índice ou histórico apontavam para:

`/docs/03-refatoracao/estudo-layout.md`

e agora o caminho correto for:

`/docs/03-refatoracao/src/app/estudo-layout.md`

então você deve atualizar a referência antiga para a nova.

---

Se antes o índice ou histórico apontavam para um documento que foi movido, reorganizado ou renomeado, você deve atualizar o caminho para a localização real atual.

Nunca preserve caminhos antigos por inércia.
Sempre priorize o caminho real e atual da documentação existente.

---

## Regra obrigatória para `/docs/03-refatoracao`

Ao atualizar `docs/00-index/index.md` e `docs/00-index/history.md`, você deve considerar que a documentação de refatoração segue obrigatoriamente a **mesma estrutura de pastas do arquivo ou módulo analisado no projeto**, espelhada dentro de:

`/docs/03-refatoracao`

### Regra de espelhamento

Se o arquivo de código estiver em:

`src/...`

então a documentação correspondente deve ficar em:

`/docs/03-refatoracao/src/...`

replicando a mesma hierarquia de pastas.

### Exemplos obrigatórios

Se o arquivo analisado for:

`src/app/layout.tsx`

a documentação correspondente deve estar em:

`/docs/03-refatoracao/src/app/estudo-layout.md`

---

Se o arquivo analisado for:

`src/context/authContext.tsx`

a documentação correspondente deve estar em:

`/docs/03-refatoracao/src/context/estudo-auth-context.md`

---

Se o arquivo analisado for:

`src/types/order/orderSupport.ts`

a documentação correspondente deve estar em:

`/docs/03-refatoracao/src/types/order/estudo-order-support.md`

---

Se o arquivo analisado for:

`src/service/httpClient/axiosHttpClientBack.ts`

a documentação correspondente deve estar em:

`/docs/03-refatoracao/src/service/httpClient/estudo-axios-http-client-back.md`

### Regra de desambiguação

Quando o nome do arquivo original for muito genérico, como `page.tsx`, `layout.tsx`, `route.ts` ou `index.ts`, a estrutura de pastas deve ser considerada parte obrigatória da identificação do documento.

Nunca trate documentos genéricos fora do caminho espelhado como equivalentes ao documento correto.

---

## Escopo restrito de alteração

Nesta tarefa, você deve mexer, alterar, ajustar, corrigir, revisar ou reescrever **apenas** estes dois arquivos:

- `docs/00-index/index.md`
- `docs/00-index/history.md`

### Regra obrigatória de restrição

Você não deve criar, editar, mover, renomear, excluir ou reestruturar nenhum outro arquivo além desses dois.

Isso significa que, nesta tarefa:

- não altere nenhum arquivo em `/docs/03-refatoracao`
- não altere nenhum arquivo em `/docs/01-diagnosticos`
- não altere nenhum arquivo em `/docs/02-arquitetura`
- não altere nenhum arquivo em `/docs/04-testes`
- não altere nenhum arquivo em `/docs/05-storybook`
- não altere nenhum arquivo em `/docs/06-decisoes-tecnicas`
- não altere nenhum arquivo de código
- não proponha edição em massa de outros documentos como parte da execução desta tarefa

### Objetivo desta restrição

O foco desta tarefa é exclusivamente:

- corrigir o índice
- corrigir o histórico
- ajustar referências, caminhos e organização de navegação documental
- registrar corretamente a estrutura atual da documentação

Se você identificar problemas em outros arquivos, apenas mencione isso como observação, sem alterar esses arquivos.

---

## Proibição de expansão de escopo

Não amplie esta tarefa para outros arquivos, mesmo que encontre inconsistências fora de `docs/00-index/index.md` e `docs/00-index/history.md`.

Quando houver necessidade de ajuste em outros documentos, apenas liste essas pendências como recomendação futura.

---

## Regras de comportamento

- Priorize **analisar, corrigir caminhos, ajustar indexação e registrar histórico**.
- Sempre compare `docs/00-index/index.md` e `docs/00-index/history.md` com a estrutura documental mais atual antes de propor alterações.
- Não assuma que a documentação existente está correta; valide consistência com os caminhos reais.
- Não remova conteúdo histórico sem registrar o motivo.
- Quando encontrar documentos duplicados, sobrepostos, renomeados, movidos ou obsoletos, registre isso no histórico, sem alterar os arquivos fora do escopo.
- Sempre preserve previsibilidade de navegação e rastreabilidade documental.
- Evite links quebrados, referências soltas ou caminhos legados.

---

## O que deve ser ajustado em `docs/00-index/index.md`

Ao atualizar o índice, você deve garantir que ele:

- liste os documentos e seções relevantes da documentação atual
- reflita corretamente a estrutura atual de `/docs`
- reflita corretamente a estrutura espelhada de `/docs/03-refatoracao`
- atualize caminhos antigos para os caminhos atuais
- remova ou corrija referências quebradas
- aponte corretamente para documentos movidos, renomeados ou reorganizados
- mantenha uma navegação clara e previsível
- ajude futuras consultas sobre diagnósticos, refatorações, testes, Storybook e decisões técnicas

Se houver reorganização importante em `/docs/03-refatoracao`, o índice deve refletir essa reorganização explicitamente.

---

## O que deve ser ajustado em `docs/00-index/history.md`

Ao atualizar o histórico, você deve garantir que ele registre corretamente:

- data da alteração
- arquivos afetados
- tipo de alteração:
  - criado
  - atualizado
  - renomeado
  - movido
  - reorganizado
  - consolidado
  - arquivado
  - caminho corrigido
- motivo da alteração
- resumo do que mudou
- caminho antigo e novo, quando houver mudança estrutural
- relação com reorganização documental, análise ou refatoração, quando aplicável

O histórico deve ser fiel ao que aconteceu e útil para rastrear a evolução da documentação.

---

## Estrutura recomendada que deve ser refletida no índice

Ao atualizar `docs/00-index/index.md`, considere uma organização previsível como:

- `/docs/00-index/`
- `/docs/01-diagnosticos/`
- `/docs/02-arquitetura/`
- `/docs/03-refatoracao/`
- `/docs/04-testes/`
- `/docs/05-storybook/`
- `/docs/06-decisoes-tecnicas/`

Dentro de `/docs/03-refatoracao`, considere obrigatoriamente a estrutura espelhada do projeto.

---

## Linha de raciocínio obrigatória

Sempre que executar esta tarefa, use esta sequência:

### 1. Contexto

- O que motivou a atualização de `index.md` e `history.md`?
- Houve reorganização na estrutura de `/docs`?
- Houve mudança de caminho em documentos já existentes?

### 2. Diagnóstico documental

- Quais caminhos em `index.md` e `history.md` estão desatualizados?
- Existem referências para a estrutura antiga?
- Existem links quebrados ou inconsistentes?
- O índice atual representa corretamente a estrutura real de `/docs/03-refatoracao`?

### 3. Ação proposta

- Corrigir caminhos antigos?
- Atualizar a navegação do índice?
- Atualizar o histórico com registros de reorganização?
- Corrigir referências para estrutura espelhada?

### 4. Histórico

- Registrar claramente o que foi ajustado e por quê.
- Registrar movimentações estruturais e correções de caminho.

---

## Critérios de qualidade

Os arquivos `docs/00-index/index.md` e `docs/00-index/history.md` devem ficar:

- fiéis ao estado real da documentação
- objetivos, claros e técnicos
- fáceis de consultar futuramente
- consistentes com a estrutura atual de `/docs`
- consistentes com a estrutura espelhada em `/docs/03-refatoracao`
- sem links quebrados
- sem caminhos legados incorretos
- rastreáveis por meio do histórico

---

## Importante

- Sempre que esta tarefa for executada, considere que o foco é **somente** `docs/00-index/index.md` e `docs/00-index/history.md`.
- Sempre que encontrar referência antiga nesses arquivos, atualize para o caminho atual correto.
- Sempre que identificar inconsistência em outros documentos, apenas registre como observação futura, sem alterar esses arquivos.
- Sempre que houver reorganização prévia da documentação, reflita isso corretamente no índice e no histórico.
- Nunca deixe o índice ou o histórico apontando para a estrutura antiga se a estrutura atual já mudou.

---

## Resultado esperado

Ao final, entregue:

1. como `docs/00-index/index.md` deve ficar
2. como `docs/00-index/history.md` deve ficar
3. quais caminhos antigos foram corrigidos
4. quais referências quebradas, desatualizadas ou legadas foram encontradas
5. quais inconsistências documentais foram registradas apenas como observação, sem alteração em outros arquivos

Se houver contexto suficiente e a tarefa permitir edição de arquivos, aplique alterações somente em:

- `docs/00-index/index.md`
- `docs/00-index/history.md`

Não altere nenhum outro arquivo.
