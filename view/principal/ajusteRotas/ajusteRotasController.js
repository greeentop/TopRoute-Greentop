
angular.module("TopRoute")
    .controller("ajusteRotasController",
        function ($scope, $mdDialog,$filter,$http, itens, veiculosRetorno,listarVeiculos,all ,ngAudio,toastr,config) {

            $scope.tabSelecioada = 0

            $scope.tabTeste  = function($event){
                
            }

            
            $scope.mouseTeste  =  function($event){
                console.log($event)
            }
            //#region  DECLARACOES


            
            // $scope.criterioDeOrdenacao      =  'ORDEM_ENTREGA'
            
            $scope.txtScanner               =  ''
            $scope.audioExisteEmVeiculo     = ngAudio.load("sons/plin.mp3");
            $scope.audioNaoAchou            = ngAudio.load("sons/erro.mp3");
            $scope.all                      =  all;
            $scope.veiculosRetorno          = veiculosRetorno;
            $scope.servicosRotaConferencia  = itens;



            console.log($scope.veiculosRetorno)

            var ultimo                          = undefined
            
            //#endregion

            //#region  SCOPES FUNCTIONS
            $scope.teste = function () {
                console.log('entrou no controller das caixas')
            }

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                
                // $mdDialog.hide(answer);
                $mdDialog.hide($scope.all);
                // console.log(itens)
            };

            $scope.mouseOvoer = function (event, index) {

                if (event.ctrlKey) {

                    var linha = $scope.all[index - 1]
                    var veiculo = linha.COD_VEICULOS
                    var Indent_veiculo = linha.IDENT_VEICULOS
                    var rotaReal = linha.ROTA_DOC_REAL

                    if (veiculo != null) {
                        if (rotaReal == null)
                            toastr.warning('Serviço já relacionado no veiculo  para manipular abra o veiculo:' + Indent_veiculo, 'Bloqueio');
                        else {
                            toastr.warning('Serviço dentro da caixa de rota:' + rotaReal, 'Bloqueio');
                        }
                    } else {

                        if (rotaReal) {
                            if (veiculo == null) {
                                toastr.warning('Serviço dentro da caixa de rota:' + rotaReal, 'Bloqueio');
                            }
                        } else {
                            if (event.ctrlKey) {
                                $scope.all[index - 1].selected = !$scope.all[index - 1].selected
                                $scope.rowsSelecteds = getAllSelectedRows()
                                $scope.peso = somaPeso()
                            }
                        }
                    }
                }
            }

            $scope.ordenarPor = function (campo) {

                $scope.criterioDeOrdenacao = campo;
                $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;

            };

            $scope.setClickedRowConferencia = function (index, event, objeto) {

                var element         = findElement('#' + objeto);
                var rows            = element.rows;
                var codDocumento    = rows[index +1].cells[17].innerHTML.trim();
                var COD_VEICULOS_   = rows[index +1].cells[18].innerHTML.trim();

                // var veiculoGrid = rows[index + 1].cells[0].innerHTML.trim();


                var veiculos = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(COD_VEICULOS_)  }, true);
                var idx  =  $scope.veiculosRetorno.indexOf(veiculos[0])

                if(idx >-1){
                    $scope.tabSelecioada =  idx
                }
                

                // if (COD_VEICULOS_) {
                //     if (parseInt(COD_VEICULOS_) > 0) {
                //         $scope.openLink_AJS('', COD_VEICULOS_)
                //     }
                // }

                $scope.servicosRotaConferencia.forEach(function (value) {

                    if (value.COD_DOCUMENTO == codDocumento.trim()) {
                        value.selected     = !value.selected;
                        atuallizaConferencia();
                        return;
                    }
                });

            }

            $scope.openLink_AJS = function (evt, animName) {
                
                var elementoLink         = findElement('#tablink-' + animName);
                // var elementoLink = angular.element(document.querySelector('#tablink-' + animName));//findElement("#divDocumentos");
                // var elementoLink =  angular.element(document.querySelectorAll('#tablink'));//findElement("#divDocumentos");


                //limpar a selecao atual
                var elementoLinkAll = angular.element(document.querySelectorAll('.tablink'));
                for (i = 0; i < elementoLinkAll.length; i++) {
                    elementoLinkAll[i].className = elementoLinkAll[i].className = 'w3-bar-item w3-button tablink ng-scope';//.replace(" w3-orange", "");
                }

                var elemento = angular.element(document.querySelector('#textField-' + animName));//findElement("#divDocumentos");


                if (ultimo != undefined) {
                    ultimo.removeClass('show')
                    ultimo.addClass('hide')
                }

                elemento.removeClass('hide')
                elemento.addClass('show')

                elementoLink[0].className += " w3-orange";


                if (evt != '') {
                    if (evt.currentTarget.id != '') {
                        evt.currentTarget.className += " w3-orange";
                    }
                }


                ultimo = elemento


            }


            $scope.onKeyUpTxtScannerConferencia = function ($event) {

                
                // // var radioTrocaRota = findElement("#radioTrocaRota");
                // // var caixaConferencia = findElement("#caixaConferencia");

                // // //se estiver checado o troca de rotas ira vir habilitado
                // // if(radioTrocaRota.checked==true){
                // //     caixaConferencia.removeClass=" w3-grayscale1-max"
                // // }

                // // if(radioTrocaRota.checked==false){
                // //     caixaConferencia.addClass=" w3-grayscale1-max"
                // // }


                if (event.keyCode == 13) {

                    //loop procura em todo grid  se achar seleciona se nao achar manda o son quando o scanner estiver ativo 


                    var element             = findElement("#tableDocumentosConferenciaAll");
                    var rows                = element.rows; // todos os serviços  do grid

                    /* == Lógica para enfocar el elemento  == */

                    $event.target.focus();
                    $event.target.select();

                    /* == Fin de la Lógica para enfocar el elemento  == */
                    var veiculoEnter = 0;
                    var blnAchou = false;


                    $scope.servicosRotaConferencia.forEach(function (value, key) {

                        // if(value.NR_DOCUMENTO == 334899){
                        //     debugger
                        // }

                        if (value.COD_BARRAS == $scope.txtScanner || value.NR_DOCUMENTO == $scope.txtScanner) {
                            blnAchou = true;
                            // value.FL_CONFERIDO = true
                            value.selected  = true
                            veiculoEnter    = value.COD_VEICULOS



                        
                            for (let index = 0; index < rows.length; index++) {

                                if (rows[index].cells[1].innerText.substr(4,20)==  value.NR_DOCUMENTO ){
                                    var row  =  rows[index-1];
                                    break
                                }
                                
                                
                            } 

                            //var row = rows[key + 1];
                            // setTableRowPosition_divTableDocumentos(row);
                            return

                            // if (value.FL_CONFERIDO) {
                            //     acao = 'CONFERIDO'
                            // } else {
                            //     acao = 'LIMPAR'
                            // }
                            //salvarStatusConferencia()
                        }

                    });

                    if (!blnAchou) {
                        $scope.audioNaoAchou.play();
                        $event.target.select();
                        toastr.error('Documento  não encontrado', 'Erro');
                        veiculoEnter = 0;
                    }

                    if (veiculoEnter != 0) {
                        $event.target.value="";
                        $event.target.focus();
                        // $scope.openLink_AJS('', veiculoEnter)
                    }

                    atuallizaConferencia()

                }

            }

            $scope.salvarStatusConferencia = function () {

                var servicosConferido = []
                
                $scope.servicosRotaConferencia.forEach(function (item) {
    
                    if(item.selected==true){
    
                        if (item.COD_VEICULOS > 0 || item.IDENT_VEICULOS != '') {
                            
                            item.FL_CONFERIDO  =true;
                            item.acao="CONFERIDO"
                            servicosConferido.push(item)
    
                        }
                    }else{
                       
                        // if (item.COD_VEICULOS > 0 || item.IDENT_VEICULOS != '') {
                            
                        //     item.FL_CONFERIDO  =false;
                        //     item.acao="LIMPAR"
                        //     servicosConferido.push(item)
                        // }
                    }
    
                })
    
                var salvarConferencia = $filter("filter")(servicosConferido, { selected: true }, true);
    
                salvarStatusConferencia_(salvarConferencia)
    
            }


            $scope.selecionarAll   =  function(){

                $scope.servicosRotaConferencia.forEach(function (item) {
                    item.selected = true
                })


            }

            $scope.excluirServicoVeiculoCaixaRota =  function(acao){

                if(acao=='voltaGridPrincipal'){


                    swal({
                        title: "Descarregar itens selecionados ao grid principal?",
                        text: "Ao confirmar os itens selecionados irão retornar ao grid principal, podendo ser adicionado a mesma caixa de rota ou outra.",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {

                                $scope.selecionarAll();

                                $filter("filter")($scope.all, { NR_DOCUMENTO_FORMATADO:'438-170567'  }, true)[0]

                            
                                var itensSelecionados = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);

                                itensSelecionados.forEach(function (item) {


                                    var reg  = $filter("filter")($scope.all, { NR_DOCUMENTO_FORMATADO:item.NR_DOCUMENTO_FORMATADO  }, true)[0]

                                    if(reg ){
                                        reg.COD_VEICULOS    =   0
                                        reg.IDENT_VEICULOS  =   ""
                                        reg.ORDEM_ENTREGA   =   ""
                                        reg.selected        =   false
                                        reg.ROTA_DOC_REAL   =   null
                                    }

                                    if (item.COD_VEICULOS == null) {
                                        item.ROTA_DOC_REAL  = null
                                        item.ORDEM_ENTREGA  = ''
                                        item.IDENT_VEICULOS = ''
                                        item.selected       = false
                                        item.FL_CONFERIDO   = false
                                    }
                                });

                                updateServicosVeiculo(itensSelecionados, 'voltaGridPrincipal');

                            } else {
                                console.log('cancelado ao clicar no voltaGridPrincipal')
                                //swal("cancelado!");
                            }
                        });
                // return
                //     var r = confirm("Descarregar itens para grid principal?");
                //     if (r == true) {

                //         var itensSelecionados = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);

                //         itensSelecionados.forEach(function(item){
                //             if(item.COD_VEICULOS== null){
                //                 item.ROTA_DOC_REAL = null
                //             }
                //         })
    
                //         updateServicosVeiculo(itensSelecionados,'voltaGridPrincipal')
                //     }

                }
                if(acao=='descarregarVeiculoCaixa'){
                    
                    swal({
                        title: "Descarregar os itens selecionados do veículo e manter na caixa de rota?",
                        text: "Ao confirmar os itens selecionados serão descarregados do veiculo e mantido na caixa de rotas.",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {

                                swal("itens! descarregados do veículo!", {
                                    icon: "success",
                                });

                                var itensSelecionados = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);

                                itensSelecionados.forEach(function(item){
                                    if(item.COD_VEICULOS>0){
                                        item.COD_VEICULOS   =0
                                        item.ORDEM_ENTREGA  =''
                                        item.IDENT_VEICULOS =''
                                        item.selected       =false
                                        item.FL_CONFERIDO   =false
        
                                    }
                                })

                                updateServicosVeiculo(itensSelecionados,'descarregarVeiculoCaixa')

                            } else {
                                console.log('cancelado ao clicar no botao descarregarVeiculoCaixa')
                                //swal("cancelado!");
                            }
                        });

                }
                
            };

            //#endregion

            //#region  FUCNTIONS CRIADAS

            function atuallizaConferencia() {
                $scope.veiculosRetorno.forEach(function (item) {
                    item.qtdConferido = 0;
                    item.servicos.forEach(function (serv) {
                        if (serv.selected == true || serv.FL_CONFERIDO && serv.COD_VEICULOS > 0) {
                            item.qtdConferido = item.qtdConferido + 1
                        }
                    })
                })
            }

            function findElement(query) {
                //Funcion para realizar la busqueda del elemento.
                var id = document.querySelector(query);
                var elements = angular.element(id);
                return elements[0];
            }

            function somaPeso() {
                var peso = {
                    total: 0,
                    Coleta: 0,
                    Entrega: 0
                }



                $scope.rowsSelecteds.forEach(function (item) {

                    if (item.PESO != null) {
                        if (item.selected == true) {

                            peso.total = parseInt(peso.total) + parseInt(item.PESO)

                            if (item.IDENT_TIPO_DOCUMENTOS == 'C') {
                                peso.Coleta = parseInt(peso.Coleta) + parseInt(item.PESO)
                            } else {
                                peso.Entrega = parseInt(peso.Entrega) + parseInt(item.PESO)
                            }

                        } else {

                            peso = parseInt(peso) - parseInt(item.PESO)
                            if (item.IDENT_TIPO_DOCUMENTOS == 'C') {
                                peso.Coleta = parseInt(peso.Coleta) - parseInt(item.PESO)
                            } else {
                                peso.Entrega = parseInt(peso.Entrega) - parseInt(item.PESO)
                            }

                        }
                    }
                })





                return peso
            }

            function getAllSelectedRows() {

                var selectedRows = $filter("filter")($scope.all, {
                    selected: true
                }, true);

                //$scope.selectedRows = selectedRows;

                return selectedRows



            }

            function setTableRowPosition_divTableDocumentos(row) {

                var element             = findElement("#tableDocumentosConferenciaAll");
                var rows                = element.rows; // todos os serviços  do grid

                for (let index = 0; index < rows.length; index++) {

                    if (rows[index].cells[1].innerText.substr(4,20)==  $scope.txtScanner ){
                        var row1 =  rows[index];
                        break
                    }
                } 

                var div = findElement("#divTableDocumentosConferenciaAll1");
               
                div.scrollTop = row.offsetTop - div.offsetHeight + 50 ;


            }

            function salvarStatusConferencia_(servicos) {
    
                if (servicos.length > 0) {
    
    
                    // $scope.servicosRotaConferencia.forEach(function (value) {
                    servicos.forEach(function (value) {
    
                        $http.put(config.baseUrl + "/api/conferencia/" + value.COD_ROTEIRIZACAO + "/" + value.ROTA + '/' + value.COD_DOCUMENTO + '/' + value.acao)
                            .then(function sucesso() {
                                if (value.FL_CONFERIDO) {
                                    toastr.success(value.NR_DOCUMENTO_FORMATADO + ' veículo:' + value.IDENT_VEICULOS, 'Conferido');
                                } else {
                                    toastr.warning(value.NR_DOCUMENTO_FORMATADO + ' Conferência removida', 'Aviso');
                                }
                            },
                                function errorCallback(error) {
                                    toastr.error('Erro ao conferir, detalhe do erro (' + error.status + ')', 'Aviso');
                                });
                        value.FL_CONFERIDO  =   true
                        value.selected      =   false
    
                    })
    
                    // ATUALIZAR A QUANTIDADE CONFERIDA NA CAIXA DO VEICULO
                     atuallizaConferencia()
                    
                    console.log($filter("filter")($scope.servicosRotaConferencia, { FL_CONFERIDO: true }, true))
                }
    
            }
    
            function atuallizaConferencia() {
                $scope.veiculosRetorno.forEach(function (item) {
                    item.qtdConferido = 0;
                    item.servicos.forEach(function (serv) {
                         if(serv.selected==true  || serv.FL_CONFERIDO && serv.COD_VEICULOS>0){
                            item.qtdConferido = item.qtdConferido + 1
                         }
    
                        // if (serv.FL_CONFERIDO) {
                        //     item.qtdConferido = item.qtdConferido + 1
                        // }
                    })
                })
            }

            // var updateServicosVeiculo = function (itens, acao) {
            // };
            
            function updateServicosVeiculo (itens, acao){
                
                if (acao == 'limparCaixa') {

                    $http.put(config.baseUrl + "/api/PUT_ROTA_DOC_REAL", itens)
                        .then(
                            function sucesso(reponse) {
                                swal("itens! retornaram ao grid principal!", {
                                    icon: "success",
                                });


                                $scope.servicosRotaConferencia.forEach(function (item) {

                                    var idx = $scope.all.indexOf(item)
                                    if (idx >= 0) {
                                        $scope.all[idx].ROTA_DOC_REAL  = '' 
                                        $scope.all[idx].COD_VEICULOS   = 0
                                        $scope.all[idx].ORDEM_ENTREGA  = ''
                                        $scope.all[idx].IDENT_VEICULOS = ''
                                        $scope.all[idx].selected       = false
                                        $scope.all[idx].FL_CONFERIDO   = false
                                    }
                                })

                                $scope.servicosRotaConferencia = []

                                carregarVeiculos('limparcaixas')

                            },
                            function errorCallback(error) {
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte lado solicita (integração)!", "error");
                            }
                        )

                }

                if (acao == 'voltaGridPrincipal') {
                    $http.put(config.baseUrl + "/api/PUT_ROTA_DOC_REAL", itens)
                        .then(
                            function sucesso(reponse) {
                                swal("itens! retornaram ao grid principal!", {
                                    icon: "success",
                                });

                                itens.forEach(function (item) {
                                    var idx = $scope.servicosRotaConferencia.indexOf(item)
                                    if (idx >= 0) {
                                        $scope.servicosRotaConferencia.splice(idx, 1)
                                    }
                                });

                                carregarVeiculos()

                            },
                            function errorCallback(error) {
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte lado solicita (integração)!", "error");
                            }
                        )

                }
    
                if (acao == 'descarregarVeiculoCaixa') {
                    $http.put(config.baseUrl + "/api/servicos", itens)
                        .then(
                            function sucesso(response) { 
                                swal("serviços descarregados do veículo mas mantido na caixa", {
                                    icon: "success",
                                });
                            },
                            function errorCallback(error) {
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte lado solicita (integração)!", "error");
                            }
                        );
                        
                    carregarVeiculos()
    
                    itens.forEach(function(item){
                        item.ORDEM_ENTREGA =  ''                    
                    });

                }
    
    
                if (acao == 'carregar') {
    
                    $http.put(config.baseUrl + "/api/servicos", itens)
                        .then(
                            function sucesso(response) {
                                swal("carregado no veículo", {
                                    icon: "success",
                                });
                            },
                            function errorCallback(error) {
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte lado solicita (integração)!", "error");
                            }
                        );

                    carregarVeiculos()
    
                } else if (acao == "descarregar") {
    
                    $http.put(config.baseUrl + "/api/servicos/del", itens)
                        .then(
                            function sucesso(response) {
                                swal("Itens retirado do veículo", {
                                    icon: "success",
                                });
                            },
                            function errorCallback(error) {
                                toastr.error('ops algum erro ocorreu, acionar suporte lado solicita (integração)', 'Aviso');
                            }
                        );

                }
            }

            function carregarVeiculos(tipo, rotaSelecionada) {





                if (tipo == 'conferencia') {

                    var vei = []
                    $scope.lstVeiculos = listarVeiculos;

                    if (rotaSelecionada != undefined) {

                        if(rotaSelecionada.length==0){

                            swal('Selecione uma das rotas abaixo!', "aplicar o serviço a uma rota selecionando uma caixa de rota.", "warning");
                        }else{
                            rotaSelecionada[0].services.forEach(function (item) {
                                if (item.IDENT_VEICULOS != '') {
                                    var idx = vei.indexOf(item.COD_VEICULOS)
                                    if (idx < 0) {
                                        vei.push(item.COD_VEICULOS)
                                    }
                                }
    
                            })
                            return vei
                        }

                    }





                }else if(tipo=='limparcaixas'){

                    var vei = []
                    $scope.lstVeiculos = listarVeiculos;

                    if (rotaSelecionada != undefined) {
                        if(rotaSelecionada.length==0){
                            swal('Selecione uma das rotas abaixo!', "aplicar o serviço a uma rota selecionando uma caixa de rota.", "warning");
                        }else{
                            rotaSelecionada[0].services.forEach(function (item) {
                                if (item.IDENT_VEICULOS != '') {
                                    var idx = vei.indexOf(item.COD_VEICULOS)
                                    if (idx < 0) {
                                        vei.push(item.COD_VEICULOS)
                                    }
                                }
                            })
                            return vei
                        }
                    }
                }else {

                    $scope.lstVeiculos = listarVeiculos;

                    $scope.lstVeiculos.forEach(veiculos => {
                        veiculos.IDENT_VEICULOS = leftPad(veiculos.IDENT_VEICULOS, 7); // 0000001
                        veiculos.servicos = []
                    })

                    var contator = 0

                    $scope.all.forEach(function (item) {

                        var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: item.COD_VEICULOS }, true);

                        if (reg[0] != undefined) {
                            contator = contator + 1;
                            reg[0].servicos.push(item)
                        }
                    });

                }

            }

            //#endregion
        });
