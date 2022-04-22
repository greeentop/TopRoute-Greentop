angular.module("TopRoute")
    .controller("adicionarVeiculosController",
        function ($scope, $window, $document, $routeParams
            , $filter, $location, $rootScope, $http, config
            , $route, $anchorScroll, $localStorage, $mdDialog, $mdSidenav) {

            $rootScope.UsuarioLogado = $localStorage.UsuarioLogado;


            $scope.dadosVeiculos = [];

            $scope.veiculoDigitado

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            $scope.findVeiculo = function (veiculo) {


                if (veiculo == undefined) {
                    swal("Ops!", "Veículo não encontrado!", "warning");
                    return
                }

                $http.get(config.baseUrl + "/api/getTopRouteVeiculo/" + veiculo)
                    .then(
                        function sucesso(response) {

                            var veiculo = response.data[0]


                            if (veiculo == undefined) {
                                swal("Ops!", "Veículo não encontrado!", "warning");
                                return
                            }

                            var reg = $filter("filter")($scope.dadosVeiculos, { COD_VEICULOS: veiculo.COD_VEICULOS }, true)[0]

                            if (reg == undefined) {

                                if (veiculo != undefined) {

                                    var veiIncluir = {
                                        COD_ROTEIRIZACAO: $rootScope.UsuarioLogado.FilialSetada.ROTEIRIZACAO_SELECIONADA.CODIGO_ROTEIRIZACAO,
                                        COD_VEICULOS: veiculo.IDENT_VEICULOS,
                                        IDENT_VEICULOS: veiculo.IDENT_VEICULOS
                                    }
                                    $scope.dadosVeiculos.push(veiIncluir)
                                    $scope.veiculoDigitado = "";
                                } else {
                                    swal("Ops!", "Veículo não encontrado!", "warning");
                                }
                            }


                        },
                        function errorCallback(error) {
                            if (error.data) {
                                swal("Ops!", "Erro ao localizar veiculo: " + error.data.ExceptionMessage + "(" + error.data.Message + ") !", "error");
                            } else {
                                swal("Ops!", "Ocorreiu algum erro, tente novamente!", "error");

                            }
                        }
                    )

                // }  


            }


            $scope.incluirVeiculo = function () {




                if ($scope.dadosVeiculos.length <= 0) {
                    swal("Alerta!", "Adicione ao menos um veículo para salvar!", "warning");
                    return
                }


                $http.post(config.baseUrl + "/api/AdicionarVeiculos", $scope.dadosVeiculos)
                    .then(
                        function sucesso(response) {

                            swal("Sucesso!", "Veículo incluido na roteirização!", "success")
                                .then((value) => {
                                    $scope.answer($rootScope.UsuarioLogado.FilialSetada.ROTEIRIZACAO_SELECIONADA.CODIGO_ROTEIRIZACAO)
                                });
                            // var veiculo = response.data[0]

                            // if (veiculo != undefined) {
                            //     $scope.dadosVeiculos.push(veiculo)
                            // } else {
                            //     swal("Ops!", "Veículo não encontrado!", "warning");
                            // }

                        },
                        function errorCallback(error) {
                            if (error.data) {
                                swal("Ops!", "Erro ao localizar veiculo: " + error.data.ExceptionMessage + "(" + error.data.Message + ") !", "error");
                            } else {
                                if(error.status =-1){
                                    swal("Ops!", "Ocorreu problema de CORS, tente novamente!", "error");
                                }else{
                                    swal("Ops!", "Ocorreu algum erro, tente novamente!", "error");
                                }
                            }

                            //swal("Ops!", "Erro ao salvar o veiculo: " + error.data.ExceptionMessage + "(" + error.data.Message + ") !", "error");
                        }
                    )


            }

        });