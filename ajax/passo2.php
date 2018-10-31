<?
#Inclui as dependências PHP
include(__DIR__."/../inc.php");

#Prepara a variável de retorno
$ReturnArray = [
	"sucesso" => 1,
	"msg" => '',
	"dados" => $_POST,
];

#Checa se vieram as relacionadas
if(!isset($_POST['relacionadas'])){
	#Informa o erro
	$ReturnArray["sucesso"] = 0;
	$ReturnArray["msg"] = "Não foi retornado nenhuma palavra relacionada.";
} elseif(!isset($_POST['palavra'])) {
	#Informa o erro
	$ReturnArray["sucesso"] = 0;
	$ReturnArray["msg"] = "Não foi retornado uma palavra primária.";
} else {
	#Prepara o dicionário
	$Nuvem = [];
	$Relacionadas = $_POST['relacionadas'];
	$PalavraPrimaria = $_POST['palavra'];

	#Inicializa a contagem de ocorrências de cada palavra em 1
	foreach ($Relacionadas as $Palavra) $Nuvem[$Palavra] = 1;

	#Para cada uma das palavras faz uma nova busca
	foreach ($Relacionadas as $PalavraPai){
		#Prepara a URL
		$URL = "https://dicionariocriativo.com.br/".urlencode($PalavraPai);
		
		#Pega o código fonte da página
		$URLContent = getUrlContent($URL);

		#Prepara o parser
		$Parser = Pharse::str_get_dom($URLContent);

		#Pega o título retornado para checar se houveram resultados
		$Titulo = $Parser('meta[property="og:title"]',0)->attributes['content'];
		$ReturnArray["dados"]["titulo"] = $Titulo;
		if(substr($Titulo, 0, 14) == 'Sem resultados'){
			// Informa o erro
			// $ReturnArray["sucesso"] = 0;
			// $ReturnArray["msg"] = "Não foram encontrados resultados para a palavra '$Palavra'";
		} else {
			$DivPalavrasRel = $Parser('#analogico',0);
			$PalavrasFilhas = $DivPalavrasRel('li a');
			foreach ($PalavrasFilhas as $PalavraFilhaRelacionada) {
				#Pega a palavra
				$PalavraFilha = strtolower($PalavraFilhaRelacionada->getPlainText());

				#Se não é a palavra primária
				if($PalavraFilha != $PalavraPrimaria){
					#Se não existe na array insere com contagem zero
					if(!array_key_exists($PalavraFilha, $Nuvem)) $Nuvem[$PalavraFilha] = 0;

					#Incrementa o contador da palavra
					$Nuvem[$PalavraFilha]++;
				}
			}
		}
	}

	#Retorna a nuvem
	$ReturnArray["dados"]["nuvem"] = $Nuvem;
}

#Retorna o JSON
echo json_encode($ReturnArray);
?>