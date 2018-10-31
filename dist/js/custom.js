//Variáveis globais
var resultGrafico = null;
var resultTabela = null;


//Eventos DOM
$("#frmBuscar" ).submit(function( event ) {
	// $('#btnBuscar').prop('disabled', true);
	var valido = $("#frmBuscar")[0].checkValidity();
	if(valido){
		//Prepara os dados
		var dados = $("#frmBuscar").serializeArray();

		//Inicia o passo 1
		passo1(dados);
	} else {
		$('#txtPalavra').focus();
		// $('#btnEnviar').prop('disabled', false);
	}
	event.preventDefault();
});

$("#btnTentarNovamente").click(function() {
	// $('#btnEnviar').prop('disabled', false);
	resetaBusca();
	// mostraContent('buscar');
});

$("#btnProcurarNav").click(function() {
	var palavra = $('#txtProcurarNav').val();
	if(palavra != ""){
		//Prepara os dados (simula o serializeArray)
		var dados = [
			{
				name: 'txtPalavra',
				value: palavra,
			}
		];

		//Limpa os resultados
		resetaBusca();

		//Inicia o passo 1
		passo1(dados);
	} else {
		$('#txtProcurarNav').focus();
	}
});

function resetaBusca(palavra){
	//Destrói a nuvem
	zingchart.exec('divNuvem', 'destroy');

	//Destrói o gráfico
	if (resultGrafico) resultGrafico.destroy();

	//Limpa a tabela
	if (resultTabela) resultTabela.bootstrapTable('destroy');

	//Volta para a tela inicial
	mostraContent('buscar');

	//Preenche o campo de busca
	$('#txtPalavra').val(palavra);

}

function mostraContent(content){
	if(content == 'buscar'){
		$('#buscar').show();
		$('#resultado').hide();
		$('#erro').hide();
		$('#modalStatus').modal('hide');
	} else if(content == 'resultado') {
		$('#resultado').show();
		$('#buscar').hide();
		$('#erro').hide();
		$('#modalStatus').modal('hide');
	} else if(content == 'erro') {
		$('#erro').show();
		$('#resultado').hide();
		$('#buscar').hide();
		$('#modalStatus').modal('hide');
	}
}

function erroAjax(x, e){
	if (x.status==0) {
		msgErro('Não foi possível conectar ao servidor. Você está conectado a internet?');
	} else if(x.status==404) {
		msgErro('A página não foi encontrada. Tente novamente mais tarde.');
	} else if(x.status==500) {
		msgErro('Erro interno no servidor. Tente novamente mais tarde.');
	} else if(e=='parsererror') {
		msgErro('Erro ao processar JSON. Tente novamente mais tarde.');
		console.log('Retorno: '+x.responseText);
	} else if(e=='timeout'){
		msgErro('Tempo máximo de execução excedido. Tente novamente mais tarde.');
	} else {
		msgErro('Erro desconhecido ('+x.responseText+'). Tente novamente mais tarde.');
	}
}

function msgErro(msg){
	if(msg == '' || msg == undefined){
		msg = '<span class="text-muted">Não existem detalhes do erro para exibição.</span>'
	}
	$('#msgErro').html(msg);
	mostraContent('erro');
}




function atualizaStatusPasso(passo, status){
	if(status == 'executando'){
		classe = 'badge-primary';
		texto = 'Executando...';		
	} else if(status == 'fila') {
		classe = 'badge-secondary';
		texto = "Na fila";
	} else if(status == 'finalizado') {
		classe = 'badge-success';
		texto = 'Finalizado!';
	} else {
		msgErro('Status de passo desconhecido ('+status+'). Tente novamente mais tarde.');
	}

	$('#statusPasso'+passo).attr('class', 'badge badge-pill '+classe+' pull-right');
	$('#statusPasso'+passo).text(texto);
}

function atualizaStatus(passo){
	if(passo == 1){
		atualizaStatusPasso(1,'executando'); //Passo 1 = Executando
		atualizaStatusPasso(2,'fila'); //Passo 2 = Na fila
		atualizaStatusPasso(3,'fila'); //Passo 3 = Na fila
		atualizaStatusPasso(4,'fila'); //Passo 4 = Na fila
		$('#statusProgress').css('width', '1%').attr('aria-valuenow', 1); //Barra de progresso
		$('#textoStatus').text('Estamos buscando a palavra, não deve demorar...'); //Texto informativo
	} else if(passo == 2) {
		atualizaStatusPasso(1,'finalizado'); //Passo 1 = Finalizado
		atualizaStatusPasso(2,'executando'); //Passo 2 = Executando
		atualizaStatusPasso(3,'fila'); //Passo 3 = Na fila
		atualizaStatusPasso(4,'fila'); //Passo 4 = Na fila
		$('#statusProgress').css('width', '25%').attr('aria-valuenow', 25); //Barra de progresso
		$('#textoStatus').text('Agora estamos procurando as palavras relacionadas (isto pode levar algum tempo). Não atualize a página!'); //Texto informativo
	} else if(passo == 3) {
		atualizaStatusPasso(1,'finalizado'); //Passo 1 = Finalizado
		atualizaStatusPasso(2,'finalizado'); //Passo 2 = Finalizado
		atualizaStatusPasso(3,'executando'); //Passo 3 = Executando
		atualizaStatusPasso(4,'fila'); //Passo 4 = Na fila
		$('#statusProgress').css('width', '50%').attr('aria-valuenow', 50); //Barra de progresso
		$('#textoStatus').text('Analisando as respostas obtidas... Estamos quase lá!'); //Texto informativo
	} else if(passo == 4) {
		atualizaStatusPasso(1,'finalizado'); //Passo 1 = Finalizado
		atualizaStatusPasso(2,'finalizado'); //Passo 2 = Finalizado
		atualizaStatusPasso(3,'fila'); //Passo 3 = Finalizado
		atualizaStatusPasso(4,'executando'); //Passo 4 = Executando
		$('#statusProgress').css('width', '75%').attr('aria-valuenow', 75); //Barra de progresso
		$('#textoStatus').text('Analisando as respostas obtidas... Estamos quase lá!'); //Texto informativo
	} else {
		msgErro('Atualização para passo desconhecido ('+passo+'). Tente novamente mais tarde.');
	}
}

function passo1(dados){
	$('#modalStatus').modal();
	atualizaStatus(1);
	$.ajax({
		type:'post',
		url:'ajax/passo1.php',
		data: dados,
		dataType: 'json',
		success:function(response) {
			console.log(response);
			if(response.sucesso==1){
				passo2(response.dados);
			} else {
				msgErro(response.msg);
			}
		},
		error: function (x, e) {
			erroAjax(x,e);
		}
	});
}

function passo2(dados){
	// console.log('Passo 2 dados');
	// console.log(dados);
	atualizaStatus(2);
	$.ajax({
		type:'post',
		url:'ajax/passo2.php',
		data: dados,
		dataType: 'json',
		success:function(response) {
			console.log(response);
			if(response.sucesso==1){
				passo3(response.dados);
			} else {
				msgErro(response.msg);
			}
		},
		error: function (x, e) {
			erroAjax(x,e);
		}
	});
}

function passo3(dados){
	atualizaStatus(3);
	$.ajax({
		type:'post',
		url:'ajax/passo3.php',
		data: dados,
		dataType: 'json',
		success:function(response) {
			console.log(response);
			if(response.sucesso==1){
				passo4(response.dados);
			} else {
				msgErro(response.msg);
			}
		},
		error: function (x, e) {
			erroAjax(x,e);
		}
	});	
}

function passo4(dados){
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

function geraNuvem(dados){
	console.log('Geração da nuvem');
	console.log(dados.nuvem);
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

function geraGrafico(dados){
	console.log('Geração do gráfico');
	console.log(dados.grafico);
	var ctx = document.getElementById("cnvGrafico");
	resultGrafico = new Chart(ctx, dados.grafico);
}

function geraTabela(dados){
	console.log('Geração da tabela');
	console.log(dados.tabela);
	resultTabela = $('#tblOcorrencias');
	$(function () {
		var data = dados.tabela;
		resultTabela.bootstrapTable({data: data});
	});
}

function trataResultado(dados){
}

