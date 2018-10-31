<div id="modalStatus" class="modal" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Status</h5>
				<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button> -->
			</div>
			<div class="modal-body">
				<p id="textoStatus">Sua busca está sendo processada...</p>
				<div class="progress">
					<div id="statusProgress" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
				</div>
				<table class="table table-sm table-striped my-2">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Descrição</th>
							<th scope="col" class="text-center">Status</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">1</th>
							<td>Busca da palavra primária</td>						
							<td class="text-center"><span id="statusPasso1" class="badge badge-pill badge-success pull-right">Sucesso!</span></td>
						</tr>
						<tr>
							<th scope="row">2</th>
							<td>Busca das palavras relacionadas</td>
							<td class="text-center"><span id="statusPasso2" class="badge badge-pill badge-primary pull-right">Executando...</span></td>
						</tr>
						<tr>
							<th scope="row">3</th>
							<td>Interpretação dos dados e geração dos resultados</td>
							<td class="text-center"><span id="statusPasso3" class="badge badge-pill badge-secondary pull-right">Na fila</span></td>
						</tr>
						<tr>
							<th scope="row">4</th>
							<td>Exibição dos resultados</td>
							<td class="text-center"><span id="statusPasso4" class="badge badge-pill badge-secondary pull-right">Na fila</span></td>
						</tr>
					</tbody>
				</table>
				<small>Por favor, aguarde até o final do processo para verificar os resultados.</small>
			</div>
			<!-- <div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary">Save changes</button>
			</div> -->
		</div>
	</div>
</div>