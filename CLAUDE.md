# CLAUDE.md — SinalZero

## Objetivo

A SinalZero é uma startup focada em presença digital, produtos web, SaaS e conversão. O site atual apresenta a marca, o e-book **Fora do Balcão** e a proposta de SaaS de presença digital e sinal de mercado.

Ao trabalhar neste repositório, priorize: clareza, conversão, qualidade visual, performance, acessibilidade, responsividade, SEO, segurança e manutenção simples.

## Stack atual

- React 19 + TypeScript
- TanStack Start / TanStack Router
- Vite 8 + Nitro
- Tailwind CSS 4
- Bun 1.3.14 como package manager
- React Query
- Radix UI
- Lucide React
- Motion / GSAP para animações
- Vercel para deploy
- Supabase, Sentry e Brevo fazem parte da arquitetura da SinalZero quando funcionalidades de backend, autenticação, monitoramento ou email forem necessárias.

`package.json` é a fonte de verdade para dependências e scripts. Use Bun; não troque para npm/yarn/pnpm sem motivo explícito.

## Estrutura importante

```text
src/
  components/site/   # componentes principais da landing page
  hooks/             # hooks reutilizáveis
  lib/               # utilitários e integrações
  routes/            # rotas TanStack Router
  router.tsx         # configuração do router
  routeTree.gen.ts   # arquivo gerado pelo TanStack Router
  server.ts          # entrada/server-side
  start.ts           # inicialização TanStack Start
  styles.css         # estilos globais
```

A rota principal é `src/routes/index.tsx`. Ela compõe a landing page com `Header`, `Hero`, seções institucionais/comerciais, oferta do e-book, FAQ, CTA e `Footer`.

O root está em `src/routes/__root.tsx` e fornece o shell HTML, metadados globais, estilos, `QueryClientProvider`, `Outlet`, tratamento de 404 e tratamento de erros.

## Regras para editar o frontend

1. Antes de criar algo novo, procure componentes, hooks, utilitários e padrões já existentes.
2. Preserve a identidade visual atual quando o usuário não pedir redesign.
3. Faça a menor alteração coesa possível.
4. Não reescreva componentes inteiros para resolver um problema pequeno.
5. Evite abstrações prematuras.
6. Use TypeScript estrito e mantenha tipos corretos.
7. Prefira componentes reutilizáveis quando houver repetição real.
8. Preserve responsividade em mobile, tablet e desktop.
9. Considere estados de loading, erro, vazio, sucesso, foco e teclado quando aplicável.
10. Não adicione bibliotecas quando a stack existente já resolver o problema.
11. Para animações, reutilize Motion/GSAP quando já houver padrão existente; não acumule efeitos sem necessidade.
12. Evite efeitos visuais que prejudiquem legibilidade, performance ou acessibilidade.

## Design e UX

A SinalZero deve parecer uma marca/produto web moderno, premium e tecnológico, mas não genérico.

- Tipografia, espaçamento, cor e hierarquia devem ter propósito.
- Priorize conversão e entendimento da proposta.
- Preserve componentes e padrões visuais existentes antes de inventar novos.
- Não transforme cada seção em uma coleção de efeitos.
- Botões e CTAs devem ter ação e destino claros.
- Garanta bom contraste e foco visível.
- Não dependa apenas de cor para comunicar estados.

## SEO

Ao alterar páginas públicas, preserve ou melhore:

- `title`
- `description`
- Open Graph
- Twitter Card
- dados estruturados quando apropriados
- semântica HTML
- headings coerentes
- links internos e externos relevantes

A página inicial já possui metadados e JSON-LD em `src/routes/index.tsx`.

## Vercel / deploy — IMPORTANTE

O projeto usa **TanStack Start + Nitro** e Vercel.

Não altere casualmente a configuração de build. Existe uma correção conhecida para um problema de deploy:

- `vite.config.ts` precisa manter `nitro()` no pipeline de plugins.
- `nitro` fica em `dependencies`.
- `vercel.json` deve manter comandos explícitos:
  - `installCommand`: `bun install`
  - `buildCommand`: `bun run build`
  - `outputDirectory`: `dist`
- Não reintroduza o Framework Preset "TanStack Start" no `vercel.json` sem investigação.

Antes de modificar build/deploy, entenda a configuração atual e teste o build.

## Comandos

```bash
bun install
bun run dev
bun run build
bun run preview
bun run lint
bun run format
```

Para mudanças relevantes, pelo menos execute o teste/build relacionado à área alterada. Se houver tempo/ambiente disponível, prefira `bun run lint` e `bun run build` antes de considerar a tarefa concluída.

## Git

- Preserve alterações existentes do usuário.
- Não faça `reset --hard`, `clean`, force-push ou outras ações destrutivas sem autorização.
- Não descarte alterações do usuário para "facilitar" a implementação.
- Faça commits claros quando solicitado.
- Antes de concluir uma tarefa, revise o diff.

Fluxo padrão local do projeto quando o usuário pedir para atualizar tudo:

```bash
git add .
git commit -m "Atualiza projeto"
git push
```

## Segurança

- Nunca exponha secrets, tokens, senhas ou arquivos `.env`.
- Nunca coloque secrets no frontend.
- Nunca use `SUPABASE_SERVICE_ROLE_KEY`/service role no cliente.
- Autorização deve ser validada no servidor quando necessário.
- Considere RLS, XSS, CSRF, SSRF, SQL injection, path traversal, uploads e rate limiting.
- Não execute migrações destrutivas ou ações irreversíveis sem confirmação.
- Use dados sintéticos em testes quando possível.

## Eficiência de contexto

Para evitar consumo desnecessário de contexto:

- Não leia o repositório inteiro sem necessidade.
- Inspecione primeiro os arquivos diretamente relacionados à tarefa.
- Não releia arquivos já compreendidos sem motivo.
- Não modifique arquivos fora do escopo solicitado.
- Faça mudanças pequenas e verificáveis.
- Não entre em loops de tentativa/correção sem limite.
- Em bugs, identifique primeiro causa provável, arquivo responsável e teste mínimo.

## Comunicação

Se a tarefa estiver clara, execute sem fazer perguntas desnecessárias.

Ao finalizar, seja objetivo e informe apenas:

1. o que foi alterado;
2. arquivos principais afetados;
3. testes/verificações executados;
4. limitações ou riscos, se existirem.

Não invente resultados de testes, APIs, arquivos ou requisitos.

## Regra principal

**Entenda o código existente → altere o mínimo necessário → teste → revise o diff → conclua.**
