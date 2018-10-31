<?
#Inclui as dependências PHP
include(__DIR__."/../inc.php");

#Prepara a variável de retorno
$ReturnArray = [
	"sucesso" => 1,
	"msg" => '',
	"dados" => [],
];

#Verifica se a palavra foi informada
if(!isset($_POST['txtPalavra'])){
	#Informa o erro
	$ReturnArray["sucesso"] = 0;
	$ReturnArray["msg"] = "Não foi fornecida uma palavra para busca.";
} else {
	#Pega a palavra e converte em letras minúsculas
	$Palavra = strtolower($_POST['txtPalavra']);
	#Faz uma limpeza da string (remove qualquer coisa não alfanumérica diferente de espaço e hífen) - baseado na resposta de Damith Ruwan de 26/06/2017 em https://stackoverflow.com/questions/11321048/remove-all-non-alphanumeric-characters-using-preg-replace
	$Palavra = preg_replace("/[^[:alnum:][:space:]-]/u", '', $Palavra);
	#Insere a palavra de retorno no objeto
	$ReturnArray["dados"]["palavra"] = $Palavra;

	#Prepara a URL e pega o código fonte da página
	$URL = "https://dicionariocriativo.com.br/".urlencode($Palavra);
	$URLContent = getUrlContent($URL);

	#Prepara o parser
	$Parser = Pharse::str_get_dom($URLContent);

	#Pega o título retornado para checar se houveram resultados
	$Titulo = $Parser('meta[property="og:title"]',0)->attributes['content'];
	$ReturnArray["dados"]["titulo"] = $Titulo;
	if(substr($Titulo, 0, 14) == 'Sem resultados'){
		#Informa o erro
		$ReturnArray["sucesso"] = 0;
		$ReturnArray["msg"] = "Não foram encontrados resultados para a palavra '$Palavra'";
	} else {
		#Se houveram resultados, pega as palavras relacionadas
		$DivPalavrasRel = $Parser('#analogico',0);
		$PalavrasRelacionadas = $DivPalavrasRel('li a');
		foreach ($PalavrasRelacionadas as $PalavraRelacionada) {
			#Converte o resultado para texto
			$PalavraTexto = strtolower($PalavraRelacionada->getPlainText());
			#Salva a palavra (se ela for diferente da palavra primária)
			if($PalavraTexto != $Palavra) $ReturnArray["dados"]["relacionadas"][] = $PalavraTexto;
		}
	}
}

#Retorna o JSON
echo json_encode($ReturnArray);
?>