angular.module("TopRoute")
    .controller('trocaVeiculoController', function(
        $scope, $http, $mdBottomSheet, $rootScope, usuarioLogado, listaVeiculos, veiculoSelecionado, $mdToast, $localStorage, $filter, config) {

        $scope.listaVeiculos_local = []


        $scope.item = {};
        $scope.itens = [];
        $scope.filial;
        $scope.filialveiculoSelecionadoParaTroca;
        $scope.company

        // console.log(usuarioLogado.FILIAIS_USUARIO)

        // usuarioLogado.FILIAIS_USUARIO.forEach(function (item) {
        //   $scope.item = {
        //     name: item.SIGLA_FILIAIS,
        //     nameDescricao: item.NM_FILIAIS,
        //     COD_FILIAIS: item.COD_FILIAIS,
        //     IDENT_FILIAIS: item.IDENT_FILIAIS,
        //     icon: 'filial'
        //   }

        //   $scope.itens.push($scope.item)

        // });

        $scope.veiculoSelecionado = veiculoSelecionado

        console.log($scope.veiculoSelecionado)

        listaVeiculos.forEach(function(item) {

            $scope.item = {
                MODELO: item.MODELO,
                DESCRICAO: item.DS_VEICULOS,
                CAPACIDADE: item.CAPACIDADE,
                OCUPACAO: item.OCUPACAO,
                NR_PLACA: item.NR_PLACA,
                COD_VEICULOS: item.COD_VEICULOS,
                IDENT_VEICULOS: item.IDENT_VEICULOS,
                PESO_REAL_Total: 0,
                servicos: item.servicos,

                icon: 'veiculo'
            }



            $scope.itens.push($scope.item)
        });





        $scope.veiculoEscolhidoTroca = async function(veiculo) {

            var reg = $filter("filter")($scope.itens, { COD_VEICULOS: parseInt(veiculo) }, true)[0];

            if (reg)
                $scope.veiculoSelecionadoParaTroca = reg

        }

        $scope.fechaTrocaVeiculo = function() {
            $mdBottomSheet.hide('fecharTrocaVeiculo');
        }
        $scope.enviaDocumentos = async function() {

            if (!$scope.veiculoSelecionadoParaTroca) {

                swal("Selecione um veiculo para efetuar a troca de veiculo!", {
                    icon: "warning",
                })
            } else {

                $scope.veiculoSelecionado.servicos.forEach(function(item) {
                    $scope.veiculoSelecionadoParaTroca.PESO_REAL_Total = parseFloat($scope.veiculoSelecionadoParaTroca.PESO_REAL_Total) + parseFloat(item.PESO)


                    $scope.veiculoSelecionadoParaTroca.OCUPACAO = Math.round(($scope.veiculoSelecionadoParaTroca.PESO_REAL_Total / $scope.veiculoSelecionadoParaTroca.CAPACIDADE) * 100)


                    $scope.veiculoSelecionadoParaTroca.servicos.push(item)
                })

            }
        }


        function trocaVeiculos(veiculoOrgigem, veiculoDestino) {

            veiculoDestino.servicos.forEach(function(item) {
                item.COD_VEICULOS = veiculoDestino.COD_VEICULOS
            })


            $http.put(config.baseUrl + "/api/servicos", veiculoDestino.servicos)
                .then(
                    function sucesso(response) {
                        console.log(response)
                            // var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: veiculoDestino.veiculo }, true);

                        // if (reg) {
                        //     var idx = $scope.lstVeiculos.indexOf(reg[0])
                        // }

                        // var vei = $scope.lstVeiculos[idx];

                        // swal('Veículo: placa ' + vei.NR_PLACA + '\n | Ident ' + vei.IDENT_VEICULOS, "Serviço(s) inserido do veículo com sucesso!", {
                        //     icon: "success",
                        // })
                    },
                    function errorCallback(error) {
                        swal("Ops!", "ops algum erro ocorreu no metodo (trocaVeiculos) no endopoint: '/api/servicos' , acionar suporte lado Solistica (Greentop)!", "error");
                    }
                )


            $http.put(config.baseUrl + "/api/servicos/del", veiculoOrgigem.servicos)
                .then(
                    function sucesso(response) {
                        console.log(response)
                    },
                    function errorCallback(error) {
                        swal("Ops!", "ops algum erro ocorreu no metodo (trocaVeiculos) no endopoint: '/api/servicos/del' , acionar suporte lado Solistica (Greentop)!", "error");

                    }
                )

            carregarVeiculos()


        }


        $scope.salvarTrocaVeiculo = async function() {


            if (!$scope.veiculoSelecionadoParaTroca) {

                swal("Selecione um veiculo para efetuar a troca de veiculo!", {
                    icon: "warning",
                })
            } else {


                if ($scope.veiculoSelecionado.servicos.length == 0) {
                    swal("Veiculo que deseja trocar esta vázio!", {
                        icon: "warning",
                    })
                } else {


                    swal("TROCA DE ORDENS VEÍCULO \n" +
                            "ORIGEM : " + $scope.veiculoSelecionado.IDENT_VEICULOS + "\n" +
                            "DESTINO :" + $scope.veiculoSelecionadoParaTroca.IDENT_VEICULOS, {

                                buttons: {
                                    descarregaTroca: {
                                        text: "Subtitui serviços  do veiculo destino (descarrega)!",
                                        value: "descarregaTroca",
                                    },
                                    trocaManten: {
                                        text: "Somar serviços ao veiculo destino!",
                                        value: "trocaManten",
                                    },
                                    // defeat: true,
                                    cancel: "Cancelar",
                                },
                            })
                        .then((value) => {
                            switch (value) {
                                // case "defeat":
                                //   swal("Pikachu fainted! You gained 500 XP!");
                                //   break;
                                case "descarregaTroca":
                                    // swal("descarregar primeiro!", "troca feita!", "success");

                                    //Esvazia o veiculo selecionado para mandar para o outro veiculo (troca)
                                    $http.put(config.baseUrl + "/api/servicos/del", $scope.veiculoSelecionado.servicos)
                                        .then(
                                            function sucesso(response) {
                                                // atualizar serviços do veiculo selecionado trocando para o novo selecionado
                                                $scope.veiculoSelecionado.servicos.forEach(function(item) {
                                                    item.COD_VEICULOS = $scope.veiculoSelecionadoParaTroca.COD_VEICULOS
                                                })

                                                $http.put(config.baseUrl + "/api/servicos/del", $scope.veiculoSelecionadoParaTroca.servicos)
                                                    .then(
                                                        function sucesso(response) {
                                                            console.log('Descarregando o veiculo primeiro para depois carregar com, assim nao soma')
                                                        },
                                                        function errorCallback(error) {
                                                            swal("Ops!", "ops algum erro ocorreu no metodo (trocaVeiculos) no endopoint: '/api/servicos/del  case (descarregaTroca)' , acionar suporte lado Solistica (Greentop)!", "error");
                                                        }
                                                    )

                                                $http.put(config.baseUrl + "/api/servicos", $scope.veiculoSelecionado.servicos)
                                                    .then(
                                                        function sucesso(response) {
                                                            console.log(response)
                                                        },
                                                        function errorCallback(error) {
                                                            swal("Ops!", "ops algum erro ocorreu no metodo (trocaVeiculos) no endopoint: '/api/servicos' , acionar suporte lado Solistica (Greentop)!", "error");
                                                        }
                                                    )
                                            },
                                            function errorCallback(error) {
                                                swal("Ops!", "ops algum erro ocorreu no metodo (trocaVeiculos) no endopoint: '/api/servicos/del' , acionar suporte lado Solistica (Greentop)!", "error");

                                            }
                                        )


                                    var msg = $mdToast.show(
                                        $mdToast.simple()
                                        .textContent('Troca realziada!')
                                        .position('top right')
                                        .hideDelay(1500)
                                    );

                                    $mdBottomSheet.hide(msg);

                                    swal("Troca de veículo!", "Realizada!", "success");


                                    break;
                                case "trocaManten":

                                    // default:
                                    //   swal("Got away safely!"); //Esvazia o veiculo selecionado para mandar para o outro veiculo (troca)
                                    $http.put(config.baseUrl + "/api/servicos/del", $scope.veiculoSelecionado.servicos)
                                        .then(
                                            function sucesso(response) {
                                                // atualizar serviços do veiculo selecionado trocando para o novo selecionado
                                                $scope.veiculoSelecionado.servicos.forEach(function(item) {
                                                    item.COD_VEICULOS = $scope.veiculoSelecionadoParaTroca.COD_VEICULOS
                                                })

                                                $http.put(config.baseUrl + "/api/servicos", $scope.veiculoSelecionado.servicos)
                                                    .then(
                                                        function sucesso(response) {
                                                            console.log(response)
                                                        },
                                                        function errorCallback(error) {
                                                            swal("Ops!", "ops algum erro ocorreu no metodo (trocaVeiculos) no endopoint: '/api/servicos' , acionar suporte lado Solistica (Greentop)!", "error");
                                                        }
                                                    )
                                            },
                                            function errorCallback(error) {
                                                swal("Ops!", "ops algum erro ocorreu no metodo (trocaVeiculos) no endopoint: '/api/servicos/del' case (trocaManten)  , acionar suporte lado Solistica (Greentop)!", "error");

                                            }
                                        )


                                    var msg = $mdToast.show(
                                        $mdToast.simple()
                                        .textContent('Troca realziada!')
                                        .position('top right')
                                        .hideDelay(1500)
                                    );

                                    $mdBottomSheet.hide(msg);
                                    swal("Troca de veículo!", "Realizada!", "success");

                            }
                        });



                    // swal({
                    //   title: "Deseja limpar a caixa de rota: ",
                    //   text: "Ao confirmar serão descarregados  serviços para o grid principal",
                    //   icon: "warning",
                    //   buttons: true,
                    //   dangerMode: true,
                    // })
                    //   .then((willDelete) => {
                    //     if (willDelete) {


                    //       var msg = $mdToast.show(
                    //         $mdToast.simple()
                    //           .textContent('Troca realziada!')
                    //           .position('top right')
                    //           .hideDelay(1500)
                    //       );

                    //       $rootScope.Veiculotrocado = $scope.veiculoSelecionadoParaTroca

                    //       $mdBottomSheet.hide(msg);

                    //       // $itemScope.r.services.forEach(function (item) {

                    //       //     var reg = $filter("filter")($scope.all, { NR_DOCUMENTO_FORMATADO: item.NR_DOCUMENTO_FORMATADO }, true)[0]

                    //       //     if (reg) {
                    //       //         reg.COD_VEICULOS    = 0
                    //       //         reg.IDENT_VEICULOS  = ""
                    //       //         reg.ORDEM_ENTREGA   = ""
                    //       //         reg.ROTA_DOC_REAL   = -9999         // para limpar a caixa mandando todos os itens para o grid principal
                    //       //         reg.FL_CONFERIDO    = false

                    //       //         // start to versão 1.7.6 do versao 1.7.8
                    //       //         item.COD_VEICULOS   = 0     
                    //       //         item.IDENT_VEICULOS = ""    
                    //       //         item.ORDEM_ENTREGA  = ""    
                    //       //         item.ROTA_DOC_REAL  = -9999    
                    //       //         item.FL_CONFERIDO   = false 
                    //       //         // start do versão 1.7.6 do versao 1.7.8

                    //       //     }

                    //       // })


                    //       // updateServicosVeiculoMouseOption($itemScope.r.services, 'voltaGridPrincipal');

                    //       // $itemScope.r.services = [];

                    //     }
                    //   });


                }
            }




        }
        $scope.selecionarFilial_ungroup = async function() {

            var day = new Date()
            var dataInicio = moment(day).format('YYYYMMDD')
            var dataFinal = moment(day).subtract(31, 'days').format('YYYYMMDD')

            const response = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-ungroup/" + dataFinal + "/" + dataInicio + '/' + $scope.company.COD_FILIAIS + "/" + 1)

            if (response.data)
                $rootScope.roteirizacoes = response.data

            if ($rootScope.roteirizacoes.length == 0) {

                var msg = $mdToast.show(
                    $mdToast.simple()
                    .textContent(' Filial sem roteirização!')
                    .position('left top right')
                    // .theme('success-toast')
                    .toastClass('md-toast-error')
                    // .highlightClass('md-accent')
                    .hideDelay(1500)
                );
            } else {

                // console.log($localStorage.UsuarioLogado.FilialSetada )
                $localStorage.UsuarioLogado.FilialSetada = {}
                $localStorage.UsuarioLogado.FilialSetada = $scope.company


                $localStorage.UsuarioLogado.FilialSetada.roteirizacoes = response.data


                $localStorage.UsuarioLogado.FilialSetada.roteirizacoes.forEach(function(item) {
                    item.canvas = [0, 0]
                })

                $localStorage.UsuarioLogado.FilialSetada.roteirizacoes.forEach(function(value, key) {


                    var routeasyPercent = (value.QTD_ROUTEASY / value.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);
                    // var topRoutePercent = (value.QTD_OPERADOR / value.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);
                    var manualPercent = (value.QTD_MANUAL / value.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);

                    value.canvas[0] = routeasyPercent.toFixed(2)
                        // value.canvas[1] = topRoutePercent.toFixed(2)
                    value.canvas[2] = manualPercent.toFixed(2)

                });

                // console.log($localStorage.UsuarioLogado.FilialSetada )

                var msg = $mdToast.show(
                    $mdToast.simple()
                    .textContent($scope.company.COD_FILIAIS + ' selecionado!')
                    .position('top right')
                    .hideDelay(1500)
                );

                $mdBottomSheet.hide(msg);
            }

        }






        $scope.selecionarFilial = function(item) {
            $http.get(config.baseUrl + "/api/listar/roteirizacao/" + $scope.company.COD_FILIAIS)
                .then(function(response) {

                    $rootScope.roteirizacoes = response.data

                    if ($rootScope.roteirizacoes.length == 0) {

                        var msg = $mdToast.show(
                            $mdToast.simple()
                            .textContent(' Filial sem roteirização!')
                            .position('left top right')
                            // .theme('success-toast')
                            .toastClass('md-toast-error')
                            // .highlightClass('md-accent')
                            .hideDelay(1500)
                        );
                    } else {

                        // console.log($localStorage.UsuarioLogado.FilialSetada )
                        $localStorage.UsuarioLogado.FilialSetada = {}
                        $localStorage.UsuarioLogado.FilialSetada = $scope.company


                        $localStorage.UsuarioLogado.FilialSetada.roteirizacoes = response.data


                        $localStorage.UsuarioLogado.FilialSetada.roteirizacoes.forEach(function(item) {
                            item.canvas = [0, 00]
                        })

                        $localStorage.UsuarioLogado.FilialSetada.roteirizacoes.forEach(function(value, key) {
                            var routeasyPercent = Math.round(value.QTD_SERVICOS_ROUTEASY / value.QTD_SERVICOS * 100);
                            var topRoutePercent = Math.round(value.QTD_SERVICOS_TOPROUTE / value.QTD_SERVICOS * 100);
                            var manualPercent = Math.round(value.QTD_SERVICOS_MANUAL / value.QTD_SERVICOS * 100);


                            value.canvas[0] = routeasyPercent
                            value.canvas[1] = topRoutePercent
                            value.canvas[2] = manualPercent

                            if (value.RETORNO_OTM.substr(0, 10) == 'Aguardando') {
                                value.OTM = false;
                            } else if (value.RETORNO_OTM.substr(13, 6) == 'Manual') {
                                value.OTM = 'Manual';
                            } else {
                                value.OTM = true;
                            }

                            value.PESO_VEICULOS_PROPRIOS = numeral(value.PESO_VEICULOS_PROPRIOS).format('0,0,0') + ' K'
                            value.PESO_VEICULOS_AGREGRADOS = numeral(value.PESO_VEICULOS_AGREGRADOS).format('0,0,0') + ' K'
                        });

                        // console.log($localStorage.UsuarioLogado.FilialSetada )

                        var msg = $mdToast.show(
                            $mdToast.simple()
                            .textContent($scope.company.COD_FILIAIS + ' selecionado!')
                            .position('top right')
                            .hideDelay(1500)
                        );

                        $mdBottomSheet.hide(msg);
                    }


                });

        };

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };



        $scope.$watch("filial", function(newValue, oldValue) {

            if (newValue != oldValue) {

                console.log($localStorage.UsuarioLogado)
                var reg = $filter("filter")($localStorage.UsuarioLogado.FILIAIS_USUARIO, { COD_FILIAIS: parseInt(newValue) }, true);
                $scope.company = reg[0]


            }

        });


    })