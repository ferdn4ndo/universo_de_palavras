<div id="resultado" style="display: none;">
	<nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
		<img class="mx-2 navbar-brand" src="img/logo.svg" alt="" width="32" height="32">
		<input id="txtProcurarNav" class="form-control form-control-dark w-100" type="text" placeholder="Digite outra palavra para procurar..." aria-label="Digite outra palavra para procurar...">
		<ul class="navbar-nav px-3">
			<li class="nav-item text-nowrap">
				<a id="btnProcurarNav" class="nav-link" href="#">Procurar</a>
			</li>
		</ul>
	</nav>

	<div class="container-fluid">
		<div class="row">
			<main role="main" class="col-md-12 ml-sm-auto pt-3 px-4">
				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
					<h1 class="h2">Resultados de busca para a palavra <i><span id="spanPalavra"></span></i></h1>
				</div>

				<!-- Parte 1 - Nuvem de Palavras -->
				<h2>Nuvem de Palavras</h2>
				<div id="divNuvem"></div>
				
				<!-- Parte 2 - Gráfico -->
				<h2 class="mt-2">Gráfico de ocorrências</h2>
				<canvas class="my-4" id="cnvGrafico" width="900" height="380"></canvas>
				
				<!-- Parte 3 - Grafo -->
				<!-- <h2>Grafo</h2>
				<div id="divGrafo"></div> -->

				<!-- Parte 4 - Tabela -->				
				<h2>Tabela de ocorrências</h2>
				<div class="table-responsive">
					<table 	id="tblOcorrencias" 
							class="table table-striped table-sm"
							data-toggle="tblOcorrencias"
							data-height="460"
							data-pagination="true"
							data-search="true"
							data-show-export="true"
							data-sort-name="id"
               				data-sort-order="asc">
						<thead>
							<tr>
								<th data-sortable="true" data-field="id">#</th>
                				<th data-sortable="true" data-field="palavra">Palavra</th>
                				<th data-sortable="true" data-field="ocorrencias">Ocorrências</th>
							</tr>
						</thead>
					</table>
				</div>
			</main>
		</div>
	</div>
</div>