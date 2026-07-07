# Copilot Instructions

> Projeto: Front-end filhotes-border-collie  
> Idioma obrigatório: pt-BR  
> Escopo: estudo, execução e validação técnica de refatorações  
> Status: ativo

## 1. Objetivo destas instruções

Este arquivo orienta o GitHub Copilot / agentes de IA a trabalhar neste projeto com **consistência arquitetural**, **rastreabilidade documental** e **segurança de refatoração**.

A atuação deve seguir um fluxo disciplinado de 3 etapas:

1. **Estudo** → analisar e propor
2. **Execução** → implementar o que foi estudado
3. **Validação** → revisar se a implementação realmente seguiu o estudo

Essas instruções devem ser respeitadas em qualquer tarefa de análise, correção, melhoria, ajuste, refatoração, testes ou documentação.

---

## 2. Idioma, tom e comportamento esperado

- Responder sempre em **pt-BR**.
- Ser técnico, claro, objetivo e organizado.
- Não inventar contexto não observado no código.
- Não responder de forma superficial.
- Não fazer mudanças silenciosas.
- Sempre explicitar riscos, trade-offs, impacto e arquivos afetados.
- Sempre priorizar **segurança de manutenção**, **clareza arquitetural** e **evolução incremental**.

---

## 3. Contexto real do projeto

Este projeto é uma aplicação web de catálogo de filhotes de Border Collie do canil **Encinas & Braga**. O sistema permite listar filhotes, filtrar por sexo e cor, visualizar detalhe de cada filhote, exibir os pais, abrir contato via WhatsApp e possui seções de FAQ e Sobre, atualmente desabilitadas. Hoje o projeto **não possui backend** e consome dados de arquivos JSON estáticos (`puppies-mock.json`, `parents-mock.json`, `faq-mock.json`). fileciteturn2file0

A stack identificada no diagnóstico é baseada em **Next.js 15 App Router**, **React 19**, **TypeScript 5**, **Tailwind CSS**, **Radix UI/shadcn**, **Framer Motion**, **Swiper** e **date-fns**. Também foi identificado que o projeto atualmente **não possui testes** e **não possui Storybook**. fileciteturn2file0 fileciteturn2file8

A arquitetura atual segue parcialmente um padrão **Controller / View**, com `page.tsx` reexportando o controller e a view concentrando a UI client-side. O diagnóstico recomenda evoluir isso para um padrão mais completo de **Controller / Page / View**, com separação mais clara entre dados, orquestração e renderização. fileciteturn2file0 fileciteturn2file9

---

## 4. Premissas arquiteturais obrigatórias

Toda sugestão, implementação ou validação deve considerar que o projeto precisa evoluir para ser:

- escalável;
- modular;
- organizado;
- previsível;
- testável;
- reutilizável;
- preparado para Storybook;
- preparado para testes unitários com Jest;
- preparado para testes E2E/componente com Cypress;
- preparado para uma arquitetura **Controller / Page / View**.

Além disso, toda evolução deve considerar o cenário futuro de:

- extração de constantes e configurações;
- redução de hardcodes;
- desacoplamento de componentes visuais do contexto global;
- preparação para eventual API/CMS;
- possível preparação multi-tenant / multi-canil. fileciteturn2file5 fileciteturn2file9

---

## 5. Uso obrigatório de Skills e MCP

Sempre que relevante, o agente deve priorizar as seguintes skills:

- `documentation-lookup`
- `senior-architect`
- `clean-architecture`
- `project-structure`
- `clean-code`
- `clean-project`
- `refactoring-expert`
- `test-engineering`
- `jest-test-scaffolder`
- `cypress-skill`
- `storybook`
- `test-automation-expert`

Também deve priorizar o uso de:

- **Context7 MCP** para validar documentação oficial, APIs, convenções e padrões atualizados da stack.

### Regra de uso

- Use `documentation-lookup` + Context7 para validar APIs e boas práticas.
- Use `senior-architect` + `clean-architecture` para revisar separação de responsabilidades, fronteiras e acoplamento.
- Use `project-structure` para reorganizar pastas e ownership quando necessário.
- Use `refactoring-expert` + `clean-code` para guiar refatorações incrementais.
- Use `test-engineering`, `jest-test-scaffolder`, `cypress-skill` e `test-automation-expert` para planejar e criar testes.
- Use `storybook` quando houver UI, estados visuais ou necessidade de documentação visual.
- Use `clean-project` para remover código morto, ruído técnico, nomes ruins e sobras de refatoração.

Essas prioridades foram definidas como base dos prompts de **estudo**, **execução** e **validação** adotados neste projeto. fileciteturn2file1 fileciteturn2file2

---

## 6. Fluxo obrigatório de trabalho

### 6.1 Regra principal

**Não começar implementando diretamente quando a tarefa envolver entendimento, refatoração estrutural, melhoria arquitetural ou risco de regressão.**

O fluxo preferencial é:

1. **Estudo**
2. **Execução**
3. **Validação**

### 6.2 Quando usar cada etapa

#### Etapa 1 — Estudo

Use quando a tarefa exigir:

- entendimento profundo de um arquivo ou fluxo;
- proposta de melhoria;
- mapeamento de responsabilidades, dependências e riscos;
- planejamento de refatoração;
- definição de estratégia de testes;
- avaliação de impacto em Storybook;
- construção de documentação técnica antes de implementar.

Nesta etapa, o comportamento obrigatório é:

**analisar → destrinchar → propor → documentar**

**Não implementar código nesta etapa.** fileciteturn2file1 fileciteturn2file6

#### Etapa 2 — Execução

Use quando já existir um estudo prévio documentado e a tarefa for implementar, de forma incremental e segura, o que foi definido.

Nesta etapa, o comportamento obrigatório é:

**analisar o estudo → validar no código real → planejar → implementar → testar → documentar**

Nesta etapa, deve haver implementação de código, tratamento de impactos colaterais, atualização de testes e ajuste de Storybook quando aplicável.

#### Etapa 3 — Validação

Use quando já existir implementação feita e for necessário conferir se:

- a implementação realmente seguiu o estudo;
- o comportamento foi preservado;
- há risco de regressão;
- os testes cobrem o necessário;
- a documentação final bate com a realidade do código.

Nesta etapa, o comportamento obrigatório é:

**analisar o estudo → analisar a implementação → comparar → validar → apontar gaps → documentar**

Por padrão, **não implementar código nesta etapa**, a menos que a tarefa peça explicitamente correções decorrentes da validação.

---

## 7. Ordem recomendada de trabalho neste projeto

A ordem recomendada não é estudar tudo, depois executar tudo e só então validar tudo. O fluxo ideal é por **blocos**, sempre seguindo:

**estudo → execução → validação → próximo bloco**

### Ordem sugerida por blocos

#### Bloco 1 — Base global

1. `src/app/layout.tsx`
2. `src/styles/globals.css`
3. `src/contexts/context.tsx`
4. `src/types/index.ts`
5. `src/utils/lib/tailwindClassUtils.ts`

#### Bloco 2 — Home

1. `src/app/(home)/page.tsx`
2. `src/app/(home)/controller/index.tsx`
3. `src/app/(home)/view/index.tsx`

Depois:

- `src/components/sections/Header/Header.tsx`
- `src/components/sections/Hero/Hero.tsx`
- `src/components/sections/About/About.tsx`
- `src/components/sections/Upcoming/Upcoming.tsx`
- `src/components/sections/Parents/Parents.tsx`
- `src/components/sections/Faq/Faq.tsx`
- `src/components/sections/Faq/FaqItem.tsx`
- `src/components/sections/Footer/Footer.tsx`
- `src/components/background/BackgroundDogs.tsx`

#### Bloco 3 — Layout de conteúdos

1. `src/app/(contents)/layout.tsx`

#### Bloco 4 — Listagem de filhotes

1. `src/app/(contents)/filhotes/page.tsx`
2. `src/app/(contents)/filhotes/controller/index.tsx`
3. `src/app/(contents)/filhotes/view/index.tsx`

Depois:

- `src/components/sections/Searchbar/Searchbar.tsx`
- `src/components/sections/Searchbar/ColorSearch.tsx`
- `src/components/sections/Searchbar/SexSearch.tsx`
- `src/components/sections/InfoPuppies/PuppiesList.tsx`
- `src/components/sections/InfoPuppies/PuppiesCard.tsx`
- `src/components/sections/InfoPuppies/PuppiesCarousel.tsx`
- `src/components/sections/InfoPuppies/PuppiesInfo.tsx`
- `src/components/sections/SkeletonGrid/SkeletonGrid.tsx`

#### Bloco 5 — Detalhe do filhote

1. `src/app/(contents)/filhotes/[id]/page.tsx`
2. `src/app/(contents)/filhotes/[id]/controller/index.tsx`
3. `src/app/(contents)/filhotes/[id]/view/index.tsx`

Depois:

- componentes reutilizados de `InfoPuppies`
- `src/utils/functions/whatsapp.ts`
- mocks e tipos relacionados

#### Bloco 6 — UI reutilizável

- `src/components/sections/Carousel/Carousel.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/popover.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/tabs.tsx`

#### Bloco 7 — Utilitários e revisão final

- `src/utils/functions/variants.ts`
- `src/utils/functions/whatsapp.ts`
- `src/utils/mock/faq-mock.json`
- `src/utils/mock/parents-mock.json`
- revisão final de `src/types/index.ts`

---

## 8. Problemas prioritários já identificados

Ao atuar neste projeto, considere como prioritários os problemas já diagnosticados:

1. uso incorreto de `<Head>` nas views do App Router;
2. nomenclatura inconsistente e conteúdo placeholder herdado de outro projeto;
3. `PuppiesProvider` posicionado fora do `<html>` no root layout;
4. código morto e dependências não utilizadas;
5. `PuppiesProvider` como God Object;
6. forte acoplamento de componentes visuais ao contexto;
7. duplicação de lógica entre `PuppiesCard` e `PuppiesInfo`;
8. duplicação do `Hero` entre home e layout de conteúdos;
9. hardcodes e magic numbers;
10.   ausência total de testes;
11.   ausência de Storybook. fileciteturn2file8 fileciteturn2file9

### Quick wins recomendados

Executar primeiro, quando aplicável:

- remover `next/head` das views do App Router;
- corrigir o provider para ficar dentro do `<body>`;
- remover código morto;
- corrigir nomes inconsistentes;
- limpar textos placeholder e dados herdados incorretamente. fileciteturn2file7

---

## 9. Regras arquiteturais e de código obrigatórias

### 9.1 App Router

- Não usar `next/head` em views do App Router.
- Metadata deve ficar em `page.tsx`, `layout.tsx` ou controller server-side apropriado.
- Evitar padrões do Pages Router neste projeto.

### 9.2 Providers

- Providers devem ficar **dentro do `<body>`**, nunca envolvendo `<html>`.
- Evitar provider global único concentrando tudo.
- Sempre que fizer sentido, dividir contexto por responsabilidade.

### 9.3 Contexto e componentes visuais

- Componentes visuais devem ser preferencialmente **puros**, recebendo props.
- Evitar `useContext` espalhado em componentes de apresentação.
- Acesso a contexto e orquestração devem ficar em containers, pages ou camadas equivalentes.

### 9.4 Duplicação

- Sempre que encontrar lógica duplicada, avaliar extração para utilitário, helper, componente compartilhado ou constante.
- Casos já conhecidos: formatação de data, botão WhatsApp, badges, lista de SVGs, ordenação por disponibilidade.

### 9.5 Hardcodes

- Evitar números, textos, branding e configurações hardcoded quando houver valor de configuração mais apropriado.
- Avaliar externalização de:
   - número do WhatsApp;
   - textos de UI;
   - branding;
   - constantes visuais;
   - dados mockados.

### 9.6 Naming

- Corrigir nomenclatura inconsistente ou herdada de outros projetos.
- Usar singular para entidade única (`puppy`) e plural para coleção (`puppies`).
- Evitar nomes genéricos ou enganosos como `ArticlesController` em rota de filhotes.

### 9.7 Testabilidade

- Escrever código preparado para testes.
- Preferir funções pequenas, previsíveis e com responsabilidades claras.
- Evitar lógica crítica escondida em componentes de UI sem extração.

---

## 10. Regras para documentação obrigatória

Toda tarefa de estudo, execução ou validação deve gerar documentação em `/docs`, respeitando a estrutura espelhada do arquivo original.

### Índices centrais

Sempre que fizer sentido, atualizar também:

- `/docs/00-index/index.md`
- `/docs/00-index/history.md`

### 10.1 Documentação de estudo

Salvar em:

`/docs/03-refatoracao/...`

Nome do arquivo:

`estudo-{nome-normalizado-do-arquivo}.md`

Objetivo:

- analisar o arquivo;
- explicar contexto;
- mapear problemas;
- propor refatoração;
- documentar riscos e passos seguintes. fileciteturn2file4 fileciteturn2file6

### 10.2 Documentação de implementação

Salvar em:

`/docs/04-implementacao/...`

Nome do arquivo:

`implementacao-{nome-normalizado-do-arquivo}.md`

Objetivo:

- registrar o que foi implementado;
- listar arquivos alterados;
- registrar decisões técnicas;
- explicitar impactos em testes e Storybook;
- documentar riscos, trade-offs e validação.

### 10.3 Documentação de validação

Salvar em:

`/docs/05-validacao/...`

Nome do arquivo:

`validacao-{nome-normalizado-do-arquivo}.md`

Objetivo:

- comparar estudo vs implementação;
- registrar aderências e desvios;
- apontar riscos de regressão;
- avaliar testes, Storybook e documentação;
- emitir parecer final.

---

## 11. Regras para estudo

Quando a tarefa for de estudo:

- ler o arquivo alvo inteiro;
- ler imports e dependências relevantes;
- ler tipos, interfaces, hooks, componentes, utilitários e módulos relacionados;
- identificar quem chama o arquivo e o que ele chama;
- entender entrada, saída, renderização, estado, efeitos colaterais e fluxo de dados;
- considerar impacto em arquitetura, modularidade, testes e Storybook;
- não implementar código;
- não aplicar patch;
- não editar arquivos da aplicação por padrão;
- produzir documento técnico em `/docs/03-refatoracao`.

### Estrutura mínima da resposta de estudo

1. resumo executivo;
2. principais achados;
3. principais riscos;
4. proposta resumida de refatoração;
5. caminho do documento gerado.

---

## 12. Regras para execução

Quando a tarefa for de execução:

- começar lendo o estudo anterior;
- validar se o estudo ainda faz sentido no código atual;
- montar plano incremental;
- implementar preservando comportamento funcional atual, salvo bug explicitamente corrigido;
- atualizar tipos, contratos, imports, testes e Storybook quando necessário;
- evitar big bang refactor;
- documentar em `/docs/04-implementacao`.

### Estrutura mínima da resposta de execução

1. resumo executivo;
2. o que foi implementado;
3. arquivos principais alterados;
4. impactos em testes;
5. impactos em Storybook;
6. riscos ou pendências;
7. caminho do documento gerado.

---

## 13. Regras para validação

Quando a tarefa for de validação:

- ler o estudo;
- ler a implementação;
- ler o código real;
- comparar estudo vs implementação;
- identificar lacunas, desvios, resíduos de refatoração e riscos de regressão;
- revisar suficiência dos testes;
- revisar Storybook quando houver UI;
- revisar coerência documental;
- emitir um parecer final claro:
   - **Aprovado**
   - **Aprovado com ressalvas**
   - **Reprovado tecnicamente**
- documentar em `/docs/05-validacao`.

### Estrutura mínima da resposta de validação

1. resumo executivo;
2. status final da validação;
3. principais aderências;
4. principais desvios ou lacunas;
5. principais riscos de regressão;
6. avaliação resumida dos testes;
7. avaliação resumida do Storybook;
8. avaliação resumida da documentação;
9. caminho do documento gerado.

---

## 14. Regras de testes

Como o projeto atualmente não possui infraestrutura de testes, toda refatoração relevante deve considerar a introdução gradual de:

- **Jest + Testing Library** para testes unitários e de componentes;
- **Cypress** para fluxos E2E e possivelmente testes de componente;
- cobertura inicial priorizando fluxos críticos.

### Fluxos prioritários para testes

- busca por sexo e cor;
- listagem de filhotes;
- navegação para detalhe do filhote;
- renderização do detalhe;
- geração de link de WhatsApp;
- comportamentos de loading, empty state e not found, quando existirem.

---

## 15. Regras de Storybook

Como o projeto atualmente não possui Storybook, ele deve ser introduzido **após ou junto do desacoplamento dos componentes visuais**.

Criar stories principalmente para:

- `PuppiesCard`
- `PuppiesInfo`
- `PuppiesCarousel`
- `PuppiesList`
- `Hero`
- `Searchbar`
- `Header`
- `Footer`
- `Upcoming`
- `Parents`
- componentes visuais extraídos durante a refatoração

Evitar criar stories para componentes excessivamente acoplados ao contexto sem antes desacoplá-los.

---

## 16. Restrições gerais

- Não inventar arquivos, fluxos ou dependências não observadas.
- Não assumir que documentação substitui leitura do código.
- Não assumir que implementação está correta sem comparar com o estudo.
- Não ignorar impacto em testes.
- Não ignorar impacto em Storybook quando houver UI.
- Não ignorar riscos de regressão.
- Não propor abstrações desnecessárias sem motivação clara.
- Não criar refatoração cosmética travestida de melhoria arquitetural.
- Não apagar contexto útil da documentação existente.

---

## 17. Perguntas de validação humana que devem continuar visíveis

Sempre que a tarefa tocar nesses temas, validar com humanos antes de consolidar decisões irreversíveis:

1. As seções **About** e **FAQ** serão reativadas ou removidas?
2. O projeto migrará para **API real** ou continuará com dados mockados por um tempo?
3. O número de **WhatsApp** é fixo ou configurável por campanha/tenant?
4. A duplicação do **Hero** é intencional ou deve ser consolidada?
5. Existe plano de **multi-tenant / multi-canil**?
6. Quais fluxos são críticos para testes E2E?
7. `react-scroll` será usado futuramente ou pode ser removido?
8. O deploy final continuará na **Vercel** e o typo de domínio será corrigido?

Esses pontos já foram explicitamente mapeados no diagnóstico do projeto. fileciteturn2file5

---

## 18. Critério de qualidade esperado

Uma tarefa só deve ser considerada realmente bem executada quando:

- houve leitura do código relevante e não apenas inferência;
- a etapa correta do fluxo foi respeitada;
- o uso das skills e do Context7 foi considerado;
- o resultado ficou alinhado à arquitetura desejada;
- os impactos em testes e Storybook foram avaliados;
- a documentação correspondente foi criada ou atualizada;
- riscos, pendências e próximos passos ficaram explícitos.

---

## 19. Resultado esperado do agente

O agente deve funcionar como um parceiro técnico disciplinado do projeto, priorizando:

- entendimento profundo antes de agir;
- mudanças incrementais e seguras;
- documentação viva;
- clareza arquitetural;
- preparação do projeto para testes, Storybook e evolução futura.

Em qualquer dúvida entre agir rápido ou agir com rastreabilidade, prefira **rastreabilidade, clareza e segurança técnica**.
