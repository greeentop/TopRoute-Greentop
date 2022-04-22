angular.module("TopRoute")
    .controller("tabshowController",
        function($scope, $window, $mdDialog, $filter, $http, itens, veiculosRetorno, all, ngAudio, toastr, config) {

            $scope.tabSelecioada = 0

            $scope.inverterSelecao = false;



            $scope.data = {
                habilitarSelecaoTodos: false,
                cb4: true,
                cb5: false
            };


            $scope.tabTeste = function($event) {

            }

            //#region  DECLARACOES

            // $scope.criterioDeOrdenacao      =  'ORDEM_ENTREGA'

            $scope.txtScanner = ''
            $scope.audioExisteEmVeiculo = ngAudio.load("sons/plin.mp3");
            $scope.audioNaoAchou = ngAudio.load("sons/erro.mp3");
            $scope.all = all;
            $scope.veiculosRetorno = veiculosRetorno;

            if ($scope.veiculosRetorno != undefined || $scope.veiculosRetorno != null) {
                $scope.veiculosRetorno.forEach(function(item) {
                    item.qtdConferido = 0
                });
            }

            atuallizaConferencia();


            $scope.servicosRotaConferencia = itens;

            $scope.pdfMake = $window.pdfMake;



            var ultimo = undefined

            //#endregion

            //#region  SCOPES FUNCTIONS
            $scope.teste = function() {
                console.log('entrou no controller das caixas')
            }

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();

                $scope.veiculosRetorno = [];
            };

            $scope.answer = function(answer) {

                // $mdDialog.hide(answer);
                $mdDialog.hide($scope.all);
                // console.log(itens)
            };

            $scope.mouseOvoer = function(event, index) {

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

            $scope.ordenarPor = function(campo) {

                $scope.criterioDeOrdenacao = campo;
                $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;

            };

            $scope.setClickedRowConferencia = function(index, event, objeto) {

                var element = findElement('#' + objeto);
                var rows = element.rows;
                var codDocumento = rows[index + 1].cells[17].innerHTML.trim();
                var COD_VEICULOS_ = rows[index + 1].cells[18].innerHTML.trim();

                // var veiculoGrid = rows[index + 1].cells[0].innerHTML.trim();


                var veiculos = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(COD_VEICULOS_) }, true);
                var idx = $scope.veiculosRetorno.indexOf(veiculos[0])

                if (idx > -1) {
                    $scope.tabSelecioada = idx
                }


                $scope.servicosRotaConferencia.forEach(function(value) {

                    if (value.COD_DOCUMENTO == codDocumento.trim()) {
                        value.selected = !value.selected;
                        atuallizaConferencia();
                        return
                    }
                })

            }

            $scope.openLink_AJS = function(evt, animName) {

                var elementoLink = findElement('#tablink-' + animName);
                // var elementoLink = angular.element(document.querySelector('#tablink-' + animName));//findElement("#divDocumentos");
                // var elementoLink =  angular.element(document.querySelectorAll('#tablink'));//findElement("#divDocumentos");


                //limpar a selecao atual
                var elementoLinkAll = angular.element(document.querySelectorAll('.tablink'));
                for (i = 0; i < elementoLinkAll.length; i++) {
                    elementoLinkAll[i].className = elementoLinkAll[i].className = 'w3-bar-item w3-button tablink ng-scope'; //.replace(" w3-orange", "");
                }

                var elemento = angular.element(document.querySelector('#textField-' + animName)); //findElement("#divDocumentos");


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


            $scope.onKeyUpTxtScan = function(event) {
                if (event.keyCode == 13) {
                    var txtScan = findElement("#txtScan");
                    if (selectScannedCTRC_Novo(txtScan.value) == false) {
                        $scope.audioNaoAchou.play();

                        swal("Código de barras ou nrº Documento : " + txtScan.value, "Documento não encontrado!", {
                                icon: "error"
                            })
                            .then((value) => {
                                txtScan.value = "";
                                txtScan.focus();
                            });
                        return

                        //self.document.Bach.stop()
                    } else {
                        toastr.selecionaGrid("achou", 'Selecionado');
                        txtScan.value = "";
                        txtScan.focus();
                    }

                }
            }

            function selectScannedCTRC_Novo(codBarrasCTRC) {
                var table = findElement("#tableDocumentosConferenciaAll");
                var rows = table.rows;
                var i;
                for (i = 1; i < rows.length; i++) {

                    var col = rows[i].cells[1].innerHTML.trim().substr(4, 20); // documentos
                    if (col.indexOf(codBarrasCTRC) > -1) {
                        // selectRow(rows[i], table, true);
                        // setTableRowPosition(rows[i]);
                        // swal("Código de documento achou", {
                        //     icon: "success"
                        // })
                        return true
                    } else {
                        var col = rows[i].cells[19].innerHTML.trim() // documentos
                        if (col.indexOf(codBarrasCTRC) > -1) {
                            // selectRow(rows[i], table, true);
                            // setTableRowPosition(rows[i]);

                            // swal("Código de barras achou", {
                            //     icon: "success"
                            // })
                            return true;
                        }
                    }


                }
                return false;
            }


            function setLineGrid(nmtable, reg) {

                var element = findElement("#fnameConferencia");

                var table = findElement(nmtable.toString());
                var rows = table.rows; // todos os serviços  do grid
                var rowNew = 0


                for (i = 1; i < rows.length; i++) {


                    // LOCALIZAR POR DOCUMENTO
                    var nrDocumento = rows[i].cells[1].innerHTML.trim().substr(4, 20);
                    if (nrDocumento == element.value) {

                        rowNew = rows[i];
                        reg.selected = true;

                        // if ($scope.rowsSelecteds.indexOf(reg) < 0) {
                        //     $scope.rowsSelecteds.push(reg);
                        // }

                        setTableRowPosition(rowNew, "#divTableDocumentosConferenciaAll1");
                        //$scope.peso = somaPeso();
                        //totalizadorGrid($scope.rowsSelecteds)
                        break;
                    }

                    //LOCALIZAR POR CODIGO DE BARRAS
                    var codBarras = rows[i].cells[19].innerText.trim();
                    // if (codBarras.indexOf($scope.scannerprincipal_model) > -1) {
                    if (codBarras == element.value) {

                        rowNew = rows[i];

                        // if ($scope.rowsSelecteds.indexOf(reg) < 0) {
                        //     $scope.rowsSelecteds.push(reg);
                        // }

                        setTableRowPosition(rowNew, "#divTableDocumentosConferenciaAll1");
                        //$scope.peso = somaPeso();
                        //totalizadorGrid($scope.rowsSelecteds)
                        break;
                    }

                }
            }



            $scope.onKeyUpTxtScannerConferenciaNovo1 = function(event) {


                if (event.keyCode == 13) {


                    // var element = findElement("#tableDocumentosConferenciaAll");
                    // var rows = element.rows;

                    var element = findElement("#fnameConferencia");

                    var barras = $filter("filter")($scope.servicosRotaConferencia, { COD_BARRAS: element.value }, true)[0]
                    var doc = $filter("filter")($scope.servicosRotaConferencia, { NR_DOCUMENTO: element.value }, true)[0]



                    var reg = (barras != undefined ? barras : doc);

                    var veiculoEnter = 0;
                    var blnAchou = false;


                    $scope.servicosRotaConferencia.forEach(function(value) {

                        if (value.COD_BARRAS == element.value || value.NR_DOCUMENTO == element.value) {
                            blnAchou = true;

                            if (value.selected) {
                                swal("Documento Conferido!", {
                                    position: 'top-end',
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1700,
                                });



                                setLineGrid('#tableDocumentosConferenciaAll', reg)

                                var regVeiculos = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(reg.COD_VEICULOS) }, true)[0];
                                var idxVeiculos = $scope.veiculosRetorno.indexOf(regVeiculos)
                                if (idxVeiculos > -1) {
                                    $scope.tabSelecioada = idxVeiculos
                                }

                                atuallizaConferencia();

                                element.value = "";

                                element.focus();
                                element.select();

                            } else {


                                value.selected = true
                                veiculoEnter = value.IDENT_VEICULOS


                                setLineGrid('#tableDocumentosConferenciaAll', reg)

                                var regVeiculos = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(reg.COD_VEICULOS) }, true)[0];
                                var idxVeiculos = $scope.veiculosRetorno.indexOf(regVeiculos)
                                if (idxVeiculos > -1) {
                                    $scope.tabSelecioada = idxVeiculos
                                }

                                atuallizaConferencia();

                                element.value = "";
                                element.focus();
                                element.select();

                            }
                        }

                    });


                    if (!blnAchou) {

                        $scope.audioNaoAchou.play();


                        swal("Digite um documento / Escaneie algum documento.", "Documento não encontrado!", {
                                icon: "warning"
                            })
                            .then((value) => {
                                element.value = "";
                                element.focus();
                                element.select();
                            });
                        veiculoEnter = 0;
                    }
                }

            }

            $scope.onKeyUpTxtScannerConferenciaNovo = function(event) {


                if (event.keyCode == 13) {

                    var idScanner = findElement("#txtScan");

                    var barras = $filter("filter")($scope.servicosRotaConferencia, { COD_BARRAS: idScanner.value }, true)[0]
                    var doc = $filter("filter")($scope.servicosRotaConferencia, { NR_DOCUMENTO: idScanner.value }, true)[0]


                    // if($scope.txtScanner == "" || $scope.txtScanner== undefined ){
                    if (idScanner.value == "") {

                        swal("Digite um documento / Escaneie algum documento.", "documento não encontrado!", {
                                icon: "warning"
                            })
                            .then((value) => {
                                idScanner.value = ""
                            });

                        return

                    }


                    if (barras == undefined && doc == undefined) {
                        $scope.audioNaoAchou.play();
                        swal("Código de barras ou nrº Documento : " + idScanner.value, "Documento não encontrado!", {
                                icon: "error"
                            })
                            .then((value) => {
                                idScanner.value = ""
                                idScanner.target.focus();
                            });
                        return

                    } else {

                        toastr.clear();
                        var reg = (barras != undefined ? barras : doc);
                        toastr.selecionaGrid("Documento: " + reg.NR_DOCUMENTO_FORMATADO, 'Selecionado');


                        if (reg.selected == true) {
                            swal("Documento Conferido!", {
                                position: 'top-end',
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1000,
                            });
                            event.target.focus();
                        }
                        reg.selected = true

                        setLineGrid('#tableDocumentosConferenciaAll', reg)

                        var regVeiculos = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(reg.COD_VEICULOS) }, true)[0];
                        var idxVeiculos = $scope.veiculosRetorno.indexOf(regVeiculos)
                        if (idxVeiculos > -1) {
                            $scope.tabSelecioada = idxVeiculos
                        }

                        atuallizaConferencia();

                        idScanner.value = ""
                        idScanner.target.focus();
                        // event.target.focus();
                        // $scope.txtScanner = "";
                        // $event.target.focus();

                    }

                }


            }

            function selectScannedCTRC(codBarrasNrDdocumento) {

                var table = findElement("#tableDocumentosConferenciaAll");
                var rows = table.rows; // todos os serviços  do grid
                var i;


                for (i = 1; i < rows.length; i++) {


                    //numero documento
                    var nrDocumento = rows[i].cells[1].innerHTML.substr(4, 20)
                    if (nrDocumento.indexOf(codBarrasNrDdocumento) > -1) {
                        var reg = $filter("filter")($scope.servicosRotaConferencia, { NR_DOCUMENTO: nrDocumento }, true)[0];
                        if (reg) {
                            reg.selected = true;
                        }

                        // selectRow(rows[i], table, true);
                        // setTableRowPosition(rows[i]);
                        return true;
                    }

                    //codigo Barras
                    var codBarras = rows[i].cells[19].innerText.trim();
                    if (codBarras.indexOf(codBarrasNrDdocumento) > -1) {
                        var reg = $filter("filter")($scope.servicosRotaConferencia, { COD_BARRAS: codBarras }, true)[0];
                        if (reg) {
                            reg.selected = true;
                        }

                        // selectRow(rows[i], table, true);
                        // setTableRowPosition(rows[i]);
                        return true;
                    }

                }


                return false;
            }


            function setTableRowPositionVeiculo(row) {
                var div = findElement("#divTableDocumentos");
                div.scrollTop = row.offsetTop - div.offsetHeight + 50;
            }

            function setTableRowPosition(row, nmtable) {
                var divTable = findElement(nmtable.toString());
                divTable.scrollTop = row.offsetTop - divTable.offsetHeight + 50;
            }


            //desativar last version 1.3.1 -  função trocada por onKeyUpTxtScannerConferenciaNovo
            $scope.onKeyUpTxtScannerConferencia = function($event) {

                if (event.keyCode == 13) {
                    if (selectScannedCTRC($scope.txtScanner) == false) {
                        $scope.audioNaoAchou.play()

                        var codBarrar = $scope.txtScanner;
                        swal("Código de barras / Nrº Documento : " + codBarrar, "Documento não encontrado, tirar da conferência!", {
                                icon: "error"
                            })
                            .then((value) => {
                                $scope.txtscanner = "";
                                $event.target.value = "";
                                $event.target.select();
                                $event.target.focus();

                            });


                    } else {



                        var table = findElement("#tableDocumentosConferenciaAll");
                        var rows = table.rows; // todos os serviços  do grid
                        var i;
                        var rowNew = 0

                        for (i = 1; i < rows.length; i++) {


                            var COD_VEICULOS_ = rows[i].cells[18].innerHTML.trim()


                            //LOCALIZAR POR NUMERO DE DOCUMENTO
                            var nrDocumento = rows[i].cells[1].innerHTML.substr(4, 20)
                            if (nrDocumento.indexOf($scope.txtScanner) > -1) {
                                var reg = $filter("filter")($scope.servicosRotaConferencia, { NR_DOCUMENTO: nrDocumento }, true)[0];
                                if (reg) {

                                    var regVeiculos = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(COD_VEICULOS_) }, true)[0];
                                    var idxVeiculos = $scope.veiculosRetorno.indexOf(regVeiculos)

                                    if (idxVeiculos > -1) {
                                        $scope.tabSelecioada = idxVeiculos
                                    }



                                    var idx = $scope.servicosRotaConferencia.indexOf(reg);
                                    rowNew = rows[idx + 1];
                                    reg.selected = true;
                                }

                                setTableRowPosition(rowNew);

                                atuallizaConferencia();

                                $scope.txtscanner = "";
                                $event.target.value = "";

                                $event.target.select();
                                $event.target.focus();

                                return true;
                            }

                            //LOCALIZAR POR CODIGO DE BARRAS
                            var codBarras = rows[i].cells[19].innerText.trim();
                            if (codBarras.indexOf($scope.txtScanner) > -1) {
                                var reg = $filter("filter")($scope.servicosRotaConferencia, { COD_BARRAS: codBarras }, true)[0];
                                if (reg) {

                                    var regVeiculos = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(COD_VEICULOS_) }, true)[0];
                                    var idxVeiculos = $scope.veiculosRetorno.indexOf(regVeiculos)

                                    if (idxVeiculos > -1) {
                                        $scope.tabSelecioada = idxVeiculos
                                    }

                                    var idx = $scope.servicosRotaConferencia.indexOf(reg);
                                    rowNew = rows[idx + 1];
                                    reg.selected = true;
                                }

                                setTableRowPosition(rowNew);
                                // selectRow(rows[i], table, true);
                                // setTableRowPosition(rows[i]);
                                atuallizaConferencia();

                                $scope.txtscanner = "";
                                $event.target.value = "";
                                $event.target.select();
                                $event.target.focus();

                                return true;
                            }

                        }



                        var tableVeiculo = findElement("#tableDocumentosConferencia");
                        var rowsVeiculo = tableVeiculo.rows; // todos os serviços  do grid
                        var ii;
                        var rowNewVeiculo = 0

                        for (i = 1; i < rowsVeiculo.length; i++) {

                            var COD_VEICULOS_ = rows[i].cells[18].innerHTML.trim()


                            //LOCALIZAR POR NUMERO DE DOCUMENTO
                            var nrDocumento = rows[i].cells[1].innerHTML.substr(4, 20)
                            if (nrDocumento.indexOf($scope.txtScanner) > -1) {
                                var reg = $filter("filter")($scope.servicosRotaConferencia, { NR_DOCUMENTO: nrDocumento }, true)[0];
                                if (reg) {

                                    var regVeiculos = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(COD_VEICULOS_) }, true)[0];
                                    var idxVeiculos = $scope.veiculosRetorno.indexOf(regVeiculos)

                                    if (idxVeiculos > -1) {
                                        $scope.tabSelecioada = idxVeiculos
                                    }



                                    var idx = $scope.servicosRotaConferencia.indexOf(reg);
                                    rowNew = rows[idx + 1];
                                    reg.selected = true;
                                }

                                setTableRowPosition(rowNew);

                                atuallizaConferencia();

                                $scope.txtscanner = "";
                                $event.target.value = "";

                                $event.target.select();
                                $event.target.focus();

                                return true;
                            }

                            //LOCALIZAR POR CODIGO DE BARRAS
                            var codBarras = rows[i].cells[19].innerText.trim();
                            if (codBarras.indexOf($scope.txtScanner) > -1) {
                                var reg = $filter("filter")($scope.servicosRotaConferencia, { COD_BARRAS: codBarras }, true)[0];
                                if (reg) {

                                    var regVeiculos = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(COD_VEICULOS_) }, true)[0];
                                    var idxVeiculos = $scope.veiculosRetorno.indexOf(regVeiculos)

                                    if (idxVeiculos > -1) {
                                        $scope.tabSelecioada = idxVeiculos
                                    }

                                    var idx = $scope.servicosRotaConferencia.indexOf(reg);
                                    rowNew = rows[idx + 1];
                                    reg.selected = true;
                                }

                                setTableRowPosition(rowNew);
                                // selectRow(rows[i], table, true);
                                // setTableRowPosition(rows[i]);
                                atuallizaConferencia();

                                $scope.txtscanner = "";
                                $event.target.value = "";
                                $event.target.select();
                                $event.target.focus();

                                return true;
                            }

                        }



                        $scope.txtscanner = "";
                        $event.target.value = "";
                        $event.target.select();
                        $event.target.focus();
                        // toastr.success('encontrado', 'success');
                    }
                }

                return



                // // var radioTrocaRota = findElement("#radioTrocaRota");
                // // var caixaConferencia = findElement("#caixaConferencia");

                // // //se estiver checado o troca de rotas ira vir habilitado
                // // if(radioTrocaRota.checked==true){
                // //     caixaConferencia.removeClass=" w3-grayscale1-max"
                // // }

                // // if(radioTrocaRota.checked==false){
                // //     caixaConferencia.addClass=" w3-grayscale1-max"
                // // }


                // if (event.keyCode == 13) {

                // //loop procura em todo grid  se achar seleciona se nao achar manda o son quando o scanner estiver ativo 

                // if (selectScannedCTRC($scope.txtScanner) == false) {

                // $scope.audioNaoAchou.play()

                // swal("Documento!", "Salva com sucesso !", {
                // icon: "error",
                // });

                // //self.document.Bach.stop()
                // $event.target.value="";

                // // $event.target.select();

                // }

                // // var element             = findElement("#tableDocumentosConferenciaAll");
                // // var rows                = element.rows; // todos os serviços  do grid

                // /* == Lógica para enfocar el elemento  == */

                // // $event.target.focus();
                // // $event.target.select();

                // // /* == Fin de la Lógica para enfocar el elemento  == */
                // // var veiculoEnter = 0;
                // // var blnAchou = false;





                // // for (let index = 0; index < rows.length; index++) {

                // //     if(index > 0 ){
                // //         var col = rows[index].cells[1].innerHTML.substr(4,20)

                // //         if (col.indexOf($scope.txtScanner) > -1) {
                // //             var row  =  rows[index-1];
                // //             blnAchou = true;

                // //         }else{

                // //             // self.document.Bach.play()
                // //             $scope.audioNaoAchou.play();
                // //             toastr.error('Documento  não encontrado', 'Erro');
                // //         }
                // //     }

                // // } 



                // // $scope.servicosRotaConferencia.forEach(function (value, key) {


                // //     if (value.COD_BARRAS == $scope.txtScanner || value.NR_DOCUMENTO == $scope.txtScanner) {
                // //         blnAchou = true;
                // //         // value.FL_CONFERIDO = true
                // //         value.selected  = true
                // //         veiculoEnter    = value.COD_VEICULOS

                // //         for (let index = 0; index < rows.length; index++) {

                // //             if (rows[index].cells[1].innerText.substr(4,20)==  value.NR_DOCUMENTO ){
                // //                 var row  =  rows[index-1];
                // //                 break
                // //             }


                // //         } 
                // //     }

                // // });

                // // if (!blnAchou) {
                // //     $scope.audioNaoAchou.play();
                // //     $event.target.select();
                // //     toastr.error('Documento  não encontrado', 'Erro');
                // //     veiculoEnter = 0;
                // // }

                // // if (veiculoEnter != 0) {
                // //     $event.target.value="";
                // //     $event.target.focus();
                // //     // $scope.openLink_AJS('', veiculoEnter)
                // // }

                // // if(blnAchou){
                // //     atuallizaConferencia()
                // // }

                // }

            }

            $scope.salvarStatusConferencia = function() {

                var servicosConferido = []

                $scope.servicosRotaConferencia.forEach(function(item) {

                    if (item.selected == true) {

                        if (item.COD_VEICULOS > 0 || item.IDENT_VEICULOS != '') {

                            item.FL_CONFERIDO = true;
                            item.acao = "CONFERIDO"
                            servicosConferido.push(item)

                        }
                    } else {

                        // if (item.COD_VEICULOS > 0 || item.IDENT_VEICULOS != '') {

                        //     item.FL_CONFERIDO  =false;
                        //     item.acao="LIMPAR"
                        //     servicosConferido.push(item)
                        // }
                    }

                })

                var salvarConferencia = $filter("filter")(servicosConferido, { selected: true }, true);

                salvarStatusConferencia_(salvarConferencia)


                swal("Conferência!", "Salva com sucesso !", {
                    icon: "success",
                });


            }



            $scope.onChangeSelecionarTodosConferencia = function(cbState) {

                $scope.servicosRotaConferencia.forEach(function(item) {
                    item.selected = cbState
                })

                // swal("Conferência!", "Salva com sucesso !", {
                //     icon: "success",
                // });

                atuallizaConferencia();

                if (cbState) {

                    swal("Selecionar todos!", {
                        position: 'top-end',
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            };



            $scope.trocaselecao = function() {


                $scope.inverterSelecao = !$scope.inverterSelecao;

                $scope.servicosRotaConferencia.forEach(function(item) {

                    item.selected = !item.selected
                })

            }


            $scope.excluirServicoVeiculoCaixaRota = function(acao) {

                if (acao == 'voltaGridPrincipal') {

                    swal({
                            title: "Descarregar itens selecionados ao grid principal?",
                            text: "Ao confirmar os itens selecionados irão retornar ao grid principal, podendo ser adicionado a mesma caixa de rota ou outra.",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        })
                        .then((willDelete) => {
                            if (willDelete) {

                                var itensSelecionados = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);

                                itensSelecionados.forEach(function(item) {
                                    if (item.COD_VEICULOS == null) {
                                        item.ROTA_DOC_REAL = null
                                        item.ORDEM_ENTREGA = ""
                                        item.COD_VEICULOS = 0
                                        item.IDENT_VEICULOS = ""
                                        item.FL_CONFERIDO = false
                                    }
                                });

                                updateServicosVeiculo(itensSelecionados, 'voltaGridPrincipal')
                                atuallizaConferencia();

                            } else {
                                console.log('cancelado ao clicar no voltaGridPrincipal')
                                    //swal("cancelado!");
                            }
                        });
                }
                if (acao == 'descarregarVeiculoCaixa') {
                    1

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


                                var itens = []
                                var itensSelecionados = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);
                                var itensSelecionadosCopy = angular.copy(itensSelecionados)


                                itensSelecionadosCopy.forEach(function(item) {
                                    if (item.COD_VEICULOS > 0) {
                                        item.COD_VEICULOS = 0
                                        item.IDENT_VEICULOS = ""
                                        item.selected = false
                                        item.FL_CONFERIDO = false
                                        item.ORDEM_ENTREGA = 0
                                    }
                                })

                                itens.push(itensSelecionados)
                                itens.push(itensSelecionadosCopy)

                                updateServicosVeiculo(itens, 'descarregarVeiculoCaixa')





                            } else {
                                console.log('cancelado ao clicar no botao descarregarVeiculoCaixa')
                                    //swal("cancelado!");
                            }
                        });

                    // return
                    // var r = confirm("Descarregar os itens selecionados do veículo?");
                    // if (r == true) {
                    //     var itensSelecionados = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);
                    //     itensSelecionados.forEach(function(item){
                    //         if(item.COD_VEICULOS>0){
                    //             item.COD_VEICULOS   = 0
                    //             item.IDENT_VEICULOS = ''
                    //             item.selected       =false
                    //             item.FL_CONFERIDO   =false
                    //         }
                    //     })
                    //     updateServicosVeiculo(itensSelecionados,'descarregarVeiculoCaixa')
                    // }
                }

            };


            $scope.pickingList = function(cod_roteirizacao, veiculo, placa) {

                var relatorio;

                try {
                    $http.get(config.baseUrl + "/api/detalhes/roteirizacao1/" + cod_roteirizacao + "/" + veiculo.IDENT_VEICULOS)
                        .then(
                            function sucesso(response) {
                                relatorio = response.data

                                if (relatorio.veiculo != undefined) {
                                    rel_pickingList(relatorio.veiculo);
                                } else {
                                    swal("Api erro consulta!",
                                        "Consulta da API (back-End)- não retornou nenhum registro \n" + JSON.stringify(response.config), "error");
                                }
                            },
                            function errorCallback(error) {

                                var msgErro

                                if (error.data != undefined) {
                                    msgErro = error.data.ExceptionMessage
                                }
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)! \n" + msgErro, "error");
                                // swal("Ops!", "Erro ao gerar o picking List" + data.ExceptionMessage + "(" + data.Message + ") !", "error");
                            }
                        )

                } catch (e) {
                    // declarações para manipular quaisquer exceções
                    //logMyErrors(e); // passa o objeto de exceção para o manipulador de erro
                    swal("Ops!", e, "error");
                    // toastr.error(e, 'Erro')
                } finally {
                    // console.log("finally");
                }



            };

            //#endregion

            //#region  FUCNTIONS CRIADAS

            function rel_pickingList(veiculo) {



                //[CRTC,REMENTENTE, DETINATARIO,CEP, CIDADE, ROT,  VOL, KG, RTS, PE, VL.MERCADORIA]
                var largColunstable1 = [60, 85, 85, 30, 40, 15, 15, 15, 20, 15, 15, 40]
                var marginTable2 = [25, 0, 0, 0]
                var marginTable3 = [25, 0, 0, 0]
                var fontSizeOrdem = 10;

                var servicos = [];
                var pallet = [{
                    columns: [
                        //veiculo
                        {
                            width: '*',
                            margin: [0, -25, 0, 0],
                            text: [
                                { text: ' ', style: 'colorText' },
                                { text: ' ', fontSize: 10, bold: true, color: '#FF5600', alignment: 'left' },
                            ]
                        },

                        //capacidade
                        {
                            width: '*',
                            margin: [0, -25, 0, 0],
                            text: [
                                { text: 'Capacidade: ', style: 'colorText' },
                                { text: veiculo.CAPACIDADE + ' (kg)', fontSize: 10, bold: true, color: '#FF5600', alignment: 'center' },
                            ]
                        },
                        // //pallet
                        // {
                        //     width: '*',
                        //     margin: [0, -25, 0, 0],
                        //     text: [
                        //         { text: 'Qtd Pallet: ', style: 'colorText', alignment: 'left' },
                        //         { text: '[             ]', fontSize: 10, bold: true, color: '#FF5600', alignment: 'left' },

                        //     ]
                        // }

                    ]
                }, ]
                var motorista = [
                    //MOTORISTA
                    {
                        columns: [{
                                width: 85,
                                margin: [30, -13, 0, 0],
                                text: { text: 'Motorista: ', style: 'colorText' },
                            },
                            {
                                width: 'auto',
                                margin: [30, -13, 0, 0],
                                text: { text: '_______________________________________________________________', fontSize: 12, bold: true, color: '#FF5600', alignment: 'left' },

                            },
                        ]
                    },
                ]

                var quatidadeTotalEntrega = 0
                var quatidadeTotal = 0
                var volumeTotal = 0
                var pesoTotal = 0
                var pesoCubadoTotal = 0
                var ValorTotal = 0
                veiculo.DOCUMENTOS.forEach(function(item) {

                    let fontSizePE = 7
                    let fontColorPE = "#242F53"
                    let fillColorPE = 'white'
                    if (item.COD_PRIORIDADE == 2) {
                        fontSizePE = 9
                        fontColorPE = "#7C79A2"

                    }
                    if (item.COD_PRIORIDADE == 4 || item.COD_PRIORIDADE == 5) {
                        fontSizePE = 12
                        fontColorPE = "#ff6f69"
                        fillColorPE = 'gray'
                    }

                    if (item.TIPO_SERVICO == 'E') {
                        quatidadeTotalEntrega += 1
                        quatidadeTotal += 1
                        item.ORDEM = quatidadeTotal
                    }

                    // if(item.TIPO_SERVICO=='C'){
                    //     quatidadeTotal += 1 
                    //     item.ORDEM  =  quatidadeTotal
                    // }

                    if (item.TIPO_SERVICO == 'E') {

                        if (item.QT_VOLUMES) {
                            volumeTotal += parseInt(item.QT_VOLUMES)
                        }
                        if (item.PESO_NOTA) {
                            pesoTotal += parseInt(item.PESO_NOTA)
                        }
                        if (item.PESO_CALCULO) {
                            pesoCubadoTotal += parseInt(item.PESO_CALCULO)
                        }

                        var serv = {
                            columns: [{
                                    width: 40,
                                    margin: [-30, 0, 0, 0],
                                    text: item.ORDEM + ')',
                                    style: 'filledHeader'
                                },

                                {
                                    width: '*',
                                    style: 'tableExample',
                                    margin: [-25, 0, -10, 0],
                                    table: {
                                        headerRows: 1,
                                        widths: largColunstable1,
                                        body: [
                                            [
                                                { text: 'Ctrc', fontSize: 9, style: 'colorText' },
                                                { text: 'Remetente', fontSize: 9, style: 'colorText' },
                                                { text: 'Destinatario', fontSize: 9, style: 'colorText' },
                                                { text: 'Cep', fontSize: 9, style: 'colorText' },
                                                { text: 'Cidade', fontSize: 9, style: 'colorText' },
                                                { text: 'Rot', fontSize: 9, style: 'colorText' },
                                                { text: 'Vol', fontSize: 9, style: 'colorText', alignment: 'right' },
                                                { text: 'Kg', fontSize: 9, style: 'colorText', alignment: 'center' },
                                                { text: 'Cub', fontSize: 9, style: 'colorText', alignment: 'center' },
                                                { text: 'Rts', fontSize: 9, style: 'colorText', alignment: 'center' },
                                                { text: 'P.E', fontSize: 9, style: 'colorText', alignment: 'center' },
                                                { text: 'Vl.Merc', fontSize: 9, style: 'colorText', alignment: 'right' }

                                            ],
                                            [
                                                { text: item.DOCUMENTO, fontSize: 6, style: 'colorText' },
                                                { text: item.REMETENTE, fontSize: 6, style: 'colorText' },
                                                { text: item.DESTINATARIO, fontSize: 6, style: 'colorText' },
                                                { text: item.CEP.substr(0, 5) + '-' + item.CEP.substr(5, 3), fontSize: 6, style: 'colorText' },
                                                { text: item.CIDADE, fontSize: 6, style: 'colorText' },
                                                { text: item.COD_ROTA, fontSize: 6, style: 'colorText', alignment: 'center' },
                                                { text: item.QT_VOLUMES, fontSize: 6, style: 'colorText', alignment: 'center' },
                                                { text: [{ text: item.PESO_NOTA, fontSize: 7, bold: true, alignment: 'right' }, ] },
                                                { text: [{ text: item.PESO_CALCULO, fontSize: 7, bold: true, alignment: 'right' }, ] },
                                                { text: item.QT_RETORNOS, fontSize: 7, alignment: 'center' },
                                                { text: item.COD_PRIORIDADE, fontSize: fontSizePE, alignment: 'center', color: fontColorPE },
                                                { text: item.VL_MERCADORIA.toLocaleString('pt-br', { minimumFractionDigits: 2 }), fontSize: 7, alignment: 'right' },
                                            ],
                                        ]
                                    },
                                    // layout: 'lightHorizontalLines'
                                    layout: {
                                        fillColor: function(rowIndex, node, columnIndex) {
                                            return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                                        }
                                    }
                                },
                            ]

                        }

                        var address = {
                            margin: marginTable2,
                            style: 'tableExample;colorText',
                            table: {
                                widths: [50, 'auto', 'auto'],
                                heights: ['auto', 'auto', 'auto'],
                                body: [
                                    [
                                        { text: 'Endereço:', fontSize: 7, bold: true, color: '#242F53' },
                                        { text: item.ENDERECO.trim() + ' - ' + item.BAIRRO.trim() + ' - ' + item.CIDADE.trim() + ' ' + item.UF.trim() + '  ' + item.CEP.substr(0, 5) + '-' + item.CEP.substr(5, 3), fontSize: 8, style: 'colorTextOrange', alignment: 'left' },
                                        { text: ' - ' + item.COMPLEMENTO, fontSize: 9, style: 'colorTextOrange' }
                                    ],
                                ]
                            },
                            layout: 'lightHorizontalLines',

                        }

                        if (item.DT_AGENDAMENTO == "0001-01-01T00:00:00") {
                            item.DT_AGENDAMENTO = ""
                        }
                        if (item.HR_AGENDAMENTO_INICIO == "0001-01-01T00:00:00") {
                            item.HR_AGENDAMENTO_INICIO = ""
                        }
                        if (item.HR_AGENDAMENTO_FIM == "0001-01-01T00:00:00") {
                            item.HR_AGENDAMENTO_FIM = ""
                        }

                        var texto_agendamento = 'Agendamento : ';
                        var msgAgendamento = texto_agendamento.concat(item.DS_AGENDAMENTOS_TIPO != null ? item.DS_AGENDAMENTOS_TIPO : '', ' ', item.DT_AGENDAMENTO != null ? item.DT_AGENDAMENTO : '', ' ', item.DS_AGENDAMENTOS_PERIODO != null ? item.DS_AGENDAMENTOS_PERIODO.toLowerCase() : '', ' ', item.HR_AGENDAMENTO_INICIO != null ? item.HR_AGENDAMENTO_INICIO : '', '  ', item.HR_AGENDAMENTO_FIM != null ? item.HR_AGENDAMENTO_FIM : '')

                        let fontSizeAgedamento = 7
                        let boldAgendamento = false
                        if (item.COD_PRIORIDADE == 2) {
                            fontSizeAgedamento = 9
                            boldAgendamento = true
                        }


                        var notasVolumeGaiolas = {
                            margin: marginTable3,
                            style: 'tableGaiola',
                            table: {
                                widths: [300, '*', '*'],
                                heights: ['auto', 'auto', 'auto'],
                                body: [
                                    [
                                        { text: 'End Arm.: ' + item.END_ARM, fontSize: 7, bold: false, color: '#242F53' },
                                        { text: 'Notas' + item.NOTAS, fontSize: 7, bold: false, color: '#242F53' },
                                        { text: 'Nr.Unitizador' + item.UNITIZADORES, fontSize: 7, bold: false, color: '#242F53' }
                                    ],
                                    [
                                        { text: msgAgendamento, fontSize: fontSizeAgedamento, bold: boldAgendamento, color: '#242F53', italics: true },
                                        { text: 'Id. Volumes:' + item.ID_VOLUMES, fontSize: 7, bold: false, color: '#242F53' },
                                        { text: 'Gaiolas:' + item.GAIOLAS, fontSize: 7, bold: false, color: '#242F53' }
                                    ],
                                ]
                            },
                            layout: 'lightHorizontalLines'

                        }


                        servicos.push(serv);
                        servicos.push(address);
                        servicos.push(notasVolumeGaiolas);



                    }

                })



                var inclusaoCTRC = [{
                    margin: [0, 20, 0, 0],
                    style: 'colorText',
                    fontSize: 10,
                    text: 'Inclusão de CTRCs :   _____________/_____________/_____________/_____________/_____________/_____________/_____________'
                }]

                var exclusaoCTRC = [{
                    margin: [0, 5, 0, 0],
                    style: 'colorText',
                    fontSize: 10,
                    text: 'Exclusão de CTRCs:   _____________/_____________/_____________/_____________/_____________/_____________/_____________'
                }]
                var inclusaoMinutas = [{
                    margin: [0, 5, 0, 0],
                    style: 'colorText',
                    fontSize: 10,
                    text: 'Inclusão Minutas    :   _____________/_____________/_____________/_____________/_____________/_____________/_____________'
                }]


                var foorterTotalizador = [{
                    margin: [120, 5, 0, 0],

                    text: [
                        { text: 'Qtd Serviços: ', style: 'colorText', fontSize: 10, alignment: 'left' },
                        { text: quatidadeTotalEntrega, fontSize: 15, bold: true, color: '#FF5600' },


                        { text: '       Volume: ', style: 'colorText', fontSize: 10 },
                        { text: volumeTotal, fontSize: 15, bold: true, color: '#FF5600' },


                        { text: '       Peso: ', style: 'colorText', fontSize: 10 },
                        { text: pesoTotal, fontSize: 15, bold: true, color: '#FF5600' },

                        { text: '       Peso Real: ', style: 'colorText', fontSize: 10 },
                        { text: pesoCubadoTotal, fontSize: 15, bold: true, color: '#FF5600' }

                        // { text: '       Valor: ', style: 'colorText', fontSize: 10, alignment: 'right' },
                        // { text: ValorTotal.toLocaleString('pt-br', { minimumFractionDigits: 2 }), fontSize: 15, bold: true, color: '#FF5600' },

                    ]
                }]

                var headerColeta = [{
                    text: 'Coleta(s) roteirizada(s) - Apenas informativo (sem carregamento de saída)',
                    style: 'colorText',
                    fontSize: 15,
                    bold: true,
                    margin: [0, 20, 0, 8]
                }, ]




                var responsavelLimpesa = [{
                    margin: [0, 15, 0, 0],
                    style: 'colorText',
                    fontSize: 9,

                    text: [{
                        text: 'Responsável pelo Limpeza :   ________________________________________________________________               LACRE T __________ '
                    }]

                }]


                var responsavelLimpeza1 = [{
                    margin: [0, 5, 0, 0],
                    style: 'colorText',
                    fontSize: 9,
                    text: [
                        { text: 'Inicio: _____ /_____ /______   ____ : ____              Término: _____ /_____ /______   ____ : ____             LACRE L _________   ', style: 'colorText', fontSize: 10 }
                    ]

                }]


                var responsaInicioFIm = [{
                    margin: [0, 30, 0, 0],
                    text: [
                        { text: 'CTRCs Carregados :   ________ ', style: 'colorText', fontSize: 8, alignment: 'left' },
                        { text: 'Resp. pelo carregamento : ____________________ ', style: 'colorText', fontSize: 8, alignment: 'left' },
                        { text: 'Inicio Carreg.: ', style: 'colorText', fontSize: 8 },
                        { text: '___/___/_____  ___:___ ', style: 'colorText', fontSize: 8 },
                        { text: 'Término Carreg.: ', style: 'colorText', fontSize: 8 },
                        { text: '___/___/_____  ___:___ ', style: 'colorText', fontSize: 8 },

                    ]
                }]


                servicos.push(foorterTotalizador)
                servicos.push(inclusaoCTRC)
                servicos.push(exclusaoCTRC)
                servicos.push(inclusaoMinutas)
                    // servicos.push(CTRCCarregados)
                servicos.push(responsavelLimpesa)
                servicos.push(responsavelLimpeza1)
                servicos.push(responsaInicioFIm)

                servicos.push(headerColeta)



                veiculo.DOCUMENTOS.forEach(function(item) {
                    if (item.TIPO_SERVICO == 'C') {

                        var servColetas = [
                            // { text: 'Coleta(s) roteirizada(s) - Apenas informativo (sem carregamento de saída)', style: 'colorText', fontSize: 15, bold: true, margin: [0, 20, 0, 8] },
                            {
                                columns: [

                                    // { text: item.ORDEM + ')', fontSize: 15, width: 40, margin: [-30, 0, 0, 0], style: 'filledHeader' },

                                    {

                                        width: '*',
                                        style: 'tableExample',
                                        margin: [0, 0, 0, 8],
                                        table: {
                                            headerRows: 1,
                                            widths: [40, 80, 80, 30, 30, 15, 15, 15, 15, 15, 40],
                                            body: [
                                                [
                                                    { text: 'Coleta(s)', fontSize: 8, style: 'colorText' },
                                                    { text: 'Remetente', fontSize: 9, style: 'colorText' },
                                                    { text: 'Destinatario', fontSize: 9, style: 'colorText' },
                                                    { text: 'Cep', fontSize: 9, style: 'colorText' },
                                                    { text: 'Cidade', fontSize: 9, style: 'colorText' },
                                                    { text: 'Rot', fontSize: 9, style: 'colorText' },
                                                    { text: 'Vol', fontSize: 9, style: 'colorText', alignment: 'right' },
                                                    { text: 'KG', fontSize: 9, style: 'colorText', alignment: 'center' },
                                                    { text: 'Rts', fontSize: 9, style: 'colorText', alignment: 'center' },
                                                    { text: 'P.E', fontSize: 9, style: 'colorText', alignment: 'center' },
                                                    { text: 'Vl.Merc', fontSize: 9, style: 'colorText', alignment: 'right' }

                                                ],
                                                [
                                                    { text: item.DOCUMENTO, fontSize: 6, style: 'colorText' },
                                                    { text: item.REMETENTE, fontSize: 6, style: 'colorText' },
                                                    { text: item.DESTINATARIO, fontSize: 6, style: 'colorText' },
                                                    { text: item.CEP.substr(0, 5) + '-' + item.CEP.substr(5, 3), fontSize: 6, style: 'colorText' },
                                                    { text: item.CIDADE, fontSize: 6, style: 'colorText' },
                                                    { text: item.COD_ROTA, fontSize: 6, style: 'colorText', alignment: 'center' },
                                                    { text: item.QT_VOLUMES, fontSize: 6, style: 'colorText', alignment: 'center' },
                                                    { text: [{ text: item.PESO_NOTA, fontSize: 7, bold: true, alignment: 'right' }, ] },
                                                    { text: item.QT_RETORNOS, fontSize: 7, alignment: 'center' },
                                                    { text: item.COD_PRIORIDADE, fontSize: 7, alignment: 'center' },
                                                    { text: item.VL_MERCADORIA, fontSize: 7, alignment: 'right' },
                                                ],
                                            ]
                                        },
                                        // layout: 'lightHorizontalLines'
                                        layout: {
                                            fillColor: function(rowIndex, node, columnIndex) {
                                                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                                            }
                                        }
                                    }
                                ]
                            },
                        ]

                        var addressColetas = {
                            margin: marginTable2,
                            style: 'tableExample;colorText',
                            table: {
                                widths: [50, 'auto', 'auto'],
                                heights: ['auto', 'auto', 'auto'],
                                body: [
                                    [
                                        { text: 'Endereço:', fontSize: 7, bold: true, color: '#242F53' },
                                        { text: item.ENDERECO.trim() + ' - ' + item.CIDADE.trim() + ' ' + item.UF.trim() + '  ' + item.CEP.substr(0, 5) + '-' + item.CEP.substr(5, 3), fontSize: 8, style: 'colorTextOrange', alignment: 'left' },
                                        { text: ' - ' + item.COMPLEMENTO, fontSize: 9, style: 'colorTextOrange' }
                                    ],
                                ]
                            },
                            layout: 'lightHorizontalLines',

                        }

                        servicos.push(servColetas)
                        servicos.push(addressColetas)
                    }
                })




                var tipoPallet = [
                    //pallet
                    {
                        width: '*',
                        margin: [120, 20, 0, 0],
                        text: [
                            { text: 'QTDE PALLET:    PBR _________ /   DESCARTÁVEIS __________', style: 'colorText', alignment: 'left' },
                            // { text: '[             ]', fontSize: 10, bold: true, color: '#FF5600', alignment: 'left' },

                        ]
                    }
                ];

                //#endregion

                var body = [

                    pallet,
                    motorista,
                    servicos,
                    tipoPallet

                ];

                var pdfMake = $scope.pdfMake;
                var docDefinition = {

                    pageSize: 'LETTER',
                    pageMargins: [30, 70, 30, 0],

                    header: [
                        { style: 'colorText', text: 'Picking List para carregamento', fontSize: 22, bold: true, margin: [15, 10, 0, 0], alignment: 'center' },
                        {
                            margin: [30, 0, 0, 0],
                            text: [
                                { text: 'Filial: ', style: 'colorText', fontSize: 10, alignment: 'left' },
                                { text: veiculo.FILIAL, fontSize: 10, bold: true, color: '#FF5600' },
                                { text: '               Data do Processamento:', style: 'colorText', fontSize: 10 },
                                { text: veiculo.DT_INCLUSAO_ROTEIRIZACAO, fontSize: 10, bold: true, color: '#FF5600' },

                            ]
                        },
                        {
                            width: '*',
                            margin: [30, 0, 0, 0],
                            text: [
                                { text: 'Veículo: ', style: 'colorText' },
                                { text: veiculo.IDENT_VEICULOS, fontSize: 10, bold: true, color: '#FF5600', alignment: 'left' },
                            ]
                        },

                        {
                            image: 'data:image/png;base64,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',
                            width: 70,
                            height: 50,
                            alignment: 'rigth',
                            margin: [520, -55, 0, 0]

                        },


                    ],

                    footer: {
                        margin: [30, 5, 0, 0],
                        columns: [
                            { text: 'una enplesa', alignment: 'center' },
                            { text: 'solistica - Femsa', alignment: 'center' }
                        ]
                    },

                    content: [
                        body

                    ],

                    // pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                    //     return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
                    //  },

                    styles: {
                        header: {
                            fontSize: 18,
                            bold: true,
                            margin: [0, 0, 0, 10]
                        },
                        subheader: {
                            fontSize: 16,
                            bold: true,
                            margin: [0, 15, 0, 5]
                        },
                        tableExample: {
                            margin: [0, 5, 0, 15],
                            color: '#242F53'
                        },
                        tableGaiola: {
                            margin: [0, 5, 0, 15],
                            color: '#242F53',
                            border: 1
                        },

                        tableHeader: {
                            bold: true,
                            fontSize: 13,
                            color: '#242F53'
                        },
                        card: {
                            borderradius: 20
                        },
                        filledHeader: {
                            bold: true,
                            fontSize: 14,
                            color: '#FF5600',
                            fillColor: 'black',
                            alignment: 'center',
                            italics: true,
                            fontSize: 15,
                        },
                        colorText: {
                            color: '#242F53'
                        },
                        colorTextOrange: {
                            color: '#FF5600'
                        },

                    },

                    defaultStyle: {
                        // alignment: 'justify'
                    }
                }



                docDefinition.dom = JSON.stringify(docDefinition);
                docDefinition.dom = JSON.parse(docDefinition.dom);

                pdfMake.createPdf(docDefinition).print();

            }

            function atuallizaConferencia() {

                if ($scope.veiculosRetorno != undefined || $scope.veiculosRetorno != null) {

                    $scope.veiculosRetorno.forEach(function(item) {
                        item.qtdConferido = 0;
                        item.servicos.forEach(function(serv) {
                            if (serv.selected == true || serv.FL_CONFERIDO && serv.COD_VEICULOS > 0) {
                                item.qtdConferido = item.qtdConferido + 1
                            }
                        })
                    })
                }
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



                $scope.rowsSelecteds.forEach(function(item) {

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

                var element = findElement("#tableDocumentosConferenciaAll");
                var rows = element.rows; // todos os serviços  do grid

                for (let index = 0; index < rows.length; index++) {

                    if (rows[index].cells[1].innerText.substr(4, 20) == $scope.txtScanner) {
                        var row1 = rows[index];
                        break
                    }
                }

                var div = findElement("#divTableDocumentosConferenciaAll1");

                div.scrollTop = row.offsetTop - div.offsetHeight + 50;


            }

            function salvarStatusConferencia_(servicos) {

                if (servicos.length > 0) {


                    // $scope.servicosRotaConferencia.forEach(function (value) {
                    servicos.forEach(function(value) {

                        $http.put(config.baseUrl + "/api/conferencia/" + value.COD_ROTEIRIZACAO + "/" + value.ROTA + '/' + value.COD_DOCUMENTO + '/' + value.acao)
                            .then(function sucesso() {
                                    // if (value.FL_CONFERIDO) {
                                    //     toastr.success(value.NR_DOCUMENTO_FORMATADO + ' veículo:' + value.IDENT_VEICULOS, 'Conferido');
                                    // } else {
                                    //     toastr.warning(value.NR_DOCUMENTO_FORMATADO + ' Conferência removida', 'Aviso');
                                    // }
                                }
                                // ,
                                //     function errorCallback(error) {
                                //         toastr.error('Erro ao conferir, detalhe do erro (' + error.status + ')', 'Aviso');
                                //     }
                            );
                        value.FL_CONFERIDO = true
                        value.selected = false

                    })

                    // ATUALIZAR A QUANTIDADE CONFERIDA NA CAIXA DO VEICULO
                    atuallizaConferencia()

                    console.log($filter("filter")($scope.servicosRotaConferencia, { FL_CONFERIDO: true }, true))
                }

            }

            // var updateServicosVeiculo = function (itens, acao) {
            // };

            function updateServicosVeiculo(itens, acao) {

                if (acao == 'voltaGridPrincipal') {
                    $http.put(config.baseUrl + "/api/PUT_ROTA_DOC_REAL", itens)
                        .then(
                            function sucesso(reponse) {


                                swal("itens! retornaram ao grid principal!", {
                                    icon: "success",
                                });


                                itens.forEach(function(item) {
                                    console.log($scope.veiculosRetorno)

                                    var idx = $scope.servicosRotaConferencia.indexOf(item)
                                    if (idx >= 0) {
                                        $scope.servicosRotaConferencia.splice(idx, 1)
                                    }
                                });


                            },
                            function errorCallback(error) {
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)!", "error");
                            }
                        )
                    itens.forEach(function(item) {
                        item.selected = false;
                    })

                    carregarVeiculos()

                    // .success(function (data, status) {

                    //     swal("itens! retornaram ao grid principal!", {
                    //         icon: "error",
                    //     });
                    //     // toastr.success('Serviço(s) inserido do veículo com sucesso', 'Aviso');

                    //     itens.forEach(function(item){
                    //         var idx  =  $scope.servicosRotaConferencia.indexOf(item)
                    //         if(idx>=0){
                    //             $scope.servicosRotaConferencia.splice(idx,1)
                    //         }
                    //     });

                    // })
                    // .error(function (data, status, header, config) {
                    //     swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)!", "error");
                    //     // toastr.error('ops algum erro ocorreu, acionar suporte lado Solistica (integração)', 'Aviso');
                    // });

                    // itens.forEach(function(item){
                    //     item.selected =false;
                    // })

                    // carregarVeiculos()

                }

                if (acao == 'descarregarVeiculoCaixa') {
                    $http.put(config.baseUrl + "/api/servicos", itens[1])
                        .then(
                            function sucesso(response) {

                                itens[0].forEach(function(item) {
                                    // console.log($scope.veiculosRetorno)

                                    item.COD_VEICULOS = 0
                                    item.IDENT_VEICULOS = ""
                                    item.ORDEM_ENTREGA = ""
                                    item.selected = false


                                    if ($scope.veiculosRetorno != undefined || $scope.veiculosRetorno != null) {
                                        $scope.veiculosRetorno.forEach(function(serv) {
                                            var idx = serv.servicos.indexOf(item)

                                            if (idx >= 0) {
                                                serv.servicos[idx].selected = false;
                                                serv.servicos.splice(idx, 1)
                                            }
                                        })
                                    }

                                });

                                var itensSelecionados = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);


                                itensSelecionados.forEach(function(item) {
                                    item.selected = false
                                    item.COD_VEICULOS = 0
                                    item.IDENT_VEICULOS = ""
                                    item.ORDEM_ENTREGA = ""

                                })


                                atuallizaConferencia();

                                $scope.$applyAsync();


                            },
                            function errorCallback(error) {
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte do TopRoute (Greentop)!", "error");
                            }
                        )


                    // .success(function (data, status) {


                    //     itens.forEach(function(item){
                    //         if(item.COD_VEICULOS>0){
                    //             item.COD_VEICULOS   =0
                    //             item.IDENT_VEICULOS =""
                    //             item.selected       =false
                    //             item.FL_CONFERIDO   =false
                    //             item.ORDEM_ENTREGA  = ""

                    //         }
                    //     })



                    //     toastr.success('serviços recolocados no grid principal', 'Sucesso');
                    // })
                    // .error(function (data, status, header, config) {
                    //     toastr.error('ops algum erro ocorreu, acionar suporte lado Solistica (integração)', 'Aviso');
                    // });


                    // carregarVeiculos()


                }


                if (acao == 'carregar') {

                    $http.put(config.baseUrl + "/api/servicos", itens)
                        .success(function(data, status) {
                            toastr.success('Serviço(s) inserido do veículo com sucesso', 'Aviso');
                        })
                        .error(function(data, status, header, config) {
                            toastr.error('ops algum erro ocorreu, acionar suporte lado Solistica (integração)', 'Aviso');
                        });

                    carregarVeiculos()


                    // $http.put(config.baseUrl + "/api/servicos",  itens).then(successCallback, function errorCallback(){});

                } else if (acao == "descarregar") {

                    $http.put(config.baseUrl + "/api/servicos/del", itens)
                        .success(function(data, status) {
                            toastr.warning('Serviço(s) retirado do veículo com sucesso', 'Aviso');
                        })
                        .error(function(data, status, header, config) {
                            toastr.error('ops algum erro ocorreu, acionar suporte lado Solistica (integração)', 'Aviso');
                        });

                    // $http.put(config.baseUrl + "/api/servicos/del", itens).then(successCallback, function errorCallback(){});
                }
            }

            function carregarVeiculos(tipo, rotaSelecionada) {



                if (tipo == 'paulo') {

                }

                if (tipo == 'conferencia') {

                    var vei = []
                    $scope.lstVeiculos = listarVeiculos.data;

                    if (rotaSelecionada != undefined) {

                        if (rotaSelecionada.length == 0) {

                            swal('Selecione uma das rotas abaixo!', "aplicar o serviço a uma rota selecionando uma caixa de rota.", "warning");
                        } else {
                            rotaSelecionada[0].services.forEach(function(item) {
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


                } else {

                    $scope.lstVeiculos = listarVeiculos.data;

                    $scope.lstVeiculos.forEach(veiculos => {
                        veiculos.IDENT_VEICULOS = leftPad(veiculos.IDENT_VEICULOS, 7); // 0000001
                        veiculos.servicos = []
                    })

                    var contator = 0

                    $scope.all.forEach(function(item) {

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