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

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sinal-zero-flow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6627332d-82aa-4b5f-b190-628718097bd5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
