# Validação Final — `src/app/layout.tsx`

> Data: 2026-04-13  
> Tipo: validação final de implementação de refatoração  
> Documento base de estudo: `docs/03-refatoracao/src/app/estudo-layout.md`  
> Documento base de implementação: `docs/04-implementacao/src/app/implementacao-layout.md`  
> Arquivo validado: `src/app/layout.tsx`  
> Foco: validar implementação das Fases 1 e 2 vs estudo original  
> Status: validação concluída

---

## 1. Contexto da validação

O `src/app/layout.tsx` é o Root Layout do projeto Next.js 15 App Router. Ele afeta 100% das rotas (Home, Lista de Filhotes, Detalhe do Filhote, 404). O estudo identificou 7 problemas (P1–P7) e propôs uma refatoração faseada em 3 fases com 8 passos. As Fases 1 e 2 (5 passos) foram implementadas. A Fase 3 (3 passos) foi explicitamente adiada por depender de estudos complementares.

Esta validação compara o estudo original com a implementação realizada, verificando aderência, riscos de regressão, testes, Storybook e coerência documental.

---

## 2. Documento de estudo utilizado como base

[docs/03-refatoracao/src/app/estudo-layout.md](../../../03-refatoracao/src/app/estudo-layout.md)

Problemas identificados: P1 (Provider fora do body), P2 (head manual), P3 (font vars no body), P4 (Header/Footer fixos), P5 (God Object), P6 (SITE_URL sem fallback), P7 (9 pesos Poppins).

Passos propostos: 1.1, 1.2, 1.3, 1.4 (Fase 1), 2.1 (Fase 2), 3.1, 3.2, 3.3 (Fase 3).

---

## 3. Documento de implementação utilizado como base

[docs/04-implementacao/src/app/implementacao-layout.md](../../../04-implementacao/src/app/implementacao-layout.md)

Implementação declarada: Passos 1.1, 1.2, 1.3, 1.4 e 2.1.

Fase 3 explicitamente marcada como pendente.

---

## 4. Objetivo da validação

1. Confirmar se cada passo implementado segue fielmente o que o estudo propôs.
2. Confirmar se o código real reflete o que a documentação de implementação declara.
3. Identificar desvios justificados e injustificados.
4. Mapear riscos de regressão.
5. Avaliar impacto em testes e Storybook.
6. Avaliar coerência documental.
7. Emitir parecer técnico final.

---

## 5. Escopo validado

| Passo | Descrição                                     | Implementado? | Conforme estudo?  |
| ----- | --------------------------------------------- | ------------- | ----------------- |
| 1.1   | Mover PuppiesProvider para dentro do `<body>` | ✅ Sim        | ✅ Sim            |
| 1.2   | Remover `<head>` manual                       | ✅ Sim        | ✅ Sim            |
| 1.3   | Mover variáveis de fonte para `<html>`        | ✅ Sim        | ✅ Sim            |
| 1.4   | Fallback para `SITE_URL`                      | ✅ Sim        | ✅ Sim            |
| 2.1   | Reduzir pesos da Poppins                      | ✅ Sim        | ⚠️ Divergência    |
| 3.1   | Extrair componente `Providers`                | ⏳ Pendente   | — (escopo futuro) |
| 3.2   | Desacoplar Header do PuppiesContext           | ⏳ Pendente   | — (escopo futuro) |
| 3.3   | Splitting do PuppiesProvider                  | ⏳ Pendente   | — (escopo futuro) |

---

## 6. Arquivos lidos e considerados

| Arquivo                                                 | Motivo da leitura                                  |
| ------------------------------------------------------- | -------------------------------------------------- |
| `src/app/layout.tsx`                                    | Arquivo principal validado                         |
| `src/contexts/context.tsx`                              | Verificar posicionamento e escopo do Provider      |
| `src/components/sections/Header/Header.tsx`             | Verificar acoplamento ao PuppiesContext            |
| `src/components/sections/Footer/Footer.tsx`             | Verificar independência do context                 |
| `src/components/sections/Hero/Hero.tsx`                 | Verificar uso de `font-light` (peso 300)           |
| `src/styles/globals.css`                                | Verificar pesos de fonte em classes utilitárias    |
| `src/app/not-found.tsx`                                 | Verificar herança do root layout e typo de domínio |
| `src/components/ui/tabs.tsx`                            | Verificar uso de `font-normal` (peso 400)          |
| `src/components/ui/select.tsx`                          | Verificar uso de `font-semibold` (peso 600)        |
| `src/components/ui/dropdown-menu.tsx`                   | Verificar uso de `font-semibold` (peso 600)        |
| Todos os componentes `src/components/**`                | Auditoria de pesos de fonte via grep               |
| `docs/03-refatoracao/src/app/estudo-layout.md`          | Documento base de estudo                           |
| `docs/04-implementacao/src/app/implementacao-layout.md` | Documento base de implementação                    |
| `docs/00-index/index.md`                                | Verificar coerência do índice documental           |
| `docs/00-index/history.md`                              | Verificar coerência do histórico documental        |

---

## 7. Comparativo entre estudo e implementação

### Passo 1.1 — Mover PuppiesProvider para dentro do `<body>`

| Aspecto              | Estudo                           | Implementação                    | Código real                         |
| -------------------- | -------------------------------- | -------------------------------- | ----------------------------------- |
| Posição do Provider  | Dentro do `<body>`               | Dentro do `<body>`               | Dentro do `<body>` ✅               |
| Escopo do Provider   | Envolve Header, children, Footer | Envolve Header, children, Footer | Envolve Header, children, Footer ✅ |
| `<html>` como Server | Sim                              | Sim                              | Sim ✅                              |

**Aderência: Total.**

### Passo 1.2 — Remover `<head>` manual

| Aspecto             | Estudo                               | Implementação | Código real                   |
| ------------------- | ------------------------------------ | ------------- | ----------------------------- |
| Preconnect removido | Sim (código morto)                   | Sim           | Nenhum `<head>` no arquivo ✅ |
| Preload removido    | Sim (coberto por `<Image priority>`) | Sim           | Confirmado ✅                 |

**Aderência: Total.**

### Passo 1.3 — Mover variáveis de fonte para `<html>`

| Aspecto                   | Estudo | Implementação | Código real                         |
| ------------------------- | ------ | ------------- | ----------------------------------- |
| Font vars no `<html>`     | Sim    | Sim           | `<html className={...}>` ✅         |
| `antialiased` no `<body>` | Sim    | Sim           | `<body className="antialiased">` ✅ |

**Aderência: Total.**

### Passo 1.4 — Fallback para `SITE_URL`

| Aspecto           | Estudo                              | Implementação                       | Código real                            |
| ----------------- | ----------------------------------- | ----------------------------------- | -------------------------------------- |
| Operador `??`     | Sim                                 | Sim                                 | `?? "https://..."` ✅                  |
| Valor de fallback | `filhotes-encinas-braga.vercel.app` | `filhotes-encinas-braga.vercel.app` | `filhotes-encinas-braga.vercel.app` ✅ |

**Aderência: Total.** (Nota: o domínio precisa de confirmação humana — ver seção 16.)

### Passo 2.1 — Reduzir pesos da Poppins

| Aspecto               | Estudo                  | Implementação                | Código real                     |
| --------------------- | ----------------------- | ---------------------------- | ------------------------------- |
| Pesos propostos       | 4: `400, 500, 600, 700` | 5: `300, 400, 500, 600, 700` | 5: `300, 400, 500, 600, 700` ✅ |
| Motivo da divergência | —                       | `font-light` em Hero.tsx     | Confirmado (2 ocorrências) ✅   |
| Pesos removidos       | 100, 200, 300, 800, 900 | 100, 200, 800, 900           | Confirmado ✅                   |

**Aderência: Parcial com divergência justificada.** O estudo propunha 4 pesos mas sinalizava que "possivelmente 300 para textos leves" poderia ser necessário. A implementação auditou o código real, encontrou 2 ocorrências de `font-light` (peso 300) em `Hero.tsx` e incluiu o peso. A divergência é tecnicamente correta, justificada e documentada.

---

## 8. O que foi implementado corretamente

| #   | Mudança                                                     | Severidade corrigida | Conformidade                   |
| --- | ----------------------------------------------------------- | -------------------- | ------------------------------ |
| 1   | Provider movido de fora do `<html>` para dentro do `<body>` | Alta (P1)            | ✅ Total                       |
| 2   | `<head>` manual removido (3 `<link>` tags de código morto)  | Média (P2)           | ✅ Total                       |
| 3   | Font variables movidas de `<body>` para `<html>`            | Baixa (P3)           | ✅ Total                       |
| 4   | `SITE_URL!` substituído por `?? fallback`                   | Baixa (P6)           | ✅ Total                       |
| 5   | Poppins reduzido de 9 para 5 pesos                          | Baixa (P7)           | ✅ Com divergência justificada |

---

## 9. O que não foi implementado ou divergiu

### 9.1 Não implementado (conforme planejado)

| Passo | Problema  | Justificativa                             |
| ----- | --------- | ----------------------------------------- |
| 3.1   | —         | Escopo futuro, sem dependência            |
| 3.2   | P5/Header | Depende de estudo do `Header.tsx`         |
| 3.3   | P5        | Depende de estudo do `context.tsx`        |
| —     | P4        | Header/Footer fixos — aceitável no escopo |

**Avaliação: Decisão correta.** As 3 ações adiadas são de escopo arquitetural maior e dependem de estudos complementares que ainda não foram realizados. Adiar é a decisão mais segura.

### 9.2 Divergência encontrada

| Item | Descrição                                        | Severidade | Justificada? |
| ---- | ------------------------------------------------ | ---------- | ------------ |
| D1   | Passo 2.1: 5 pesos em vez de 4 (inclusão do 300) | Baixa      | ✅ Sim       |

A divergência D1 é de severidade **Baixa** e está **completamente justificada**. O estudo já sinalizava incerteza sobre o peso 300, e a implementação realizou auditoria completa confirmando uso real. A documentação de implementação registra a divergência explicitamente na seção 6.5.

### 9.3 Implementado fora do estudo

Nenhuma mudança foi implementada que não estivesse prevista no estudo.

---

## 10. Riscos de regressão identificados

| #   | Risco                                 | Probabilidade | Impacto | Mitigação                                    |
| --- | ------------------------------------- | ------------- | ------- | -------------------------------------------- |
| 1   | Fonte weight 300 ausente              | Eliminada     | —       | Incluído na implementação (auditoria real)   |
| 2   | Fallback SITE_URL incorreto           | Baixa         | Baixo   | Confirmar domínio real com responsável       |
| 3   | CSS variables não cascateando do html | Inexistente   | —       | CSS vars cascateiam por definição            |
| 4   | Preload da logo ausente               | Muito baixa   | Baixo   | `<Image priority>` no Header já gera preload |
| 5   | Hydration mismatch residual           | Muito baixa   | Médio   | Provider agora está dentro do body (correto) |

**Build executado com sucesso** — 6/6 páginas geradas, zero erros de compilação ou tipo.

**Risco geral de regressão: Muito baixo.** As mudanças são todas estruturais/conformidade e não alteram comportamento funcional ou visual.

---

## 11. Avaliação de testes

### Estado atual

O projeto **não possui infraestrutura de testes** (sem Jest, sem Cypress, sem qualquer runner configurado).

### Impacto da refatoração nos testes

Nenhum teste foi quebrado (inexistentes). A refatoração melhora a testabilidade futura:

- O fallback em `SITE_URL` previne crash em ambiente de teste sem `.env`.
- O Provider dentro do `<body>` segue o padrão correto para `render()` wrappers em Testing Library.

### Lacunas de teste relevantes

| Fluxo                                                  | Cobertura    | Prioridade |
| ------------------------------------------------------ | ------------ | ---------- |
| Root layout renderiza Header, children e Footer        | ❌ Sem teste | Média      |
| Font variables disponíveis na árvore de componentes    | ❌ Sem teste | Baixa      |
| Metadata global gerada corretamente (OG, title, icons) | ❌ Sem teste | Baixa      |
| Fallback de SITE_URL funcional quando ENV ausente      | ❌ Sem teste | Baixa      |

**Parecer:** A ausência de testes é um problema **pré-existente** e não foi introduzida pela refatoração. O estudo e a implementação mencionam corretamente a inexistência e a melhoria para testabilidade futura. Nenhuma lacuna nova foi criada.

---

## 12. Avaliação de Storybook

### Estado atual

O projeto **não possui Storybook configurado**.

### Impacto da refatoração no Storybook

- Root layouts do Next.js não são candidatos a stories.
- A movimentação das CSS variables para `<html>` facilita futura configuração de decorators globais no Storybook.
- O Header continua acoplado ao PuppiesContext, impedindo story isolada (problema P5, Fase 3).

**Parecer:** Nenhuma lacuna de Storybook foi introduzida. A melhoria (font vars no `<html>`) é positiva para configuração futura. O bloqueio real para stories do Header (acoplamento ao context) é pré-existente e será endereçado na Fase 3.

---

## 13. Avaliação da documentação

### 13.1 Documento de estudo (`estudo-layout.md`)

| Critério                            | Avaliação                                    |
| ----------------------------------- | -------------------------------------------- |
| Cobertura dos problemas             | ✅ Completa (7 problemas mapeados)           |
| Proposta faseada                    | ✅ Clara e incremental (3 fases)             |
| Riscos explicitados                 | ✅ 8 riscos com probabilidade e impacto      |
| Impacto em testes avaliado          | ✅ Seção dedicada                            |
| Impacto em Storybook avaliado       | ✅ Seção dedicada                            |
| Pontos de validação humana          | ✅ 5 pontos explícitos                       |
| Status atualizado pós-implementação | ✅ Marcado como "implementado (Fases 1 e 2)" |

**Incoerência menor:** O inventário técnico (seção 3) ainda descreve o estado **anterior** do arquivo ("9 pesos carregados", "envolve toda a árvore, inclusive `<html>`"). Isso é aceitável como registro histórico, mas poderia causar confusão se lido isoladamente. **Severidade: Baixa.**

### 13.2 Documento de implementação (`implementacao-layout.md`)

| Critério                          | Avaliação                              |
| --------------------------------- | -------------------------------------- |
| Referência ao estudo base         | ✅ Link direto                         |
| Escopo implementado vs pendente   | ✅ Tabela clara com status por passo   |
| Decisões técnicas documentadas    | ✅ 5 decisões com referências Context7 |
| Divergência do estudo documentada | ✅ Seção 6.5 explica peso 300          |
| Arquivos alterados listados       | ✅ Apenas `layout.tsx`                 |
| Impacto em testes                 | ✅ Seção dedicada                      |
| Impacto em Storybook              | ✅ Seção dedicada                      |
| Pendências e próximos passos      | ✅ 5 itens claros                      |
| Instruções de validação manual    | ✅ Build + visual + técnica            |

**Parecer: Documentação de implementação completa e coerente com o código real.** Nenhuma inconsistência identificada entre o que a documentação declara e o que o código mostra.

### 13.3 Índice e histórico (`index.md`, `history.md`)

| Critério                              | Avaliação                      |
| ------------------------------------- | ------------------------------ |
| Estudo registrado no índice           | ✅                             |
| Implementação registrada no índice    | ✅                             |
| Estudo registrado no histórico        | ✅                             |
| Implementação registrada no histórico | ✅                             |
| Validação registrada no índice        | ❌ Pendente (será feito agora) |
| Validação registrada no histórico     | ❌ Pendente (será feito agora) |

---

## 14. Resíduos técnicos ou inconsistências

### 14.1 Resíduos pré-existentes (não introduzidos pela refatoração)

| #   | Tipo                  | Descrição                                                          | Severidade | Arquivo             |
| --- | --------------------- | ------------------------------------------------------------------ | ---------- | ------------------- |
| 1   | Warning TypeScript    | `Cannot find module for side-effect import '@/styles/globals.css'` | Baixa      | `layout.tsx` L1     |
| 2   | Typo no not-found.tsx | `fihlotes-encinas-braga.vercel.app/404` (deveria ser `filhotes`)   | Baixa      | `not-found.tsx` L20 |
| 3   | Typo no Hero.tsx      | `tex-sm` em vez de `text-sm` (classe Tailwind inválida)            | Baixa      | `Hero.tsx` L36      |

### 14.2 Resíduos introduzidos pela refatoração

**Nenhum.** Não foram encontrados imports mortos, código órfão, duplicações ou naming inconsistente introduzidos pela refatoração.

---

## 15. Parecer final

### **Aprovado** ✅

A implementação das Fases 1 e 2 do estudo do `src/app/layout.tsx` é **aderente ao plano original**, **tecnicamente correta** e **bem documentada**.

**Fundamentos do parecer:**

1. **Aderência total em 4 de 5 passos.** A única divergência (peso 300 da Poppins) é justificada por auditoria real do código e documentada explicitamente.
2. **Risco de regressão muito baixo.** Build passa com 6/6 páginas. Nenhuma mudança funcional ou visual. As mudanças são de conformidade com a documentação oficial do Next.js.
3. **Nenhum resíduo técnico introduzido.** O arquivo está mais limpo e enxuto que antes (de ~85 para ~72 linhas).
4. **Documentação completa e coerente.** Estudo, implementação e código real estão alinhados. As referências ao Context7 MCP estão presentes e corretas.
5. **Fase 3 adiada corretamente.** As 3 ações pendentes dependem de estudos complementares e não devem ser implementadas prematuramente.

---

## 16. Pendências e recomendações

### Pendências herdadas do estudo (não introduzidas pela refatoração)

| #   | Item                                             | Prioridade | Depende de              |
| --- | ------------------------------------------------ | ---------- | ----------------------- |
| 1   | Confirmar domínio real de produção para SITE_URL | Média      | Decisão humana          |
| 2   | Fase 3.1 — Extrair `Providers` wrapper           | Baixa      | Nenhuma dependência     |
| 3   | Fase 3.2 — Desacoplar Header do context          | Média      | Estudo do `Header.tsx`  |
| 4   | Fase 3.3 — Split do PuppiesProvider              | Alta       | Estudo do `context.tsx` |
| 5   | Corrigir typo `fihlotes` no `not-found.tsx`      | Baixa      | Nenhuma dependência     |
| 6   | Corrigir typo `tex-sm` no `Hero.tsx`             | Baixa      | Nenhuma dependência     |

### Recomendações

1. **Validação visual recomendada**: Executar `npx next dev` e verificar manualmente as rotas `/`, `/filhotes`, `/filhotes/[id]` e 404 para confirmar que fontes, Header, Footer e layout estão visuais idênticos ao estado anterior.
2. **Quick fix do typo**: Corrigir `tex-sm` → `text-sm` em `Hero.tsx` L36. Não faz parte desta refatoração, mas é um bug visual real (a classe não existe no Tailwind).
3. **Próximo bloco natural**: Estudo do `src/styles/globals.css` (Bloco 1.2) ou do `src/contexts/context.tsx` (Bloco 1.3), conforme a ordem recomendada nas instruções do projeto.

---

## 17. Como validar manualmente

### Build

```bash
npx next build
```

✅ Validado — 6/6 páginas, zero erros.

### Validação visual (pendente — requer olho humano)

```bash
npx next dev
```

Verificar em cada rota:

- `/` — Hero com fontes Poppins (light e bold), Header com logo, Footer.
- `/filhotes` — Lista com cards, filtros funcionando.
- `/filhotes/[id]` — Detalhe do filhote com carrossel e botão WhatsApp.
- URL inválida — 404 com Header e Footer herdados do root layout.

### Inspeção técnica via DevTools

1. **Elements** → `<html>` deve conter classes de CSS variables das fontes.
2. **Elements** → `<body>` deve conter apenas `antialiased`.
3. **Elements** → `<head>` **não** deve conter `<link rel="preconnect">` para Google Fonts.
4. **Network** → **nenhuma** requisição para `fonts.googleapis.com` ou `fonts.gstatic.com`.
5. **Console** → sem warnings de hydration mismatch.

---

## 18. Conclusão

A implementação das Fases 1 e 2 do estudo do root layout é **aprovada sem ressalvas**. O código real está em conformidade com o estudo, a documentação oficial do Next.js e as premissas arquiteturais do projeto. A única divergência (inclusão do peso 300 da Poppins) é uma **melhoria sobre o estudo original**, baseada em auditoria real do código que o estudo não cobriu completamente.

O arquivo `layout.tsx` está agora mais limpo, mais correto e mais preparado para evolução futura. As 3 ações pendentes (Fase 3) foram corretamente adiadas e dependem de estudos complementares dos arquivos `Header.tsx` e `context.tsx`.
