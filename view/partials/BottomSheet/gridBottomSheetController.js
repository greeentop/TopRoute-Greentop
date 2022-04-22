angular.module("TopRoute")
    .controller('GridBottomSheetCtrl', function($scope, $http, $mdBottomSheet, $rootScope, usuarioLogado, $mdToast, $localStorage, $filter, config) {

        $scope.item = {};
        $scope.itens = [];
        $scope.filial
        $scope.company

        console.log(usuarioLogado.FILIAIS_USUARIO)

        usuarioLogado.FILIAIS_USUARIO.forEach(function(item) {
            $scope.item = {
                name: item.SIGLA_FILIAIS,
                nameDescricao: item.NM_FILIAIS,
                COD_FILIAIS: item.COD_FILIAIS,
                IDENT_FILIAIS: item.IDENT_FILIAIS,
                icon: 'filial'
            }

            $scope.itens.push($scope.item)

        });



        // $scope.items = [
        //   { name: 'Hangout', icon: 'hangout' },
        //   { name: 'Mail', icon: 'mail' },
        //   { name: 'Message', icon: 'message' },
        //   { name: 'Copy', icon: 'copy2' },
        //   { name: 'Facebook', icon: 'facebook' },
        //   { name: 'Twitter', icon: 'twitter' },
        // ];



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
                            item.canvas = [0, 0]
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