<?
###############################################################################################################################
# CONFIGURAÇÕES
###############################################################################################################################
header('Content-Type: text/html; charset=utf-8'); //Define que todo retorno do PHP será em HTML e UTF-8

###############################################################################################################################
# IMPORTAÇÃO DAS CLASSES
###############################################################################################################################
include(__DIR__."/dist/php/pharse/pharse.php");

###############################################################################################################################
# FUNÇÕES
###############################################################################################################################

/**
 * Retorna o código fonte da URL (baseado na resposta do usuário qrworld.net de
 * 11/11/2014 em http://php.net/manual/pt_BR/book.curl.php)
 *
 * @param      string          $url    A URL a ser baixada
 *
 * @return     string|boolean  Retorna uma string com o código fonte da URL se obteve sucesso, falso se falhou.
 */
function getUrlContent($url){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	$data = curl_exec($ch);
	$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	return ($httpcode>=200 && $httpcode<300) ? $data : false;
}

?>