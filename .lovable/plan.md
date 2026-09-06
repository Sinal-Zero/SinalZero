# Plano — Reorganização e animações da SinalZero

## Objetivo

Refinar o site existente sem recriá-lo: preservar identidade, conteúdo, logo, cores e os dois contatos atuais, corrigindo a execução das animações e melhorando hierarquia, ritmo visual e comportamento responsivo.

## Problemas confirmados

- Os conteúdos animados são renderizados invisíveis e só aparecem depois do `IntersectionObserver`; falhas de hidratação, rolagem rápida ou observer atrasado podem deixar áreas vazias.
- Cada bloco cria seu próprio observer e os atrasos crescem por item, produzindo revelações tardias e uma sensação lenta principalmente no celular.
- O parallax atual atualiza estado React durante o scroll e combina transformação inline com classes de transformação, aumentando o risco de tremor e trabalho desnecessário.
- O cabeçalho perde toda a navegação no celular, e o ritmo vertical deixa vazios grandes entre conteúdos.
- Cards e links usam respostas visuais diferentes; foco, hover e toque precisam de um padrão único e discreto.
- A página está sem erros atuais no console e sem rolagem horizontal; os dois únicos contatos apontam corretamente para `https://linktr.ee/SinalZero`.

## Etapas

1. **Estabilizar movimento**
   - Consolidar a lógica de revelação com fallback seguro, execução única, início mais cedo e atrasos curtos/adaptados ao celular.
   - Tornar o conteúdo visível quando observers não estiverem disponíveis e evitar estados presos em invisibilidade.
   - Trocar o parallax baseado em estado por atualização leve via `requestAnimationFrame` e variável CSS, sem rerenderizar a página.

2. **Reorganizar a apresentação**
   - Padronizar largura, espaçamento vertical, alinhamento e cantos dos blocos sem alterar textos ou seções.
   - Melhorar a hierarquia do topo e das listas, reduzindo vazios excessivos no celular.
   - Criar navegação móvel compacta usando as mesmas âncoras já existentes, sem novo canal de contato.

3. **Refinar interações**
   - Unificar transições de botões, cards, links e menu com `transform`, `opacity`, borda e sombra leves.
   - Garantir estados de foco por teclado, toque e movimento reduzido.
   - Manter animações decorativas lentas e discretas, pausadas para quem prefere menos movimento.

4. **Validar e corrigir regressões**
   - Testar carregamento inicial, rolagem lenta e rápida, âncoras, menu, foco por teclado e os dois contatos.
   - Verificar visualmente desktop e celular, incluindo preferência por menos movimento e ausência de overflow.
   - Executar lint, checagem de tipos e build; revisar console, desempenho aparente e alterações finais.

## Riscos e limites

- Mudanças ficam restritas à apresentação e ao comportamento no navegador; nenhum texto, página, serviço ou integração será criado.
- A redução dos atrasos muda o ritmo visual, mas não a ordem nem o conteúdo das seções.
- O site continuará com exatamente dois links de contato, ambos para o Linktree informado.