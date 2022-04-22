
angular.module("TopRoute")
	.config(function ($routeProvider,$httpProvider ) {

		$routeProvider.when('/login', {
			templateUrl: 'view/login/login.html',
			controller: 'loginController',
			resolve: {
				'check': function ($location, $rootScope, $localStorage) {
					if (!$localStorage.LoggeIn) {
						$location.path('/login')
					} else {
						$location.path('/Dashboard')
					}
				}
			}
		}).when("/teste", {
			templateUrl: "view/teste/teste.html",
			controller: "testeController"
		}).when("/Services/:id", {
			templateUrl: "view/principal/principal.html",
			controller: "principalController",
			resolve: {


				roteirizacaoItens: function (roteirizadorAPI, $route, $localStorage, $location) {
					if (!$localStorage.LoggeIn) {
						$location.path('/login')
					} else {
						return roteirizadorAPI.getRoteirizacaoItens($route.current.params.id);
					}


				},
				listarVeiculos: function (roteirizadorAPI, $route, $localStorage, $location) {
					if (!$localStorage.LoggeIn) {
						$location.path('/login')
					} else {
						return roteirizadorAPI.listarVeiculos($route.current.params.id);
					}

				},
				listaRotasDistribuicao: function (roteirizadorAPI, $route, $localStorage, $location) {
					if (!$localStorage.LoggeIn) {
						$location.path('/login')
					} else {
						var u = $localStorage.UsuarioLogado
						return roteirizadorAPI.getRotasDistribuicao(u.FilialSetada.COD_FILIAIS);
					}

				},
				retRouteasy: function (roteirizadorAPI, $route, $localStorage, $location) {
					if (!$localStorage.LoggeIn) {
						$location.path('/login')
					} else {
						return roteirizadorAPI.getRetornoRouteasy($route.current.params.id);
					}
				},
				roteirizacoes: function (roteirizadorAPI, $localStorage, $location) {
					if (!$localStorage.LoggeIn) {
						$location.path('/login')
					} else {
						return roteirizadorAPI.getRoteirizacao();
					}
				}
			}
		}).when("/Dashboard", {
			templateUrl: "view/dashboard/dashboard.html",
			controller: "dashboardControler",
			resolve: {
				
				roteirizacoes: function (roteirizadorAPI, $rootScope, $localStorage, $location) {

					if (!$localStorage.LoggeIn) {
						$location.path('/login')
					}else{
						var u = $localStorage.UsuarioLogado

						var day  		= new Date()
						var dataInicio  =    moment(day).format('YYYYMMDD')
						var dataFinal  	=    moment(day).subtract(31, 'days').format('YYYYMMDD')
	
						return  roteirizadorAPI.getDashboardManager(dataInicio, dataFinal,u.FilialSetada.COD_FILIAIS , 1)
					}
				}

				//,
				// roteirizacoes: function (roteirizadorAPI, $rootScope, $localStorage, $location) {
				// 	// return roteirizadorAPI.getRoteirizacao();

				// 	if (!$localStorage.LoggeIn) {
				// 		$location.path('/login')
				// 	} else {
				// 		var u = $localStorage.UsuarioLogado

				// 		return roteirizadorAPI.getRoteirizacaoFiliais(u.FilialSetada.COD_FILIAIS);
				// 	}
				// }

			}
		}).when("/Dashboard/Manager", {
			templateUrl: "view/dashboard-manager/dashboard-manager.html",
			controller: "dashboard-Manager-ctrl"
			,resolve: {
				list_dashboardManager: async function (roteirizadorAPI, $rootScope, $localStorage, $location) {
					if (!$localStorage.LoggeIn) {
						$location.path('/login')
					}else{
						var u = $localStorage.UsuarioLogado

						var day  		= 	new Date()
						// var dataInicio  =    moment(day).format('YYYYMMDD')
						// var dataFinal  	=    moment(day).subtract(40, 'days').format('YYYYMMDD')
						var dataInicio 	=	moment(moment(day).subtract(1, 'days')).format('YYYYMMDD')
						var dataFinal 	=	moment(moment(day).subtract(1, 'days')).format('YYYYMMDD')

						return  roteirizadorAPI.getDashboardManager_agroup(dataInicio, dataFinal)
					}
				},
				baixaRemota: function (roteirizadorAPI, $rootScope, $localStorage, $location) {

					if (!$localStorage.LoggeIn) {
						$location.path('/login')
					}else{
						var u = $localStorage.UsuarioLogado

						var day  		= new Date()
						var dataInicio  =    moment(day).format('YYYYMMDD')
						var dataFinal  	=    moment(day).subtract(1, 'days').format('YYYYMMDD')
	
						return  roteirizadorAPI.getDonwloadRemotesimplified(dataInicio, dataFinal,u.FilialSetada.COD_FILIAIS)
					}
				}
				,
				documentosRoteirizados: function (roteirizadorAPI, $rootScope, $localStorage, $location) {

					if (!$localStorage.LoggeIn) {
						$location.path('/login')
					}else{

						var u = $localStorage.UsuarioLogado

						var day  		= new Date()
						var dataInicio  =    moment(day).format('YYYYMMDD')
						var dataFinal  	=    moment(day).subtract(1, 'days').format('YYYYMMDD')
	
						return  roteirizadorAPI.getDocsRouter(dataFinal,dataInicio)
					}
				}



			}
		}).when("/roteirizacaoItens/:id", {
			templateUrl: "view/outros/roteirizacaoItens.html",
			controller: "roteirizacaoItensController",
			resolve: {
				roteirizacaoItens: function (roteirizadorAPI, $route) {
					return roteirizadorAPI.getRoteirizacaoItens($route.current.params.id);
				},
				listarVeiculos: function (roteirizadorAPI, $route) {
					return roteirizadorAPI.listarVeiculos($route.current.params.id);
				},
				listaRotasDistribuicao: function (roteirizadorAPI, $route) {
					return roteirizadorAPI.getRotasDistribuicao($route.current.params.id);
				}

			}
		}).when("/MapaVeiculo/:id/:veiculo", {
			url: '/contact',
			templateUrl: "view/MAP.html",
			controller: "mapaCtrl",
			resolve: {
				detalheItensVeiculo: function (roteirizadorAPI, $route) {
					return roteirizadorAPI.getDetalhesItensVeiculo($route.current.params.id, $route.current.params.veiculo);
				}

			}
		}).when("/mapa/:id/:veiculo", {
			templateUrl: "view/googlemaps.html",
			controller: "mapaCtrl"
		}).when("/home", {
			templateUrl: "view/ordenacao.html",
			controller: "BasicListCtrl"

		}).when("/error", {
			templateUrl: "view/error.html"
		}).when("/novoGrid", {
			templateUrl: "view/novogrid.html",
			controller: "novoGridCtrl"
		});

		$routeProvider.otherwise({ redirectTo: "/login" });

	})

.config(function($mdIconProvider) {
    $mdIconProvider
    //   .icon('share', 'img/icons/baseline-share-24px.svg', 24)
    //   .icon('upload', 'img/icons/upload.svg', 24)
    //   .icon('copy', 'img/icons/copy.svg', 24)
    //   .icon('print', 'img/icons/print.svg', 24)
      .icon('hangout'	, 'img/ico/hangout.svg', 24)
	   .icon('filial'	, 'img/ico/filial.svg', 48)
	   .icon('refrash'	, 'img/ico/refrashfilial.svg', 24)
	   .icon('dashManager', 'img/ico/dashmanager.png')
    //   .icon('message', 'img/icons/message.svg', 24)
    //   .icon('copy2', 'img/icons/copy2.svg', 24)
    //   .icon('facebook', 'img/icons/facebook.svg', 24)
    //   .icon('twitter', 'img/icons/twitter.svg', 24);
})
function Interceptor($httpProvider) {
	$httpProvider.interceptors.push('Interceptor');
}





