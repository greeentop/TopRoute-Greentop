angular.module("TopRoute").factory("roteirizadorAPI", function ($http, config,toastr,$location,$localStorage) {
   

	var _getRoteirizacaoFiliais = function (cod_filias) {
		return $http.get(config.baseUrl + "/api/listar/roteirizacao/"+ cod_filias)
		// try {
		// 		// .then(function (response, status) {
		// 		// 	// console.log(status)

		// 		// 	// if(response.status ==200){
		// 		// 	// 	return response
		// 		// 	// }
		// 		// }).catch(function (error) {
        //         //     if (error.status == 400) {
		// 		// 		$localStorage.LoggeIn       =   false ; 
		// 		// 		$localStorage.UsuarioLogado =   {};
		// 		// 		$location.path('/login');getRoteirizacaoFiliais
        //         //         toastr.error(error.data.error + ' tente novamente', 'Aviso');
        //         //     }
        //         // });
			
		// } catch (error) {
		// 	return 	error	
		// }
		
	};

	var _getDocsRouter   = function( dataInicio, dataFinal){
		return $http.get(config.baseUrl+ "/api/documentosRoteirizados/"+   dataInicio +'/'+ dataFinal );
	}


	var _getDonwloadRemotesimplified   = function(dataInicio, dataFinal){
		return $http.get(config.baseUrl_TR_IRBR + "/download-simplified-period/"+   dataFinal  +"/" +  dataInicio  );
	}


	var _getDashboardManager_ungroup   =  function(dataInicio, dataFinal,COD_FILIAIS){
		return $http.get(config.baseUrl + "/api/listar/dashboard-manager-ungroup/"+   dataFinal  +"/" +  dataInicio +'/' + COD_FILIAIS  );
	};

	var _getDashboardManager_agroup   =  function(dataInicio, dataFinal){
		return $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/"+   dataFinal  +"/" +  dataInicio  );
	};

	
	var _getDashboardManager   =  function(dataInicio, dataFinal,COD_FILIAIS , principal ){

		return $http.get(config.baseUrl + "/api/listar/dashboard-manager-ungroup/" + dataFinal + "/" + dataInicio + '/' + COD_FILIAIS + '/' + principal);
	};

    var _getRoteirizacao = function () {
		return $http.get(config.baseUrl + "/api/listar/roteirizacao");
	};
	
	var _getRoteirizacaoId = function (id) {
		return $http.get(config.baseUrl + "/api/detalhes/roteirizacao/"+id);
	};

	var _getDashBoard = function (id) {
		return $http.get(config.baseUrl + "/api/detalhes/dashboard/"+id);
	};
	

	var _getRoteirizacaoItens = function (id) {
		return $http.get(config.baseUrl + "/api/detalhes/roteirizacaoItens/" + id);
	};

	var _getListarVeiculos  =  function(id){
		return $http.get(config.baseUrl +"/api/listar/veiculos/" +id);
	};

	var _getDetalhesVeiculo  =  function(id,veiculo){
		return $http.get(config.baseUrl +"/api/detalhes/veiculo/" +id+ "/"+veiculo);
	};

	var _getRotasDistribuicao  =  function(id,veiculo){
		return $http.get(config.baseUrl + "/api/listar/rotasdistribuicao/" +id);
	};

	var _saveContato = function (serv) {
		return $http.post(config.baseUrl + "/serv", serv);
	};

	var _putServicos  =  function(servicos){

		return  $http.put(config.baseUrl+"/api/servicos").
		success(function(data, status, headers) {
			// this callback will be called asynchronously
			// when the response is available
			console.log(data);
		  }).
		  error(function(data, status, headers) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		  });


	}

	var  _saveRoteirizacaoItens =  function(itens){
		var parameter = JSON.stringify({type:"user", username:user_email, password:user_password});
		return  $http.post(config.baseUrl, parameter).
		success(function(data, status, headers) {
			// this callback will be called asynchronously
			// when the response is available
			console.log(data);
			console.log(status);
		  }).
		  error(function(data, status, headers) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		  });
		 
	}

	var _getRetornoRouteasy  =  function(cod_roteirizacao){
		return $http.get(config.baseUrl+ '/api/listar/integracaoLogs/' +cod_roteirizacao )
	}

	return {
		getRoteirizacao			: _getRoteirizacao,
		getRoteirizacaoItens	: _getRoteirizacaoItens,
		getDashBoard			: _getDashBoard,
		listarVeiculos			: _getListarVeiculos,
		detalhesVeiculo			: _getDetalhesVeiculo,
		salvarRoteirizacaoItens : _saveRoteirizacaoItens,
		putServicos				: _putServicos,
		saveContato				: _saveContato,
		getRotasDistribuicao 	: _getRotasDistribuicao,
		getRetornoRouteasy		: _getRetornoRouteasy,
		getRoteirizacaoFiliais	: _getRoteirizacaoFiliais,
		getDashboardManager		: _getDashboardManager,
		getDashboardManager_ungroup	: _getDashboardManager_ungroup,
		getDashboardManager_agroup	: _getDashboardManager_agroup,
		getDonwloadRemotesimplified: _getDonwloadRemotesimplified,
		getDocsRouter: _getDocsRouter
		
	};
});