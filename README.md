
# Universo de Palavras

Gera um universo de palavras a partir de uma palavra informada (PHP+JS).

Versão online [disponível aqui!](http://cscconsultoria.com.br/universo_de_palavras/)

## Estratégia para resolução do problema

A resolução do problema foi dividida em três etapas:

### 1 - Análise da necessidade do cliente

Foi recebida a seguinte demanda:

> A palavra é uma unidade da linguagem humana. Uma de suas funções é representar o que pensamos.
> É conhecido que uma palavra possui diferentes tipos de relações com outras palavras. E que uma palavra pode ser “definida” pelo contexto em que habita. Mas como explorar esse universo de palavras? Como visualiza-lo, resumi-lo em uma imagem? 
> Em termos práticos, o desafio proposto é coletar informações sobre palavras e implementar uma visualização que resuma o universo em questão. Na visualização deve ser possível procurar por palavras e encontrar suas relações com outras palavras.

Bem como uma análise prévia do *back-end*:

>3.1) Coleta: você precisa encontrar uma base de conhecimento de palavras e coletar as informações. Exemplo: baixar as informações das palavras do site dicionariocriativo.com.br e ir navegando pelas palavras sinônimos / análogas (assim o coletor iria fazer download de praticamente toda a base de palavras).

>3.2) Modelagem de Dados: interprete as informações que tem de cada palavra e modele de uma forma simples e objetiva. Se você vai visualizar por um gráfico, seus dados terão “cara de tabela”. Se for modelar um grafo (palavras e suas relações), você irá modelar de forma que uma palavra saiba quais são todas suas ligações.

>3.3) View, foco do desafio: Aqui é onde deve focar maior parte do seu tempo. Confira as dicas, existem vários exemplos para você testar. Uma rede de relacionamentos (modelado num grafo), pode ser uma boa. Mas, no final, você é quem deve decidir qual a melhor forma de visualização!

Recebido o *briefing*, foram realizadas algumas perguntas ao cliente:

#### 1 - O objetivo é criar um mapa de palavras relacionadas a partir de uma palavra qualquer informada pelo usuário, correto? Neste caso, a entrada seria uma palavra e a saída pode ser uma tabela ou uma imagem (mapa) de palavras relacionadas (como a imagem de exemplo, do grafo).
> Sim.

#### 2 - É permitida a utilização de outras linguagens de programação? Seria mais fácil pra mim utilizar Python ou PHP.
> Sim.

#### 3 - É necessário hospedar em algum dos dois serviços fornecidos ou pode ser em outros locais (inclusive servidores particulares)?
> Pode.

Baseado no *briefing* e nas perguntas, passei para a definição da estratégia do back-end.


### 2 - Definição da estratégia de back-end

Pela familiaridade com a linguagem e pelos recentes trabalhos na área, optei por utilizar PHP no *back-end*, já que o mesmo é capaz de realizar consultas em outros websites (utilizando [cURL](http://php.net/manual/pt_BR/book.curl.php)) e fazer o tratamento dos dados, deixando a o *front-end* por conta do JS. A hospedagem se deu em servidor próprio disponível, rodando PHP 7.1. 

Para realizar a verificação das palavras relacionadas, fiz uma consulta a URL fornecida no manual (https://dicionariocriativo.com.br/) adicionando ao final do endereço a palavra (convertida para caracteres compatíveis e em letras minúsculas).

Verifiquei fazendo alguns testes no site que o espaço entre as palavras é convertido em um *underline* ```_``` ao invés do sinal de mais esperado ```+``` ou do hexa ```%20``` da URL. Esta transformação teve que ser feita na mão (*hardcoding*) já que não segue o padrão [RFC3986](https://www.ietf.org/rfc/rfc3986.txt).

Exemplos:

- ```Amor``` -> [```https://dicionariocriativo.com.br/amor```](https://dicionariocriativo.com.br/amor)
- ```CONSTRUÇÃO``` -> [```https://dicionariocriativo.com.br/constru%C3%A7%C3%A3o```](https://dicionariocriativo.com.br/constru%C3%A7%C3%A3o)
- ```DiGiTaLiZaÇãO``` -> [```https://dicionariocriativo.com.br/digitaliza%C3%A7%C3%A3o```](https://dicionariocriativo.com.br/digitaliza%C3%A7%C3%A3o)
- ```Por Meio De``` -> [```https://dicionariocriativo.com.br/por_meio_de```](https://dicionariocriativo.com.br/por_meio_de)

A partir da URL, o código-fonte da página pode ser obtido no PHP por meio da execução de um chamado cURL.

Obtido o código fonte, foi necessário interpretar o HTML retornado. Haviam duas opções:
1. Realizar tratamentos via RegEx
2. Utilizar uma biblioteca PHP para tal.

Como o objetivo do desafio não é gerar PI (Propriedade Intelectual), optei pela segunda pela facilidade, tempo disponível e por encontrar uma biblioteca com licença [GPL](https://pt.wikipedia.org/wiki/GNU_General_Public_License). Utilizei a [bilbioteca Pharse](https://github.com/ressio/pharse).

Assim, foram definidos os passos (que representam as etapas até chegar no resultado), na ordem:

#### 3.1 - Busca da palavra primária

A entrada é a palavra fornecida pelo usuário. São esperados dois tipos de retorno: um objeto com propriedades da palavra e suas relações OU uma mensagem de erro (aborta o processo).

#### 3.2 - Busca pelas palavras secundárias

A entrada é o conjunto de palavras relacionadas obtidas no passo 1. São esperados dois tipos de retorno: uma coleção de palavras com um *rank* (pontuação que representa a soma de aparições da palavra secundária nos resultados de busca) OU uma mensagem de erro (aborta o processo).

#### 3.3 - Geração dos resultados

A entrada é o resultado do passo 2. O objetivo do passo é preparar os resultados para exibição. Optei por apresentar a resposta em 3 formas:

##### 3.3.3.1 - Nuvem de palavras

Como o PHP demanda um tempo maior para o processamento de imagens (possível ponto de gargalo do sistema, podendo ser melhorado trabalhando com outras linguagens mais otimizadas para isso, como *Pyhton* e JAVA) e existem requisições web (com *timeouts* e possíveis retornos com erro), foi considerado a geração da nuvem direto em JS. A solução encontrada foi o modelo [*wordcloud* da ZingChart](https://www.zingchart.com/docs/getting-started/your-first-chart/). Baseado neste exemplo e na documentação, o JSON é gerado. 

Em alguns testes percebi que um elevado número de palavras gerava instabilidade e dificuldade na visualização do mesmo. Optei aqui por exibir somente as 50 primeiras palavras relacionadas, exibindo a palavra pesquisada no meio em tamanho 50% maior que a relação mais pontuada, a fim de gerar a sensação da relação apresentada na imagem do exemplo fornecido pelo cliente.

##### 3.3.3.2 - Gráfico de barras

De modo a facilitar a identificação da pontuação das palavras que mais aparecem nas relações, optei também por exibir os dados em um gráfico de barras. Utilizei a biblioteca [ChartJS](http://www.chartjs.org/) para a geração do exemplo, me baseando nos exemplos vistos [aqui](http://www.chartjs.org/samples/latest/charts/bar/horizontal.html) e [aqui](http://www.chartjs.org/samples/latest/scales/linear/min-max.html), bem como na documentação disponível, para a geração do JSON.

Novamente, testes mostraram que um número elevado de palavras relacionadas (em uma busca por ```amor``` por exemplo) dificultava a visualização. Optei por exibir a pontuação dos primeiros 15 resultados.

##### 3.3.3.2 - Tabela

A fim de permitir a visualização de todas as palavras relacionadas encontradas, bem como a sua pontuação, optei por inserir uma tabela (necessariamente com paginação e busca). Objetivando manter a identidade visual compatível com a *framework*, utilizei a biblioteca [Bootstrap-Table](http://bootstrap-table.wenzhixin.net.cn/). Me baseei no exemplo disponível [aqui](https://github.com/wenzhixin/bootstrap-table-examples/blob/master/welcome.html) para geração do JSON.

### 3 - Desenvolvimento do front-end (coleta+view) e ajustes

Como considerações gerais do front-end, optei pela utilização de uma *framework* responsiva (com o Bootstrap)[https://getbootstrap.com/], procurando também evitar grandes trabalhos com CSS. Cabe aqui considerar que em um projeto personalizado e com um prazo maior (ou havendo necessidade de PI), seria interessante considerar outras possibilidades, até mesmo desenvolvendo as próprias folhas de estilos.

Para identidade visual, considerei como ícone a [imagem](https://www.iconfinder.com/icons/2981794/astronomy_galaxy_scifi_space_icon) de um sistema planetário, para remeter a ideia do universo. A imagem é distribuída sobre a licença [*Creative Commons*](https://br.creativecommons.org/).
![Logo base do sistema](https://cdn2.iconfinder.com/data/icons/space-82/64/galaxy-512.png)

Considerei a utilização de um sistema de [SPA (*Single Page Application*)](https://pt.wikipedia.org/wiki/Aplicativo_de_p%C3%A1gina_%C3%BAnica) para que houvesse o menor *overhead* possível, e também para manter o *back-end* menos exposto (através da URL), além de fornecer uma [UX (*User eXperience*)](https://pt.wikipedia.org/wiki/Experi%C3%AAncia_do_usu%C3%A1rio) similar ao uso de um aplicativo desktop.

Para o *layout* da página de busca inicial, considerei o [exemplo de *login* do Bootstrap 4.0](https://getbootstrap.com/docs/4.0/examples/sign-in/), alterando levemente a disposição dos itens. Para a página dos resultados, considerei o [exemplo de *dashboard*](https://getbootstrap.com/docs/4.0/examples/dashboard/), removendo o menu lateral e adicionando os resultados gerados.

Assim, tendo em vista manter o usuário em contato com a página durante o seu carregamento, optei pela exibição de um modal com os passos que estão sendo executados via AJAX. Aproveitando a interface, adicionei também um quarto passo que é a inserção dos JSON nos componentes e instanciação dos mesmos. Entretanto, nos testes verificou-se que esta etapa é executada com grande rapidez e acaba nem sendo possível visualizar a animação de transição para este passo.

Ao final das etapas - se não houve mensagem de erro - os resultados são exibidos. Caso tenha ocorrido um erro, exibe uma página com a mensagem (bem como um botão para voltar e tentar novamente). Para este página considerei uma imagem que remetesse a um evento ruim. Procurando por imagens encontrei esta (https://br.freepik.com/vetores-gratis/um-macaco-playdead-no-fundo-branco_3256334.htm). Inseri com link para os créditos, conforme solicitado na licença gratuída do [Freepik](https://br.freepik.com/).

## Árvore de Páginas

Assim, a árvore de páginas ficou estruturada como a exibida abaixo. Cada arquivo .php (bem como o [custom.js](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/dist/js/custom.js)) está totalmente comentado para facilitar a compreensão do processo.

 - [index.php](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/index.php) -> página base da SPA
 - [inc.php](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/inc.php) -> definições do back-end PHP e suas dependências
 - [ajax/](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/ajax) -> pasta onde os arquivos de requisição do back-end são armazenados
	 - [passo1.php](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/ajax/passo1.php) -> arquivo de AJAX da requisição da palavra primária
	 - [passo2.php](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/ajax/passo2.php) -> arquivo de AJAX da requisição das palavras secundárias
	 - [passo3.php](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/ajax/passo3.php) -> arquivo de AJAX da requisição dos resultados tratados
 - [containers/](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/containers) -> pasta onde os conteúdos HTML da SPA são armazenados
	 - [buscar.php](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/containers/buscar.php) -> content inicial com o logo, a caixa de busca e o botão
	 - [erro.php](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/containers/erro.php) -> content exibido quando ocorre algum erro
	 - [modal.php](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/containers/modal.php) -> modal exibido durante a execução dos passos (após clicar em buscar)
	 - [resultado.php](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/containers/resultado.php) -> content de exibição dos resultados.
 - [dist/](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/dist) -> pasta onde são armazenadas as bibliotecas utilizadas, tanto pelo front-end quanto pelo back-end, bem como o núcleo JS e CSS.
 	- [css/custom.css](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/dist/css/custom.css) -> arquivo base de CSS da página, com todos os estilos personalizados.
 	- [js/custom.js](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/dist/js/custom.js) -> arquivo base de JS da página, responsável por fazer toda a tratativa dos eventos (adicionando escutas, fazendo as requisições e definindo funções).
 	- Os demais arquivos dentro de dist são pertencentes as bibliotecas de origem e não foram alterados.
 - [img/](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/img) -> pasta onde são armazenadas as imagens (logo, ícone de favorito e imagem de erro)

## Considerações finais

Durante a execução do trabalho foram encontrados dois problemas:

### 1 - Certificado da hospedagem

Como estou utilizando um servidor particular onde não foi instalado um certificado SSL, tive que desabilitar o uso do protocolo de segurança nas requisições realizadas via cURL. Isto implica em uma brecha de segurança já que todo o tráfego pode ser interceptado. Em uma aplicação em produção, isto deveria ser corrigido com a instalação de um certificado válido.

### 2 - Bug na busca nos resultados

Depois de realizar uma busca bem sucedida e já se encontrar na página de resultados, ao informar um novo texto para busca o status dos passos anteriores não é redefinido para "na fila", embora o código esteja correto ([js/custom.js](https://github.com/ferdn4ndo/universo_de_palavras/tree/master/dist/js/custom.js):243). Ao que indica, a função dentro do laço for nesta linha não é chamada, embora executando o código JS manualmente (simulando a variável 'passo'), as chamadas ocorrem. Uma abordagem para solução seria usar alternativas ao laço *for*, talvez com objetos de iteração, *promises* ou instanciação de *prototypes*.