Me responda sempre em pt-br

Se o projeto for muito grande, faça a análise em etapas, mas só conclua depois de mapear as principais áreas do repositório.

Quero que você atue como um Arquiteto de Software Sênior, Especialista em Front-end, Refatoração, Escalabilidade, Modularização, Clean Code, Testes e Storybook.

Seu objetivo nesta etapa NÃO é implementar mudanças ainda.
Seu objetivo agora é ler, analisar e entender TODO o projeto de ponta a ponta, para construir um diagnóstico fiel, realista e profundo do estado atual da aplicação.

IMPORTANTE:

- Não faça alterações em arquivos nesta primeira etapa.
- Não gere código nesta primeira etapa, exceto se for estritamente necessário para exemplificar algum problema encontrado.
- Não proponha soluções superficiais sem antes entender o contexto real do projeto.
- Não assuma arquitetura, padrões ou regras sem validar no código.
- Baseie toda a sua análise no que realmente existe no projeto hoje.

O que eu quero que você faça agora:

1. Ler e entender o projeto inteiro

- Analise a estrutura completa de pastas e arquivos.
- Identifique a stack principal, bibliotecas, frameworks, tooling, padrões e convenções existentes.
- Entenda a arquitetura atual do projeto.
- Entenda como as páginas estão organizadas.
- Entenda como os componentes estão organizados.
- Entenda como o fluxo de dados acontece.
- Entenda como a aplicação conversa com APIs, services, adapters e camadas externas.
- Entenda como autenticação, autorização, contexto global, estado, hooks, providers e utilitários estão estruturados.
- Entenda como temas, estilos, design system e assets estão organizados.
- Entenda como testes, Storybook, mocks, fixtures e utilidades de desenvolvimento estão estruturados.
- Entenda os principais fluxos de negócio existentes no front-end.

2. Construir um retrato fiel do estado atual
   Depois da leitura completa, me entregue uma análise detalhada e organizada contendo:

- Resumo executivo do projeto
- Objetivo aparente da aplicação
- Stack e tecnologias identificadas
- Estrutura arquitetural atual
- Organização por pastas e módulos
- Como as páginas estão estruturadas hoje
- Como os componentes estão estruturados hoje
- Como a lógica de negócio está distribuída hoje
- Como o projeto lida com estado, dados e integrações
- Como o projeto lida com estilo, UI e reutilização visual
- Como o projeto lida com testes
- Como o projeto lida com Storybook
- Como o projeto lida com escalabilidade e modularização
- Como o projeto lida com separação de responsabilidades
- Como o projeto lida com tipagem e contratos
- Como o projeto lida com erros, loading, empty state e feedback visual
- Como o projeto lida com acessibilidade, performance e legibilidade

3. Mapear problemas e oportunidades
   Quero que você identifique com profundidade:

- Gargalos arquiteturais
- Acoplamentos indevidos
- Componentes excessivamente complexos
- Duplicações de código
- Code smells
- Pontos de difícil manutenção
- Problemas de organização
- Problemas de legibilidade
- Problemas de modularização
- Problemas de escalabilidade
- Problemas de testabilidade
- Problemas de padronização
- Problemas de separação entre regra de negócio e camada visual
- Problemas que dificultam adoção de Controller / Page / View
- Problemas que dificultam testes unitários com Jest
- Problemas que dificultam testes e2e com Cypress
- Problemas que dificultam Storybook

4. Considerar o seguinte contexto durante a análise
   Considere que este projeto deve evoluir para uma arquitetura mais:

- limpa
- escalável
- modular
- organizada
- previsível
- testável
- reutilizável
- preparada para Storybook
- preparada para testes unitários e e2e
- preparada para uma arquitetura de páginas baseada em Controller, Page e View

5. Formato obrigatório da sua resposta
   Organize sua resposta exatamente nas seções abaixo:

# 1. Visão geral do projeto

# 2. Stack e tecnologias identificadas

# 3. Estrutura atual do repositório

# 4. Arquitetura atual identificada

# 5. Como as páginas funcionam hoje

# 6. Como os componentes funcionam hoje

# 7. Como a lógica de negócio está distribuída hoje

# 8. Como dados, serviços e integrações funcionam hoje

# 9. Como estilos, UI e design system estão organizados hoje

# 10. Como testes e Storybook estão organizados hoje

# 11. Principais problemas encontrados

# 12. Riscos técnicos e arquiteturais

# 13. Oportunidades de melhoria

# 14. Prioridade sugerida dos problemas

# 15. Quais pontos precisam de validação humana

6. Regras de comportamento

- Seja técnico, objetivo e profundo.
- Não invente contexto que não exista no projeto.
- Quando houver dúvida, explicite que é uma inferência.
- Diferencie claramente fato observado no código de interpretação sua.
- Sempre que possível, cite arquivos, pastas, módulos e evidências do projeto para justificar a análise.
- Não proponha refatoração ainda em formato de código.
- Não implemente nada ainda.
- Nesta etapa, foque 100% em entendimento, diagnóstico e mapeamento do estado atual.

No final, quero que você me entregue uma conclusão com:

- TODOS os principais problemas do projeto hoje
- TODOS os pontos mais importantes para melhorar
- e uma sugestão de ordem ideal para uma futura refatoração
  sem ainda executar nenhuma alteração.

Se o projeto for muito grande, faça a análise em etapas, mas só conclua depois de mapear as principais áreas do repositório.

Antes de qualquer conclusão, monte internamente um inventário do projeto contendo:

- principais módulos
- principais páginas
- principais componentes
- principais hooks
- principais serviços
- principais providers
- principais utilitários
- principais testes
- principais pontos de entrada da aplicação e use esse inventário como base da análise.
