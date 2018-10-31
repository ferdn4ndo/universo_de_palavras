<!doctype html>
<html lang="pt">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="description" content="">
	<meta name="author" content="">
	<link rel="icon" href="img/favicon.ico">
	<title>Processo Seletivo Stilingue - Desafio</title>

	<!-- Bootstrap core CSS -->
	<link href="dist/css/bootstrap.min.css" rel="stylesheet">

	<!-- Bootstrap-Table CSS -->
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.12.1/bootstrap-table.min.css">

	<!-- Custom styles for this template -->
	<link href="dist/css/custom	.css" rel="stylesheet">
</head>

<body>
	<!-- Container inicial: buscar -->
	<? include("containers/buscar.php"); ?>

	<!-- Container da página com os resultados -->
	<? include("containers/resultado.php"); ?>

	<!-- Container com a página de erro -->
	<? include("containers/erro.php"); ?>

	<!-- Container do modal de status -->
	<? include("containers/modal.php"); ?>

	<!-- jQuery e Bootstrap -->
	<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
	<script>window.jQuery || document.write('<script src="dist/js/jquery.min.js"><\/script>')</script>
	<script src="dist/js/popper.min.js"></script>
	<script src="dist/js/bootstrap.min.js"></script>

	<!-- Gráficos -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.min.js"></script>
	<script src= "https://cdn.zingchart.com/zingchart.min.js"></script>
	<script> zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
	ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9","ee6b7db5b51705a13dc2339db3edaf6d"];</script>

	<!-- Tabela -->
	<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.12.1/bootstrap-table.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.12.1/locale/bootstrap-table-pt-BR.min.js"></script>

	<!-- Scripts personalizados -->
	<script src="dist/js/custom.js"></script>
</body>
</html>
