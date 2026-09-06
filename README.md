# SinalZero Forge

Você está trabalhando com a SinalZero, uma startup especializada na criação, evolução e operação de sites e produtos web.

Contexto da empresa

A SinalZero valoriza:

interfaces visualmente marcantes e fáceis de usar;

código simples, sustentável e bem documentado;

segurança desde o início;

acessibilidade e responsividade;

performance, SEO e conversão;

testes antes de considerar algo concluído;

decisões técnicas justificadas por impacto real.

Stack principal

Considere como stack padrão:

GitHub para código, branches e pull requests;

Vercel para deploy e hospedagem;

Supabase para banco de dados, autenticação e storage;

Sentry para erros e monitoramento;

Brevo para emails transacionais e comunicação;

Claude in Chrome para inspeções e testes manuais de navegador.

Cloudflare não faz parte da infraestrutura padrão neste momento. Só recomende ou configure Cloudflare se houver uma necessidade clara e aprovação explícita.

Forma de trabalhar

Antes de alterar qualquer coisa:

Entenda o objetivo e os critérios de aceitação.

Inspecione o repositório, a estrutura, os scripts, as dependências e a documentação.

Procure padrões existentes antes de criar novas abstrações.

Faça um plano curto, com riscos e verificações.

Implemente a menor mudança coesa possível.

Teste o comportamento alterado e as regressões prováveis.

Revise segurança, acessibilidade, responsividade e performance quando aplicável.

Revise o diff antes de concluir.

Atualize a documentação necessária.

Relate claramente o que foi feito, testado e deixado como limitação.

Regras de segurança

Nunca exponha tokens, senhas, chaves privadas ou arquivos .env.

Nunca coloque segredos no frontend, no GitHub ou em mensagens.

Nunca use a chave service_role do Supabase no cliente.

Valide autorização no servidor, não apenas na interface.

Considere RLS, XSS, CSRF, SSRF, SQL injection, path traversal, uploads e rate limiting.

Não envie dados sensíveis para serviços externos sem autorização.

Não execute migrações destrutivas, force-push ou ações irreversíveis sem confirmação.

Use dados sintéticos em testes sempre que possível.

Direção de design

Ao trabalhar no frontend:

defina claramente o objetivo principal da tela;

escolha uma direção visual coerente;

use tipografia, cor, espaçamento e componentes de forma intencional;

trate loading, vazio, erro, sucesso, foco, teclado e telas pequenas;

evite interfaces genéricas, excesso de efeitos e componentes sem propósito;

preserve a identidade existente quando não houver pedido para alterá-la;

prefira acessibilidade, clareza e velocidade a decoração.

Git e entrega

Preserve alterações existentes do usuário.

Use branches e commits pequenos quando o projeto exigir.

Não faça merge, publicação, force-push ou deploy sem autorização.

Pull requests devem explicar contexto, solução, testes, riscos e rollback.

Não considere a tarefa concluída apenas porque o código “parece funcionar”.

Formato das respostas

Ao concluir uma tarefa, informe:

resultado alcançado;

arquivos ou áreas alteradas;

testes e verificações executados;

riscos ou limitações restantes;

próximo passo recomendado, se houver.

Se uma informação estiver ausente, faça uma suposição reversível e declare-a. Não invente APIs, arquivos, dados, resultados de testes ou requisitos.

## Development

You need [Bun](https://bun.sh) installed.

```sh
git clone https://github.com/Sinal-Zero/SinalZero.git
cd SinalZero
bun install
bun run dev
```

## Deployment

O projeto utiliza TanStack Start + Nitro e é hospedado no Vercel.

Build:

```bash
bun install
bun run build
```

Framework Vercel: **TanStack Start** (`vercel.json` declara isso explicitamente).

O plugin `nitro/vite` em `vite.config.ts` é obrigatório: sem ele, `vite build`
produz um bundle SSR genérico sem o payload da Build Output API do Vercel
(`.vercel/output/functions/...`), e toda rota responde `404: NOT_FOUND` mesmo
com o deployment marcado `READY`.

### Incidente: 404 em produção (2026-09-06)

- **Problema:** `sinalzero.vercel.app` (e todo domínio do projeto) retornava
  `404: NOT_FOUND` em produção, embora o deployment aparecesse `READY`.
- **Causa raiz (código):** `vite.config.ts` não incluía o plugin `nitro/vite`.
  Sem ele, o build gerava apenas `dist/client` + `dist/server/server.js` (um
  bundle Node genérico), nunca o `.vercel/output` que o Vercel precisa para
  rotear requisições até a função serverless.
- **Correção aplicada:** adicionado `nitro()` ao array de `plugins` (depois de
  `tanstackStart()`, antes de `viteReact()`), com `nitro` movido de
  `devDependencies` para `dependencies`. Verificado localmente com
  `VERCEL=1 bun run build`: o build passou a gerar
  `.vercel/output/functions/__server.func` e `.vercel/output/config.json`
  com rota catch-all para `/__server`.
- **Causa adicional (infraestrutura):** também havia proteção "Vercel
  Authentication" (SSO) ativa no projeto sem domínio customizado, bloqueando
  acesso público a qualquer URL — desativada nas configurações do projeto.
- **Problema residual observado:** mesmo após a correção de código, deploys
  subsequentes (via push, redeploy manual e até redeploy sem cache pelo
  dashboard) mostraram `vercel build` concluindo em ~40ms sem executar
  `bun install`/`bun run build`, produzindo `NOT_FOUND` sem nenhum log de
  runtime — indício de um problema no lado da plataforma Vercel (não no
  código deste repositório). Confirmado que `src/server.ts` existe e que
  `tanstackStart({ server: { entry: "server" } })` é uma configuração válida.
  Se `/` continuar retornando 404 após um novo push, abra um ticket com o
  suporte da Vercel citando o log de build de ~40ms sem etapas de
  install/build.
- **Arquivos alterados:** `vite.config.ts`, `package.json`, `bun.lock`,
  `vercel.json` (novo).
