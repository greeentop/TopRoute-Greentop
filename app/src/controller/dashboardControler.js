angular.module("TopRoute")
    .controller("dashboardControler",
        function($scope, $rootScope, roteirizacoes, $filter, $window, $location, $http, $timeout, config, $localStorage, $mdDialog) {
            // socketio

            // console.log(routers)



            // // socket.on('chat.message', data => {
            // // 	console.log('[SOCKET] chat.message => ' , data)
            // // 	io.emit('chat.message',data)
            // // })

            // // socket.on('disconect', () => {
            // // 	console.log('[SOCKET]  disconnect => a was disconneted')
            // // })
            // var  socket  = io('http://localhost:8000')
            // socket.on('connect', () => console.log('[OI] connect => a new connect'))



            // socket.emit('chat.message',{
            // 	id:1,
            // 	message:'paulo Roberto Chagas Fantin'
            // })

            // $scope.socketIO  = {
            // 	id:2,
            // 	message:'Thalita'
            // } 

            // socket.on('chat.message', (data) => {
            // 	$scope.socketIO  = data;
            // 	console.log('[SOCKET] chat.message vindo do back end =>', data )
            // 	 $scope.$apply();
            //   });




            // $location.search({});



            $rootScope.user = $localStorage.UsuarioLogado
            $rootScope.login = $localStorage.LoggeIn;


            // // intercept the route change event
            // $scope.$on('$routeChangeStart', function (angularEvent, newUrl) {

            // 	// check if the custom property exist
            // 	if (newUrl.requireAuth && !session.user) {

            // 		// user isn’t authenticated
            // 		$location.path("/login");
            // 	}
            // });

            //$filter('upper')("Lista Roteirizacao")

            $scope.testeScopeCompartilhado = "App teste paulo ";
            $scope.loading = true;
            $scope.app = "Lista Roteirizacao";


            $localStorage.UsuarioLogado.FilialSetada.roteirizacoes = roteirizacoes.data
            $rootScope.roteirizacoes = $localStorage.UsuarioLogado.FilialSetada.roteirizacoes;


            // debugger
            // console.log($rootScope.roteirizacoes)	

            $scope.labels = ["Roteasy", "Operador", "Manual"];
            $scope.colors = ["#006400", "#e6570f", "#acaaaa"];

            // $scope.data = [  parseInt( $rootScope.roteirizacoes.PERCENT_SERVICOS_AGREGADOS), parseInt(  $rootScope.roteirizacoes.PERCENT_SERVICOS_PROPRIOS)];
            // $scope.data = [70, 30];
            // $scope.colors = ["#004d40", "#1c355d","#d32f2f"];

            // $scope.colors = ["#287e60", "#2e453d","#ff0000"];






            $localStorage.UsuarioLogado.FilialSetada.roteirizacoes.forEach(function(item) {
                item.canvas = [0, 0]
            })



            $localStorage.UsuarioLogado.FilialSetada.roteirizacoes.forEach(function(value, key) {

                value.QTD_ROUTEASY = value.QTD_ROUTEASY + value.QTD_OPERADOR
                value.QTD_OPERADOR = 0
                var routeasyPercent = ((value.QTD_ROUTEASY + value.QTD_OPERADOR) / value.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);

                var manualPercent = (value.QTD_MANUAL / value.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);


                value.canvas[0] = routeasyPercent.toFixed(2)
                value.canvas[2] = manualPercent.toFixed(2)

            });


            angular.forEach($rootScope.roteirizacoes, function(value, key) {

                value.QTD_ROUTEASY = value.QTD_ROUTEASY + value.QTD_OPERADOR
                value.QTD_OPERADOR = 0
                var routeasyPercent = ((value.QTD_ROUTEASY + value.QTD_OPERADOR) / value.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);
                var manualPercent = (value.QTD_MANUAL / value.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);


                value.canvas[0] = routeasyPercent.toFixed(2)
                value.canvas[2] = manualPercent.toFixed(2)

                $scope.loading = false;

            });


            $scope.EnviarOTM = function(cod) {
                angular.forEach($rootScope.roteirizacoes, function(value, key) {
                    if (value.COD_ROTEIRIZACAO == cod) {
                        value.OTM = false;
                        $http.put(config.baseUrl + "/api/enviarOTM", value).then(successCallback, function errorCallback() {});
                    }
                });
            }

            function successCallback(result) {

                $scope.teste = result.data

                // console.log('Ordem enviada com sucesso para o OTM'  + result.data);
            }






            var generateSerial = function(roteirizacoes) {
                roteirizacoes.forEach(function(item) {
                    item.serial = serialGenerator.generate();
                });
            };

            $scope.verificarContatoSelecionado = function(roteirizacoes) {
                $scope.hasContatoSelecionado = roteirizacoes.some(function(roteirizacao) {
                    return roteirizacao.selecionado;
                });
            };

            $scope.ordenarPor = function(campo) {
                $scope.criterioDeOrdenacao = campo;
                $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
            };

            $scope.reset = function() {
                $rootScope.roteirizacoes = angular.copy($rootScope.roteirizacoes);
            };

            $scope.alerta = function(campo) {
                $window.alert(campo);
            };

            $scope.filterSearch = function(campo) {
                $window.alert(campo);
            };

            $scope.openRtng = function(id) {
                $localStorage.UsuarioLogado.FilialSetada.ROTEIRIZACAO_SELECIONADA = { CODIGO_ROTEIRIZACAO: id }
                $location.path('/Services/' + id);
            };







            $scope.$watch("login", function(newValue, oldValue) {

                if (newValue == false) {
                    $localStorage.LoggeIn = $rootScope.login;
                    $localStorage.UsuarioLogado = {};
                    $location.path('/login');
                }

            });




            //#region  commentado




            // $scope.load = function() {
            // 		$http.get(config.baseUrl + "/api/detalhes/roteirizacao/37411").then(successCallback, function errorCallback() { });
            // 		//$scope.teste =  data.data
            // 		if ($scope.teste!=undefined){
            // 			angular.forEach($rootScope.roteirizacoes, function (value, key) {
            // 				if(value.CODIGO_ROTEIRIZACAO==$scope.teste.CODIGO_ROTEIRIZACAO){
            // 					value.QTD_ENTREGAS_ENVIO = $scope.teste.QTD_ENTREGAS_ENVIO
            // 					value.QTD_COLETAS_ENVIO = $scope.teste.QTD_COLETAS_ENVIO
            // 					//value.OTM =false;
            // 				}
            // 			});
            // 			console.log($scope.teste);
            // 		}
            // 		$timeout($scope.load, 5000);
            // };

            //$scope.load();







            // var Slideout = window.Slideout;
            // var slideout = new Slideout({
            // 	'panel': document.getElementById('panel'),
            // 	'menu': document.getElementById('menu'),
            // 	'padding': 256,
            // 	'tolerance': 70
            // });

            // slideout.open();
            // document.getElementById('panel').classList.add('hidden');
            // document.querySelector('.logo').addEventListener('click', function () {
            // 	slideout.toggle();
            // });

            // document.querySelector('.toggle-button').addEventListener('click', function () {
            // 	slideout.toggle();
            // });

            // slideout.on('open', function () {
            // 	document.querySelector('.fa-chevron-down').classList.remove('hidden');
            // 	document.querySelector('.minimizeIcon').classList.remove('fa-chevron-right');
            // 	document.querySelector('.minimizeIcon').classList.add('fa-chevron-left');
            // 	document.querySelector('.minimizeIcon').classList.remove('rotate');
            // });

            // slideout.on('close', function () {
            // 	document.querySelector('.fa-chevron-down').classList.add('hidden');
            // 	document.querySelector('.minimizeIcon').classList.remove('fa-chevron-left');
            // 	document.querySelector('.minimizeIcon').classList.add('fa-chevron-right');
            // 	document.querySelector('.minimizeIcon').classList.add('rotate');
            // });



            //#endregion


        })