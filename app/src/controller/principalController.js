angular.module("TopRoute")
    .controller("principalController",
        function($scope, $window, $mdBottomSheet, $document, $routeParams, $log, $filter, $location, $rootScope, $http, ngAudio, toastr, config, roteirizacaoItens, listarVeiculos, listaRotasDistribuicao, roteirizacoes, retRouteasy, $route, $anchorScroll, $localStorage, $mdDialog, $mdSidenav, $timeout, pickingListSERVICE) {


            //var socket = io.connect("http://localhost:3001");
            var socket = io.connect(config.baseUrlRealTime);


            socket.emit('TopRoute-login', { name: $localStorage.UsuarioLogado })
                // var ready = false;        

            // function checkConnection() {
            //     if (!socket.connected) {
            //         // try to connect again
            //         socket.connect();

            //         // seems like we have to join our room after reconnecting!
            //         socket.emit('TopRoute-Emite', {'name': 'paulo fantin'})
            //     }
            // }


            socket.on('middleware-retorno', function(ddataate) {

                const tableRow = document.getElementById("tableDocumentos").rows;



                setTimeout(function() {

                    $scope.rotas.forEach(function(item) {

                        if (item.COD_ROTAS_DISTRIBUICAO == parseInt(ddataate.cod_rota.substr(0, 2).trim())) {
                            item.retorno = null;
                        }
                    })

                    // document.getElementById("#avisoRetorno").fadeOut().empty();
                    // $("#avisoRetorno").fadeOut().empty();
                }, (60 * 1000) * 3);


                var veiculoSelecionado = [];
                const servMiddleware = []

                $scope.lstVeiculos.filter(function(vei) {

                    //LOOP DOS VEICULOS DE RETORNO DA ROUTEASY E VERIFICANDO NA LISTA DE VEICULO DO TOPROUTE SE EXISTE O MESMO VEICULO DE RETORNO
                    ddataate.rotasRouteasy.forEach(function(vei_retorno) {

                        const vRetorno = ("0000000" + vei_retorno.veiculo.toUpperCase()).slice(-7);

                        if (vei.IDENT_VEICULOS.toUpperCase() === vRetorno) {

                            vei.CAPACIDADE = vei_retorno.capacidade
                            vei.KM_TOTAL_DISTANCE = Math.round(vei_retorno.kms)

                            //procura todos os serviços do retorno
                            vei_retorno.locations.forEach(function(servicos) {

                                if (servicos.consolidations.length > 0) {
                                    //consolidado

                                    servicos.consolidations.forEach(function(consolidations) {

                                        const reg = $filter("filter")($scope.all, { COD_DOCUMENTO: parseInt(consolidations.cod_conhecimento) }, true)[0];

                                        reg.IDENT_VEICULOS = vei.IDENT_VEICULOS;
                                        reg.COD_VEICULOS = vei.COD_VEICULOS;
                                        reg.ORDEM_ENTREGA = servicos.order;




                                        console.log(`veiculo: ${vei_retorno.veiculo}  Conheimento : ${consolidations.cod_conhecimento} na ordem : ${servicos.order}  -  consolidado' `)
                                    })

                                } else {
                                    const reg = $filter("filter")($scope.all, { COD_DOCUMENTO: parseInt(servicos.services[0].cod_conhecimento) }, true)[0];

                                    reg.IDENT_VEICULOS = vei.IDENT_VEICULOS;
                                    reg.COD_VEICULOS = vei.COD_VEICULOS;
                                    reg.ORDEM_ENTREGA = servicos.order;

                                    console.log(`veiculo: ${vei_retorno.veiculo}  conhecimento : ${servicos.services[0].cod_conhecimento}  na orderm ${servicos.order} -  nao consolidado`)
                                        //noa consolidado

                                }

                            })

                            $scope.$applyAsync();

                            const _vei = {
                                veiculo: vei
                            }
                            veiculoSelecionado.push(_vei);







                            // for (var i = 0; i <  $scope.all.length; i++) {

                            //     if(i>0){
                            //         if(tableRow[i].cells[20].innerText ==="37305060"){
                            //             const lstLinhaServico1 = $filter("filter")($scope.all, { COD_DOCUMENTO: parseInt(tableRow[i].cells[20].innerText) }, true)[0];
                            //             tableRow[i].cells[0].innerText = lstLinhaServico1.IDENT_VEICULOS
                            //             console.log(tableRow[i].cells[20].innerText )
                            //         }
                            //     }
                            //   };
                        }


                    })

                    //ATULIZAR F5 REAL TIME MENU LATERAL
                    const servVei = $filter("filter")($scope.all, { COD_VEICULOS: parseInt(vei.COD_VEICULOS) }, true);
                    if (servVei) {
                        //Ajuste apostado como erro na filial de CGR, a cadas retorno ele somana no veiculo os serviços feigto um if para saber que ja esta carregado
                        if (vei.servicos.length <= 0) {
                            if (servVei.length > 0) {
                                servVei.forEach(function(item) {
                                    vei.servicos.push(item)
                                })
                            }
                        }
                    }




                })


                // atualiza por filial todas as caixas  de rotas de retorno routeasy (quem estiver online no toproute )
                if ($localStorage.UsuarioLogado.FilialSetada.ROTEIRIZACAO_SELECIONADA.CODIGO_ROTEIRIZACAO ===
                    parseInt(ddataate.cod_roteirizacao)) {

                    $scope.rotas.forEach(function(item) {

                        if (item.COD_ROTAS_DISTRIBUICAO == parseInt(ddataate.cod_rota.substr(0, 2).trim())) {
                            item.envio = 'SUCCESS' /// deixar a caixa verde apois o retorno da routeasy  -  faltar fazer o tratamento do css para deixar destivado quando nao tiver nenhum serviço na caixa
                            item.retorno = 'routeasy'
                        }
                    })



                    veiculoSelecionado.forEach(function(veiretorno) {

                        const veiculo = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: parseInt(veiretorno.veiculo.COD_VEICULOS) }, true)[0];
                        console.log(veiculo)


                        ddataate.rotasRouteasy
                    })


                    // $scope.lstVeiculos.forEach(async function (veiculo) {
                    //     veiculo.servicos = []


                    //     $filter("filter")(veiculoSelecionado, { COD_VEICULOS: parseInt(veiculo.COD_VEICULOS) }, true);


                    //     veiculoSelecionado
                    //     const servVei = await $filter("filter")($scope.all, { COD_VEICULOS: parseInt(veiculo.COD_VEICULOS) }, true);

                    //     if (servVei) {

                    //         if (servVei.length > 0) {
                    //             servVei.forEach(function (item) {
                    //                 veiculo.servicos.push(item)
                    //             })
                    //         }
                    //     }

                    // })
                }
                // console.log(ddataate)
            })

            // setInterval(checkConnection, 1000);
            socket.on('server ready', function(data) {

                const router = data.msg.split('-')


                if ($localStorage.UsuarioLogado.FilialSetada.ROTEIRIZACAO_SELECIONADA.CODIGO_ROTEIRIZACAO === parseInt(router[0])) {
                    $scope.rotas[4].envio = 'SUCCESS'
                        // console.log($scope.rotas[4].envio ='SUCCESS')
                        // swal("Ops!", `Erro ao gerar o picking List  (  ${data.msg}   - ${router[0]} ) !`, "success");
                }
            })

            socket.on('RetornoRouteasy', msg => {

                console.log(msg)



                swal("Ops!", `Erro ao gerar o picking List  (  ${msg} ) !`, "error");

                // let ul = document.getElementById("messages");
                // let li = document.createElement('li');
                // let br = document.createElement('br');
                // li.appendChild(document.createTextNode(msg));
                // ul.appendChild(li);

                // document.getElementById('typing').innerHTML = "";
                // document.getElementById('typing').hidden = true;
            })


            $scope.emitEvento = function() {
                    socket.emit("TopRoute-Emite", 'paulo fantin');
                }
                // setFiltroAtivivosLocalStorage();

            $localStorage.UsuarioLogado.FilialSetada.filtros = {
                "veiculo": '',
                "tipo": '',
                "documento": '',
                "mac": '',
                "remetente": '',
                "destinatario": '',
                "rota": '',
                "endereco": '',
                "cidade": '',
                "bairro": '',
                "cep": '',
                "em": '',
                "mx": '',
                "ret": '',
                "volume": '',
                "p": '',
                "pr": '',
                "valor": 0,
            }


            //  MARK: (opcaoFiltragemGridPrincial)  - array de carregamento do combo dos campos
            $scope.opcaoFiltragemGridPrincipal = [
                { name: "veiculo", ordem: 2, code: "veiculo" },
                { name: "Documento", ordem: 3, code: "documento" },
                { name: "Tipo", ordem: 4, code: "tipo" },
                { name: "Mac", ordem: 5, code: "NR_MAC" },
                { name: "Remetente", ordem: 5, code: "remetente" },
                { name: "Destinátario", ordem: 6, code: "destinatario" },
                { name: "Rota", ordem: 7, code: "rota" },
                { name: "Endereço", ordem: 8, code: "endereco" },
                { name: "Cidade", ordem: 9, code: "cidade" },
                { name: "Bairro", ordem: 10, code: "bairro" },
                { name: "CEP", ordem: 11, code: "cep" },
                { name: "EM", ordem: 12, code: "em" },
                { name: "MX", ordem: 13, code: "mx" },
                { name: "RET", ordem: 14, code: "ret" },
                { name: "Volume", ordem: 15, code: "valume" },
                { name: "P", ordem: 16, code: "p" },
                { name: "P.R", ordem: 17, code: "pr" },
                { name: "Valor", ordem: 18, code: "valor" }
            ]

            function loadingFilters(elemento, index) {

                if (index == 0) {

                    const response = roteirizacaoItens.data.filter(function(person, index, array) {

                        switch (elemento.campo) {
                            case "veiculo":

                                if (elemento.acao == 'contem') {
                                    return person.IDENT_VEICULOS.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {

                                    return (person.IDENT_VEICULOS == elemento.conteudo);
                                }
                                break;
                            case "documento":

                                if (elemento.acao == 'contem') {
                                    return person.COD_DOCUMENTO.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {

                                    return (person.COD_DOCUMENTO == elemento.conteudo);
                                }
                                break;
                            case "tipo":

                                if (elemento.acao == 'contem') {
                                    return person.IDENT_TIPO_DOCUMENTOS.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {

                                    return (person.IDENT_TIPO_DOCUMENTOS == elemento.conteudo);
                                }
                                break;
                            case "NR_MAC":

                                if (elemento.acao == 'contem') {
                                    return person.NR_MAC_FORMATADO.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {

                                    return (person.NR_MAC_FORMATADO == elemento.conteudo);
                                }
                                break;
                            case "remetente":

                                if (elemento.acao == 'contem') {
                                    return person.REMETENTE.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {

                                    return (person.REMETENTE == elemento.conteudo);
                                }
                                break;
                            case "destinatario":

                                if (elemento.acao == 'contem') {
                                    return person.DESTINATARIO.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.DESTINATARIO == elemento.conteudo);
                                }
                                break;
                            case "rota":

                                if (elemento.acao == 'contem') {
                                    return person.ROTA.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.ROTA == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.ROTA > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.ROTA < elemento.conteudo);
                                }
                                break;
                            case "endereco":

                                if (elemento.acao == 'contem') {
                                    return person.ENDERECO.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.ENDERECO == elemento.conteudo);
                                }
                                break;
                            case "cidade":

                                if (elemento.acao == 'contem') {
                                    return person.CIDADE.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.CIDADE == elemento.conteudo);
                                }
                                break;
                            case "bairro":

                                if (elemento.acao == 'contem') {
                                    return person.BAIRRO.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.BAIRRO == elemento.conteudo);
                                }
                                break;
                            case "cep":

                                if (elemento.acao == 'contem') {
                                    return person.CEP.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.CEP == elemento.conteudo);
                                }
                                break;
                            case "em":

                                if (elemento.acao == 'contem') {
                                    return person.DT_EMISSAO.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.DT_EMISSAO == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.DT_EMISSAO > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.DT_EMISSAO < elemento.conteudo);
                                }
                                break;
                            case "mx":

                                if (elemento.acao == 'contem') {
                                    return person.DT_MAXIMA.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.DT_MAXIMA == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.DT_MAXIMA > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.DT_MAXIMA < elemento.conteudo);
                                }
                                break;
                            case "ret":
                                if (elemento.acao == 'contem') {
                                    return person.QTD_RETORNO.toString().indexOf(parseInt(elemento.conteudo)) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.QTD_RETORNO == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.QTD_RETORNO > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.QTD_RETORNO < elemento.conteudo);
                                }
                                break;
                            case "volume":
                                if (elemento.acao == 'contem') {
                                    return person.QT_VOLUME.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.QT_VOLUME == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.QT_VOLUME > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.QT_VOLUME < elemento.conteudo);
                                }
                                break;
                            case "p":
                                if (elemento.acao == 'contem') {
                                    return person.PESO.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.PESO == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.PESO > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.PESO < elemento.conteudo);
                                }
                                break;
                            case "pr":
                                if (elemento.acao == 'contem') {
                                    return person.PESO_REAL.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.PESO_REAL == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.PESO_REAL > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.PESO_REAL < elemento.conteudo);
                                }
                                break;
                            case "valor":
                                if (elemento.acao == 'contem') {
                                    return person.VALOR.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.VALOR == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.VALOR > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.VALOR < elemento.conteudo);
                                }
                                break;

                            default:
                                break;
                        }

                    });

                    elemento.itens = response;
                    elemento.qtd = elemento.itens.length;
                    $scope.all = response;

                } else {

                    const regs = $localStorage.UsuarioLogado.FilialSetada.filtroAtivos[index - 1]

                    //1841
                    const responseCombinations = regs.itens.filter(function(person, index, array) {

                        switch (elemento.campo) {
                            case "veiculo":

                                if (elemento.acao == 'contem') {
                                    return person.IDENT_VEICULOS.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {

                                    return (person.IDENT_VEICULOS == elemento.conteudo);
                                }
                                break;
                            case "documento":

                                if (elemento.acao == 'contem') {
                                    return person.COD_DOCUMENTO.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {

                                    return (person.COD_DOCUMENTO == elemento.conteudo);
                                }
                                break;
                            case "tipo":

                                if (elemento.acao == 'contem') {
                                    return person.IDENT_TIPO_DOCUMENTOS.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {

                                    return (person.IDENT_TIPO_DOCUMENTOS == elemento.conteudo);
                                }
                                break;
                            case "mac":

                                if (elemento.acao == 'contem') {
                                    return person.NR_MAC_FORMATADO.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {

                                    return (person.NR_MAC_FORMATADO == elemento.conteudo);
                                }
                                break;
                            case "remetente":

                                if (elemento.acao == 'contem') {
                                    return person.REMETENTE.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {

                                    return (person.REMETENTE == elemento.conteudo);
                                }
                                break;
                            case "destinatario":

                                if (elemento.acao == 'contem') {
                                    return person.DESTINATARIO.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.DESTINATARIO == elemento.conteudo);
                                }
                                break;
                            case "rota":

                                if (elemento.acao == 'contem') {
                                    return person.ROTA.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.ROTA == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.ROTA > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.ROTA < elemento.conteudo);
                                }
                                break;
                            case "endereco":

                                if (elemento.acao == 'contem') {
                                    return person.ENDERECO.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.ENDERECO == elemento.conteudo);
                                }
                                break;
                            case "cidade":

                                if (elemento.acao == 'contem') {
                                    return person.CIDADE.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.CIDADE == elemento.conteudo);
                                }
                                break;
                            case "bairro":

                                if (elemento.acao == 'contem') {
                                    return person.BAIRRO.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.BAIRRO == elemento.conteudo);
                                }
                                break;
                            case "cep":

                                if (elemento.acao == 'contem') {
                                    return person.CEP.indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.CEP == elemento.conteudo);
                                }
                                break;
                            case "em":

                                if (elemento.acao == 'contem') {
                                    return person.DT_EMISSAO.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.DT_EMISSAO == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.DT_EMISSAO > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.DT_EMISSAO < elemento.conteudo);
                                }
                                break;
                            case "mx":

                                if (elemento.acao == 'contem') {
                                    return person.DT_MAXIMA.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.DT_MAXIMA == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.DT_MAXIMA > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.DT_MAXIMA < elemento.conteudo);
                                }
                                break;
                            case "ret":
                                if (elemento.acao == 'contem') {
                                    return person.QTD_RETORNO.toString().indexOf(parseInt(elemento.conteudo)) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.QTD_RETORNO == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.QTD_RETORNO > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.QTD_RETORNO < elemento.conteudo);
                                }
                                break;
                            case "volume":
                                if (elemento.acao == 'contem') {
                                    return person.QT_VOLUME.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.QT_VOLUME == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.QT_VOLUME > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.QT_VOLUME < elemento.conteudo);
                                }
                                break;
                            case "p":
                                if (elemento.acao == 'contem') {
                                    return person.PESO.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.PESO == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.PESO > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.PESO < elemento.conteudo);
                                }
                                break;
                            case "pr":
                                if (elemento.acao == 'contem') {
                                    return person.PESO_REAL.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.PESO_REAL == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.PESO_REAL > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.PESO_REAL < elemento.conteudo);
                                }
                                break;
                            case "valor":
                                if (elemento.acao == 'contem') {
                                    return person.VALOR.toString().indexOf(elemento.conteudo) !== -1;
                                }
                                if (elemento.acao == 'igual') {
                                    return (person.VALOR == elemento.conteudo);
                                }
                                if (elemento.acao == 'maior') {
                                    return (person.VALOR > elemento.conteudo);
                                }
                                if (elemento.acao == 'menor') {
                                    return (person.VALOR < elemento.conteudo);
                                }
                                break;

                            default:
                                break;
                        }

                    });

                    elemento.itens = responseCombinations;
                    elemento.qtd = elemento.itens.length;
                    $scope.all = responseCombinations;


                }

            }

            $scope.filtrarGrid = function(filtros) {

                if ($localStorage.UsuarioLogado.FilialSetada.filtroAtivos != undefined) {

                    $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.filter(function(elem, index, array) {
                        // console.log(index, elem)
                        loadingFilters(elem, index)
                    })
                }

                var element = findElement('#idFiltros');
                element.style.display = "none"

            }


            var element = findElement("#scannerprincipal");
            element.focus();


            $scope.data = {
                Agrupamento: false,
                merge: false
            };

            $scope.player = {
                gold: 100
            };

            $scope.items = [
                { name: 'Small Health Potion', cost: 4 },
                { name: 'Small Mana Potion', cost: 5 },
                { name: 'Iron Short Sword', cost: 12 }
            ];

            $scope.menuOptions = [
                ['Limpar caixa', function($itemScope) {

                    swal({
                            title: "Deseja limpar a caixa de rota: " + $itemScope.r.COD_ROTAS_DISTRIBUICAO,
                            text: "Ao confirmar serão descarregados " + $itemScope.r.services.length + " serviços para o grid principal",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        })
                        .then((willDelete) => {
                            if (willDelete) {


                                $itemScope.r.services.forEach(function(item) {

                                    var reg = $filter("filter")($scope.all, { NR_DOCUMENTO_FORMATADO: item.NR_DOCUMENTO_FORMATADO }, true)[0]

                                    if (reg) {
                                        reg.COD_VEICULOS = 0
                                        reg.IDENT_VEICULOS = ""
                                        reg.ORDEM_ENTREGA = ""
                                        reg.ROTA_DOC_REAL = -9999 // para limpar a caixa mandando todos os itens para o grid principal
                                        reg.FL_CONFERIDO = false

                                        // start to versão 1.7.6 do versao 1.7.8
                                        item.COD_VEICULOS = 0
                                        item.IDENT_VEICULOS = ""
                                        item.ORDEM_ENTREGA = ""
                                        item.ROTA_DOC_REAL = -9999
                                        item.FL_CONFERIDO = false
                                            // start do versão 1.7.6 do versao 1.7.8

                                    }

                                })


                                updateServicosVeiculoMouseOption($itemScope.r.services, 'voltaGridPrincipal');

                                $itemScope.r.services = [];

                            }
                        });



                }],
                null,

                ['Conferência', function($itemScope) {

                    // document.getElementById("myConferenciaManual").style.width = "100%";
                    document.getElementById("divModalConferencia").style.width = "100%";

                    $scope.veiculosRetornoAux = []
                    $scope.veiculosRetorno = []
                    $scope.servicosRotaConferencia = []
                    var vei = []

                    $scope.lstVeiculos = listarVeiculos.data;

                    const servicosCaixa = $filter("filter")($scope.all, { ROTA_DOC_REAL: parseInt($itemScope.r.COD_ROTAS_DISTRIBUICAO) }, true);


                    servicosCaixa.forEach(function(item) {
                        if (item.IDENT_VEICULOS != '') {
                            var idx = vei.indexOf(item.COD_VEICULOS)
                            if (idx < 0) {
                                vei.push(item.COD_VEICULOS)
                            }
                        }
                    })

                    // $itemScope.r.services.forEach(function (item) {
                    //     if (item.IDENT_VEICULOS != '') {
                    //         var idx = vei.indexOf(item.COD_VEICULOS)
                    //         if (idx < 0) {
                    //             vei.push(item.COD_VEICULOS)
                    //         }
                    //     }
                    // })

                    vei.forEach(function(vei) {

                        var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: parseInt(vei) }, true)[0];

                        if (reg) {
                            reg.servicos = []
                            $scope.veiculosRetorno.push(reg)
                        }
                    })

                    servicosCaixa.forEach(function(serv) {

                        var veiculo = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(serv.COD_VEICULOS) }, true);

                        if (veiculo) {
                            if (veiculo.length > 0) {
                                if (serv.COD_VEICULOS == veiculo[0].COD_VEICULOS) {
                                    veiculo[0].servicos.push(serv)

                                    if (veiculo[0].qtdConferido == undefined) {
                                        veiculo[0].qtdConferido = 0
                                    }
                                    if (serv.FL_CONFERIDO == true) {
                                        veiculo[0].qtdConferido = parseInt(veiculo[0].qtdConferido) + 1
                                    }
                                }
                            }
                        }
                    })

                    var CaixaSelecionadaConferencia = {
                        servicosCaixa: servicosCaixa, //$itemScope.r.services,
                        veiculos: $scope.veiculosRetorno,
                    }

                    $rootScope.RefreshConferencia(CaixaSelecionadaConferencia)

                }],
                null,

                [' Carregar selecionado(s) ', function($itemScope) {


                    var selRota = $itemScope.r.COD_ROTAS_DISTRIBUICAO;
                    $scope.rowsSelecteds.forEach(function(item) {
                        item.ROTA_DOC_REAL = selRota == '0A' ? -1 : parseInt(selRota)
                            // item.ROTA               = selRota == 0 || selRota == '0A'   ? item.ROTA : parseInt(selRota)
                        item.FL_ROTEIRIZAR = 1
                    })

                    angular.forEach($scope.all, function(value, key) {

                        angular.forEach($scope.rowsSelecteds, function(v, k) {
                            if (v.COD_DOCUMENTO == value.COD_DOCUMENTO) {
                                value.ROTA = v.ROTA;
                                value.ROTA_DOC_REAL = v.ROTA_DOC_REAL;
                                value.status = v.status;
                                value.selected = false;
                                value.FL_ROTEIRIZAR = v.FL_ROTEIRIZAR;

                                if (v.ORDEM_ENTREGA == null) {
                                    v.ORDEM_ENTREGA = 0
                                }

                                $itemScope.r.services.push(v);
                            }
                        })
                    })


                    // $http.put(config.baseUrl + "/api/putRota", JSON.stringify($scope.rowsSelecteds))
                    $http.put(config.baseUrl + "/api/putRota", $scope.rowsSelecteds)
                        .then(
                            function sucesso(response) {
                                if (response.status == 200) {
                                    swal("Salvo! ", "Itens incluído com sucesso na caixa de rota [" + selRota + "] !", "success");
                                }

                                if (response.status == 500) {
                                    swal("Erro! ", "Ocorreu algum erro ao incluir os dados selecionados na rota :   [" + selRota + "] !", "error");
                                }

                            },
                            function errorCallback(error) {
                                if (error.data != undefined) {
                                    var msg = error.data.Message + '\n' + error.status + ': \n' + error.statusText
                                    swal('Ops!', msg, "error");
                                } else {
                                    swal('Ops!', "ocorreu algum erro.", "error");
                                }
                            }
                        );

                    $scope.rowsSelecteds = [];

                }],
                null, ['Ajuste de rotas', function($itemScope) {

                    swal({
                            title: "Deseja ajustar todos os serviços da caixa para a rota : " + $itemScope.r.COD_ROTAS_DISTRIBUICAO,
                            // text: "Ao confirmar todos os serviços ficaram como padrão  na rota " + $itemScope.r.COD_ROTAS_DISTRIBUICAO  + " totais de serviços alterados" +  $itemScope.r.services.length ,
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        })
                        .then((willDelete) => {
                            if (willDelete) {

                                $scope.rowsSelecteds = [];
                                $scope.rowsSelecteds = $filter("filter")($scope.all, { ROTA_DOC_REAL: parseInt($itemScope.r.COD_ROTAS_DISTRIBUICAO) }, true);


                                var selRota = $itemScope.r.COD_ROTAS_DISTRIBUICAO;
                                $scope.rowsSelecteds.forEach(function(item) {
                                    item.ROTA_DOC_REAL = selRota == '0A' ? -1 : parseInt(selRota)
                                    item.ROTA = selRota == 0 || selRota == '0A' ? item.ROTA : parseInt(selRota)
                                    item.FL_ROTEIRIZAR = 1
                                })

                                angular.forEach($scope.all, function(value, key) {

                                    angular.forEach($scope.rowsSelecteds, function(v, k) {
                                        if (v.COD_DOCUMENTO == value.COD_DOCUMENTO) {
                                            value.ROTA = v.ROTA;
                                            value.ROTA_DOC_REAL = v.ROTA_DOC_REAL;
                                            value.status = v.status;
                                            value.selected = false;
                                            value.FL_ROTEIRIZAR = v.FL_ROTEIRIZAR;

                                            if (v.ORDEM_ENTREGA == null) {
                                                v.ORDEM_ENTREGA = 0
                                            }

                                            // $itemScope.r.services.push(v);
                                        }
                                    })
                                })


                                $http.put(config.baseUrl + "/api/putRota", $scope.rowsSelecteds)
                                    .then(
                                        function sucesso(response) {
                                            if (response.status == 200) {
                                                swal("Salvo! ", "Itens incluído com sucesso na caixa de rota [" + selRota + "] !", "success");
                                            }

                                            if (response.status == 500) {
                                                swal("Erro! ", "Ocorreu algum erro ao incluir os dados selecionados na rota :   [" + selRota + "] !", "error");
                                            }

                                        },
                                        function errorCallback(error) {
                                            if (error.data != undefined) {
                                                var msg = error.data.Message + '\n' + error.status + ': \n' + error.statusText
                                                swal('Ops!', msg, "error");
                                            } else {
                                                swal('Ops!', "ocorreu algum erro.", "error");
                                            }
                                        }
                                    );

                                $scope.rowsSelecteds = [];
                            }
                        });

                }],
                null, ['Enviar Routeasy', function($itemScope) {
                    $scope.enviarRouteasy($itemScope.r.COD_ROTAS_DISTRIBUICAO)

                }],

                //#region comentado
                // ['Ajuste de rotas', function ($itemScope) {
                //     $scope.veiculosRetornoAux = []
                //     $scope.veiculosRetorno = []
                //     $scope.servicosRotaConferencia = []
                //     var vei = []
                //     $scope.lstVeiculos = listarVeiculos.data;
                //     $itemScope.r.services.forEach(function (item) {
                //         if (item.IDENT_VEICULOS != '') {
                //             var idx = vei.indexOf(item.COD_VEICULOS)
                //             if (idx < 0) {
                //                 vei.push(item.COD_VEICULOS)
                //             }
                //         }
                //     })
                //     vei.forEach(function (vei) {
                //         var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: parseInt(vei) }, true)[0];
                //         if (reg) {
                //             reg.servicos = []
                //             $scope.veiculosRetorno.push(reg)
                //         }
                //     })

                //     $itemScope.r.services.forEach(function (serv) {
                //         var veiculo = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(serv.COD_VEICULOS) }, true);
                //         if (veiculo) {
                //             if (veiculo.length > 0) {
                //                 if (serv.COD_VEICULOS == veiculo[0].COD_VEICULOS) {
                //                     veiculo[0].servicos.push(serv)
                //                     if (veiculo[0].qtdConferido == undefined) {
                //                         veiculo[0].qtdConferido = 0
                //                     }
                //                     if (serv.FL_CONFERIDO == true) {
                //                         veiculo[0].qtdConferido = parseInt(veiculo[0].qtdConferido) + 1
                //                     }
                //                 }
                //             }
                //         }
                //     })
                //     $mdDialog.show({
                //         controller: 'ajusteRotasController',
                //         templateUrl: 'view/principal/ajusteRotas/ajusteRotas.tmpl.html',
                //         parent: angular.element(document.body),
                //         resolve: {
                //             itens: function () {
                //                 return $itemScope.r.services;
                //             },
                //             veiculosRetorno: function () {
                //                 return $scope.veiculosRetorno;
                //             },
                //             all: function () {
                //                 return $scope.all;
                //             },
                //             listarVeiculos: function () {
                //                 return $scope.lstVeiculos;
                //             }
                //         },
                //         // targetEvent: ev,
                //         clickOutsideToClose: false,
                //         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                //     })
                //         .then(function (answer) {
                //             // $scope.status = 'You said the information was "' + answer + '".';
                //             // console.log('You said the information was "' + answer + '".')
                //             console.log(answer);
                //         }, function () {
                //             $scope.status = 'You cancelled the dialog.';
                //             console.log('You cancelled the dialog.')
                //         });
                // }],
                // null,
                // ['Troca de caixa', function ($itemScope) {
                //     swal("Troca de caixa!", {
                //         icon: "success",
                //     });

                // }],
                // null,
                // ['Mais...', [
                //     ['Alert Cost', function ($itemScope) {
                //         alert('Alert Cost')
                //         // alert($itemScope.item.cost);
                //     }],
                //     ['Alert Player Gold', function ($itemScope) {
                //         alert('Alert Player Gold')
                //         // alert($scope.player.gold);
                //     }]
                // ]]
                // null,
                // ['Conferência', function ($itemScope) {
                //     $scope.veiculosRetornoAux       = []
                //     $scope.veiculosRetorno          = []
                //     $scope.servicosRotaConferencia  = []
                //     var vei                         = []
                //     $scope.lstVeiculos = listarVeiculos.data;
                //     $itemScope.r.services.forEach(function (item) {
                //         if (item.IDENT_VEICULOS != '') {
                //             var idx = vei.indexOf(item.COD_VEICULOS)
                //             if (idx < 0) {
                //                 vei.push(item.COD_VEICULOS)
                //             }
                //         }
                //     })
                //     vei.forEach(function (vei) {
                //         var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: parseInt(vei) }, true)[0];
                //         if (reg) {
                //             reg.servicos = []
                //             $scope.veiculosRetorno.push(reg)
                //         }
                //     })
                //     $itemScope.r.services.forEach(function (serv) {
                //         var veiculo = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(serv.COD_VEICULOS) }, true);
                //         if (veiculo) {
                //             if (veiculo.length > 0) {
                //                 if (serv.COD_VEICULOS == veiculo[0].COD_VEICULOS) {
                //                     veiculo[0].servicos.push(serv)
                //                     if (veiculo[0].qtdConferido == undefined) {
                //                         veiculo[0].qtdConferido = 0
                //                     }
                //                     if (serv.FL_CONFERIDO == true) {
                //                         veiculo[0].qtdConferido = parseInt(veiculo[0].qtdConferido) + 1
                //                     }
                //                 }
                //             }
                //         }
                //     })
                //     $mdDialog.show({
                //         controller: 'tabshowController',
                //         templateUrl: 'view/principal/conferencia/tabDialog.tmpl.html',
                //         parent: angular.element(document.body),
                //         resolve: {
                //             itens: function () {
                //                 return $itemScope.r.services;
                //             },
                //             veiculosRetorno: function () {
                //                 return $scope.veiculosRetorno;
                //             },
                //             all: function () {
                //                 return $scope.all;
                //             },
                //         },
                //         clickOutsideToClose: false,
                //         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                //     })
                //         .then(function (answer) {
                //             // $scope.status = 'You said the information was "' + answer + '".';
                //             // console.log('You said the information was "' + answer + '".')
                //             console.log(answer);
                //         }, function () {
                //             $scope.status = 'You cancelled the dialog.';
                //             console.log('You cancelled the dialog.')
                //         });
                // }],
                //#endregion
            ];

            $scope.otherMenuOptions = [
                ['Favorite Color', function($itemScope, $event, color) {
                    alert(color);
                }]
            ]

            //#endregion


            $scope.contadorSelecteds = {
                qtd_Selecionados: 0,
                qtd_volumes: 0,
                qtd_Peso: 0,
                qtd_PesoReal: 0,
                qtd_ValorMecaria: 0,
                qtd_ValorFrete: 0
            }



            function rel_pickingList(veiculo) {

                pickingListSERVICE.pickingList(veiculo)
                return

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
                                { text: 'Capacidade: ', style: 'colorText', fontSize: 10 },
                                { text: veiculo.veiculo.CAPACIDADE + ' (kg)', fontSize: 10, bold: true, color: '#FF5600', alignment: 'center' },
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
                veiculo.veiculo.DOCUMENTOS.forEach(function(item) {

                    let fontSizePE = 7
                    let fontColorPE = "#242F53"
                    let fillColorPE = 'white'





                    if (item.COD_PRIORIDADE == 2) {
                        fontSizePE = 9
                        fontColorPE = "#7C79A2"

                    }
                    if (item.COD_PRIORIDADE == 4 || item.COD_PRIORIDADE == 5) {
                        fontSizePE = 12
                        fontColorPE = "blacck"
                        fillColorPE = '#C0C0C0'
                    }

                    if (item.TIPO_SERVICO == 'E') {
                        quatidadeTotalEntrega += 1
                        quatidadeTotal += 1
                        item.ORDEM = quatidadeTotal
                    }

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
                                    margin: [-32, 10, 0, 0],
                                    text: item.ORDEM + ')',
                                    style: 'filledHeader'
                                },

                                {
                                    width: '*',
                                    style: 'tableExample',
                                    margin: [-30, 5, -10, 0],
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
                                                { text: item.CIDADE, fontSize: 5, style: 'colorText' },
                                                { text: item.COD_ROTA, fontSize: 6, style: 'colorText', alignment: 'center' },
                                                { text: item.QT_VOLUMES, fontSize: 6, style: 'colorText', alignment: 'center' },
                                                { text: [{ text: item.PESO_NOTA, fontSize: 7, bold: true, alignment: 'right' }, ] },
                                                { text: [{ text: item.PESO_CALCULO, fontSize: 7, bold: true, alignment: 'right' }, ] },
                                                { text: item.QT_RETORNOS, fontSize: 7, alignment: 'center' },
                                                { text: item.COD_PRIORIDADE, fontSize: fontSizePE, alignment: 'center', color: fontColorPE, fillColor: fillColorPE },
                                                { text: item.VL_MERCADORIA.toLocaleString('pt-br', { minimumFractionDigits: 2 }), fontSize: 7, alignment: 'right' },
                                            ],
                                        ]
                                    },


                                    // layout: 'lightHorizontalLines',
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
                                margin: [-25, 0, 0, 0],
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

                        // { text: 'Agendamento:' + item.DT_AGENDAMENTO, fontSize: 7, bold: true, color: '#242F53' },

                        // if(item.VL_MERCADORIA){
                        //     ValorTotal      += item.VL_MERCADORIA
                        // }




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
                    text: 'Inclusão Minutas  :    _____________/_____________/_____________/_____________/_____________/_____________/_____________'
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


                veiculo.veiculo.DOCUMENTOS.forEach(function(item) {
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
                                            widths: [60, 90, 90, 30, 40, 15, 15, 15, 15, 15, 50],
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
                                                    { text: item.DOCUMENTO, fontSize: 5, style: 'colorText' },
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
                                        // layout: 'lightHorizontalLines',
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




                var body = [

                    pallet,
                    motorista,
                    servicos,
                    tipoPallet

                ];




                const docInfo = {
                    info: {
                        title: 'paulo',
                        author: 'pf',
                        subject: 'theme',
                        keywords: 'ffff sss'
                    },
                    pageSize: 'LETTER',
                    // pageOrientation:'landscape',
                    pageMargins: [30, 70, 30, 60],
                    // pageMargins: [30, 70, 30, 0],

                    header: [
                        { style: 'colorText', text: 'Picking List para carregamento', fontSize: 22, bold: true, margin: [15, 10, 0, 0], alignment: 'center' },
                        {
                            margin: [30, 0, 0, 0],
                            text: [
                                { text: 'Filial: ', style: 'colorText', fontSize: 10, alignment: 'left' },
                                { text: veiculo.veiculo.FILIAL, fontSize: 10, bold: true, color: '#FF5600' },
                                { text: '               Data do Processamento:', style: 'colorText', fontSize: 10 },
                                { text: moment(veiculo.veiculo.DT_INCLUSAO_ROTEIRIZACAO).format('DD/MM/YYYY'), fontSize: 10, bold: true, color: '#FF5600' },

                            ]

                        },

                        {
                            width: '*',
                            margin: [30, 0, 0, 0],
                            text: [
                                { text: 'Veiculo: ', style: 'colorText', fontSize: 10, alignment: 'left' },
                                { text: veiculo.veiculo.IDENT_VEICULOS, fontSize: 10, bold: true, color: '#FF5600', alignment: 'left' },

                            ]
                        },

                        {
                            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAABMCAIAAAAtGDQDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABG3SURBVHhe7ZwHXFTH9sfPNljYpfcmYkDsCAgkYgRFRH2GSOwaNZoYEzX6ecYSjS0WYmyJSh5ijTWieco/UWNvUSLYFSyICCi9SduFdcv/zN4rsg/YvQuyLPn4/SzLzNy7u3N/d+bMOTP3XpZCoYC36Ao2/f8tOuGt3Drlrdw65a3cOuWt3DpFV54J/sqLXCjMhLJ8qCgGiRhEZVgKPEMwMAJjMzCxBgtHsGkLhsb0R/6JNKfcJVnwOBFSE+HJNci4A+IyUMiJ7uQXqXclLBb+kXcWG9gcsHGFtj7g4Q/v+EM7H+Dx6d3+ETSD3Bl34eZRSDgMz5NBJgG5nC7XDhZwuGBkAt3CoEc4eIWB0ILe0pp5c3Jj442PhbNbIOMeSKvpwjcCmw18EwgYCsETwbMn6QStljchd0k2nIqGs1uhrICYi+aDawBuvhA+F3wHk7bfCmma3DjcHf8J/twAFSXEHOsGFBqN+6gV0LWf0u63JhorN37q6m+wbx4Upr8e9HQJtnS/ITD2B+LMtB4aJXdJDvwyE67FgewlXdJSoPv48RoIGt9aDLr2ciedg82fQkE6nW1x0La8NwombQRBK3BdtJT7+AY48C1UV9JZ/QGH0Jn7waE9ndVXGMstlxFLjaOiTEqX6Bvm9jD3D3inB53VS5jJjVpvmwrntjXVzzMwBmtnMLMDY3MSuyMYBKHDjmE9jgelOY2NiV4htII5cdChF53VPxjIjRJvnwZntjRSa4wM3QOg4/vQIQgc2xPFeTxg40s5uOGv47nEIfdlNVQWk6D/wUV4FA9ZDxr5c0JL+OY4eATQWT2DgdyHlsLhFUQUbXH3h15jibtmZqvF1AeqLC4nEwAXd0HiERI6aYuFIyw+B46edFaf0CQ3xuU/jwephM4ypENviJhPOjVfSJc0AjzBL3Lg7HY4HQ2leXQhQ1y7w5JzeuirqJU7+xEsDoTyIjrLBFs3GLkC/D4EQwFd0kSweoWZcGQlaexanXV0xr/YSZssvaFhubFxLekFKVfpLBMCx5Awz9LpzcfWaNxvn4Qd06Ewgy7RCJsDU3+B9z+ms/pBw3LHrSIuNsPxyoAPoyKh/1SyXNB85D+F6Elw/wKd1QiOGT/cIqZcb2igr73IhT/WMNUa7ca0PTBwZvNqjaClmn2EzMQypDSfjPM6mztjQANy75tLfGEmoMTT9xAJdGMlBebERKC3wxC0+Om36bQeUJ9GBRlkLYYRLJgYRQZGXU6Eorfz5U7weJfOqgdHV7SK6r0vHVKf3IdXMp0VCZ0CwZ+0wGwctvFpu0l0ygR03tHF0g/qKPWyisysMsHOHUZHttiqioMHjFtLupdG0Ks5v5NOtzR15L4SC+WFdFo9n0a1cBzRcxR49afT6rm8lzQjPaCO3Jf3MRrKO/eFLn3pNDPQ43z2PO/6zQfxCffuP3wqEmt3/DKZfNW63d+v3YWvnFxlg+BwL7uPH5cRuCC7e7lMbScrySbzMA1w5OiFiDHzFi3fUlWlZfCsPap+t0wKk22hsoTOqmHhGegaQqcZkPwgbUP0wXvJqeUVIplUZmRkaGNjMTS8z+jh/U2EjK7jeflS2sF3JFXbuF9Xd+vijolh4+bfvE3scozL1VCTHLJfQ3wwpyx8yaaYQ9Q3TJ081NLClNrSq/+U7BwyMxP7y3I/385UYTOh2rpTE0D0gk6rwdpVq0nOB4/SJ3654sz5xLz8YpGoqlry8kVpxePUZ1Exh6jjbDT/Cgt0srfyMSrqytfURO6drqwU7dz7x4495FVW/toXiBgc5GBn5e/bycO9DV3UbKjKfevPGp9JYQAKAShMQGGE3ZYqe0XIZK0imo2bDxYWkbNoaiL4bEL4wnmTPvqwj4O9VeR3U9s37QgnjBkUu2vlzs4p9rxapslQWXOhas2fJUFVOZ1WZebUEQd3R26LWmBuZkIXNRuqJi/jDr5hLeW2oMAuzmGRkV8OLKkCXgAHDSY1C9u5j/IfU9LSs6jEyKH9vpk1nsUiFiwrp9DR3hrT1CakUlR16/bDu8lPKipEfL5Bxw5uvt071HT5evkr/nZ5hZhr0K1baakjT4x1rrZi3xJbJpeaF0sMBGypp6DMl1NsXiEpquacP3aqxnCev3TDxck2JNgff//k2QSq3MfL09HBWrkd0I7fuvPo7v0npaXlPC7Xs70rNn9rK3Nqa3ZuYfL9tJTUTLSNBgY8j3bO/j0629laUlvVoGq75/nIX9ySOymFrgOrUsHJQMXZsL2IeL6MGTHhWxwhMeHqYv/t3Im+Xp4WdUS8m5y67PvtSQ+eSCT04hyHw27r6jh7xpj+fQPwrNRruwdEzExJfYaJNY43Itwyxbac+Te8z2Q5VsnoVs1ly70si3f7X0l8aDMprWetQwVU58rprWw2y91rmFy5ivTzutkD+/fExMOU9GU/7Lh1J6W6mh482Wy2W1uH1cu+8vZqfyju3Kbog6g49SkEq+fqYrd0weTegd5USUOoGBOFtKghrRGFgCVzQcPtDMbqWlxdRkSEcLnk+DOe5U6btWb4+AXLV+9Ag15zpp+mZ0+ZsermnUeoNe7pYG9taGiArsiTtOez5m/AJkztpgZs11jz07kOxzKdKa3tjcW2RmKZgjXAJZtnqgB7BY/9Wm0Om40vOqNKbl7RlJk/XE1MQq1RZTwrpqYCVJbD4fB45Jvbu7vgF2GJlaWZnY0l7oMHkp6ZO2/RzyKRmPqShlAxJnLT0oa0plCYsOR2nmwmwUUtIsKDcXjctf9YWloWNtK09Gx8/d/RS19NGT5+zCBsGj/95wCOorgnHsCq76bh8eQXlixaHvMwJUMsro5cuyvw3W7UVzWE3IIFbFZ2pbFCWTcHY9HGwGsWhpKHJabBjmRpwsuhZPNIi08PlFLnOGr9nDbOdti0yYdV2bn3KDqsmBAKjJYt/NzHqwMO7pf/vj0orKe9rRWWe3XxiNkw707S44AeXbAL4qbFK7bi1+YVFD9+8tyrq4fya+pHtXUbMpgCdLLXUm3SlMaOCNu/fVn0j3OHhgfb2pDgqLikLHLdrmtKI5NwLVm5I0z97KOQ4B4uznZotRfM/oSy7Ggin2drcmCUVertmCfkkiuNcsVG8xJ8/pPUnsfGDk+2CXlSD5uKmop7erTp6Fn/5VdXrt6lEh+F9xkyOKiNix2e/knjPqC0pjA1FdpaW5w8c3XrzrirryqPVGpq3aodqlZ3awgFv5GzrDjOhIYErF7x1b5t39krRxVs6afOJmCirEKk3AUcHWyoBIKtj07hYVRqOAwKT/Oy9e9d97UpNObI0spMDqe7Tr8S8E2Cd5VUacpZjJZby1/5iM5OrytTw0updEN07OiJiz6fsWrNhr37D506duJKjVXUiKrcLzW3W1YBsxC/Fuhr7z1w4nl2PlYLG6yzky1aQ2oT9lN8d21jT2WPn4qnRifc87+/n6cOw9CA51TrNCClZRV0ShWsvZd1yabAxL19/5rXPcmEJ3kpZx/PdL6Ua6vc+trPqxmQ69LODYcvwpnz1ypenWbsi1Rlzl+4sWnzwazsfGNj/rhRA9atnLErZnGNUcrN0zBrrSI3W2ysIYCXASs9U6v5ejS+3y7bvHjlljGTFs+Ysx4NMY6KaOOorX4+HfF91NBQym4cO3ll2tdrY3bGfb1g49ZfflfuAkM+CMLOi1ZSKFRemgKwbNX2J09p55KCVU3qJJZyFiR6/zveL7HAmseW1VjmPBEfpGAmcOLy6LFqycotcxdFFReXUtnaDB8SgqMfJq7dvD95emTM9sOr1u8eO2nxxuiDeCyp6c/lcvJb7m5Okz8Z8q5/F2xMNY17fdT+qJjf6Ex9qAyVLJE5yPJA2EAbVwA7W8ESPSRzbFwDulATz7Lyrt8iBvp5Vj6+qEKKoF7eoX39MTF6WCg6gr8fu4TeyLmL1/FF7YD4+XaaPgsWix0+qPe+2BNYiFpjOPrOq2aIsIrQT4Vfn7U9l2WPo2VC/uveIOBK/ayLsOaCni6hwRbHTpHJk4TryfjqG9RjQL//nTfvHxIwfvTAfbEn0W5Qu1Hlj9OeWVqaBvh25hsaYKfE+AAbEJ6Y7NwCM1MhWm20jdk5hSfO/D19yjDqI3XhLF26lE5ipf8+xHqaQSIxQ2WAUxsJsHMUbAyVUeug8eR6JWagsxES7GcqNBZXSVA1HpdjYiJwc3X8eGTYvFkTqAkT9LF6B3Z3cbLD4B7bDvqC1D6fjB00f9aEmkgHuwLGFNUSiaWFWZ/evmiU/k5MwhIbWXGwYeY71RWOZmJToVQk47JZCkOO3MJA0tGidH6newHSIjZGtWHT/Ad/KJXKUBeBgI8xpFtbR28vzzMXruG4YmNt0S/Yr42LPSr4XkBXdzfn0vJKhVyBWYHQCCuDo+XwiBC0e65tHPLyi7CeYnEV14AbGNBt2aIpPbw7lJWLMGx2drIbPCCQqnBdVMOc6E/hwg4UGgNLhSm+o3eFBp0EOKwyYNVcXTzjVwgcRacZg+e/oKAERUeB7GwthIJ6ZqYwlsvNL8I+q2YfNO4S1MuYj0JgR8YOAQvf5eck81hyBTYRY6g05haAoUTO4YPMVirmi+R0zTelkdVOALTI1NiLJxtNMAaxlARGfEMqPqDAs4K+XUWFGO0Yju3YAugNSguJ7jm2cRMTY4yNsSZYiCdSXFVtwONi0EDtVhdVuS/tgZ8nEKuhHp/BMPd3nS6YqSEnBWZ10nyRl5kdbH4ObLXztM2PqmfiFcZodebOCSjIpNMtzrntmrVGOgUB63XLbSlU5TazJYtSGpFJ4YJ+LEeJSuGvPXRaPd3C9KE7qsqNMFw0OP4jFKu4Yi3Dn5vIlcoaQT/KK5ROtyh15B4wA7g8Oq0GcRn89h2jXtx85D8l970xoXMfsHSm0y1KHbnt3aEdsxsAzu+A28QLbhmk1bBzBlQwu1w05HM9GdjryI0M+jejS0ewaW/5HHKf0Fldgt7U0fVw8xidVY+9B3gPotMtTX2y+keAC7MV0pJs2DRW64uvm058LPx3uWaHlSJ8DrliVD+oT270BYctYeqipiboWvHEI7DtC/KIDiY4d4ZeY+i0HtCA0fD/iDiqDLl3Fn4cAXlpdLb5oBzQ6InE/2MCmwNjvn9jF/a/CRqQGweWz6K1WJB8cAkiBxDdm89XqXwBsQth25dMtUbeGwE+/6LT+oFqEP8//LkBdn+thYJ8AQyaBQO/AtN6JuYbD1Yg7TrsnUtOKnOsXWFFvF5dS4+olVsuh59GQoK6Cdx6cPWCiAXQfQAYabeCXA8KOXGuT0QRpxM9feYYGJFZna796KzeoFZupLIEVoRC2g06yxQWec5L38+gW38wtyM2VFuqReQq4Yu7IP6A1uMw/tzY1TB4Fp3VJzTJjaBnHRkGeY3yr23bQde+4BMObb3IDaY4aqkJN3AkFL0gQXnyeeJTP7pMRNcWjBgGzoRxaxpzjpsfBnIj6bdhbUSTnvJgagvOnUjI6uQJVm3IgzGoWy7RLleUQGku5KeTO4VzUkijbvSzlfBcYpeauKnZ7xJqLMzkRlBx9PZyH9NZPQSbc+gXMG6d3mqNMJYbyU2FjWOIk8D8IzoDx8YP5sCwRS2+gKAebeRGygrIvaSJh/XrMRum1jD+J3gfo0f9WGBqGC3lRtDaHt8AcZHa3bzdTODA6BFAIjL0PlsD2stNga7hnq/JHRiylnsclcACwqbDh3Ob9KAD3dJYuRGphPjFcauIx9K4Z480GrTUGMKMWAZtu9MlrYQmyE2B1vx0NJzdRp742sRn7TABhXb3J6Oi98DW8nS12jRZborSfBL+nd1KvJdmuaWORZ4B2zmYrMtgu9bLEIYJb0huCjQvSWfJ4xzvnCI3ZzZdd2y/Ribk+WkBQ8mcMJOrBPSbNyp3DeJyeHgZHv4F9y9CbgqJxSVVTO07hweGRmQYbOdHlnQ79SZLBPqx0th0mkfu2lQUwbP7xMhQMXpxFplyqq6knyjB45NpW6EVmDuAnRs4diBLi46e5CFhqPs/juaX+y21aH2De6vmrdw65a3cOgTg/wGafiPveLFJQgAAAABJRU5ErkJggg==',
                            width: 70,
                            height: 50,
                            alignment: 'rigth',
                            margin: [520, -55, 0, 0]

                        },


                    ],

                    // footer: function (currentPage, pageCount) {
                    //     return [
                    //         {
                    //             text: currentPage.toString() + 'de' + pageCount,
                    //             alignment: 'center',
                    //             fontSize: 10,
                    //             margin: [0, 40, 10, 50]
                    //         },
                    //         {
                    //             text:'Paulo Roberto Chagas Fantin'
                    //         }
                    //     ]
                    // },
                    footer: [{
                        // margin: [0, 40, 10, 50],
                        width: '*',
                        // // style: 'tableExample',
                        margin: [50, 40, 10, 50],

                        // margin: [30, -15, -10, 0],
                        table: {
                            headerRows: 1,
                            body: [
                                [
                                    { text: 'PE (Prioridade de entrega)  =  (1) URGENTE - (2) AGENDAMENTO  -  (3) PRIORIDADE -  (4) ATRASADO -  (5) VENCE NO DIA  ', fontSize: 9, fillColor: '#C0C0C0', color: 'black' },
                                ]
                            ]
                        }
                    }],

                    content: [
                        body
                    ],

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
                        alignment: 'justify'
                    }
                }

                pdfMake.createPdf(docInfo).print();

            }


            function rel_pickingList_old(veiculo) {
                //paulo fantin
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
                                { text: 'Capacidade: ', style: 'colorText', fontSize: 10 },
                                { text: veiculo.veiculo.CAPACIDADE + ' (kg)', fontSize: 10, bold: true, color: '#FF5600', alignment: 'center' },
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
                veiculo.veiculo.DOCUMENTOS.forEach(function(item) {

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
                                    margin: [-32, 10, 0, 0],
                                    text: item.ORDEM + ')',
                                    style: 'filledHeader'
                                },

                                {
                                    width: '*',
                                    style: 'tableExample',
                                    margin: [-30, 5, -10, 0],
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
                                                { text: item.CIDADE, fontSize: 5, style: 'colorText' },
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


                                    // layout: 'lightHorizontalLines',
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
                                margin: [-25, 0, 0, 0],
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

                        // { text: 'Agendamento:' + item.DT_AGENDAMENTO, fontSize: 7, bold: true, color: '#242F53' },

                        // if(item.VL_MERCADORIA){
                        //     ValorTotal      += item.VL_MERCADORIA
                        // }




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
                    text: 'Inclusão Minutas  :    _____________/_____________/_____________/_____________/_____________/_____________/_____________'
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


                veiculo.veiculo.DOCUMENTOS.forEach(function(item) {
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
                                            widths: [60, 90, 90, 30, 40, 15, 15, 15, 15, 15, 50],
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
                                                    { text: item.DOCUMENTO, fontSize: 5, style: 'colorText' },
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
                                        // layout: 'lightHorizontalLines',
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
                    tipoPallettabl

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
                                { text: veiculo.veiculo.FILIAL, fontSize: 10, bold: true, color: '#FF5600' },
                                { text: '               Data do Processamento:', style: 'colorText', fontSize: 10 },
                                { text: moment(veiculo.veiculo.DT_INCLUSAO_ROTEIRIZACAO).format('DD/MM/YYYY'), fontSize: 10, bold: true, color: '#FF5600' },

                            ]

                        },

                        {
                            width: '*',
                            margin: [30, 0, 0, 0],
                            text: [
                                { text: 'Veiculo: ', style: 'colorText', fontSize: 10, alignment: 'left' },
                                { text: veiculo.veiculo.IDENT_VEICULOS, fontSize: 10, bold: true, color: '#FF5600', alignment: 'left' },

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

                    footer: function(currentPage, pageCount) {
                        return {
                            margin: 10,
                            columns: [{
                                fontSize: 9,
                                text: [{
                                        text: '--------------------------------------------------------------------------' +
                                            '\n',
                                        margin: [0, 20]
                                    },
                                    {
                                        text: '© xyz pvt., ltd. ' + currentPage.toString() + ' of ' + pageCount,
                                    }
                                ],
                                alignment: 'center'
                            }]
                        };

                    },

                    content: [
                        body
                    ],


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
                        alignment: 'justify'
                    }
                }



                docDefinition.dom = JSON.stringify(docDefinition);
                docDefinition.dom = JSON.parse(docDefinition.dom);

                pdfMake.createPdf(docDefinition).print();

            }

            // menuLateralVeiculos

            $scope.showAdvancedConfServices = function() {
                document.getElementById("divModalConferenciaServiceBotica").style.width = "100%";

                var Conferenciaservices = {
                    documents: $scope.all
                }

                $rootScope.RefreshConferenciaservices(Conferenciaservices)

            }

            $scope.pickingList_Todos_veiculos_pagina_Unica = function(listaVeiculos) {


                var arrayTwo = [];
                var arrayTwoND = [];
                $scope.lstVeiculos
                const veiculosImprimir = $scope.lstVeiculos.sort(function(a, b) {
                    return a.IDENT_VEICULOS.localeCompare(b.IDENT_VEICULOS)
                })




                const maiorquezero = veiculosImprimir.map(name => {
                    return name.servicos.length > 0 ? arrayTwo.push(name) : arrayTwoND.push(name);
                })



                pickingListSERVICE.pickingListTodos(listaVeiculos)


            }

            $scope.pickingList = function(cod_roteirizacao, veiculo) {

                var relatorio;

                try {
                    $http.get(config.baseUrl + "/api/detalhes/roteirizacao1/" + cod_roteirizacao + "/" + veiculo.IDENT_VEICULOS)
                        .then(
                            function sucesso(response) {
                                relatorio = response.data
                                rel_pickingList(relatorio);
                            },
                            function errorCallback(error) {
                                swal("Ops!", "Erro ao gerar o picking List" + "(" + error.data.Message + ") !", "error");
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

            $scope.filtroSelecionados = {
                campo: '',
                acao: '',
                conteudo: ''
            }

            $scope.acao = null;
            $scope.arr = null

            // MARK: (filtroItemExcluir) - para limpar o item da lista que nao quer mais no filtro
            $scope.filtroItemAcoes = function(item, acao) {


                switch (acao) {
                    case 'Selecionar':
                        $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.forEach(function(item) {
                            item.selecionado = false;
                        })

                        item.selecionado = true;
                        break;
                    case 'Excluir':
                        var element = findElement('#loading');
                        element.style.display = "block"

                        var reg = $filter("filter")($localStorage.UsuarioLogado.FilialSetada.filtroAtivos, { id: item.id }, true)[0];
                        if (reg)
                            var idx = $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.indexOf(reg)

                        if (idx >= 0) {
                            $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.splice(idx, 1)
                            $scope.$applyAsync();
                        }

                        // aplicaFiltros()
                        setFiltroAtivivosLocalStorage()



                        if ($localStorage.UsuarioLogado.FilialSetada.filtroAtivos != undefined) {
                            if ($localStorage.UsuarioLogado.FilialSetada.filtroAtivos.length > 0) {

                                $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.filter(function(elem, index, array) {
                                    // console.log(index, elem)
                                    loadingFilters(elem, index)
                                })
                            } else {

                                $scope.all = roteirizacaoItens.data;
                            }

                        }


                        setTimeout(function() {

                            var element = findElement('#loading');

                            element.style.display = "none"
                        }, 2000);

                        break;
                }




            }


            // MARK: (filtroItemExcluir) - para limpar o item da lista que nao quer mais no filtro
            $scope.filtroItemExcluir = function(item) {



                var reg = $filter("filter")($localStorage.UsuarioLogado.FilialSetada.filtroAtivos, { id: item.id }, true)[0];
                if (reg)
                    var idx = $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.indexOf(reg)

                if (idx >= 0) {
                    $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.splice(idx, 1)
                    $scope.$applyAsync();
                }


            }



            // MARK: (adicionarFiltro)  - Adiconar filtro no modal para poder levar ao grid
            $scope.adicionarFiltro = function(valor) {


                if ($scope.filtroSelecionados.campo == "" ||
                    $scope.filtroSelecionados.acao == "" ||
                    $scope.filtroSelecionados.conteudo == "") {

                    swal("Aviso", "Selecione uma opção de filtro", "warning");
                    return
                }

                if ($localStorage.UsuarioLogado.FilialSetada.filtroAtivos != undefined) {
                    const _condicao = $scope.filtroSelecionados.campo;
                    const exist = false;
                    var uniqueArray = $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.filter(function(elem, index, array) {
                        if (elem.campo === $scope.filtroSelecionados.campo) {
                            swal("Aviso", "Opção ja adicionada na lista de filtros na ordem: " + elem.id, "warning");
                            exist = true
                            return exist
                        }
                        //return array.indexOf( elem ) === index;
                        return exist
                    });

                    if (uniqueArray == true) {
                        return
                    }
                }

                if ($scope.filtroSelecionados.campo == "" ||
                    $scope.filtroSelecionados.acao == "" ||
                    $scope.filtroSelecionados.conteudo == "") {

                    swal("Aviso", "Selecione uma opção de filtro", "warning");
                    return
                }


                if ($localStorage.UsuarioLogado.FilialSetada.filtroAtivos == undefined) {
                    valorId = 0
                } else {
                    valorId = $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.length
                }

                const item = {
                    id: valorId + 1,
                    campo: $scope.filtroSelecionados.campo,
                    acao: $scope.filtroSelecionados.acao,
                    conteudo: $scope.filtroSelecionados.conteudo.toUpperCase(),
                    qtd: $scope.all.length
                        // , cod_filiais :
                }


                if ($localStorage.UsuarioLogado.FilialSetada.filtroAtivos == undefined) {
                    $localStorage.UsuarioLogado.FilialSetada.filtroAtivos = [];
                    $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.push(item)
                } else {
                    $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.push(item)
                }


                setFiltroAtivivosLocalStorage();


                if ($localStorage.UsuarioLogado.FilialSetada.filtroAtivos != undefined) {

                    $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.filter(function(elem, index, array) {
                        // console.log(index, elem)
                        loadingFilters(elem, index)
                    })
                }


            }


            $scope.limparFilfro = function() {


                swal({
                        title: "Deseja limpar o(s)  filtro(s)?",
                        text: "Ao confirmar ira carregar novamente os todos os dados iniciais.",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                        if (willDelete) {





                            var element = findElement('#loading');
                            element.style.display = "block"



                            $scope.all = roteirizacaoItens.data; // todos os itens da base (XML gerado no newsitex)
                            $localStorage.UsuarioLogado.FilialSetada.filtroAtivos = null;
                            // aplicaFiltros();
                            setFiltroAtivivosLocalStorage();


                            setTimeout(function() {

                                var element = findElement('#loading');

                                element.style.display = "none"
                            }, 1000);


                        } else {
                            console.log('cancelado ao clicar no voltaGridPrincipal')
                            element.style.display = "none"
                                //swal("cancelado!");
                        }
                    });


            }

            // MARK: (showTrocaVeiculo) -TROCA DE VEICULO
            $scope.showTrocaVeiculo = function(veiculo) {

                $mdBottomSheet.show({
                    templateUrl: 'view/partials/BottomSheet-troca-veiculo/trocaVeiculo.html',
                    controller: 'trocaVeiculoController',
                    resolve: {
                        usuarioLogado: function(roteirizadorAPI, $rootScope, $localStorage, $location) {
                            return $localStorage.UsuarioLogado;
                        },
                        listaVeiculos: function() {

                            return listarVeiculos.data;
                        },
                        veiculoSelecionado: function() {
                            return veiculo
                        }
                    },
                    clickOutsideToClose: false
                }).then(function(clickedItem) {


                    clickedItem.forEach(function(item) {
                        item.COD_VEICULOS = null
                    })

                    // console.log(clickedItem)

                    $scope.toggleSidenav();
                    $scope.menuLateralVeiculos();
                    // $mdToast.show(
                    //     $mdToast.simple()
                    //         .textContent(clickedItem['name'] + ' - COD: ' + clickedItem['COD_FILIAIS'] + ' clicked!')
                    //         .position('top right')
                    //         .hideDelay(1500)
                    // );
                }).catch(function(error) {
                    // User clicked outside or hit escape
                });
            };

            $scope.scannerprincipal_model


            $scope.toggleSidenav = buildToggler('closeEventsDisabled');


            $scope.menuLateralVeiculos = function() {
                $scope.MenuLateralVeiculos = !$scope.MenuLateralVeiculos

                var toolbarMenuLateural = findElement("#toolbarManuLateralVeiculos");

                if ($scope.MenuLateralVeiculos) {
                    toolbarMenuLateural.classList.remove('hideMenuLateralVeiculos')
                    toolbarMenuLateural.classList.add('showMenuLateralVeiculos')

                    $scope.lstVeiculos = null;
                    $scope.lstVeiculos = listarVeiculos.data;

                    $scope.lstVeiculos.forEach(async function(veiculo) {
                        veiculo.servicos = []
                        const servVei = await $filter("filter")($scope.all, { COD_VEICULOS: parseInt(veiculo.COD_VEICULOS) }, true);

                        if (servVei) {

                            if (servVei.length > 0) {
                                servVei.forEach(function(item) {
                                    veiculo.servicos.push(item)
                                })
                            }
                        }

                    })
                } else {
                    toolbarMenuLateural.classList.remove('showMenuLateralVeiculos')
                    toolbarMenuLateural.classList.add('hideMenuLateralVeiculos')

                }





            }



            $scope.showDocumentoManifestado = function(ev) {
                $mdDialog.show({
                        controller: 'documento-manifestado-ctrl',
                        templateUrl: 'view/principal/documento-manifestado/documento-manifestado.html',
                        resolve: {
                            itens: function(roteirizadorAPI, $route) {
                                return $scope.all;
                            }
                        },
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })
                    .then(function(answer) {

                        $scope.lstVeiculos = $scope.all

                        // $http.get(config.baseUrl + "/api/listar/veiculos/" + answer)
                        //     .then(function sucesso(response) {


                        //         $scope.lstVeiculos.forEach(function (item) {
                        //             item.IDENT_VEICULOS = ("0000000" + item.IDENT_VEICULOS).slice(-7)
                        //         })
                        //     })

                        //   $scope.status = 'You said the information was "' + answer + '".';
                    }, function() {
                        // alert('clicou me cancelar')
                        //   $scope.status = 'You cancelled the dialog.';
                    });
            };



            $scope.printAllPickinglistNEW = function() {

                $scope.pickingListNEW(69323)

            }

            $scope.pickingListNEW = function(cod_roteirizacao) {

                var relatorio;

                try {
                    $http.get(config.baseUrl + "/api/pickinglist/Todos/" + cod_roteirizacao)
                        .then(
                            function sucesso(response) {
                                relatorio = response.data


                                $scope.veiculo = {
                                    servicos: []
                                }

                                const listaVeiculos = [];
                                var cod_veiculo = 0;
                                relatorio.forEach(function(item) {


                                    const servico = {}




                                    if (cod_veiculo == 0) {



                                        $scope.veiculo.FILIAL = item.FILIAL
                                        $scope.veiculo.DT_EMISSAO_MANIFESTOS = item.DT_EMISSAO_MANIFESTOS
                                        $scope.veiculo.DT_INCLUSAO_ROTEIRIZACAO = item.DT_INCLUSAO_ROTEIRIZACAO
                                        $scope.veiculo.IDENT_VEICULOS = item.IDENT_VEICULOS
                                        $scope.veiculo.CAPACIDADE = item.CAPACIDADE

                                        servico.CODIGO_ROTEIRIZACAO = item.COD_ROTEIRIZACAO
                                        servico.COD_VEICULOS = item.COD_VEICULOS
                                        servico.TIPO_SERVICO = item.TIPO_SERVICO
                                        servico.ORDEM = item.ORDEM
                                        servico.DOCUMENTO = item.DOCUMENTO

                                        $scope.veiculo.servicos.push(servico)

                                    } else {
                                        if (cod_veiculo == item.COD_VEICULOS) {
                                            $scope.veiculo.FILIAL = item.FILIAL
                                            $scope.veiculo.DT_EMISSAO_MANIFESTOS = item.DT_EMISSAO_MANIFESTOS
                                            $scope.veiculo.DT_INCLUSAO_ROTEIRIZACAO = item.DT_INCLUSAO_ROTEIRIZACAO
                                            $scope.veiculo.IDENT_VEICULOS = item.IDENT_VEICULOS
                                            $scope.veiculo.CAPACIDADE = item.CAPACIDADE

                                            servico.CODIGO_ROTEIRIZACAO = item.COD_ROTEIRIZACAO
                                            servico.COD_VEICULOS = item.COD_VEICULOS
                                            servico.TIPO_SERVICO = item.TIPO_SERVICO
                                            servico.ORDEM = item.ORDEM
                                            servico.COD_DOCUMENTO = item.COD_DOCUMENTO

                                            $scope.veiculo.servicos.push(servico)

                                            //adiciona no mesmi veico
                                        } else {
                                            listaVeiculos.push($scope.veiculo)


                                            $scope.veiculo = {
                                                servicos: []
                                            }




                                            $scope.veiculo.FILIAL = item.FILIAL
                                            $scope.veiculo.DT_EMISSAO_MANIFESTOS = item.DT_EMISSAO_MANIFESTOS
                                            $scope.veiculo.DT_INCLUSAO_ROTEIRIZACAO = item.DT_INCLUSAO_ROTEIRIZACAO
                                            $scope.veiculo.IDENT_VEICULOS = item.IDENT_VEICULOS
                                            $scope.veiculo.CAPACIDADE = item.CAPACIDADE

                                            servico.CODIGO_ROTEIRIZACAO = item.COD_ROTEIRIZACAO
                                            servico.COD_VEICULOS = item.COD_VEICULOS
                                            servico.TIPO_SERVICO = item.TIPO_SERVICO
                                            servico.ORDEM = item.ORDEM
                                            servico.COD_DOCUMENTO = item.COD_DOCUMENTO

                                            $scope.veiculo.servicos.push(servico)

                                        }
                                    }

                                    cod_veiculo = item.COD_VEICULOS

                                })




                                rel_pickingListNEW(relatorio);
                            },
                            function errorCallback(error) {
                                swal("Ops!", "Erro ao gerar o picking List" + "(" + error.data.Message + ") !", "error");
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
            }


            function rel_pickingListNEW(veiculo) {

                pickingListSERVICE.pickingListNEW(veiculo)
                return
            }


            $scope.printAllPickinglist = function() {


                var arrayTwo = [];
                var arrayTwoND = [];

                $scope.lstVeiculos
                const veiculosImprimir = $scope.lstVeiculos.sort(function(a, b) {
                    return a.IDENT_VEICULOS.localeCompare(b.IDENT_VEICULOS)
                })


                const maiorquezero = veiculosImprimir.map(name => {
                    return name.servicos.length > 0 ? arrayTwo.push(name) : arrayTwoND.push(name);
                })


                arrayTwo.forEach(function(veiculo) {
                    //pickingListSERVICE.pickingListAll(veiculo)
                    //pickingListSERVICE.pickingList(veiculo)
                    $scope.pickingList(veiculo.COD_ROTEIRIZACAO, veiculo, veiculo.IDENT_VEICULOS)
                });


                // swal({
                //     title: "Deseja Imprimir todos os PickingList?",
                //     text: "Ao confirmar os será impresso todos os pickinglist de carregamento dos veiculos usados na routeirização.",
                //     icon: "warning",
                //     buttons: true,
                //     dangerMode: true,
                // })
                //     .then((willDelete) =>  {
                //         if (willDelete) {


                //             var arrayTwo = [];
                //             var arrayTwoND = [];
                //             const veiculosImprimir = listarVeiculos.data.sort(function(a, b) {
                //                 return a.IDENT_VEICULOS.localeCompare(b.IDENT_VEICULOS)
                //             })




                //             const maiorquezero  = veiculosImprimir.map(name =>{
                //                 return name.servicos.length > 0 ? arrayTwo.push(name) : arrayTwoND.push(name) ;
                //             })



                //               arrayTwo.forEach(async function(item){
                //                 await rel_pickingList_All1(item)
                //             });


                //            // swal('Enviado para impressoa com sucesso!', `${ JSON.stringify(arrayTwo.length)}`, "success");

                //             // selecionarAll();
                //             // var itensSelecionados = $filter("filter")($scope.all, { selected: true }, true);

                //         } else {
                //             console.log('cancelado ao clicar no voltaGridPrincipal')
                //             //swal("cancelado!");
                //         }
                //     });


            }


            $scope.showAdvanced = function(ev) {
                $mdDialog.show({
                        controller: 'adicionarVeiculosController',
                        templateUrl: 'view/principal/adicionarVeiculos/adicionarVeiculos.tmp.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })
                    .then(function(answer) {
                        $http.get(config.baseUrl + "/api/listar/veiculos/" + answer)
                            .then(function sucesso(response) {
                                $scope.lstVeiculos = response.data;


                                $scope.lstVeiculos.forEach(function(item) {
                                    item.IDENT_VEICULOS = ("0000000" + item.IDENT_VEICULOS).slice(-7)
                                })
                            })

                        //   $scope.status = 'You said the information was "' + answer + '".';
                    }, function() {
                        // alert('clicou me cancelar')
                        //   $scope.status = 'You cancelled the dialog.';
                    });
            };


            function buildToggler(componentId) {
                return function() {
                    $mdSidenav(componentId).toggle();

                };
            }


            $location.search({});

            var calibracao
            var last_location
            var linhas = 12;
            var strokeWeight = 3
            var ultimo = undefined
            $scope.audioExisteEmVeiculo = ngAudio.load("sons/plin.mp3");
            $scope.audioNaoAchou = ngAudio.load("sons/erro.mp3");
            $rootScope.UsuarioLogado = $localStorage.UsuarioLogado;
            $rootScope.login = $localStorage.LoggeIn;
            $scope.habilitarMerge = false;
            $scope.resquest_routes = [];
            $scope.markers = [];
            $scope.geocodificacao = [];
            $scope.markerCluster = [];
            $scope.markersGrid = [];
            $scope.selectedRows = [];
            $scope.selectedRowsCopy = [];
            $scope.rowsSelecteds = [];
            $scope.rotasCopy = [];
            $scope.qtdSecinadoConferencia = 0;
            $scope.qtdRotasEnviadasRouteasy = 0;
            $scope.qtdRotasRetornadasRouteasy = 0;
            $scope.inverterSelecao = false;
            $scope.checkedMerge = false;
            $scope.barcode = false;
            $scope.opcaoTela = 'settings';
            $scope.all = roteirizacaoItens.data; // todos os itens da base (XML gerado no newsitex)
            $scope.rotas = listaRotasDistribuicao.data; // todas as rotas dessa filials



            if ($localStorage.UsuarioLogado.FilialSetada.filtroAtivos != undefined) {

                $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.filter(function(elem, index, array) {
                    // console.log(index, elem)
                    loadingFilters(elem, index)
                })
            }

            if (roteirizacaoItens.data.length > 0) {
                $localStorage.UsuarioLogado.FilialSetada.ROTEIRIZACAO_SELECIONADA = {
                    CODIGO_ROTEIRIZACAO: $localStorage.UsuarioLogado.FilialSetada.ROTEIRIZACAO_SELECIONADA.CODIGO_ROTEIRIZACAO,
                    TotalItens: roteirizacaoItens.data.length
                }
            }

            $scope.rotaEnvioRoutesy = {
                rota: 0,
                cod_roteirizacao: 0,
                descricao: '',
                totalServices: 0,
                pedoTotal: 0,
                totalServicesColeta: 0,
                pesoColeta: 0,
                totalServicesEntrega: 0,
                pesoEntrega: 0
            }

            $scope.peso = {
                total: 0,
                Coleta: 0,
                Entrega: 0
            }


            var jsonRotaZeroA = {
                COD_ROTAS_DISTRIBUICAO: '0A',
                DS_ROTAS_DISTRIBUICAO: "ROTA ORFÃ 1",
                IDENT_ROTAS_DISTRIBUICAO: "0000000000",
                KM_ROTAS_DISTRIBUICAO: 9999,
                envio: "Nao Enviado",
                on_off: true,
                retorno: false,
                services: []
            }

            var jsonRotaZero = {
                COD_ROTAS_DISTRIBUICAO: 0,
                DS_ROTAS_DISTRIBUICAO: "ROTA ORFÃ",
                IDENT_ROTAS_DISTRIBUICAO: "0000000000",
                KM_ROTAS_DISTRIBUICAO: 9999,
                envio: "Nao Enviado",
                on_off: true,
                retorno: false,
                services: []
            }

            var fil = {
                latlng: '-23.5256461, -46.6055707',
                end: 'R. Ferreira de Oliveira, 59 - Alto do Par',
                lat: '-23.5256461',
                lng: '-46.6055707'
            }

            // retorna todos as rotas que foram roteirizadas e  retornadas do lado routesy para lado TopRoute
            var retornos_routeasy = retRouteasy.data;
            $scope.retornos_routeasy = retRouteasy.data;
            $scope.pdfMake = $window.pdfMake;

            // $scope.roteirizacoes    = roteirizacoes.data;
            $scope.roteirizacoes = roteirizacoes.data

            $scope.rotas.push(jsonRotaZero);
            $scope.rotas.push(jsonRotaZeroA);

            var data1 = new Date();
            var dtFormatada1 = formatarData(data1, 112)
            var envio_route;

            $scope.rotas.forEach(function(item) {
                item.envio = 'Nao Enviado'
                item.services = []
                item.COD_ROTAS_DISTRIBUICAO_GRID = item.COD_ROTAS_DISTRIBUICAO
            })



            $scope.rotas.forEach(function(item) {

                var reg = $filter("filter")($scope.all, { ROTA_DOC_REAL: item.COD_ROTAS_DISTRIBUICAO == "0A" ? -1 : item.COD_ROTAS_DISTRIBUICAO }, true)
                if (reg.length > 0) {

                    reg.forEach(function(serv) {
                        item.services.push(serv)
                    })

                }
            })


            init();


            //#region  FUNCTION


            function init() {

                getRotasEnviadas()
                carregarVeiculos('normal');


                // $scope.retornoRouteasyButton()
                // retorno();
                // retornoRoutesyFunc();

                // $scope.$apply() ;
                // retornoRoutesyFunc();
            }



            function getRotasEnviadas() {

                $http.get(config.baseUrl + '/api/rotasEnviadas/' + $localStorage.UsuarioLogado.FilialSetada.ROTEIRIZACAO_SELECIONADA.CODIGO_ROTEIRIZACAO + '/' + dtFormatada1)
                    .then(function(response) {
                        $scope.qtdRotasEnviadasRouteasy = response.data.length
                        envio_route = response.data

                        $scope.rotas.forEach(function(item) {
                            item.retorno = false
                            item.on_off = false
                        })

                        envio_route.forEach(function(item) {
                            var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: item.COD_ROTA }, true);
                            var idx = $scope.rotas.indexOf(reg[0])

                            if (idx >= 0) {
                                $scope.rotas[idx].envio = 'Enviado'
                            }
                        })

                        retorno();

                    });
            }

            function carregarVeiculos(tipo, rotaSelecionada) {


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


                } else if (tipo == 'limparcaixas') {

                    var vei = []
                    $scope.lstVeiculos = listarVeiculos;

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

                    // $scope.all.forEach( async  function (item) {

                    //     await $http.get("http://toproute.com.br/api/simplifiled-conhecimento/" + item.COD_DOCUMENTO + '/' + $rootScope.UsuarioLogado.FilialSetada.COD_FILIAIS)
                    //         .then(
                    //             function sucesso(response) {
                    //                 $scope.baixa = response.data

                    //                 if ($scope.baixa.length == 0) {
                    //                     item.foto = ""
                    //                 } else {
                    //                     item.foto = $scope.baixa[0].completed_values_file_photo.replace('{{"', "").replace('"}}', "")
                    //                 }

                    //                 var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: item.COD_VEICULOS }, true);

                    //                 if (reg[0] != undefined) {
                    //                     contator = contator + 1;
                    //                     reg[0].servicos.push(item)
                    //                 }
                    //             }
                    //             ,
                    //             function errorCallback(error) {
                    //                 swal("Ops!", "Erro ao buscar dados da baixa na api externa do toproute !", "error");
                    //             }
                    //         )
                    // });

                }

            }

            function retorno() {
                var routes = []

                $scope.retornos_routeasy.forEach(function(item) {

                    if ($scope.checkedMerge == false) {
                        // DESAGRUPADO
                        var a = item.COD_ROTEIRIZACAO_ROTA.replace('[', '').replace(']', '').split(',')

                        a.forEach(function(item) {
                            if (item.length <= 3) {
                                routes.push(item)
                            }
                        })
                    } else {
                        // AGRUPADO
                        var merge = item.COD_ROTEIRIZACAO_ROTA.indexOf("[");

                        if (merge > -1) {
                            var a = item.COD_ROTEIRIZACAO_ROTA
                            routes.push(a)
                        } else {
                            var idx = item.COD_ROTEIRIZACAO_ROTA.indexOf(",");
                            if (idx > 0) {
                                var rotaRetorno = (item.COD_ROTEIRIZACAO_ROTA.substring(idx + 1, item.COD_ROTEIRIZACAO_ROTA.length))
                                routes.push(rotaRetorno)
                            }
                        }

                    }
                })



                if ($scope.checkedMerge == true) {

                    if ($scope.rotasCopy.length == 0) {
                        $scope.rotasCopy = angular.copy($scope.rotas)
                    }

                    routes.forEach(function(item) {
                        var merg = item.indexOf("[");

                        if (merg > -1) {

                            var rotaMerge = {

                                COD_ROTAS_DISTRIBUICAO: item,
                                DS_ROTAS_DISTRIBUICAO: '',
                                IDENT_ROTAS_DISTRIBUICAO: '',
                                KM_ROTAS_DISTRIBUICAO: '',
                                envio: "SUCCESS",
                                on_off: false,
                                retorno: false,
                                services: []
                            }

                            merg = item.replace('[', '').replace(']', '').split(',')

                            merg.forEach(function(i) {
                                // console.log(i)

                                var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: parseInt(i) }, true);
                                var idx = $scope.rotas.indexOf(reg[0])
                                var del = $scope.rotas.splice(idx, 1) //NOTE: splice metodo para deletar de array

                                del[0].services.forEach(function(serv) {
                                    rotaMerge.services.push(serv)
                                })

                            })

                            $scope.rotas.push(rotaMerge)

                        } else {

                            var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: parseInt(item) }, true);
                            reg[0].envio = 'SUCCESS'

                        }
                    })


                } else {

                    if ($scope.rotasCopy.length > 0) {
                        $scope.rotas = []
                        $scope.rotas = $scope.rotasCopy
                        $scope.rotasCopy = [];
                    }
                    // passar por todas as rotas retornadas
                    routes.forEach(function(i) {
                        var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: parseInt(i) }, true)[0];


                        if (reg) {

                            if (reg.length > 0) {
                                reg.envio = 'SUCCESS'
                            } else {
                                reg.envio = 'Nao Enviado'
                            }
                        }
                    });

                };

                // debugger
                console.log($filter("filter")($scope.rotas, { envio: 'SUCCESS' }, true));

            }


            function InserirMapa(agrupado, veiculo) {



                var clientes = angular.copy(veiculo)

                // $scope.InserirMapa = function (agrupado) {
                if ($scope.markers.length > 0) {
                    deleteMarkers();
                }

                // deleteMarkers();


                //ROOFTOP              PONTO EXATO
                //RANGE_INTERPOLATED   PONTO DA RUA
                //GEOMETRIC_CENTER     PROXIMO EM UM RAIO DE 1 KM OU MAIS
                //APPROXIMATE          PONTO COM PESSIMA QUALIDADE DE APROXIMAÇÃO
                //UNKNOWN              NÃO ENCONTRATO

                var urll
                var markers = [];
                $scope.markers = [];





            }

            function deleteMarkers() {
                clearMarkers();
                $scope.markers = [];
            }

            function clearMarkers() {
                setMapOnAll(null);
            }

            function setMapOnAll(map) {
                for (var i = 0; i < $scope.markers.length; i++) {
                    $scope.markers[i].setMap(map);
                }
            }

            function customIcon(opts) {
                return Object.assign({
                    // path: google.maps.SymbolPath.CIRCLE,
                    //path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
                    fillColor: 'blue',
                    fillOpacity: .5,
                    strokeColor: '#000',
                    strokeWeight: 1,
                    scale: 1,
                    url: '../../img/marker/servic48.png',
                    origin: new google.maps.Point(0, 0)
                        //  anchor: new google.maps.Point(parseFloat(0),parseFloat(0)),
                        //  scaledSize: new google.maps.Size(parseFloat(0),parseFloat(0))
                        //    labelOrigin: [30, 20]
                }, opts);
            }

            function somaHora(horaInicio, horaSomada) {
                horaIni = horaInicio.split(':');
                horaSom = horaSomada.split(':');
                horasTotal = parseInt(horaIni[0], 10) + parseInt(horaSom[0], 10);
                minutosTotal = parseInt(horaIni[1], 10) + parseInt(horaSom[1], 10);

                if (minutosTotal >= 60) {
                    minutosTotal -= 60;
                    horasTotal += 1;
                }




                horaFinal = ("00" + horasTotal).slice(-2) + ':' + ("00" + minutosTotal).slice(-2) // completaZeroEsquerda(horasTotal) + ":" + completaZeroEsquerda(minutosTotal); 
                return horaFinal;
            }


            function pegacor(cont) {
                var cores = {};
                if (cont == 0) {
                    cores = {
                        corlinha: "rgb(60, 179, 113)",
                        corMarker: '././img/marker/seq/green.png',
                        nomeCor: 'green'
                    }
                }

                if (cont == 1) {
                    cores = {
                        corlinha: "rgb(255, 70, 70)",
                        corMarker: '././img/marker/seq/red.png',
                        nomeCor: 'red'
                    }
                }
                if (cont == 2) {
                    cores = {
                        corlinha: "rgb(135, 206, 235)",
                        corMarker: '././img/marker/seq/blue.png',
                        nomeCor: 'blue'
                    }
                }
                if (cont == 3) {
                    cores = {
                        corlinha: "rgb(195 , 195, 195)",
                        corMarker: '././img/marker/seq/grey.png',
                        nomeCor: 'gray'
                    }
                }
                if (cont == 4) {
                    cores = {
                        corlinha: "rgb(131, 111, 255)",
                        corMarker: '././img/marker/seq/purple.png',
                        nomeCor: 'purple'
                    }
                }

                if (cont == 5) {
                    cores = {
                        corlinha: "rgb(255, 0, 255)",
                        corMarker: '../img/marker/seq/pink.png',
                        nomeCor: 'pink'
                    }
                }
                if (cont == 6) {
                    cores = {
                        corlinha: "rgb(127, 255, 212)",
                        corMarker: '../img/marker/seq/aqua.png',
                        nomeCor: 'aqua'
                    }
                }

                if (cont == 7) {
                    cores = {
                        corlinha: "rgb(255, 165, 74)",
                        corMarker: '../img/marker/seq/orange.png',
                        nomeCor: 'orange'
                    }
                }

                return cores
            }

            function InserirMapaNew() {

                if ($scope.RotaVeiculoManual.servicos != undefined) {

                    // var n =2
                    // var rotaSelecionada = $scope.rotas[n];
                    // var cores =  pegacor(n);
                    var cont = 0;
                    $scope.resquest_routes = [];
                    var parts1 = []


                    // $scope.RotaVeiculoManual.servicos.forEach(function (item) {

                    // var rotaSelecionada = item;

                    contadorSequencia = 1
                    cont = cont + 1

                    deleteMarkers()

                    var wyapints = [];
                    var wyapintsUnit = { location: '' };

                    for (var i = 0; i < $scope.RotaVeiculoManual.servicos.length; i++) {
                        var latlng = $scope.RotaVeiculoManual.servicos[i].lat + ',' + $scope.RotaVeiculoManual.servicos[i].lng

                        wyapintsUnit.location = latlng;
                        wyapints.push(wyapintsUnit)
                        wyapintsUnit = {};
                    }

                    // for (var i = 0; i < rotaSelecionada.servicos.length; i++) {
                    //   var latlng = rotaSelecionada.servicos[i].service.lat + ',' + rotaSelecionada.servicos[i].service.lng;
                    //   wyapintsUnit.location = latlng;

                    //   wyapints.push(wyapintsUnit)
                    //   wyapintsUnit = {};
                    // }

                    // QUEBRAR EM PARTES DE ATE 25 PONTOS POR CHAMADA CONFORTE A API  DO GOOGLE Solistica 
                    for (var i = 0, max = 25 - 1; i < wyapints.length; i = i + max) {
                        parts1.push(wyapints.slice(i, i + max + 1));
                    }

                    //quantidade de rotas cridas 
                    $rootScope.qtdRotasCriadas = 1


                    for (var i = 0; i < parts1.length; i++) {
                        var waypointsParts = [];

                        for (var j = 0; j < parts1[i].length; j++) {
                            waypointsParts.push(parts1[i][j])
                        }


                        // if (item.settings.retornaOrigem == true) {
                        //     $scope.destination =  item.origem.latlng
                        // } else {
                        //     $scope.destination = item.origem.latlng
                        // }
                        $scope.destination = fil.latlng //new google.maps.LatLng(fil.latlng); //PARI


                        var service_options = {
                            origin: fil.latlng //$scope.Filial
                                ,
                            destination: $scope.destination
                                // , destination: waypointsParts[waypointsParts.length - 1].location //waypointsParts[waypointsParts.length-1].location//$scope.Filial
                                ,
                            waypoints: waypointsParts,
                            travelMode: google.maps.TravelMode.DRIVING,
                            optimizeWaypoints: true
                                // ,drivingOptions: {
                                //     departureTime: new Date(2019, 10, 1+1, 7, 45),
                                //     trafficModel: 'pessimistic'
                                //   }
                        };

                        $scope.resquest_routes.push(service_options)

                    }

                    parts1 = []


                }
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


            function findElement(query) {
                //Funcion para realizar la busqueda del elemento.
                var id = document.querySelector(query);
                var elements = angular.element(id);
                return elements[0];
            }

            function successCallback(result) {
                toastr.success('Salvo com sucesso', 'Aviso');
            }


            function selectScannedCTRC(codBarrasNrDdocumento) {

                var table = findElement("#tableDocumentos");
                var rows = table.rows; // todos os serviços  do grid
                var i;


                for (i = 1; i < rows.length; i++) {

                    var col = rows[i].cells[1].innerHTML.substr(4, 20)


                    if (col.indexOf(codBarrasNrDdocumento) > -1) {

                        var reg = $filter("filter")($scope.all, { NR_DOCUMENTO: col }, true)[0];
                        if (reg) {
                            reg.selected = true;
                        }

                        // selectRow(rows[i], table, true);
                        // setTableRowPosition(rows[i]);
                        return true;
                    } else {

                    }
                }


                return false;
            }



            function setTableRowPosition(row) {
                var div = findElement("#divTableDocumentos");
                div.scrollTop = row.offsetTop - div.offsetHeight + 50;
            }


            function formatarData(data, tipoRetur) {

                var data = new Date(),
                    dia = data.getDate().toString(),
                    diaF = (dia.length == 1) ? '0' + dia : dia,
                    mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
                    mesF = (mes.length == 1) ? '0' + mes : mes,
                    anoF = data.getFullYear();

                var DataFormatada

                if (tipoRetur == 17) {

                    DataFormatada = diaF + "/" + mesF + "/" + anoF;
                }
                if (tipoRetur == 112) {
                    DataFormatada = anoF + mesF + diaF;

                }


                return DataFormatada
            }


            function leftPad(value, totalWidth, paddingChar) {
                var length = totalWidth - value.toString().length + 1;
                return Array(length).join(paddingChar || '0') + value;
            };


            function updateServicosVeiculoMouseOption(itens, acao) {

                if (acao == 'limparCaixa') {

                    $http.put(config.baseUrl + "/api/PUT_ROTA_DOC_REAL", itens)
                        .then(
                            function sucesso(reponse) {
                                swal("itens! retornaram ao grid principal!", {
                                    icon: "success",
                                });


                                $scope.servicosRotaConferencia.forEach(function(item) {

                                    var idx = $scope.all.indexOf(item)
                                    if (idx >= 0) {
                                        $scope.all[idx].ROTA_DOC_REAL = ''
                                        $scope.all[idx].selected = false
                                        $scope.all[idx].FL_CONFERIDO = false
                                        $scope.all[idx].TIPO_ROUTER = null
                                            //hotfix/emp-12  inicio pfantin 21/03/2020
                                            // $scope.all[idx].COD_VEICULOS = 0
                                            // $scope.all[idx].ORDEM_ENTREGA = ''
                                            // $scope.all[idx].IDENT_VEICULOS = ''
                                            //hotfix/emp-12  final  pfantin  21/03/2020
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

                                // itens.forEach(function (item) {
                                //     var idx = $scope.all.indexOf(item)
                                //     if (idx >= 0) {
                                //         $scope.all.splice(idx, 1)
                                //     }
                                // });

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

                    itens.forEach(function(item) {
                        item.ORDEM_ENTREGA = ''
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


            var updateServicosVeiculo = function(itens, acao, veiculo) {

                if (acao == 'voltaGridPrincipal') {

                    $http.put(config.baseUrl + "/api/PUT_ROTA_DOC_REAL", itens)
                        .then(
                            function sucesso(response) {
                                swal("Serviço(s) inserido do veículo com sucesso!", {
                                    icon: "success",
                                })


                                itens.forEach(function(item) {
                                    var idx = $scope.servicosRotaConferencia.indexOf(item)
                                    if (idx >= 0) {
                                        $scope.servicosRotaConferencia.splice(idx, 1)
                                    }
                                    item.selected = false;
                                })

                            },
                            function errorCallback(error) {
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)!", "error");

                            }
                        )

                    carregarVeiculos()

                }
                if (acao == 'descarregarVeiculoCaixa') {

                    $http.put(config.baseUrl + "/api/servicos", itens)
                        .then(
                            function sucesso(response) {
                                swal("serviços recolocados no grid principal!", {
                                    icon: "success",
                                })
                            },
                            function errorCallback(error) {
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)!", "error");

                            }
                        )

                    carregarVeiculos()

                    itens.forEach(function(item) {
                        item.ORDEM_ENTREGA = ''
                    })


                    // $http.put(config.baseUrl + "/api/servicos", itens)
                    //     .then(
                    //         function sucesso(response) {
                    //             swal("serviços recolocados no grid principal!", {
                    //                 icon: "success",
                    //             })
                    //         },
                    //         function errorCallback(error) {
                    //             swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)!", "error");

                    //         }
                    //     )

                    //     carregarVeiculos()

                    //     itens.forEach(function(item){
                    //         item.ORDEM_ENTREGA =  ''                    
                    //     })

                }
                if (acao == 'carregar') {

                    $http.put(config.baseUrl + "/api/servicos", itens)
                        .then(
                            function sucesso(response) {

                                var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: veiculo }, true);

                                if (reg) {
                                    var idx = $scope.lstVeiculos.indexOf(reg[0])
                                }

                                var vei = $scope.lstVeiculos[idx];

                                swal('Veículo: placa ' + vei.NR_PLACA + '\n | Ident ' + vei.IDENT_VEICULOS, "Serviço(s) inserido do veículo com sucesso!", {
                                    icon: "success",
                                })
                            },
                            function errorCallback(error) {
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)!", "error");

                            }
                        )

                    carregarVeiculos()
                        // $http.put(config.baseUrl + "/api/servicos",  itens).then(successCallback, function errorCallback(){});

                } else if (acao == "descarregar") {

                    $http.put(config.baseUrl + "/api/servicos/del", itens)
                        .then(
                            function sucesso(response) {

                                var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: veiculo }, true);

                                if (reg) {
                                    var idx = $scope.lstVeiculos.indexOf(reg[0])
                                }

                                var vei = $scope.lstVeiculos[idx];


                                swal('Descarregar veículo', "Veículo descarregado com sucesso!", {
                                        icon: "success",
                                    })
                                    // swal('Veículo: placa ' + vei.NR_PLACA + '\n | Ident ' + vei.IDENT_VEICULOS, "Serviço(s) descarregado do veículo com sucesso!", {
                                    //     icon: "success",
                                    // })


                            },
                            function errorCallback(error) {
                                swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)!", "error");

                            }
                        )
                }


            }


            //#endregion

            function selecionarAll() {

                $scope.all.forEach(function(item) {
                    if (item.COD_VEICULOS > 0) {
                        item.selected = true
                    }
                })

            }

            $scope.limparGridPrincial = function() {

                swal({
                        title: "Deseja limpar o grid principal ?",
                        text: "Ao confirmar os itens serão descarregados dos veículos e perderá o relacionamento do retorno da routeasy ou do carregamento manual.",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                        if (willDelete) {

                            selecionarAll();

                            var itensSelecionados = $filter("filter")($scope.all, { selected: true }, true);

                            itensSelecionados.forEach(function(item) {
                                if (item.COD_VEICULOS > 0) {
                                    item.COD_VEICULOS = 0
                                    item.ORDEM_ENTREGA = ''
                                    item.IDENT_VEICULOS = ''
                                    item.selected = false
                                    item.FL_CONFERIDO = false
                                }

                            });

                            // $http.put(config.baseUrl + "/api/servicos", itensSelecionados)
                            $http.put(config.baseUrl + "/api/servicos/del", itensSelecionados)
                                .then(
                                    function sucesso(reponse) {
                                        swal("Grid princila foi descarregado com sucesso!", {
                                            icon: "success",
                                        });


                                        itensSelecionados.forEach(function(item) {
                                            item.selected = false
                                        });


                                        //updateServicosVeiculo(itensSelecionados,'descarregarVeiculoCaixa')
                                        $scope.$applyAsync();

                                    },
                                    function errorCallback(error) {
                                        swal("Ops!", "ops algum erro ocorreu, acionar suporte lado solicita (integração)!", "error");
                                    }
                                )





                        } else {
                            console.log('cancelado ao clicar no voltaGridPrincipal')
                                //swal("cancelado!");
                        }
                    });


            }



            $scope.atualizar_Retorno_Routeasy = function(cod_roteirizacao) {

                $http.get(config.baseUrl + '/api/listar/integracaoLogs/' + cod_roteirizacao)
                    .then(
                        function sucesso(response) {
                            $scope.retornoRouteasy = response.data;
                            retornos_routeasy = $scope.retornoRouteasy;

                            retorno()

                            var routes = []

                            //$scope.checkedMerge = !$scope.checkedMerge


                            $scope.rotas.forEach(function(item) {
                                item.COD_ROTAS_DISTRIBUICAO_GRID = item.COD_ROTAS_DISTRIBUICAO
                            });


                            retornos_routeasy.forEach(function(item) {
                                if ($scope.checkedMerge == false) {
                                    // DESAGRUPADO
                                    var a = item.COD_ROTEIRIZACAO_ROTA.replace('[', '').replace(']', '').split(',')

                                    a.forEach(function(item) {
                                        if (item.length <= 3) {
                                            routes.push(item)
                                        }
                                    })
                                } else {
                                    // AGRUPADO
                                    var merge = item.COD_ROTEIRIZACAO_ROTA.indexOf("[");

                                    if (merge > -1) {
                                        var a = item.COD_ROTEIRIZACAO_ROTA
                                        routes.push(a)
                                    } else {
                                        var idx = item.COD_ROTEIRIZACAO_ROTA.indexOf(",");
                                        if (idx > 0) {
                                            var rotaRetorno = (item.COD_ROTEIRIZACAO_ROTA.substring(idx + 1, item.COD_ROTEIRIZACAO_ROTA.length))
                                            routes.push(rotaRetorno)
                                        }
                                    }

                                }
                            });

                            if ($scope.checkedMerge == true) {

                                if ($scope.rotasCopy.length == 0) {
                                    $scope.rotasCopy = angular.copy($scope.rotas)
                                }

                                routes.forEach(function(item) {

                                    var merg = item.indexOf("[");

                                    if (merg > -1) {

                                        var rotaMerge = {
                                            COD_ROTAS_DISTRIBUICAO_GRID: item.replace(",", "_").replace(",", "_").replace(",", "_").replace(",", "_").replace(",", "_").replace(",", "_").replace("[", "").replace("]", ""),
                                            COD_ROTAS_DISTRIBUICAO: item.replace(",", "-").replace(",", "-").replace(",", "-").replace(",", "-").replace(",", "-").replace(",", "-"),
                                            DS_ROTAS_DISTRIBUICAO: 'Merge-' + item,
                                            IDENT_ROTAS_DISTRIBUICAO: '',
                                            KM_ROTAS_DISTRIBUICAO: '',
                                            envio: "SUCCESS",
                                            on_off: false,
                                            retorno: false,
                                            services: [],
                                            merge: true
                                        }

                                        // debugger
                                        merg = item.replace('[', '').replace(']', '').split(',')

                                        merg.forEach(function(i) {
                                            // console.log(i)

                                            var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: parseInt(i) }, true);
                                            var idx = $scope.rotas.indexOf(reg[0])
                                            var del = $scope.rotas.splice(idx, 1)

                                            del[0].services.forEach(function(serv) {
                                                rotaMerge.services.push(serv)
                                            })

                                        })

                                        $scope.rotas.push(rotaMerge)

                                    } else {

                                        // item.COD_ROTAS_DISTRIBUICAO_GRID =  item                            

                                        var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: parseInt(item) }, true);
                                        reg[0].envio = 'SUCCESS'
                                        reg[0].COD_ROTAS_DISTRIBUICAO_GRID = item

                                    }
                                })


                            } else {

                                if ($scope.rotasCopy.length > 0) {
                                    $scope.rotas = []
                                    $scope.rotas = $scope.rotasCopy
                                    $scope.rotasCopy = [];
                                }

                                // passar por todas as rotas retornadas
                                routes.forEach(function(i) {
                                    var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: parseInt(i) }, true);
                                    reg[0].envio = 'SUCCESS'
                                });

                            };




                            $http.get(config.baseUrl + "/api/detalhes/roteirizacaoItens/" + cod_roteirizacao)
                                .then(
                                    function sucesso(response) {

                                        $scope.all = response.data
                                        $scope.rotas = [];
                                        $scope.rotas.push(jsonRotaZero)
                                        $scope.rotas.push(jsonRotaZeroA)
                                        $scope.rotas = listaRotasDistribuicao.data;

                                        $scope.rotas.forEach(function(item) {
                                            item.services = []
                                            item.COD_ROTAS_DISTRIBUICAO_GRID = item.COD_ROTAS_DISTRIBUICAO
                                        })

                                        $scope.all.forEach(function(item) {

                                            if (item.ROTA_DOC_REAL == 0) {
                                                var rota = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: item.ROTA_DOC_REAL }, true);
                                            } else {

                                                var rota = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: item.ROTA }, true);
                                            }

                                            if (rota.length > 0) {
                                                if (item.ROTA_DOC_REAL != null) {
                                                    rota[0].services.push(item)
                                                }
                                            }

                                            if (item.VALOR) {
                                                item.VALOR = item.VALOR.toLocaleString('pt-br', { minimumFractionDigits: 2 });
                                            }
                                        });



                                    },
                                    function errorCallback(error) {
                                        swal("Ops!", "Erro ao gerar o picking List" + data.ExceptionMessage + "(" + data.Message + ") !", "error");
                                    }
                                )


                        },
                        function errorCallback(error) {
                            swal("Ops!", "Erro ao gerar o picking List" + data.ExceptionMessage + "(" + data.Message + ") !", "error");
                        }
                    )




            }




            $scope.carregarVeiculoMenuLateral = function() {
                carregarVeiculos('normal')
            }

            $scope.opcaoEscolhidaTela = function(opcao) {
                $scope.opcaoTela = opcao
            }


            function retornoRoutesyFunc() {
                retorno()

                var routes = []


                $scope.habilitarMerge = !$scope.habilitarMerge

                $scope.data.merge = $scope.habilitarMerge

                $scope.rotas.forEach(function(item) {
                    item.COD_ROTAS_DISTRIBUICAO_GRID = item.COD_ROTAS_DISTRIBUICAO
                });


                $scope.retornos_routeasy.forEach(function(item) {
                    if ($scope.data.merge == false) {
                        // DESAGRUPADO
                        var a = item.COD_ROTEIRIZACAO_ROTA.replace('[', '').replace(']', '').split(',')

                        a.forEach(function(item) {
                            if (item.length <= 3) {
                                routes.push(item)
                            }
                        })
                    } else {
                        // AGRUPADO
                        var merge = item.COD_ROTEIRIZACAO_ROTA.indexOf("[");

                        if (merge > -1) {
                            var a = item.COD_ROTEIRIZACAO_ROTA
                            routes.push(a)
                        } else {
                            var idx = item.COD_ROTEIRIZACAO_ROTA.indexOf(",");
                            if (idx > 0) {
                                var rotaRetorno = (item.COD_ROTEIRIZACAO_ROTA.substring(idx + 1, item.COD_ROTEIRIZACAO_ROTA.length))
                                routes.push(rotaRetorno)
                            }
                        }

                    }
                });

                if ($scope.data.merge == true) {

                    if ($scope.rotasCopy.length == 0) {
                        $scope.rotasCopy = angular.copy($scope.rotas)
                    }

                    routes.forEach(function(item) {

                        var merg = item.indexOf("[");

                        if (merg > -1) {

                            var rotaMerge = {
                                COD_ROTAS_DISTRIBUICAO_GRID: item.replace(",", "_").replace(",", "_").replace(",", "_").replace(",", "_").replace(",", "_").replace(",", "_").replace("[", "").replace("]", ""),
                                COD_ROTAS_DISTRIBUICAO: item.replace(",", "-").replace(",", "-").replace(",", "-").replace(",", "-").replace(",", "-").replace(",", "-"),
                                DS_ROTAS_DISTRIBUICAO: 'Merge-' + item,
                                IDENT_ROTAS_DISTRIBUICAO: '',
                                KM_ROTAS_DISTRIBUICAO: '',
                                envio: "SUCCESS",
                                on_off: false,
                                retorno: false,
                                services: [],
                                merge: true
                            }

                            // debugger
                            merg = item.replace('[', '').replace(']', '').split(',')

                            merg.forEach(function(i) {
                                // console.log(i)

                                var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: parseInt(i) }, true);
                                var idx = $scope.rotas.indexOf(reg[0])
                                var del = $scope.rotas.splice(idx, 1)

                                del[0].services.forEach(function(serv) {
                                    rotaMerge.services.push(serv)
                                })

                            })

                            $scope.rotas.push(rotaMerge)

                        } else {

                            // item.COD_ROTAS_DISTRIBUICAO_GRID =  item                            

                            var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: parseInt(item) }, true)[0];
                            if (reg) {
                                reg.envio = 'SUCCESS'
                                reg.COD_ROTAS_DISTRIBUICAO_GRID = item
                            }

                        }
                    })


                } else {

                    if ($scope.rotasCopy.length > 0) {
                        $scope.rotas = []
                        $scope.rotas = $scope.rotasCopy
                        $scope.rotasCopy = [];
                    }

                    // passar por todas as rotas retornadas
                    routes.forEach(function(i) {
                        var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: parseInt(i) }, true)[0];
                        if (reg) {
                            reg.envio = 'SUCCESS'
                        }
                    });

                };

            }

            $scope.retornoRouteasyButton = function() {
                retornoRoutesyFunc()

            }

            $scope.ordenarPor = function(campo) {

                $scope.criterioDeOrdenacao = campo;
                $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;

            };


            $scope.fecharVeiculoManual = function(veiculo) {

                veiculo.servicos.forEach(function(item) {
                    item.selected = false
                })



                $scope.veiculoManual = []
                $scope.veiculoManualServicos = []


                // $scope.veiculoManualServicos =[]



            }


            $scope.excluirServicoVeiculoCaixaRota = function(acao) {

                if (acao == 'voltaGridPrincipal') {
                    var r = confirm("Descarregar itens para grid principal?");
                    if (r == true) {

                        var itensSelecionados = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);

                        itensSelecionados.forEach(function(item) {
                            if (item.COD_VEICULOS == null) {
                                item.ROTA_DOC_REAL = null
                            }
                        })

                        updateServicosVeiculo(itensSelecionados, 'voltaGridPrincipal')
                    }

                }
                if (acao == 'descarregarVeiculoCaixa') {
                    var r = confirm("Descarregar os itens selecionados do veículo?");
                    if (r == true) {

                        var itensSelecionados = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);

                        itensSelecionados.forEach(function(item) {
                            if (item.COD_VEICULOS > 0) {
                                item.COD_VEICULOS = 0
                                item.IDENT_VEICULOS = ''
                                item.selected = false
                                item.FL_CONFERIDO = false

                            }
                        })

                        updateServicosVeiculo(itensSelecionados, 'descarregarVeiculoCaixa')

                    }
                }

            }

            $scope.saveSectionManual = function(veiculos) {

                var descarregar = []

                //pega os itens selecionados
                veiculos.servicos.forEach(function(item) {
                    if (item.selected == true) {
                        item.TIPO_ROUTER == null
                        descarregar.push(item)
                    }
                })

                swal({
                        title: "Deseja descarregar iten(s) selecionado(s) ?",
                        text: "Ao confirmar os itens retornarão ao grid principal, podendo ser inserido(s) novamente em outro veículo.",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                        if (willDelete) {

                            $http.put(config.baseUrl + "/api/servicos/del", descarregar)
                                .then(
                                    function sucesso(response) {

                                        swal("Descarregado com sucesso!", {
                                            icon: "success",
                                        })

                                    },
                                    function errorCallback(error) {
                                        swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)!", "error");
                                    }
                                )


                            descarregar.forEach(function(item) {
                                veiculos.servicos.splice(veiculos.servicos.indexOf(item), 1)
                            })

                            descarregar.forEach(function(i) {
                                var idx = $scope.all.indexOf(i)

                                $scope.all[idx].COD_VEICULOS = ""
                                $scope.all[idx].IDENT_VEICULOS = ""


                            })

                            $scope.$applyAsync();


                        } else {
                            console.log('cancelado ao clicar no voltaGridPrincipal')
                                //swal("cancelado!");
                        }
                    });


            }

            $scope.trocaselecao = function(veiculo) {
                $scope.inverterSelecao = !$scope.inverterSelecao;

                veiculo.servicos.forEach(function(item) {
                    item.selected = !item.selected
                        // if(item.selected){
                        //     $scope.rowsSelectedsVeiculo.push(item);
                        //     totalizadorGridVeiculos($scope.rowsSelectedsVeiculo);
                        // }else{

                    //     $scope.rowsSelectedsVeiculo.splice($scope.rowsSelectedsVeiculo.indexOf(item, 1));
                    //     totalizadorGridVeiculos($scope.rowsSelectedsVeiculo);
                    // }
                })


                const setSelected = $filter("filter")(veiculo.servicos, { selected: true }, true);
                if (setSelected) {
                    totalizadorGridVeiculos(setSelected)
                }

            }





            $scope.openServicosVeiculoManual = function(veiculo) {
                $scope.veiculoManual = veiculo
                $scope.veiculoManualServicos = veiculo.servicos
            }


            $scope.setClickedRowGridDocumentosConferencia = function(index, event) {
                var achou = false;

                $scope.servicosRotaConferencia.services.forEach(function(value) {

                    if (value.selected == true) {
                        $scope.selectedRows.push(value);
                        $scope.selectedRowsCopy = angular.copy($scope.selectedRows);
                        achou = true;
                    }

                })


            }

            $scope.setClickedRowGridDocumentosConferenciaManual = function(index, event) {
                var achou = false;


                const regSel = $scope.veiculoManual.servicos[index]

                regSel.selected = !regSel.selected

                if (regSel.selected) {
                    $scope.rowsSelectedsVeiculo.push(regSel);
                    totalizadorGridVeiculos($scope.rowsSelectedsVeiculo);
                } else {

                    $scope.rowsSelectedsVeiculo.splice($scope.rowsSelectedsVeiculo.indexOf(regSel, 1));
                    totalizadorGridVeiculos($scope.rowsSelectedsVeiculo);

                }

                // $scope.veiculoManual.servicos.forEach(function (value) {

                //     if (value.COD_DOCUMENTO == regSel.COD_DOCUMENTO) {
                //         value.selected = !value.selected

                //         if(value.selected){
                //             $scope.rowsSelectedsVeiculo.push(value);
                //             totalizadorGridVeiculos($scope.rowsSelectedsVeiculo);
                //         }else{

                //             $scope.rowsSelectedsVeiculo.splice($scope.rowsSelectedsVeiculo.indexOf(regSel, 1));
                //             totalizadorGridVeiculos($scope.rowsSelectedsVeiculo);

                //         }
                //     }

                // })




            }

            $scope.setClickedRow = function(index, event, objeto, row) {

                var veiculo = row.COD_VEICULOS
                var Indet_veiculo = row.IDENT_VEICULOS
                var rotaReal = row.ROTA_DOC_REAL



                if (veiculo != '') {
                    //if(rotaReal!='')

                    //toastr.warning('Serviço dentro da caixa de rota:' +  rotaReal,'Bloqueio');
                    //else{
                    //toastr.warning('Serviço já relacionado no veiculo  para manipular abra o veiculo:' + Indet_veiculo,'Bloqueio');
                    //}

                } else {

                    if (rotaReal) {
                        if (veiculo == null) {
                            toastr.warning('Serviço dentro da caixa de rota:' + rotaReal, 'Bloqueio');
                        }
                    } else {


                        var table = findElement("#tableDocumentos");
                        var rows = table.rows; // todos os serviços  do grid
                        var i;

                        for (i = 1; i < rows.length; i++) {

                            var col = rows[i].cells[1].innerHTML.trim().substr(4, 20)

                            if (col.indexOf(row.NR_DOCUMENTO) > -1) {
                                var reg = $filter("filter")($scope.all, { NR_DOCUMENTO: row.NR_DOCUMENTO }, true)[0];

                                if (reg) {
                                    var idx = $scope.all.indexOf(reg);
                                    reg.selected = !reg.selected;
                                    break;
                                }
                            }
                        }



                        // $scope.selectedRow = index;

                        // var element = findElement('#' + objeto);
                        // var rows = element.rows;
                        // var row = rows[index + 1]
                        // var codDocumento = rows[index + 1].cells[1].innerHTML;

                        // $scope.all.forEach(function (value) {
                        //     if (value.status != "emVeiculo") {
                        //         if (value.COD_DOCUMENTO == codDocumento) {
                        //             if (event.ctrlKey == true) {
                        //                 value.selected = true;
                        //                 $scope.messagen = value.NR_DOCUMENTO_FORMATADO + ' ' + value.DESTINATARIO
                        //             } else {
                        //                 value.selected = !value.selected;
                        //             }
                        //         }
                        //     }
                        // })

                        $scope.rowsSelecteds = getAllSelectedRows()
                        $scope.peso = somaPeso()
                    }
                }
            }


            $scope.setClickedRowGridDocumentos = function(index, event, linha) {

                var veiculo
                var Indent_veiculo
                var placa_veiculo
                var rotaReal
                var lin = linha
                var ordem = 0
                var arrayOrdens = []
                var max = 0


                if (lin) {
                    veiculo = lin.COD_VEICULOS
                    Indent_veiculo = lin.IDENT_VEICULOS
                    placa_veiculo = lin.NR_PLACA
                    rotaReal = lin.ROTA_DOC_REAL
                }


                if ($scope.rowsSelecteds.length == 0) {

                    if (veiculo == null || veiculo == 0) {

                        if (veiculo != null) {
                            max = 1
                            lin.ORDEM_ENTREGA = max
                            linha.ORDEM_ENTREGA = max

                            arrayOrdens.push(lin.ORDEM_ENTREGA)
                        }

                    }
                } else {

                    if (veiculo > 0) {
                        if (rotaReal == null)
                            swal("Aviso! ", "Serviço já relacionado ao veiculo,  para manipular abra o veiculo  no grid lateral:" + Indent_veiculo, "Warnig");
                        // toastr.warning('Serviço já relacionado ao veiculo,  para manipular abra o veiculo  no grid lateral:' + Indent_veiculo, 'Bloqueio');
                        else {
                            toastr.warning('Serviço dentro da caixa de rota:' + rotaReal, 'Bloqueio');
                        }
                    }
                    if ($scope.rowsSelecteds.length > 0) {




                        $scope.rowsSelecteds.forEach(function(item) {
                            if (item.ORDEM_ENTREGA != null) {
                                arrayOrdens.push(item.ORDEM_ENTREGA)
                            } else {
                                item.ORDEM_ENTREGA = max + 1
                                arrayOrdens.push(item.ORDEM_ENTREGA)
                            }
                        })

                        max = Math.max.apply(Math, arrayOrdens)
                        lin.ORDEM_ENTREGA = max + 1
                        linha.ORDEM_ENTREGA = max + 1
                        arrayOrdens.push(lin.ORDEM_ENTREGA)



                    }
                }


                if (lin) {

                    // veiculo         = lin.COD_VEICULOS
                    // Indent_veiculo  = lin.IDENT_VEICULOS
                    // placa_veiculo   = lin.NR_PLACA
                    // rotaReal        = lin.ROTA_DOC_REAL

                    if (veiculo > 0) {
                        if (rotaReal == null)
                            swal("Aviso! ", "Serviço já relacionado ao veiculo,  para manipular abra o veiculo  no grid lateral:" + Indent_veiculo, "warning");
                        // toastr.warning('Serviço já relacionado ao veiculo,  para manipular abra o veiculo  no grid lateral:' + Indent_veiculo, 'Bloqueio');
                        else {
                            swal("Aviso! ", "Serviço dentro da caixa de rota:" + rotaReal, "warning");
                            // toastr.warning('Serviço dentro da caixa de rota:' + rotaReal, 'Bloqueio');
                        }
                    } else {

                        if (rotaReal) {
                            if (veiculo == null) {
                                swal("Aviso! ", "Serviço dentro da caixa de rota:" + rotaReal, "warning");
                                // toastr.warning('Serviço dentro da caixa de rota:' + rotaReal, 'Bloqueio');
                            }
                        } else {
                            if (event.ctrlKey == true) {
                                var idxend = $scope.all.indexOf(lin)
                                $scope.end = idxend
                            } else {
                                var idxstart = $scope.all.indexOf(lin)
                                $scope.start = idxstart;
                            }

                            if (event.ctrlKey) {

                                if ($scope.start < $scope.end) {

                                    if ($scope.start >= 0 && $scope.end >= 0) {
                                        for (var i = $scope.start; i <= $scope.end; i++) {
                                            $scope.all[i].selected = true;

                                        }
                                    }
                                } else {

                                    if ($scope.start >= 0 && $scope.end >= 0) {
                                        for (var i = $scope.end; i <= $scope.start; i++) {
                                            $scope.all[i].selected = true;

                                        }
                                    }
                                }

                            } else {



                                linha.selected = !linha.selected
                                if (linha.selected == false) {
                                    var idx = arrayOrdens.indexOf(lin.ORDEM_ENTREGA)
                                    if (idx >= 0) {
                                        arrayOrdens.splice(idx, 1)
                                    }
                                    linha.ORDEM_ENTREGA = null
                                }
                            }

                            var achou = false;

                            $scope.all.forEach(function(value) {

                                if (value.selected == true) {
                                    $scope.habilitarConfiguracoes = true;
                                    $scope.selectedRowsCopy = angular.copy($scope.selectedRows);
                                    achou = true;
                                    $scope.messagen = value.NR_DOCUMENTO_FORMATADO + ' ' + value.DESTINATARIO

                                } else {
                                    if (!achou) {
                                        $scope.habilitarConfiguracoes = false;
                                    }
                                }

                            })

                            $scope.rowsSelecteds = getAllSelectedRows()
                            $scope.peso = somaPeso()

                            totalizadorGrid($scope.rowsSelecteds)




                        }

                    }


                } else {

                    veiculo = $scope.all[index].COD_VEICULOS
                    Indent_veiculo = $scope.all[index].IDENT_VEICULOS
                    placa_veiculo = $scope.all[index].NR_PLACA
                    rotaReal = $scope.all[index].ROTA_DOC_REAL

                    if (veiculo != null) {
                        if (rotaReal == null)
                            toastr.warning('Serviço já relacionado ao veiculo,  para manipular abra o veiculo  no grid lateral:' + Indent_veiculo, 'Bloqueio');
                        else {
                            toastr.warning('Serviço dentro da caixa de rota:' + rotaReal, 'Bloqueio');
                        }
                    } else {

                        if (rotaReal) {
                            if (veiculo == null) {
                                toastr.warning('Serviço dentro da caixa de rota:' + rotaReal, 'Bloqueio');
                            }
                        } else {
                            if (event.ctrlKey == true) {
                                $scope.end = index

                            } else {
                                $scope.start = index;
                            }

                            if (event.ctrlKey) {

                                if ($scope.start < $scope.end) {

                                    if ($scope.start >= 0 && $scope.end >= 0) {
                                        for (var i = $scope.start; i <= $scope.end; i++) {
                                            $scope.all[i].selected = true;

                                        }
                                    }
                                } else {

                                    if ($scope.start >= 0 && $scope.end >= 0) {
                                        for (var i = $scope.end; i <= $scope.start; i++) {
                                            $scope.all[i].selected = true;

                                        }
                                    }
                                }

                            } else {
                                $scope.all[index].selected = !$scope.all[index].selected;

                            }

                            var achou = false;

                            $scope.all.forEach(function(value) {
                                if (value.selected == true) {
                                    $scope.habilitarConfiguracoes = true;
                                    $scope.selectedRowsCopy = angular.copy($scope.selectedRows);
                                    achou = true;
                                    $scope.messagen = value.NR_DOCUMENTO_FORMATADO + ' ' + value.DESTINATARIO

                                } else {
                                    if (!achou) {
                                        $scope.habilitarConfiguracoes = false;
                                    }
                                }
                            })

                            $scope.rowsSelecteds = getAllSelectedRows()
                            $scope.peso = somaPeso()

                            totalizadorGrid($scope.rowsSelecteds)
                        }

                    }
                }

            }



            $scope.mouseOvoer = function(event, index, row) {

                if (event.ctrlKey) {


                    var table = findElement("#tableDocumentos");
                    var rows = table.rows; // todos os serviços  do grid
                    var i;

                    for (i = 1; i < rows.length; i++) {

                        var col = rows[i].cells[1].innerHTML.trim().substr(4, 20)

                        if (col.indexOf(row.NR_DOCUMENTO) > -1) {
                            var reg = $filter("filter")($scope.all, { NR_DOCUMENTO: row.NR_DOCUMENTO }, true)[0];

                            if (reg) {
                                var idx = $scope.all.indexOf(reg);
                                reg.selected = !reg.selected;
                                break;
                            }

                            // if (reg) {
                            //     reg.selected = true;
                            // }


                            // selectRow(rows[i], table, true);
                            // setTableRowPosition(rows[i]);

                        }
                    }


                    $scope.rowsSelecteds = getAllSelectedRows()
                    $scope.peso = somaPeso()

                    totalizadorGrid($scope.rowsSelecteds);

                    return


                    console.log(row)

                    // var linha           = $scope.all[index - 1]
                    var veiculo = row.COD_VEICULOS
                    var Indent_veiculo = row.IDENT_VEICULOS
                    var rotaReal = row.ROTA_DOC_REAL


                    // var linha           = $scope.all[index - 1]
                    // var veiculo         = linha.COD_VEICULOS
                    // var Indent_veiculo  = linha.IDENT_VEICULOS
                    // var rotaReal        = linha.ROTA_DOC_REAL

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

            $scope.selecionarRota = function(index_rota) {


                var rota_atual = $scope.rotas[index_rota].COD_ROTAS_DISTRIBUICAO
                    //console.log($scope.rotas[index_rota])
                $scope.rotas.forEach(function(item) {
                    if (item.COD_ROTAS_DISTRIBUICAO == rota_atual) {
                        if (on_off == true) {
                            on_off = false
                        } else {
                            on_off = true
                        }
                    } else {
                        on_off = false
                    }

                });

                for (let index = 0; index < $scope.rotas.length; index++) {

                    var element = angular.element(document.querySelector('#rota_check-' + index));

                    if (element) {

                        if (rota_atual == $scope.rotas[index].COD_ROTAS_DISTRIBUICAO) {

                            element[0].checked = !element[0].checked

                        } else {
                            element[0].checked = false

                            var ro = angular.element(document.querySelector('#rota_check-RO'));
                            ro[0].checked = false

                        }
                    }

                    if (index_rota == "R.O" && rota_atual > 0) {
                        var ro = angular.element(document.querySelector('#rota_check-' + index));
                        ro[0].checked = false


                    }

                }

            }


            $scope.salvarSelecionados = function() {
                var selectedRoutes = $filter("filter")($scope.rotas, { on_off: true }, true);

                if (selectedRoutes.length == 0) {
                    // toastr.info('Selecione uma das rotas abaixo!', 'Aviso');
                    swal('Selecione uma das rotas abaixo!', "para aplicar o serviço a uma rota selecione uma caixa de rota.", "warning");
                } else {

                    var radioMerge = angular.element(document.querySelector('#idMerge'));

                    if (radioMerge[0].checked == true) {
                        // toastr.info('Desligue o merge para aplicar os serviços na rota selecionada!', 'Aviso');
                        swal('Desligue o agrupamento de rotas!', "somente com o agrupamento é possível ajustar o serviço na rota selecionada.", "warning");
                    } else {
                        if (selectedRoutes.length > 1) {
                            // toastr.info('Selecione apenas uma rota!', 'Aviso');
                            swal('Selecione apenas uma rota!', "deixe somente uma caixa de rota selecionado para aplicar a alteração.", "warning");

                        } else {

                            var selRota = selectedRoutes[0].COD_ROTAS_DISTRIBUICAO
                            $scope.rowsSelecteds.forEach(function(item) {
                                item.ROTA_DOC_REAL = parseInt(selRota)
                                item.ROTA = selRota == 0 ? item.ROTA : parseInt(selRota)
                                item.FL_ROTEIRIZAR = 1
                            })

                            angular.forEach($scope.all, function(value, key) {

                                angular.forEach($scope.rowsSelecteds, function(v, k) {
                                    if (v.COD_DOCUMENTO == value.COD_DOCUMENTO) {
                                        value.ROTA = v.ROTA;
                                        value.ROTA_DOC_REAL = v.ROTA_DOC_REAL;
                                        value.status = v.status;
                                        value.selected = false;
                                        value.FL_ROTEIRIZAR = v.FL_ROTEIRIZAR


                                        if (v.ORDEM_ENTREGA == null) {
                                            v.ORDEM_ENTREGA = 0
                                        }

                                        selectedRoutes[0].services.push(v)

                                    }
                                })
                            })

                            // $http.put(config.baseUrl + "/api/putRota", JSON.stringify($scope.rowsSelecteds))
                            $http.put(config.baseUrl + "/api/putRota", $scope.rowsSelecteds)
                                .then(
                                    function sucesso() {
                                        // toastr.success('Salvo com sucesso', 'Aviso');
                                        swal("Salvo! ", "Itens incluído com sucesso na caixa de rota [" + selRota + "] !", "success");

                                        var caixaConferencia = angular.element(document.querySelector('#idConferencia'));
                                        // var element = angular.element(document.querySelector('#route-' + cod_rota));
                                        var element = angular.element(document.querySelector('#route_0'));

                                        $scope.rotas.forEach(function(i) {

                                            if (i.COD_ROTAS_DISTRIBUICAO_GRID == undefined) {

                                                caixaConferencia = angular.element(document.querySelector('#route_' + i.COD_ROTAS_DISTRIBUICAO));
                                            } else {
                                                caixaConferencia = angular.element(document.querySelector('#route_' + i.COD_ROTAS_DISTRIBUICAO_GRID));
                                            }

                                            caixaConferencia[0].checked = false;
                                            i.on_off = false
                                        })



                                        // toastr.warning('Salvo paulo Fantin', 'Aviso');
                                    },
                                    function errorCallback(error) {
                                        if (error.data != undefined) {
                                            // toastr.error(error.data.Message +'\n' + error.status + ': \n' + error.statusText   , 'erro');
                                            var msg = error.data.Message + '\n' + error.status + ': \n' + error.statusText
                                            swal('Ops!', msg, "error");
                                        } else {
                                            swal('Ops!', "ocorreu algum erro.", "error");
                                            // toastr.error('Ops, ocorreu algum erro!','Error')
                                        }
                                    }
                                );

                            $scope.rowsSelecteds = [];

                        }
                    }

                }


                // return
                // console.log(selectedRows)

                var element = findElement('#divRotas');

                if (element.children.length > 0) {

                    var selRota = element.children[0].innerText.substring(1, element.children[0].innerText.length)
                        // element.children[0].innerText;


                    $scope.rowsSelecteds.forEach(function(item) {
                        item.ROTA_DOC_REAL = parseInt(selRota)
                        item.ROTA = parseInt(selRota)

                        // var selectedRows = $filter("filter")($scope.all, { COD_DOCUMENTO: item.COD_DOCUMENTO }, true);

                        // selectedRows.ROTA = parseInt(selRota)
                        // selectedRows.ROTA_DOC_REAL = parseInt(selRota)

                    })



                    // $scope.rowsSelecteds.forEach(function (value) {
                    //     value.ROTA = parseInt(selRota)
                    //     value.ROTA_DOC_REAL = parseInt(selRota)

                    //     $http.put(config.baseUrl + "/api/putRota", value)
                    //         .success(function (data, status) {
                    //             // toastr.success('Salvo com sucesso', 'Aviso');
                    //      })  

                    //      var rota = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: value.ROTA }, true);
                    //      if (rota.length > 0) {
                    //         if (value.ROTA_DOC_REAL != null) {
                    //             rota[0].services.push(value)
                    //         }
                    //      }

                    // })

                    angular.forEach($scope.all, function(value, key) {

                        angular.forEach($scope.rowsSelecteds, function(v, k) {
                            if (v.COD_DOCUMENTO == value.COD_DOCUMENTO) {
                                value.ROTA = v.ROTA;
                                value.ROTA_DOC_REAL = v.ROTA_DOC_REAL;
                                value.status = v.status;
                                value.selected = false;
                                value.FL_ROTEIRIZAR = v.FL_ROTEIRIZAR
                            }
                        })
                    })





                    $http.put(config.baseUrl + "/api/putRota", $scope.rowsSelecteds)
                        .then(function sucesso() {
                                toastr.success('Salvo com sucesso', 'Aviso');
                                // toastr.warning('Salvo paulo Fantin', 'Aviso');
                            },
                            function errorCallback(error) {
                                toastr.warning(error, 'Aviso');
                            });

                    $scope.rowsSelecteds = [];




                    $scope.rotas = []
                    $scope.rotas = listaRotasDistribuicao.data
                    $scope.rotas.forEach(function(item) {
                        item.services = []
                    })

                    $scope.all.forEach(function(item) {
                        var rota = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: item.ROTA }, true);

                        if (rota.length > 0) {
                            if (item.ROTA_DOC_REAL != null) {
                                rota[0].services.push(item)
                            }
                        }
                    })



                } else {
                    toastr.warning('Selecione ao meno uma rota', 'Aviso');

                }

                $scope.limparSelecionados()
            }

            $scope.selecionarCaixa = function(index_rota, cod_rota) {

                // debugger
                //caixa rota orfã

                if (cod_rota == "R0") {


                    var caixaConferencia = angular.element(document.querySelector('#idConferencia'));
                    var rotazero = angular.element(document.querySelector('#route_' + cod_rota));

                    if (caixaConferencia[0].checked == true) {
                        $scope.rotas.forEach(function(i) {
                            var caixaConferencia = angular.element(document.querySelector('#route_' + i.COD_ROTAS_DISTRIBUICAO_GRID));
                            caixaConferencia[0].checked = false;
                            i.on_off = false
                        })

                        rotazero[0].checked = true;

                    }

                } else {

                    var caixaConferencia = angular.element(document.querySelector('#idConferencia'));
                    // var element = angular.element(document.querySelector('#route-' + cod_rota));
                    var element = angular.element(document.querySelector('#route_' + cod_rota));


                    //if (caixaConferencia[0].checked == true) {
                    var caixaConferencia

                    $scope.rotas.forEach(function(i) {

                        if (i.COD_ROTAS_DISTRIBUICAO_GRID == undefined) {

                            caixaConferencia = angular.element(document.querySelector('#route_' + i.COD_ROTAS_DISTRIBUICAO));
                        } else {
                            caixaConferencia = angular.element(document.querySelector('#route_' + i.COD_ROTAS_DISTRIBUICAO_GRID));
                        }

                        caixaConferencia[0].checked = false;
                        i.on_off = false
                    })

                    var caixaConferenciaSel = angular.element(document.querySelector('#route_' + cod_rota));
                    caixaConferenciaSel[0].checked = true;
                    $scope.rotas[index_rota].on_off = true;


                    // } else {
                    //     $scope.rotas[index_rota].on_off = element[0].checked
                    //     var selectedRows = $filter("filter")($scope.rotas, { on_off: true }, true);
                    //}

                }


            }


            $scope.limparSelecionados_coferencia = function() {
                var rotas = []
                var selectedRows = $filter("filter")($scope.all, { selected: true }, true);

                selectedRows.forEach(function(item) {
                    item.selected = false;
                })

                $scope.rowsSelecteds = [];

            }

            $scope.limparSelecionados = function() {
                var rotas = []
                var selectedRows = $filter("filter")($scope.all, { selected: true }, true);

                selectedRows.forEach(function(item) {
                    item.selected = false;
                    item.ORDEM_ENTREGA = null;
                })

                $scope.rowsSelecteds = [];


                $scope.contadorSelecteds = {
                    qtd_Selecionados: 0,
                    qtd_volumes: 0,
                    qtd_Peso: 0,
                    qtd_PesoReal: 0,
                    qtd_ValorMecaria: 0,
                    qtd_ValorFrete: 0,
                }
            }


            $scope.limparSelecionadosVeiculos = function() {
                $scope.rowsSelectedsVeiculo = []
                var selectedRows = $filter("filter")($scope.all, { selected: true }, true);

                selectedRows.forEach(function(item) {
                    item.selected = false;
                    // item.ORDEM_ENTREGA = null;
                })


                $scope.contadorSelectedsnew = [];


                $scope.contadorSelectedsnew = {
                    qtd_Selecionados: 0,
                    qtd_volumes: 0,
                    qtd_Peso: 0,
                    qtd_PesoReal: 0,
                    qtd_ValorMecaria: 0,
                    qtd_ValorFrete: 0,

                }




            }

            $scope.limparRotasSelecionadasMenu = function() {

                var element = findElement('#divRotas');


                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }


            }


            $scope.scanner = function() {
                $scope.barcode = !$scope.barcode

                var myEl
                var eleDoc
                if ($scope.barcode == true) {
                    $scope.textoFind = 'Selecionar usando o scanner.'


                    eleDoc = angular.element(document.querySelector('#documentos'));
                    eleDoc.addClass('caixaSelecaoAtiva');

                    myEl = angular.element(document.querySelector('#scanner'));
                    myEl.removeClass('w3-grayscale-max')
                    myEl.addClass('normal');

                } else {
                    $scope.textoFind = 'Digite algo que contenha na lista'
                    myEl = angular.element(document.querySelector('#scanner'));

                    myEl.removeClass('normal')
                    myEl.addClass('w3-grayscale-max');

                    eleDoc = angular.element(document.querySelector('#documentos'));
                    eleDoc.removeClass('caixaSelecaoAtiva');
                }


                //  myEl  = null;
                $scope.$applyAsync();
            }



            function totalizadorGridVeiculos(selecionados) {

                $scope.contadorSelectedsnew = {
                    qtd_Selecionados: 0,
                    qtd_volumes: 0,
                    qtd_Peso: 0,
                    qtd_PesoReal: 0,
                    qtd_ValorMecaria: 0
                }


                var volumes = 0;
                var peso = 0;
                var pesoReal = 0;
                var valorMerc = 0;
                var valorFrete = 0;

                selecionados.forEach(function(item) {

                    if (item.QT_VOLUME == null || item.QT_VOLUME == undefined) {
                        item.QT_VOLUME = 0
                    }
                    volumes += parseFloat(item.QT_VOLUME)


                    if (item.PESO == null || item.PESO == undefined) {
                        item.PESO = 0
                    }
                    peso += parseFloat(item.PESO)



                    if (item.PESO_REAL == null || item.PESO_REAL == undefined) {
                        item.PESO_REAL = 0
                    }
                    pesoReal += parseFloat(item.PESO_REAL)


                    if (item.VALOR == null || item.VALOR == undefined) {
                        item.VALOR = 0
                    }

                    if (item.VALOR.toFixed(2)) {
                        valorMerc = (parseFloat(valorMerc) + (item.VALOR));
                    }

                    if (item.FRETE.toFixed(2)) {
                        valorFrete = (parseFloat(valorFrete) + (item.FRETE));
                    }


                })

                $scope.contadorSelectedsnew = {
                    qtd_Selecionados: selecionados.length,
                    qtd_volumes: volumes,
                    qtd_Peso: peso,
                    qtd_PesoReal: pesoReal,
                    qtd_ValorMecaria: valorMerc.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                    qtd_ValorFrete: valorFrete.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                }




            }


            function totalizadorGrid(selecionados) {

                $scope.contadorSelecteds = {
                    qtd_Selecionados: 0,
                    qtd_volumes: 0,
                    qtd_Peso: 0,
                    qtd_PesoReal: 0,
                    qtd_ValorMecaria: 0
                }


                var volumes = 0;
                var peso = 0;
                var pesoReal = 0;
                var valorMerc = 0;
                var valorFrete = 0;

                selecionados.forEach(function(item) {

                    if (item.QT_VOLUME == null || item.QT_VOLUME == undefined) {
                        item.QT_VOLUME = 0
                    }
                    volumes += parseFloat(item.QT_VOLUME)


                    if (item.PESO == null || item.PESO == undefined) {
                        item.PESO = 0
                    }
                    peso += parseFloat(item.PESO)



                    if (item.PESO_REAL == null || item.PESO_REAL == undefined) {
                        item.PESO_REAL = 0
                    }
                    pesoReal += parseFloat(item.PESO_REAL)


                    if (item.VALOR == null || item.VALOR == undefined) {
                        item.VALOR = 0
                    }

                    if (item.VALOR.toFixed(2)) {
                        valorMerc = (parseFloat(valorMerc) + (item.VALOR));
                    }

                    if (item.FRETE.toFixed(2)) {
                        valorFrete = (parseFloat(valorFrete) + (item.FRETE));
                    }


                })

                $scope.contadorSelecteds = {
                    qtd_Selecionados: $scope.rowsSelecteds.length,
                    qtd_volumes: volumes,
                    qtd_Peso: peso,
                    qtd_PesoReal: pesoReal,
                    qtd_ValorMecaria: valorMerc.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                    qtd_ValorFrete: valorFrete.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                }




            }


            function setLineGrid(nmtable, reg) {

                var elementScannerPrincipal = findElement("#scannerprincipal");

                var table = findElement(nmtable.toString());
                var rows = table.rows; // todos os serviços  do grid
                var rowNew = 0


                for (i = 1; i < rows.length; i++) {


                    // LOXALIZAR POR DOCUMENTO
                    var nrDocumento = rows[i].cells[1].innerHTML.trim().substr(4, 20);
                    // if (nrDocumento.indexOf($scope.scannerprincipal_model) > -1) {
                    if (nrDocumento == elementScannerPrincipal.value) {

                        //var idx = $scope.all.indexOf(reg);
                        rowNew = rows[i + 1];
                        reg.selected = true;

                        if ($scope.rowsSelecteds.indexOf(reg) < 0) {
                            $scope.rowsSelecteds.push(reg);
                        }

                        setTableRowPosition(rowNew);
                        $scope.peso = somaPeso();
                        totalizadorGrid($scope.rowsSelecteds)

                        break;
                    }

                    //LOCALIZAR POR CODIGO DE BARRAS
                    var codBarras = rows[i].cells[19].innerText.trim();
                    // if (codBarras.indexOf($scope.scannerprincipal_model) > -1) {
                    if (codBarras == elementScannerPrincipal.value) {


                        //var idx = $scope.all.indexOf(reg);
                        rowNew = rows[i + 1];

                        if ($scope.rowsSelecteds.indexOf(reg) < 0) {
                            $scope.rowsSelecteds.push(reg);
                        }

                        setTableRowPosition(rowNew);
                        $scope.peso = somaPeso();
                        totalizadorGrid($scope.rowsSelecteds)


                        break;

                    }

                }
            }




            $scope.onKeyUpTxtScannerNovo = function(event) {

                if (event.keyCode == 13) {

                    var element = findElement("#scannerprincipal");

                    var barras = $filter("filter")($scope.all, { COD_BARRAS: element.value }, true)[0]
                    var doc = $filter("filter")($scope.all, { NR_DOCUMENTO: element.value }, true)[0]

                    if (element.value == "" || element == undefined) {

                        swal("Digite um documento / Escaneie algum documento.", "documento não encontrado!", {
                                icon: "warning"
                            })
                            .then((value) => {
                                element.value = ""
                                element.focus();
                            });

                        return

                    }


                    if (barras == undefined && doc == undefined) {
                        $scope.audioNaoAchou.play();
                        swal("Código de barras / Nrº Documento : " + element.value, "documento não encontrado!", {
                                icon: "error"
                            })
                            .then((value) => {
                                element.value = "";
                                element.focus();
                            });
                    } else {


                        toastr.clear();
                        var reg = (barras != undefined ? barras : doc);
                        toastr.selecionaGrid("Documento: " + reg.NR_DOCUMENTO_FORMATADO, 'Selecionado');

                        reg.selected = true


                        setLineGrid('#tableDocumentos', reg)

                        element.value = "";
                        element.focus();




                    }

                }


            }

            $scope.onKeyUpTxtScanner = function(event) {

                var blnAchou = false;

                if (event.keyCode == 13) {

                    // if ($scope.Scanner == true) {
                    //loop procura em todo grid  se achar sez se nao achar manda o son quando o scanner estiver ativo 
                    /* == Lógica para enfocar el elemento  == */
                    // var element = findElement("#txtscanner");



                    var element = findElement("#scannerprincipal");
                    var table = findElement("#tableDocumentos");
                    var rows = table.rows; // todos os serviços  do grid
                    var rowNew = 0
                    var i;

                    if ($scope.scannerprincipal_model != "") {
                        for (i = 1; i < rows.length; i++) {

                            //LOCALIZAR POR NUMERO DE DOCUMENTO
                            var nrDocumento = rows[i].cells[1].innerHTML.trim().substr(4, 20);
                            if (nrDocumento.indexOf($scope.scannerprincipal_model) > -1) {
                                var reg = $filter("filter")($scope.all, { NR_DOCUMENTO: nrDocumento }, true)[0];
                                if (reg) {

                                    var idx = $scope.all.indexOf(reg);
                                    rowNew = rows[idx + 1];
                                    reg.selected = true;

                                    if ($scope.rowsSelecteds.indexOf(reg) < 0) {
                                        $scope.rowsSelecteds.push(reg);
                                    }

                                    setTableRowPosition(rowNew);

                                    $scope.scannerprincipal_model = "";
                                    element.focus();

                                    $scope.peso = somaPeso();
                                    blnAchou = true;
                                    totalizadorGrid($scope.rowsSelecteds)



                                    break;

                                }
                            }

                            //LOCALIZAR POR CODIGO DE BARRAS
                            var codBarras = rows[i].cells[19].innerText.trim();
                            if (codBarras.indexOf($scope.scannerprincipal_model) > -1) {
                                var reg = $filter("filter")($scope.all, { COD_BARRAS: codBarras }, true)[0];
                                if (reg) {

                                    var idx = $scope.all.indexOf(reg);
                                    rowNew = rows[idx + 1];
                                    reg.selected = true;

                                    if ($scope.rowsSelecteds.indexOf(reg) < 0) {
                                        $scope.rowsSelecteds.push(reg);
                                    }



                                    setTableRowPosition(rowNew);

                                    $scope.scannerprincipal_model = "";
                                    element.focus();

                                    $scope.peso = somaPeso();
                                    blnAchou = true;
                                    totalizadorGrid($scope.rowsSelecteds)


                                    break;
                                }
                            }

                        }
                    }
                    if (blnAchou == false) {

                        $scope.audioNaoAchou.play()

                        // var codBarrar = $scope.txtScanner;
                        swal("Código de barras / Nrº Documento : " + $scope.scannerprincipal_model, "documento não encontrado!", {
                                icon: "error"
                            })
                            .then((value) => {
                                $scope.scannerprincipal_model = "";
                                element.focus();

                            });

                    }


                    console.log($scope.selectedRows.length)

                    /* == Fin de la Lógica para enfocar el elemento  == */

                    //var blnAchou = false;
                    // angular.forEach($scope.all, function (value, key) {
                    //     if (value.COD_BARRAS == element.value || value.NR_DOCUMENTO == element.value) {
                    //         value.selected      = true;
                    //         //blnAchou            = true;
                    //         $scope.selectedRows.push(value);

                    //         documentoEmVeiculo  = value.NR_DOCUMENTO_FORMATADO
                    //         EmVeiculo           = value.IDENT_VEICULOS

                    //         //var row = rows[key + 1];
                    //         //setTableRowPosition(rowNew);
                    //         return
                    //     }

                    // });

                    return

                    if (blnAchou) {

                        element.value = "";
                        if (EmVeiculo != null && EmVeiculo != "") {
                            // $scope.audioExisteEmVeiculo.play();
                            toastr.warning('CTRC: ' + documentoEmVeiculo + ' com mesmo destinatário roteirizado para o veículo: :' + EmVeiculo, 'Atenção');
                        } else {

                            $scope.rowsSelecteds = getAllSelectedRows()
                            $scope.peso = somaPeso()

                            // swal("Selecionado: " +documentoEmVeiculo  , {
                            //     position: 'top-end',
                            //     icon: "success",
                            //     showConfirmButton: false,
                            //     timer: 1000,
                            // });

                            // toastr.success('Documento: ' + documentoEmVeiculo, 'Aviso');
                            element.Text = "";
                            element.focus();
                        }

                    } else {



                        if (selectScannedCTRC($scope.scannerprincipal_model) == false) {
                            $scope.audioNaoAchou.play()

                            var codBarrar = $scope.scannerprincipal_model;
                            swal("Código de barras / Nrº Documento : " + codBarrar, "Documento não encontrado!", {
                                    icon: "error"
                                })
                                .then((value) => {


                                    element.value = "";
                                    element.focus();


                                    // $scope.txtscanner ="";
                                    // $event.target.value="";
                                    // $event.target.select();
                                    // $event.target.focus();

                                });
                        }

                    }

                }

            }

            $scope.clickCheckBoxOpcoes = function(rdio) {
                var radioTrocaRota = findElement("#radioTrocaRota");
                var radioConferencia = findElement("#radioConferencia");
                var caixaConferencia = findElement("#caixaConferencia");

                if (radioTrocaRota == "radioTrocaRota") {

                    radioTrocaRota.checked == true
                    radioConferencia.checked == false

                    caixaConferencia.addClass = " w3-grayscale1-max"
                }

                if (radioTrocaRota == "radioConferencia") {

                    radioTrocaRota.checked == false
                    radioConferencia.checked == true
                    caixaConferencia.removeClass = " w3-grayscale1-max"

                }

            };


            $scope.rowsSelectedsVeiculo = [];
            $scope.onKeyUpTxtScannerConferenciaManual = function(event) {

                if (event.keyCode == 13) {
                    // if ($scope.Scanner == true) {


                    var element = findElement("#tableDocumentosConferenciaManual");
                    var rows = element.rows;


                    //loop procura em todo grid  se achar seleciona se nao achar manda o son quando o scanner estiver ativo 

                    /* == Lógica para enfocar el elemento  == */

                    var documentoEmVeiculo = '';
                    var EmVeiculo = '';
                    // var element = findElement("#txtscanner");
                    var element = findElement("#fnameConferenciaManual");


                    element.focus();
                    element.select();
                    /* == Fin de la Lógica para enfocar el elemento  == */
                    var veiculoEnter = 0;
                    var blnAchou = false;


                    $scope.veiculoManual.servicos.forEach(function(value) {

                        if (value.COD_BARRAS == element.value || value.NR_DOCUMENTO == element.value) {
                            blnAchou = true;
                            value.selected = true
                            veiculoEnter = value.IDENT_VEICULOS

                            $scope.rowsSelectedsVeiculo.push(value)
                            totalizadorGridVeiculos($scope.rowsSelectedsVeiculo)
                        }

                    });

                    if (!blnAchou) {
                        element.value = "";
                        $scope.audioNaoAchou.play();
                        toastr.error('Documento  não encontrado', 'Erro');
                        veiculoEnter = 0;
                    }

                }

            }

            function setFiltroAtivivosLocalStorage() {

                $localStorage.UsuarioLogado.FilialSetada.filtros = {
                    "veiculo": '',
                    "tipo": '',
                    "documento": '',
                    "mac": '',
                    "remetente": '',
                    "destinatario": '',
                    "rota": '',
                    "endereco": '',
                    "cidade": '',
                    "bairro": '',
                    "cep": '',
                    "em": '',
                    "mx": '',
                    "ret": '',
                    "volume": '',
                    "p": '',
                    "pr": '',
                    "valor": 0,
                    "itensGridOriginal": []
                }


                if ($localStorage.UsuarioLogado.FilialSetada.filtroAtivos != undefined) {

                    $localStorage.UsuarioLogado.FilialSetada.filtroAtivos.filter(function(elem, index, array) {

                        switch (elem.campo) {
                            case "veiculo":
                                $localStorage.UsuarioLogado.FilialSetada.filtros.veiculo = elem.conteudo;
                                break;
                            case "tipo":
                                $localStorage.UsuarioLogado.FilialSetada.filtros.tipo = elem.conteudo.toUpperCase();
                                break;
                            case "documento":
                                $localStorage.UsuarioLogado.FilialSetada.filtros.documento = elem.conteudo.toUpperCase();
                                break;
                            case "NR_MAC":
                                $localStorage.UsuarioLogado.FilialSetada.filtros.mac = elem.conteudo.toUpperCase();
                                break;
                            case 'remetente':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.remetente = elem.conteudo.toUpperCase();
                                break;
                            case 'destinatario':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.destinatario = elem.conteudo.toUpperCase();
                                break;
                            case 'rota':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.rota = elem.conteudo.toUpperCase();
                                break;
                            case 'endereco':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.endereco = elem.conteudo.toUpperCase();
                                break;
                            case 'cidade':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.cidade = elem.conteudo.toUpperCase();
                                break;
                            case 'bairro':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.bairro = elem.conteudo.toUpperCase();
                                break;
                            case 'cep':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.cep = elem.conteudo.toUpperCase();
                                break;
                            case 'em':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.em = elem.conteudo.toUpperCase();
                                break;
                            case 'mx':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.mx = elem.conteudo.toUpperCase();
                                break;
                            case 'ret':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.ret = elem.conteudo.toUpperCase();
                                break;
                            case 'valume':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.volume = elem.toUpperCase();
                                break;
                            case 'p':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.p = elem.conteudo.toUpperCase();
                                break;
                            case 'pr':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.pr = elem.conteudo.toUpperCase();
                                break;
                            case 'valor':
                                $localStorage.UsuarioLogado.FilialSetada.filtros.valor = elem.conteudo.toUpperCase();
                                break;
                        }

                        $scope.$applyAsync();

                    });

                    // setFiltroAtivivosLocalStorage();

                    if ($localStorage.UsuarioLogado.FilialSetada.filtros.itensGridOriginal.length <= 0) {
                        $localStorage.UsuarioLogado.FilialSetada.filtros.itensGridOriginal = $scope.all;
                    }

                }


            }

            $scope.modal = function(modal, rota) {
                if (modal == 'Filtros') {


                    var element = findElement('#idFiltros');
                    element.style.display = "block"


                    if ($localStorage.UsuarioLogado.FilialSetada.filtroAtivos != undefined)
                        setFiltroAtivivosLocalStorage()

                }

                if (modal == "envioRouteasy1") {

                    if ($scope.rotas[rota].services.length > 0) {

                        $scope.rotaEnvioRoutesy = {
                            rota: 0,
                            cod_roteirizacao: 0,
                            descricao: '',
                            totalServices: 0,
                            pesoTotal: 0,
                            totalServicesColeta: 0,
                            pesoColeta: 0,
                            totalServicesEntrega: 0,
                            pesoEntrega: 0
                        }


                        var pesototal = 0
                        var pesocoleta = 0
                        var pesoentrega = 0
                        var totalServicesColeta = 0
                        var totalServicesEntrega = 0

                        $scope.rotas[rota].services.forEach(item => {
                            pesototal = parseInt(pesototal) + parseInt(item.PESO)

                            if (item.IDENT_TIPO_DOCUMENTOS == 'C') {
                                pesocoleta = parseInt(pesocoleta) + parseInt(item.PESO)
                                totalServicesColeta = totalServicesColeta + 1
                            } else {
                                pesoentrega = parseInt(pesoentrega) + parseInt(item.PESO)
                                totalServicesEntrega = totalServicesEntrega + 1
                            }
                        });

                        $scope.rotaEnvioRoutesy = {

                            totalServices: $scope.rotas[rota].services.length,
                            rota: $scope.rotas[rota].COD_ROTAS_DISTRIBUICAO,
                            cod_roteirizacao: $scope.rotas[rota].COD_ROTAS_DISTRIBUICAO,
                            descricao: $scope.rotas[rota].DS_ROTAS_DISTRIBUICAO,
                            totalServices: $scope.rotas[rota].services.length,
                            pesoTotal: pesototal,
                            totalServicesColeta: totalServicesColeta,
                            pesoColeta: pesocoleta,
                            totalServicesEntrega: totalServicesEntrega,
                            pesoEntrega: pesoentrega
                        }

                        var element = findElement('#id01');
                        element.style.display = "block"


                    } else {
                        toastr.warning('Rota sem nenhum serviço para porder enviar a Routeasy', 'Atenção');
                    }


                }
            }


            $scope.carregamentoManual = function(index, veiculo) {

                var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: veiculo }, true);

                if (reg) {
                    var idx = $scope.lstVeiculos.indexOf(reg[0])
                }

                var vei = $scope.lstVeiculos[idx];

                var peso = 0

                $scope.rowsSelecteds.forEach(function(item) {

                    var reg = $scope.all.indexOf(item)

                    $scope.all[reg].selected = false;
                    $scope.all[reg].COD_VEICULOS = vei.COD_VEICULOS;
                    $scope.all[reg].IDENT_VEICULOS = vei.IDENT_VEICULOS;

                    item.COD_VEICULOS = vei.COD_VEICULOS
                    item.IDENT_VEICULOS = vei.IDENT_VEICULOS
                    item.TIPO_ROUTER = 'MANUAL'

                    if (item.ORDEM_ENTREGA == null) {
                        item.ORDEM_ENTREGA = 0
                    }

                    peso = peso + item.PESO
                    var exist = vei.servicos.indexOf(item)

                    if (exist < 0) {
                        vei.servicos.push(item)
                    }

                })

                vei.OCUPACAO = parseFloat((peso / vei.CAPACIDADE) * 100).toFixed(2)

                updateServicosVeiculo($scope.rowsSelecteds, 'carregar', veiculo);

                // toastr.success("Veiculo: " + vei.NR_PLACA + ' ' + $scope.rowsSelecteds.length, 'Carregamento');

                $scope.limparSelecionados()
            };

            $scope.descarregamentoManual = function(index, cod_veiculos, veiculoSelecionado) {

                var veiculo = veiculoSelecionado; //$scope.lstVeiculos[index];
                //swal('Veículo: placa '  + vei.NR_PLACA  + '\n | Ident ' + vei.IDENT_VEICULOS ,   "Serviço(s) inserido do veículo com sucesso!", {

                var pergunta = "Deseja descarregar todos os itens do veículo: placa " + veiculo.NR_PLACA + "\n | Ident " + veiculo.IDENT_VEICULOS

                swal({
                        title: pergunta,
                        text: "Ao descarregar ficará sem nenhum item, podendo ser iseridos novamente novos itens",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                        if (willDelete) {


                            veiculo.servicos.forEach(function(item) {
                                const serv = $filter("filter")($scope.all, { COD_DOCUMENTO: parseInt(item.COD_DOCUMENTO) }, true)[0]
                                if (serv) {
                                    serv.IDENT_VEICULOS = '';
                                    serv.COD_VEICULOS = null;
                                    serv.ORDEM_ENTREGA = null;
                                }

                                item.COD_VEICULOS = "";
                                item.ORDEM_ENTREGA = "";
                                item.TIPO_ROUTER = "";
                            })

                            updateServicosVeiculo(veiculo.servicos, 'descarregar');

                            veiculo.servicos = []
                            veiculo.OCUPACAO = 0

                        } else {
                            console.log('cancelado ao clicar no voltaGridPrincipal')
                                //swal("cancelado!");
                        }
                    });




            };


            $scope.enviarRouteasy = function(rota) {

                var routesy = {};
                if (rota == 'all') { // ENVIAR TODOAS AS ROTAS (SERVIÇOS DENTRO DA CAIXA)

                    routesy = {
                        CODIGO_ROTEIRIZACAO: $localStorage.UsuarioLogado.FilialSetada.ROTEIRIZACAO_SELECIONADA.CODIGO_ROTEIRIZACAO,
                        CODIGO_FILIAIS: $localStorage.UsuarioLogado.FilialSetada.COD_FILIAIS,
                        COD_ROTA_INDIVIDUAL: -2,
                        SISTEMA_ENVIO: 'TOPROUTE'
                    }

                    var data = new Date();

                    var dtFormatada = formatarData(data, 112)
                        // toastr.success(dtFormatada, 'Aviso');                    

                    $http.put(config.baseUrl + "/api/enviarRouteasyIndividual", routesy)

                    .then(
                        function sucesso(reponse) {
                            swal("Rotas enviadas!", " Verificar no ambiente da routeasy!", {
                                icon: "success",
                            });
                        },
                        function errorCallback(error) {
                            console.log(error)
                            swal("Ops!", " algum erro ocorrei, acionar o suporte help desk!", {
                                icon: "error",
                            });

                        }
                    )

                    var element = findElement('#id01');
                    element.style.display = "none"

                } else if (rota == 0 || rota == '0A') { // enviar tudo que estivar na caixa da rota zero (podera ser mandado para o ambiente da routeasy sem  referencia a rota dentro dessa caixa)


                    var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: rota }, true);

                    if (reg) {


                        if (reg[0].services.length <= 0) {

                            swal("Caixa de rota sem documentos!", " Somente é possível enviar para o ambiente ROUTEASY com documentos na caixa!!", {
                                icon: "warning",
                            });
                            return
                        }

                        var Codiv19 = 0;
                        if (rota == '0A') {
                            Codiv19 = -1;
                        } else {
                            Codiv19 = rota;
                        }

                        routesy = {
                            CODIGO_ROTEIRIZACAO: reg[0].services[0].COD_ROTEIRIZACAO //$scope.rotas[idx].services[0].COD_ROTEIRIZACAO,
                                ,
                            CODIGO_FILIAIS: $localStorage.UsuarioLogado.FilialSetada.COD_FILIAIS,
                            COD_ROTA_INDIVIDUAL: Codiv19,
                            SISTEMA_ENVIO: 'TOPROUTE'
                        }

                        $http.put(config.baseUrl + "/api/enviarRouteasyIndividual", routesy)
                            .then(
                                function sucesso(reponse) {

                                    var element = findElement('#id01');
                                    element.style.display = "none"

                                    routesy = {};


                                    $scope.rotaEnvioRoutesy = {
                                        rota: 0,
                                        cod_roteirizacao: 0,
                                        descricao: '',
                                        totalServices: 0,
                                        pesoTotal: 0,
                                        totalServicesColeta: 0,
                                        pesoColeta: 0,
                                        totalServicesEntrega: 0,
                                        pesoEntrega: 0
                                    }

                                    getRotasEnviadas();



                                    swal("Rota enviada!", " Verificar no ambiente da routeasy!", {
                                        icon: "success",
                                    });

                                    // toastr.success('Rota enviada para \n Routeasy com sucesso', 'Aviso');

                                },
                                function errorCallback(error) {
                                    console.log(error);

                                    swal("Ops!", " algum erro ocorrei, acionar o suporte help desk!", {
                                        icon: "error",
                                    });
                                    // toastr.error('ops algum erro ocorreu, acionar suporte help Desk \n' + error, 'Aviso');
                                    // toastr.error(error.data.Message + '\n' + error.status + ': \n' + error.statusText, 'erro');
                                }
                            );

                    }
                } else { //Envia rota idivididual da caixa selecionada

                    var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: rota }, true);
                    var idx = $scope.rotas.indexOf(reg[0])



                    if ($scope.rotas[idx].services.length <= 0) {

                        swal("Caixa de rota sem documentos!", " Somente é possível enviar para o ambiente ROUTEASY com documentos na caixa!!", {
                            icon: "warning",
                        });
                        return
                    }

                    $scope.rotaEnvioRoutesy = {
                        rota: $scope.rotas[idx].COD_ROTAS_DISTRIBUICAO,
                        cod_roteirizacao: $scope.rotas[idx].services[0].COD_ROTEIRIZACAO,
                        descricao: $scope.rotas[idx].DS_ROTAS_DISTRIBUICAO,
                        totalServices: $scope.rotas[idx].services.length,
                        pesoTotal: 0,
                        totalServicesColeta: 0,
                        pesoColeta: 0,
                        totalServicesEntrega: 0,
                        pesoEntrega: 0
                    }

                    routesy = {
                        CODIGO_ROTEIRIZACAO: $scope.rotas[idx].services[0].COD_ROTEIRIZACAO,
                        CODIGO_FILIAIS: $localStorage.UsuarioLogado.FilialSetada.COD_FILIAIS,
                        COD_ROTA_INDIVIDUAL: rota,
                        SISTEMA_ENVIO: 'TOPROUTE'
                    }

                    // var _data = new Date();
                    // var dtFormatada = formatarData(_data, 112)
                    // toastr.success(dtFormatada, 'Aviso');  

                    $http.put(config.baseUrl + "/api/enviarRouteasyIndividual", routesy)
                        .then(
                            function sucesso(reponse) {

                                var element = findElement('#id01');
                                element.style.display = "none";

                                var routesy = {};

                                $scope.rotaEnvioRoutesy = {
                                    rota: 0,
                                    cod_roteirizacao: 0,
                                    descricao: '',
                                    totalServices: 0,
                                    pesoTotal: 0,
                                    totalServicesColeta: 0,
                                    pesoColeta: 0,
                                    totalServicesEntrega: 0,
                                    pesoEntrega: 0
                                }


                                getRotasEnviadas();

                                // toastr.success('Rota enviada para Routeasy com sucesso', 'Aviso');
                                swal("Rota enviada!", " Verificar no ambiente da routeasy!", {
                                    icon: "success",
                                });


                            },
                            function errorCallback(error) {
                                console.log(error)
                                swal("Ops!", " algum erro ocorrei, acionar o suporte help desk!", {
                                    icon: "error",
                                });

                                // toastr.error('ops algum erro ocorreu, acionar suporte help Desk \n' + error, 'Aviso');
                                // toastr.error(error.data.Message + '\n' + error.status + ': \n' + error.statusText, 'erro');
                            }
                        );

                }
            }


            $scope.atualizaEnviados = function(cod_roteirizacao) {

                var _data = new Date();
                var dtFormatada = formatarData(_data, 112)
                    //var dtFormatada = '';

                $http.get(config.baseUrl + '/api/rotasEnviadas/' + cod_roteirizacao + '/' + dtFormatada)
                    .then(
                        function sucesso(response) {

                            $scope.qtdRotasEnviadasRouteasy = response.data.length
                            envio_route = response.data


                            envio_route.forEach(function(item) {
                                var reg = $filter("filter")($scope.rotas, { COD_ROTAS_DISTRIBUICAO: item.COD_ROTA }, true);
                                var idx = $scope.rotas.indexOf(reg[0])

                                if (idx >= 0) {
                                    $scope.rotas[idx].envio = true
                                }
                            });

                        },
                        function errorCallback(error) {
                            toastr.error('ops algum erro ao executar o metodo (atualizaEnviados) routeasy ocorreu, acionar suporte help Desk', 'Aviso');

                        }
                    );

            }

            $scope.clearMemory = function(tela) {
                if (tela == "conferencia") {


                    $scope.servicosRotaConferencia.services.forEach(function(item) {
                        item.selected = false;
                    });


                };

            }


            $scope.InserirMapaExterno = function() {
                deleteMarkers()
                InserirMapaNew()
                    //   InserirFiliaisMapa()




            }

            $scope.get1 = function() {
                return [{
                        "featureType": "landscape.natural.landcover",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "landscape.natural.landcover",
                        "elementType": "labels.text",
                        "stylers": [{
                            "visibility": "simplified"
                        }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.text",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.fill",
                        "stylers": [{
                                "color": "#f5f5f5"
                            },
                            {
                                "weight": 1.5
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                                "color": "#f3f0bc"
                            },
                            {
                                "weight": 1
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway.controlled_access",
                        "elementType": "geometry.fill",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "road.highway.controlled_access",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                                "color": "#acd6a5"
                            },
                            {
                                "visibility": "off"
                            },
                            {
                                "weight": 1.5
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway.controlled_access",
                        "elementType": "labels.icon",
                        "stylers": [{
                            "visibility": "simplified"
                        }]
                    },
                    {
                        "featureType": "road.highway.controlled_access",
                        "elementType": "labels.text",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "road.highway.controlled_access",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "road.local",
                        "stylers": [{
                            "visibility": "on"
                        }, ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "transit.line",
                        "elementType": "labels.text",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "transit.station",
                        "stylers": [{
                            "color": "#acd6a5"
                        }]
                    },
                    {
                        "featureType": "transit.station",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "visibility": "on"
                        }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "visibility": "simplified"
                        }]
                    }
                ];
            }

            $scope.InserirMapa = function(agrupado, veiculo) {
                InserirMapa(agrupado, veiculo)

                $scope.RotaVeiculoManual = veiculo
            }

            $scope.$on('dragToReorder.reordered', function($event, reordered) {
                var servicosVeiculoCopy = angular.copy($scope.veiculoManualServicos)


                swal({
                        title: "Deseja alterar a sequência de entrega do item?",
                        text: "Ao confirmar será alterada a sequência de entra do serviço, repeitando aonde foi recolocada!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                        if (willDelete) {


                            var base = reordered.from - reordered.to;

                            reordered.item.ORDEM_ENTREGA = reordered.to + 1;

                            reordered.item.TIPO_ROUTER = reordered.item.TIPO_ROUTER == "ROUTEASY" ? "AJUSTE" : reordered.item.TIPO_ROUTER

                            var index = reordered.from;

                            if (base < 0) {
                                for (let index = reordered.from; index <= reordered.to; index++) {
                                    var contador = index + 1;
                                    $scope.veiculoManualServicos[index].ORDEM_ENTREGA = contador;
                                    $scope.veiculoManualServicos[index].TIPO_ROUTER = reordered.item.TIPO_ROUTER;
                                    $scope.wayPoints = [];
                                    angular.forEach($scope.veiculoManualServicos, function(value, key) {
                                        $scope.point = {};
                                        $scope.point = {
                                            'location': {
                                                'ORDEM_ENTREGA': parseFloat(value.ORDEM_ENTREGA),
                                                'lat': parseFloat(value.lat),
                                                'lng': parseFloat(value.lng),
                                                'tipo': value.IDENT_TIPO_DOCUMENTOS
                                            },
                                            stopover: true
                                        }
                                        $scope.wayPoints.push($scope.point);
                                    });

                                }
                                swal("Nova sequência de entrega", "Antiga:" + parseInt(reordered.from) + 1 + " \n Nova: " + parseInt(reordered.to) + 1, {
                                    icon: "success",
                                });


                            } else {
                                for (let index = reordered.to; index <= reordered.from; index++) {
                                    var contador = index + 1;
                                    $scope.veiculoManualServicos[index].ORDEM_ENTREGA = contador;
                                    $scope.veiculoManualServicos[index].TIPO_ROUTER = reordered.item.TIPO_ROUTER;
                                    $scope.wayPoints = [];
                                    angular.forEach($scope.veiculoManualServicos, function(value, key) {
                                        $scope.point = {};
                                        $scope.point = {
                                            'location': {
                                                'ORDEM_ENTREGA': parseFloat(value.ORDEM_ENTREGA),
                                                'lat': parseFloat(value.lat),
                                                'lng': parseFloat(value.lng),
                                                'tipo': value.IDENT_TIPO_DOCUMENTOS
                                            },
                                            stopover: true
                                        }
                                        $scope.wayPoints.push($scope.point);
                                    });
                                }
                                swal("Nova sequência de entrega", "Antiga:" + parseInt(reordered.from + 1) + " \n Nova: " + parseInt(reordered.to + 1), {
                                    icon: "success",
                                });
                            }



                        } else {
                            console.log('cancelado ao clicar no voltaGridPrincipal')
                                //swal("cancelado!");
                        }
                    });

            });

            $scope.salvarOrdenacao = function() {
                $http.put(config.baseUrl + "/api/putSequencia", $scope.veiculoManualServicos)

                .then(
                    function sucesso(response) {
                        swal("Ordenação", "Sequência atualizada!", {
                            icon: "success",
                        })

                    },
                    function errorCallback(error) {
                        swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)!", "error");
                    }
                )

            }



            $scope.showTabDialog = function(ev) {

                var radioConferencia = angular.element(document.querySelector('#idConferencia'))[0];
                var radioAjusteRotas = angular.element(document.querySelector('#idSettingsRotas'))[0];


                $scope.veiculosRetornoAux = []
                $scope.veiculosRetorno = []
                $scope.servicosRotaConferencia = []

                var qtdRotasSelected = $filter("filter")($scope.rotas, { on_off: true }, true);

                var vei = carregarVeiculos('conferencia', qtdRotasSelected);

                vei.forEach(function(vei) {

                    var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: parseInt(vei) }, true);

                    if (reg) {
                        reg[0].servicos = []

                        $scope.veiculosRetorno.push(reg[0])
                    }
                })

                qtdRotasSelected.forEach(function(rota) {
                    rota.services.forEach(function(serv) {

                        var veiculo = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(serv.COD_VEICULOS) }, true);

                        if (veiculo) {

                            if (veiculo.length > 0) {
                                if (serv.COD_VEICULOS == veiculo[0].COD_VEICULOS) {
                                    veiculo[0].servicos.push(serv)

                                    if (veiculo[0].qtdConferido == undefined) {
                                        veiculo[0].qtdConferido = 0
                                    }
                                    if (serv.FL_CONFERIDO == true) {
                                        veiculo[0].qtdConferido = parseInt(veiculo[0].qtdConferido) + 1
                                    }

                                }
                            }

                        }

                    })

                })

                $scope.servicosRotaConferencia = qtdRotasSelected[0].services;


                // CONFERENCIA HABILITADA (SELECIONADA)
                if (radioConferencia.checked == true) {

                    $mdDialog.show({
                            controller: 'tabshowController',
                            templateUrl: 'view/principal/conferencia/tabDialog.tmpl.html',
                            parent: angular.element(document.body),
                            resolve: {
                                itens: function() {
                                    return qtdRotasSelected[0].services
                                },
                                veiculosRetorno: function() {
                                    return $scope.veiculosRetorno
                                },
                                all: function() {
                                    return $scope.all
                                },
                            },
                            targetEvent: ev,
                            clickOutsideToClose: false,
                            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                        })
                        .then(function(answer) {
                            // $scope.status = 'You said the information was "' + answer + '".';
                            // console.log('You said the information was "' + answer + '".')
                            console.log(answer);
                        }, function() {
                            $scope.status = 'You cancelled the dialog.';
                            console.log('You cancelled the dialog.')
                        });

                } else if (radioAjusteRotas.checked == true) {

                    $mdDialog.show({
                            controller: 'ajusteRotasController',
                            templateUrl: 'view/principal/ajusteRotas/ajusteRotas.tmpl.html',
                            parent: angular.element(document.body),
                            resolve: {
                                itens: function() {
                                    return qtdRotasSelected[0].services;
                                },
                                veiculosRetorno: function() {
                                    return $scope.veiculosRetorno;
                                },
                                all: function() {
                                    return $scope.all;
                                },
                                listarVeiculos: function() {
                                    return $scope.lstVeiculos;
                                }
                            },
                            targetEvent: ev,
                            clickOutsideToClose: false,
                            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                        })
                        .then(function(answer) {
                            // $scope.status = 'You said the information was "' + answer + '".';
                            // console.log('You said the information was "' + answer + '".')
                            console.log(answer);
                        }, function() {
                            $scope.status = 'You cancelled the dialog.';
                            console.log('You cancelled the dialog.')
                        });
                }


            };

            $scope.conferencia = function() {


                $scope.servicosRotaConferencia = []
                var radioConferencia = angular.element(document.querySelector('#idConferencia'));

                // var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: parseInt(5005) }, true);
                // console.log(reg)

                if (radioConferencia[0].checked == true) { // CONFERENCIA HABILITADA (SELECIONADA)

                    //quantidade de rotas selecionadas para conferencia
                    var qtdRotasSelected = $filter("filter")($scope.rotas, { on_off: true }, true);

                    if (qtdRotasSelected.length > 1) {
                        swal('Seleciona apenas uma rota para conferência!', "tente novamente.", "warning");
                        // toastr.warning('Seleciona apenas uma rota para conferência!', "Aviso")

                    } else {

                        //abrir o modal com os grids para conferencia 
                        var myconfer = angular.element(document.querySelector('#myConferencia'));
                        if (myconfer) {

                            $scope.veiculosRetornoAux = []
                            $scope.veiculosRetorno = []
                            $scope.servicosRotaConferencia = []
                            myconfer[0].style.width = "100%";
                        }
                        //carregar veiculos da rota de conferencia selecioanda  
                        var vei = carregarVeiculos('conferencia', qtdRotasSelected);



                        vei.forEach(function(vei) {

                            var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: parseInt(vei) }, true);

                            if (reg) {
                                reg[0].servicos = []

                                $scope.veiculosRetorno.push(reg[0])
                            }
                        })


                        qtdRotasSelected.forEach(function(rota) {
                            rota.services.forEach(function(serv) {

                                var veiculo = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(serv.COD_VEICULOS) }, true);

                                if (veiculo) {

                                    if (veiculo.length > 0) {
                                        if (serv.COD_VEICULOS == veiculo[0].COD_VEICULOS) {
                                            veiculo[0].servicos.push(serv)

                                            if (veiculo[0].qtdConferido == undefined) {
                                                veiculo[0].qtdConferido = 0
                                            }
                                            if (serv.FL_CONFERIDO == true) {
                                                veiculo[0].qtdConferido = parseInt(veiculo[0].qtdConferido) + 1
                                            }

                                        }
                                    }

                                }

                            })

                        })

                        $scope.servicosRotaConferencia = qtdRotasSelected[0].services;
                        // console.log($scope.veiculosRetorno[0], $scope.servicosRotaConferencia, qtdRotasSelected)
                    }


                } else { // CONFERENCIA DESABILITADA

                    var myconfer = angular.element(document.querySelector('#myConferencia'));
                    if (myconfer) {
                        myconfer[0].style.width = "0";
                    }
                    swal('Conferência não habilitada!', "Selecione no canto inferior a opção (conferência).", "warning");
                    // toastr.warning('Conferencia não habilitada!', "Aviso")
                }
            }

            $scope.$watch("login", function(newValue, oldValue) {

                if (newValue == false) {
                    $localStorage.LoggeIn = $rootScope.login;
                    $localStorage.UsuarioLogado = {};
                    $location.path('/login');
                }

            });



            $scope.carregando = false;

            $scope.acabou = function() {
                $timeout(function() {

                    if ($scope.carregando == false) {
                        retornoRoutesyFunc()
                        $scope.carregando = true;
                        retornoRoutesyFunc()
                    }
                }, 3000);
            }

            $scope.acabou();

        });