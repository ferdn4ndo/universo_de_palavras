
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VARIÁVEIS GLOBAIS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var resultGrafico = null;
var resultTabela = null;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNÇÕES DOS CONTENTS (SPA)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Função para fazer uma transição com fade do texto (fonte:
 * https://stackoverflow.com/questions/3670487/jquery-text-fade-transition-from-one-text-to-another)
 *
 * @param      {string}   elementId  A ID do elemento a ter o texto alterado
 * @param      {string}   text       O novo texto
 * @return     {boolean}  Retorna falso se o texto a ser mudado é igual ao atual, verdadeiro caso contrário
 */
function alteraTexto(elementId, text){
	if(text == $('#'+elementId).text()) return false;
	$('#'+elementId).animate({'opacity': 0}, 250, function () {
		$(this).text(text);
	}).animate({'opacity': 1}, 250);
	return true;
}

/**
 * Função para limpeza dos resultados de busca atual e retorno a tela inicial
 *
 * @param      {string}   palavraNova  A palavra nova a ser buscada
 */
function resetaBusca(palavraNova){
	//Destrói a nuvem
	zingchart.exec('divNuvem', 'destroy');

	//Destrói o gráfico
	if (resultGrafico) resultGrafico.destroy();

	//Limpa a tabela
	if (resultTabela) resultTabela.bootstrapTable('destroy');

	//Volta para a tela inicial
	mostraContent('buscar');

	//Volta o passo para o primeiro
	atualizaPasso(1);

	//Preenche o campo de busca
	$('#txtPalavra').val(palavraNova);
}

/**
 * Função de troca de conteúdo da SPA
 *
 * @param      {string}   content  O nome do novo content a ser exibido
 * @return     {boolean}  Retorna false se ocorreram erros, true caso contrário
 */
function mostraContent(content){
	//Lista de contents possíveis
	var contents = ['buscar','resultado','erro','modalStatus'];

	//Checa se o content atual existe na lista (exibe um erro e retorna falso se não existir)
	if($.inArray(content, contents) == -1){
		msgErro('Content não encontrado na lista ('+content+').');
		return false;
	} 

	//Oculta cada um dos contents que não o atual
	$.each(contents, function(index,value){
		//Primeiro checa se o content existe (fonte: https://stackoverflow.com/questions/3373763/how-to-find-if-div-with-specific-id-exists-in-jquery)
		if($("#"+value).length == 0) {
			msgErro('Content não encontrado ('+value+')!');
		} else {
			//Se não é o content que se deseja exibir (para evitar o efeito oculta-aparece)
			if(value != content){
				//Se é um modal chama o método modal('hide'), caso contrário chama o método hide
				if(value.substring(0,5) == 'modal'){
					$('#'+value).modal('hide');
				} else {
					$('#'+value).hide();
				}
			}
		}
	});

	//Exibe o content atual (se é modal chama o método modal, caso contrário chama o método show)
	if(content.substring(0,5) == 'modal'){
		$('#'+content).modal();
	} else {
		$('#'+content).show();
	}

	//Retorna verdadeiro se chegou até o final da execução
	return true;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNÇÕES DE TRATAMENTO DE ERRO
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Função para tratamento dos erros possíveis na execução do AJAX (callback do
 * evento)
 *
 * @param      {jqXHR}   jqXHR        O objeto jqXHR retornado do erro (ver
 *                                    http://api.jquery.com/jQuery.ajax/#jqXHR)
 * @param      {string}  textStatus   Uma string que descreve o tipo de erro que
 *                                    ocorreu
 * @param      {string}  errorThrown  Caso tenha ocorrido uma exceção retorna a
 *                                    string/objeto aqui
 */
function erroAjax(jqXHR, textStatus, errorThrown){
	//Não foi possível conectar ao servidor
	if (jqXHR.status==0) {
		msgErro('Não foi possível conectar ao servidor. Você está conectado a internet?');
	//A página não foi encontrada (HTTP 404)
	} else if(jqXHR.status==404) {
		msgErro('A página não foi encontrada. Tente novamente mais tarde.');
	//Erro interno no servidor (HTTP 500)
	} else if(jqXHR.status==500) {
		msgErro('Erro interno no servidor. Tente novamente mais tarde.');
	//Erro ao ler o JSON (parse)
	} else if(textStatus=='parsererror') {
		msgErro('Erro ao processar JSON. Tente novamente mais tarde.');
		console.log('responseText: '+jqXHR.responseText); //Como debug adicional, loga o erro (útil para encontrar erros no PHP, mas pode representar uma brecha de segurança, principalmente quando utilizando banco de dados)
	//Tempo máximo de execução excedido (timeout)
	} else if(textStatus=='timeout'){
		msgErro('Tempo máximo de execução excedido. Tente novamente mais tarde.');
	//Nenhum caso conhecido, debuga o máximo possível no console (pode ser uma brecha! O ideal seria armazenar em um log no banco de dados ou arquivo)
	} else {
		msgErro('Erro desconhecido ('+jqXHR.responseText+'). Tente novamente mais tarde.');
		console.log('statusHTTP: '+textStatus);
		console.log('errorThrown: '+errorThrown);
		console.log('responseText: '+jqXHR.responseText);
	}
}


/**
 * Função para atualizar a mensagem do content de erro
 *
 * @param      {string}  msg     A mensagem de erro a ser exibida
 */
function msgErro(msg){
	//Se não existe mensagem, coloca um aviso
	if(msg == '' || msg == undefined) msg = '<span class="text-muted">Não existem detalhes do erro para exibição.</span>';

	//Atualiza a mensagem e exibe o erro
	$('#msgErro').html(msg);
	mostraContent('erro');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNÇÕES DOS PASSOS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Função para atualização da classe e texto do status de um determinado passo
 *
 * @param      {string}   passo   O passo que será alterado
 * @param      {string}   status  O novo status do passo
 *                                (executando|fila|finalizado)
 * @return     {boolean}  Retorna false se ocorreram erros, true caso contrário
 */
function atualizaStatus(passo, status){
	//Dicionário dos status (poderia ser lido de JSON para portabilidade de skins e linguagens)
	var dicStatus = {
		'executando': {
			'classe': 'badge-primary',
			'texto': 'Executando...'
		},
		'fila': {
			'classe': 'badge-secondary',
			'texto': 'Na fila',
		},
		'finalizado': {
			'classe': 'badge-success',
			'texto': 'Finalizado!',
		}
	};

	//Checa se a div do passo existe
	if($('#statusPasso'+passo).length == 0) {
		msgErro('Div do status do passo '+passo+' não encontrada (statusPasso'+passo+')!');
		return false;
	} 

	//Checa se o status está no dicionário
	if(!(status in dicStatus)){
		msgErro('Status não encontrado no dicionário ('+status+').');
		return false;
	} 

	//Altera a classe e o texto do passo
	$('#statusPasso'+passo).attr('class', 'badge badge-pill '+dicStatus[status]['classe']+' pull-right');
	$('#statusPasso'+passo).text(dicStatus[status]['texto']);

	//Retorna verdadeiro se chegou até o final da execução
	return true;
}

/**
 * Função para atualização do status dado o número do passo atual
 *
 * @param      {number}   passo   O passo atual
 * @return     {boolean}  Retorna false se ocorreram erros, true caso contrário
 */
function atualizaPasso(passo){
	var dicPassos = {
		1: {
			'progresso': 1,
			'texto': 'Estamos buscando a palavra, não deve demorar...',
		},
		2: {
			'progresso': 25,
			'texto': 'Agora estamos procurando as palavras relacionadas (isto pode levar algum tempo). Não atualize a página!',
		},
		3: {
			'progresso': 60,
			'texto': 'Analisando as respostas obtidas... Estamos quase lá!',
		},
		4: {
			'progresso': 85,
			'texto': 'Vamos aos resultados!',
		}
	};

	//Checa se o passo está no dicionário
	if(!(passo in dicPassos)){
		msgErro('Passo não encontrado no dicionário ('+passo+').');
		return false;
	}

	//Define os passos anteriores ao atual como 'finalizado'
	for (var i = 1; i < passo; i++) atualizaStatus(i, 'finalizado');

	//Define o passo atual como 'executando'
	atualizaStatus(passo, 'executando');

	//Define os passos futuros como 'na fila'
	for (var j = passo + 1; j <= dicPassos.length; j++) atualizaStatus(j, 'fila');

	//Atualiza o progresso
	$('#statusProgress').css('width', dicPassos[passo]['progresso']+'%').attr('aria-valuenow', dicPassos[passo]['progresso']);

	//Atualiza o texto com transição
	alteraTexto('textoStatus',dicPassos[passo]['texto']);

	//Retorna verdadeiro se chegou até o final da execução
	return true;
}

/**
 * Função de execução do passo 1 - busca da palavra primária
 *
 * @param      {object}  dados   Objeto com os dados iniciais para o passo (no
 *                               caso, a palavra vinda do form)
 */
function passo1(dados){
	//Atualiza o status
	atualizaPasso(1);

	//Exibe o modal de status
	$('#modalStatus').modal();

	//Faz a chamada do AJAX para o passo1
	$.ajax({
		type:'post',
		url:'ajax/passo1.php',
		data: dados,
		dataType: 'json',
		//Se obteve sucesso chama o próximo passo (passando os dados atuais). Caso tenha acontecido um erro, exibe a mensagem
		success:function(response) {
			if(response.sucesso==1){
				passo2(response.dados);
			} else {
				msgErro(response.msg);
			}
		},
		//Se ocorreu um erro no ajax, chama o callback de tratamento de erro
		error: function (x, e) {
			erroAjax(x,e);
		}
	});
}

/**
 * Função de execução do passo 2 - busca das palavras relacionadas
 *
 * @param      {object}  dados   Objeto com os dados iniciais para o passo (no
 *                               caso, o retorno do passo1)
 */
function passo2(dados){
	//Atualiza o status
	atualizaPasso(2);

	//Faz a chamada do AJAX para o passo2
	$.ajax({
		type:'post',
		url:'ajax/passo2.php',
		data: dados,
		dataType: 'json',
		//Se obteve sucesso chama o próximo passo (passando os dados atuais). Caso tenha acontecido um erro, exibe a mensagem
		success:function(response) {
			if(response.sucesso==1){
				passo3(response.dados);
			} else {
				msgErro(response.msg);
			}
		},
		//Se ocorreu um erro no ajax, chama o callback de tratamento de erro
		error: function (x, e) {
			erroAjax(x,e);
		}
	});
}

/**
 * Função de execução do passo 3 - geração dos resultados
 *
 * @param      {object}  dados   Objeto com os dados iniciais para o passo (no
 *                               caso, o retorno do passo2)
 */

function passo3(dados){
	//Atualiza o status
	atualizaPasso(3);

	//Faz a chamada do AJAX para o passo3
	$.ajax({
		type:'post',
		url:'ajax/passo3.php',
		data: dados,
		dataType: 'json',
		//Se obteve sucesso chama o próximo passo (passando os dados atuais). Caso tenha acontecido um erro, exibe a mensagem
		success:function(response) {
			if(response.sucesso==1){
				passo4(response.dados);
			} else {
				msgErro(response.msg);
			}
		},
		//Se ocorreu um erro no ajax, chama o callback de tratamento de erro
		error: function (x, e) {
			erroAjax(x,e);
		}
	});	
}

/**
 * Função de execução do passo 4 - exibição dos resultados
 *
 * @param      {object}  dados   Objeto com os dados iniciais para o passo (no
 *                               caso, o retorno do passo3)
 */
function passo4(dados){
	//Atualiza o status
	atualizaPasso(4);

	//Faz o cabeçalho
	$('#spanPalavra').text(dados.palavra)

	// Gera a nuvem
	geraNuvem(dados);

	// Gera o gráfico
	geraGrafico(dados);

	// Gera a tabela
	geraTabela(dados);

	// Exibe o resultado
	mostraContent('resultado');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNÇÕES DOS RESULTADOS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Função para geração da nuvem de palavras. Fonte:
 * https://www.zingchart.com/docs/chart-types/wordcloud/
 *
 * @param      {object}  dados   Os dados retornados do passo 3
 */
function geraNuvem(dados){
	var myConfig = {
		type: 'wordcloud',
		"options": dados.nuvem,
	};
	zingchart.render({ 
		id: 'divNuvem', 
		data: myConfig, 
		height: 400, 
		width: '100%' 
	});
}

/**
 * Função para geração do gráfico de ocorrências. Fonte:
 * http://www.chartjs.org/samples/latest/charts/bar/horizontal.html
 *
 * @param      {object}  dados   Os dados retornados do passo 3
 */
function geraGrafico(dados){
	var ctx = document.getElementById("cnvGrafico");
	resultGrafico = new Chart(ctx, dados.grafico);
}

/**
 * Função para geração da tabela de relações. Fonte:
 * https://github.com/wenzhixin/bootstrap-table-examples/blob/master/welcome.html
 *
 * @param      {object}  dados   Os dados retornados do passo 3
 */
 function geraTabela(dados){
	resultTabela = $('#tblRelacoes');
	$(function () {
		var data = dados.tabela;
		resultTabela.bootstrapTable({data: data});
	});
}

/**
 * Função para gerar uma nova busca a partir da tela dos resultados
 */
function novaBusca(){
	//Pega a palavra da caixa e checa se ela está vazia
	var palavraNova = $('#txtProcurarNav').val();
	if(palavraNova != ""){
		//Prepara os dados (simula o serializeArray)
		var dados = [
			{
				name: 'txtPalavra',
				value: palavraNova,
			}
		];

		//Limpa os resultados atuais e inicia o passo um com a nova palavra
		resetaBusca(palavraNova);
		passo1(dados);
	} else {
		//Se está vazia, foca na caixa de texto
		$('#txtProcurarNav').focus();
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS DOM
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [CONTENT BUSCAR] Evento do envio do form inicial 
 */
$("#frmBuscar" ).submit(function( event ) {
	//Verifica se o form é válido
	var valido = $("#frmBuscar")[0].checkValidity();
	if(valido){
		//Prepara os dados e inicia o passo 1
		var dados = $("#frmBuscar").serializeArray();
		passo1(dados);
	} else {
		//Se não validou foca na caixa de texto da palavra
		$('#txtPalavra').focus();
	}
	//Evita que redirecione pro action
	event.preventDefault();
});

/**
 * [CONTENT ERRO] Evento do botão tentar novamente
 */
$("#btnTentarNovamente").click(function() {
	//Pega a palavra atual e inicia novamente a busca (limpa e volta para tela de início)
	var palavra = $('#txtPalavra').val();
	resetaBusca(palavra);
});

/**
 * [CONTENT RESULTADO] Evento do botão de nova busca
 */
$("#btnProcurarNav").click(function() {
	//Realiza uma nova busca
	novaBusca();
});

/**
 * [CONTENT RESULTADO] Evento que ocorre ao pressionar enter na caixa de busca do resultado
 */
 $("#txtProcurarNav").on('keyup', function (e) {
 	//Checa se a tecla pressionada é enter (13)
 	if (e.keyCode == 13) {
        novaBusca();
    }
});

/**
 * [GLOBAL] Evento de carregamento do jQuery. Fonte: http://learn.jquery.com/using-jquery-core/document-ready/
 */
$( document ).ready(function() {
	//Atualiza o passo para o primeiro
	atualizaPasso(1);
});