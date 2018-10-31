<?
#Inclui as dependências PHP
include(__DIR__."/../inc.php");

#Prepara a variável de retorno
$ReturnArray = [
	"sucesso" => 1,
	"msg" => '',
	"dados" => [],
];

#Checa se vieram as relacionadas
if(!isset($_POST['nuvem'])){
	#Informa o erro
	$ReturnArray["sucesso"] = 0;
	$ReturnArray["msg"] = "Não foi retornado uma nuvem de palavras.";
} elseif(!isset($_POST['palavra'])) {
	#Informa o erro
	$ReturnArray["sucesso"] = 0;
	$ReturnArray["msg"] = "Não foi retornado uma palavra primária.";
} else {
	#Clona a array pela número de ocorrências (a função altera a array original)
	$NuvemOrdenada = $_POST['nuvem'];
	arsort($NuvemOrdenada);
	$Palavras = array_keys($NuvemOrdenada);
	$PalavraPrimaria = $_POST['palavra'];
	$ReturnArray['dados']['palavra'] = $PalavraPrimaria;

	###############################################################################################################################
	# DADOS DA NUVEM
	###############################################################################################################################
	$DadosNuvem = [
		'words' => [],
	];

	#Insere a palavra primária, com uma pontuação 150% maior que a segunda colocada
	$DadosNuvem['words'][] = [
		"text" => $PalavraPrimaria,
		"count" => round($NuvemOrdenada[$Palavras[0]]*2.5),
	];

	#Pega os primeiros 50 resultados para a nuvem
	for ($i=0; $i < 50; $i++) { 
		$DadosNuvem['words'][] = [
			"text" => $Palavras[$i],
			"count" => $NuvemOrdenada[$Palavras[$i]],
		];
	}
	
	#Salva o retorno da nuvem
	$ReturnArray['dados']['nuvem'] = $DadosNuvem;

	###############################################################################################################################
	# DADOS DO GRÁFICO
	###############################################################################################################################

	#Prepara o retorno do gráfico
	#Fonte: http://www.chartjs.org/samples/latest/charts/bar/horizontal.html
	#		http://www.chartjs.org/samples/latest/scales/linear/min-max.html
	$ChartData = [
		'type' => 'horizontalBar',
		'data' => [
			'labels' => [],
			'datasets' => [
				[
					'lineTension' => 0,
					'backgroundColor' => '#229dff',
					'borderColor' => '#007bff',
					'borderWidth' => 1,
					'pointBackgroundColor' => '#007bff',
					// 'backgroundColor' => 'color(window.chartColors.red).alpha(0.5).rgbString()',
					// 'borderColor' => 'window.chartColors.red',
					// 'borderWidth' => 1,
					'data' => []
				]
			]
		],
		'options' => [
			'elements' => [
				'rectangle' => [
					'borderWidth' => 1,
				]
			],
			'responsive' => 1,
			'legend' => [
				'display' => 0,
			],
			'scales' => [
				// 'yAxes' => [
				// 	'ticks' => [
				// 		'min' => 10,
				// 		'max' => 50
				// 	]
				// ],
				'xAxes' => [
					[
						'ticks' => [
							'min' => 10,
							'max' => 50
						]
					]
				],
			]
		]

	];
	
	#Pega os primeiros 15 resultados para o gráfico
	$MaximoItensGrafico = 15;
	$FaixaAcimaAbaixo = 3;

	#Fonte: https://stackoverflow.com/questions/3720096/get-the-first-n-elements-of-an-array
	$NuvemCortada = array_slice($Palavras, 0, $MaximoItensGrafico, true);
	foreach ($NuvemCortada as $PalavraNuvem) {
		$ChartData['data']['labels'][] = $PalavraNuvem;
		$ChartData['data']['datasets'][0]['data'][] = $NuvemOrdenada[$PalavraNuvem];
	}

	#Atualiza o máximo e mínimo da barra
	$ValorMax = $ChartData['data']['datasets'][0]['data'][0];
	$ValorMin = $ChartData['data']['datasets'][0]['data'][$MaximoItensGrafico-1];
	$ChartData['options']['scales']['xAxes'][0]['ticks']['min'] = ($ValorMin > $FaixaAcimaAbaixo) ? ($ValorMin - $FaixaAcimaAbaixo) : 0;
	$ChartData['options']['scales']['xAxes'][0]['ticks']['max'] = $ValorMax + $FaixaAcimaAbaixo;
	
	#Salva o retorno do gráfico
	$ReturnArray['dados']['grafico'] = $ChartData;

	###############################################################################################################################
	# DADOS DA TABELA
	###############################################################################################################################
	#Prepara a variável de retorno da tabela
	$DadosTabela = [];

	#Pega todos os resultados e insere na tabela
	$IDX = 0;
	foreach ($NuvemOrdenada as $PalavraNuvem => $ValorNuvem) {
		$IDX++;
		$DadosTabela[] = [
			"id" => $IDX,
			"palavra" => $PalavraNuvem,
			"ocorrencias" => $ValorNuvem,
		];
	}

	#Salva o retorno da tabela
	$ReturnArray['dados']['tabela'] = $DadosTabela;
}

#Retorna o JSON
echo json_encode($ReturnArray);
?>