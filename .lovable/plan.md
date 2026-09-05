# Plano — Site one-page da SinalZero

## Objetivo

Landing page institucional da SinalZero em uma única página (`/`), com seção de contato, usando a identidade visual do logo radar enviado (azul-marinho profundo + laranja âmbar com brilho). Foco em conversão, acessibilidade, responsividade e SEO.

## Estrutura da página

1. **Header fixo** — logo radar (SVG), navegação por âncoras (Serviços, Processo, Contato), CTA "Fale conosco".
2. **Hero** — logo radar em destaque com glow, título forte (criação, evolução e operação de sites e produtos web), subtítulo e CTA.
3. **Serviços** — 3 cards: Criação, Evolução, Operação (com ícones).
4. **Como trabalhamos** — pilares da empresa: código sustentável, segurança desde o início, performance/SEO, testes e acessibilidade.
5. **Contato** — formulário (nome, e-mail, mensagem) com validação, estados de envio/sucesso/erro + e-mail direto como alternativa.
6. **Footer** — logo, links de âncora, copyright.

Estados tratados: loading do envio, erro, sucesso, foco visível, navegação por teclado, telas pequenas (menu mobile).

## Direção de design

- Paleta derivada do SVG: fundo navy (`#0a1424`/`#152840`), acento laranja (`#ffa726`/`#f57c00`/`#ffd166`), texto claro.
- Tema escuro como padrão (combina com o logo); tokens semânticos em `src/styles.css` (oklch), sem classes de cor fixas nos componentes.
- Tipografia: fonte display marcante para títulos + fonte neutra para corpo (via Google Fonts com `<link>`).
- Movimento sóbrio: glow sutil no radar, transições suaves em hover/focus — sem excesso de efeitos.
- O SVG enviado será copiado para o projeto como logo (é identidade da marca, não imagem de referência).

## Formulário de contato

- Server function (`createServerFn`) com validação Zod no servidor, rate-limit básico e honeypot anti-spam.
- Envio de e-mail via Brevo **somente após** você fornecer a chave (secret). Até lá, o formulário valida e confirma recebimento, e o e-mail de contato fica visível como canal direto. (Suposição reversível — declarada.)
- Nenhum segredo no frontend.

## SEO e qualidade

- `head()` próprio na rota `/`: título, description, og:title/description, og:type, twitter:card; JSON-LD `Organization`.
- H1 único, HTML semântico, alt nas imagens, contraste verificado.
- Verificação final: build sem erros + inspeção da página renderizada (desktop e mobile) via navegador.

## Arquivos principais

- `src/routes/index.tsx` — página completa (seções podem virar componentes em `src/components/`).
- `src/styles.css` — tokens de cor/tipografia do tema SinalZero.
- `src/routes/__root.tsx` — fontes e metadados base.
- `src/lib/contact.functions.ts` — server function do formulário.
- Logo SVG em `src/assets/`.

## Riscos e verificações

- Envio real de e-mail depende da chave Brevo (limitação declarada até lá).
- Verificações: build OK, formulário testado (sucesso/erro/validação), navegação por âncoras, teclado, viewport mobile, contraste de cores.
