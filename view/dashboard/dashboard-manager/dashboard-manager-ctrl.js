angular
    .module("TopRoute")
    .controller("dashboard-Manager-ctrl",
        function($scope, list_dashboardManager, baixaRemota, documentosRoteirizados, $rootScope, $filter, $window, $location, $http, $timeout, config, $localStorage, $mdDialog) {


            //$scope.filiais  =  [{"COD_FILIAIS":197,"NM_FILIAIS":"438 - (POA) - FLB - CACHOEIRINHA","QTD_ROTEIRIZACAO":1,"COD_ROTEIRIZACAO":0,"TOTAL_DOCUMENTOS":118,"DATA_INICIO_PESQUISA":"08/05/2020","DATA_FINAL_PESQUISA":"08/05/2020","DATA_INCLUSAO_ROTEIRIZACAO":"","HORA_INCLUSAO_ROTEIRIZACAO":"","KM_TOTAL":873,"TIPO_ROUTER":"DISTRIBUIÇÃO","QTD_MANUAL":0,"QTD_OPERADOR":108,"QTD_ROUTEASY":10},{"COD_FILIAIS":206,"NM_FILIAIS":"437 - (RIO) - FLB - RIO DE JANEIRO","QTD_ROTEIRIZACAO":1,"COD_ROTEIRIZACAO":0,"TOTAL_DOCUMENTOS":758,"DATA_INICIO_PESQUISA":"08/05/2020","DATA_FINAL_PESQUISA":"08/05/2020","DATA_INCLUSAO_ROTEIRIZACAO":"","HORA_INCLUSAO_ROTEIRIZACAO":"","KM_TOTAL":2060,"TIPO_ROUTER":"DISTRIBUIÇÃO","QTD_MANUAL":404,"QTD_OPERADOR":93,"QTD_ROUTEASY":261},{"COD_FILIAIS":213,"NM_FILIAIS":"405 - (CPQ) - FLB - CAMPINAS","QTD_ROTEIRIZACAO":1,"COD_ROTEIRIZACAO":0,"TOTAL_DOCUMENTOS":175,"DATA_INICIO_PESQUISA":"08/05/2020","DATA_FINAL_PESQUISA":"08/05/2020","DATA_INCLUSAO_ROTEIRIZACAO":"","HORA_INCLUSAO_ROTEIRIZACAO":"","KM_TOTAL":1069,"TIPO_ROUTER":"DISTRIBUIÇÃO","QTD_MANUAL":0,"QTD_OPERADOR":3,"QTD_ROUTEASY":172},{"COD_FILIAIS":219,"NM_FILIAIS":"413 - (CWB) - FLB - CURITIBA","QTD_ROTEIRIZACAO":1,"COD_ROTEIRIZACAO":0,"TOTAL_DOCUMENTOS":264,"DATA_INICIO_PESQUISA":"08/05/2020","DATA_FINAL_PESQUISA":"08/05/2020","DATA_INCLUSAO_ROTEIRIZACAO":"","HORA_INCLUSAO_ROTEIRIZACAO":"","KM_TOTAL":1269,"TIPO_ROUTER":"DISTRIBUIÇÃO","QTD_MANUAL":14,"QTD_OPERADOR":202,"QTD_ROUTEASY":48},{"COD_FILIAIS":383,"NM_FILIAIS":"521 - (PNM) - FLB - PQ NOVO MUNDO","QTD_ROTEIRIZACAO":1,"COD_ROTEIRIZACAO":0,"TOTAL_DOCUMENTOS":932,"DATA_INICIO_PESQUISA":"08/05/2020","DATA_FINAL_PESQUISA":"08/05/2020","DATA_INCLUSAO_ROTEIRIZACAO":"","HORA_INCLUSAO_ROTEIRIZACAO":"","KM_TOTAL":3164,"TIPO_ROUTER":"DISTRIBUIÇÃO","QTD_MANUAL":148,"QTD_OPERADOR":228,"QTD_ROUTEASY":556}]

            $scope.baixasRemotas = baixaRemota.data
            $scope.filiais = list_dashboardManager.data
            $scope.documentos = documentosRoteirizados.data
            $scope.motra = false
            $scope.data1 = [
                [10, 100]
            ]; // baixa remotas e ocorrencia
            $scope.labels1 = ['Ocorrencia', 'Sucesso'];
            $scope.colors1 = ["#1c355d", "#e6570f", "#1c355d"];
            $scope.labels = ["Manual", "Operador", "Roteasy"];
            $scope.colors = ["#686868", "#e6570f", "#1c355d"];
            $scope.title = 'Paulo Roberto Chagas Fantin'
            $scope.dateFinal;

            const nowStart = new Date
            const nowFinish = undefined;

            $scope.acao1 = async function(filiais) {

                var filiais_old = angular.copy(filiais)

                // USO PARA TESTE EM DESENVOLVIMENTO LOCAL HOST
                // if(config.baseUrl=="http://localhost/ApiOTM"){
                // 	filiais  =  9999
                // }


                const retorno_baixa_filial = await $filter("filter")($scope.baixasRemotas, { codigo_branch: parseInt(filiais) }, true)
                const retorno_baixa_filial_baixados = await $filter("filter")(retorno_baixa_filial, { document_status: 'success' }, true)
                const retorno_baixa_filial_ocorrencias = await $filter("filter")(retorno_baixa_filial, { document_status: 'failure' }, true)
                const retorno_baixa_filial_null = await $filter("filter")(retorno_baixa_filial, { document_status: null }, true)

                const qtd_total_service_fill_router = await $filter("filter")($scope.filiais, { COD_FILIAIS: parseInt(filiais) }, true)[0]

                // const retorno_baixa_filial =  $scope.baixasRemotas.filter(function (evento) {
                // 	return evento.codigo_branch == filiais
                // });

                await retorno_baixa_filial.forEach(function(baixa) {

                    var reg_docs = $filter("filter")($scope.documentos, { COD_DOCUMENTOS: parseInt(baixa.document_cod_documentos) }, true)[0]

                    if (reg_docs) {
                        reg_docs.BAIXA = baixa.document_status == "failure" ? "OCORRENCIA" : "SUCESSO"
                    }
                })


                const fil = await $filter("filter")($scope.documentos, { COD_FILIAIS: filiais }, true)
                    // chamar o metodo de update 
                    //  const baixa = await $http.put(config.baseUrl + "/api/documentosBaixa" , fil)



                const _qtdServicoRouteasy = await $scope.documentos.filter(function(doc) {
                    return doc.TIPO_ROUTER == "ROUTEASY"
                });

                const _baixados = await _qtdServicoRouteasy.filter(function(doc) {
                    return doc.BAIXA == "SUCESSO" && doc.COD_FILIAIS == filiais
                });

                const _pendentes = await _qtdServicoRouteasy.filter(function(doc) {
                    return doc.BAIXA == "PENDENTE" && doc.TIPO_ROUTER == "ROUTEASY" || doc.TIPO_ROUTER == "AJUSTE"
                });

                const _ocorrencia = await _qtdServicoRouteasy.filter(function(doc) {
                    return doc.BAIXA == "OCORRENCIA" && doc.COD_FILIAIS == filiais
                });


                const _SomenteEntregas = await _qtdServicoRouteasy.filter(function(doc) {
                    return doc.TIPO_DOCUMENTOS == "ENTREGA" && doc.COD_FILIAIS == filiais
                });



                // //filtrar por filial depois pegar somente as entregas e desconsidera as coletas ate que nao seja criado pontos na routeasy
                // var quandiadeseServFilial   = $filter("filter")($scope.documentos, { COD_FILIAIS:  filiais }, true)


                // var totalDocs_percent  		= qtd_total_service_fill_router.QTD_ROUTEASY 
                var totalDocs_percent = _SomenteEntregas.length
                var percentual_baixados = 0
                var percentual_ocorrencia = 0
                var percentual_NaoEntregues = 0

                // if((retorno_baixa_filial_baixados.length + retorno_baixa_filial_null.length ) > qtd_total_service_fill_router.QTD_ROUTEASY){
                if ((retorno_baixa_filial_baixados.length + retorno_baixa_filial_null.length) > _SomenteEntregas.length) {

                    percentual_baixados = (((retorno_baixa_filial_baixados.length + retorno_baixa_filial_null.length) / retorno_baixa_filial.length) * 100)
                    percentual_ocorrencia = ((retorno_baixa_filial_ocorrencias.length / retorno_baixa_filial.length) * 100)
                    percentual_NaoEntregues = 0
                } else {
                    percentual_baixados = (((retorno_baixa_filial_baixados.length + retorno_baixa_filial_null.length) / totalDocs_percent) * 100)
                    percentual_ocorrencia = ((retorno_baixa_filial_ocorrencias.length / totalDocs_percent) * 100)
                    percentual_NaoEntregues = (((totalDocs_percent - (retorno_baixa_filial_baixados.length + retorno_baixa_filial_ocorrencias.length)) / totalDocs_percent) * 100)
                }


                var obj = {
                    qtd_services: (retorno_baixa_filial.length),
                    percent_success_percent: percentual_baixados,
                    percent_success_failure: percentual_ocorrencia,
                    percent_not_delivered: percentual_NaoEntregues,
                    baixados: (retorno_baixa_filial_baixados.length + retorno_baixa_filial_null.length),
                    ocorencias: retorno_baixa_filial_ocorrencias,
                    naoEntregues: (totalDocs_percent - (retorno_baixa_filial_baixados.length + retorno_baixa_filial_ocorrencias.length))

                }

                var options = options_chart(obj)

                // USO PARA TESTE EM DESENVOLVIMENTO LOCAL HOST
                // if (config.baseUrl == "http://localhost/ApiOTM") {
                // 	filiais = filiais_old
                // }
                var elementoLink1 = await findElement('#tablink-' + filiais);


                var chart1 = new ApexCharts(elementoLink1, options);
                await chart1.render();

            }

            function options_chart(object) {
                var options = {
                    series: [{
                        name: 'Baixados ' + object.baixados,
                        data: [object.percent_success_percent]
                    }, {
                        name: 'Ocorrência ' + object.ocorencias.length,
                        data: [object.percent_success_failure]
                    }, {
                        name: 'Não entregues ' + object.naoEntregues,
                        data: [object.percent_not_delivered]
                    }],
                    chart: {
                        type: 'bar',
                        height: 180,
                        stacked: true,
                        stackType: '100%'
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                        },
                    },
                    stroke: {
                        width: 1,
                        colors: ['#1c355d', '#D9534F', '#686868']
                    },

                    title: {
                        text: 'Baixa remota Routeasy  (' + object.qtd_services + ')  Ctes',
                        align: 'center',
                        margin: 10,
                        offsetX: 0,
                        offsetY: 0,
                        floating: false,
                        style: {
                            fontSize: '20px',
                            fontWeight: 'bold',
                            fontFamily: undefined,
                            color: '#1c3449'
                        },
                    },

                    xaxis: {
                        categories: ['Ctes'],
                    },

                    fill: {
                        opacity: 1,
                        colors: ['#1c355d', '#D9534F', '#686868']
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'center',
                        offsetX: 40,
                        labels: {
                            colors: ['#1c355d', '#D9534F', '#686868'],
                            useSeriesColors: false
                        },
                        markers: {
                            width: 12,
                            height: 12,
                            strokeWidth: 0,
                            strokeColor: '#fff',
                            fillColors: ['#1c355d', '#D9534F', '#686868'],
                            radius: 12,
                            customHTML: undefined,
                            onClick: undefined,
                            offsetX: 0,
                            offsetY: 0
                        }
                    }
                }

                return options

            }

            $scope.filiais.forEach(item => {
                item.canvas_percentual = [];
                item.canvas = [];

                item.canvas.push(item.QTD_MANUAL);
                // item.canvas.push(item.QTD_OPERADOR);
                item.canvas.push(item.QTD_ROUTEASY);


                var routeasyPercent = (item.QTD_ROUTEASY / item.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);
                // var operadorPercent = (item.QTD_OPERADOR 	/ item.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);
                var manualPercent = (item.QTD_MANUAL / item.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);

                item.canvas_percentual.push(manualPercent.toFixed(2))
                    // item.canvas_percentual.push(operadorPercent.toFixed(2))
                item.canvas_percentual.push(routeasyPercent.toFixed(2))

                // var percentual_manual = (item.QTD_MANUAL/item.TOTAL_DOCUMENTOS_ROTEIRIZADOS*100)
                // item.canvas_percentual.push( parseInt( percentual_manual))
                // var percentual_operador = (item.QTD_OPERADOR/item.TOTAL_DOCUMENTOS_ROTEIRIZADOS*100)
                // item.canvas_percentual.push(parseInt(percentual_operador))
                // var percentual_routeasy = (item.QTD_ROUTEASY/item.TOTAL_DOCUMENTOS_ROTEIRIZADOS*100)
                // item.canvas_percentual.push(parseInt(percentual_routeasy))
            });


            $scope.dateRangePicker = {
                date: { startDate: moment().subtract(1, 'years'), endDate: moment().add(1, 'years') },
                picker: null,
                options: {
                    pickerClasses: 'custom-display', //angular-daterangepicker extra
                    buttonClasses: 'btn',
                    applyButtonClasses: 'btn-primary',
                    cancelButtonClasses: 'btn-danger',
                    locale: {
                        applyLabel: "Apply",
                        cancelLabel: 'Cancel',
                        customRangeLabel: 'Custom range',
                        separator: ' - ',
                        format: "YYYY-MM-DD",
                        //will give you 2017-01-06
                        //format: "D-MMM-YY", //will give you 6-Jan-17
                        //format: "D-MMMM-YY", //will give you 6-January-17
                    },
                    ranges: {
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()]
                    },
                    eventHandlers: {
                        'apply.daterangepicker': function(event, picker) { console.log('applied'); }
                    }
                }
            };


            const opcoesEscolha = [
                { id: 1, opcao: 'Hoje', days: 0, data: { inicio: '', fim: '' }, active: false }, { id: 2, opcao: 'Ontem', days: 0, data: { inicio: '', fim: '' }, active: true }, { id: 3, opcao: 'Ultimos 7 dias', days: 0, data: { inicio: '', fim: '' }, active: false }, { id: 4, opcao: 'Ultimos 15 dias', days: 0, data: { inicio: '', fim: '' }, active: false }, { id: 5, opcao: 'Ultimos 30 dias', days: 0, data: { inicio: '', fim: '' }, active: false }, { id: 6, opcao: 'Ultimos Mes', days: 0, data: { inicio: '', fim: '' }, active: false }
                // ,{ id:7, opcao:'Ultimos 3 Meses'	,days:0, data:{ inicio:'', fim:''},active:false}
                // ,{ id:8, opcao:'Ultimos 6 Meses'	,days:0, data:{ inicio:'', fim:''},active:false}
                // ,{ id:9, opcao:'Ultimos 12 Meses'	,days:0, data:{ inicio:'', fim:''},active:false}
                , { id: 10, opcao: 'Intervalo', days: 0, data: { inicio: '', fim: '' }, active: false }
            ]


            $scope.yourCustomConf = {
                dateFormat: 'DD/MM/YYYY',
                allowFuture: true
            }


            $scope.Busca = {
                dataInicio: '',
                dataFinal: '',
            }

            async function simplified_vps(dataInicio, dataFinal, opcao) {

                const response = await $http.get(config.baseUrl_VPS + "/" + dataInicio + '/' + dataFinal)

                if (!response.data)
                    swal("Ops!", "Nenhum registro encontrado na data de " + moment(nowStart).format('DD/MM/YYY') + " a " + moment(nowStart).format('DD/MM/YYY'));

                return response.data;
            }

            async function donwload_Remota_simplified(dataInicio, DataFinal) {


                //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                const response = await $http.get(config.baseUrl_TR_IRBR + "/download-simplified-period/" + dataInicio + "/" + DataFinal)

                if (!response.data)
                    swal("Ops!", "Nenhum registro encontrado na data de " + moment(nowStart).format('DD/MM/YYY') + " a " + moment(nowStart).format('DD/MM/YYY'));

                return response.data
            }

            ///consumir serviço de baixa remota no dominio greentop 
            $scope.buscarDadosApi_TR_IRBR = async function(opcao) {


                // try {

                switch (opcao.id) {
                    case 1:


                        console.log($scope.Busca = {
                            dataInicio: moment(nowStart).format('YYYYMMDD'),
                            dataFinal: moment(nowStart).format('YYYYMMDD')
                        })

                        // console.log($scope.Busca={
                        // 	dataInicio:moment(nowStart).subtract(3, 'days').format('YYYYMMDD'),
                        // 	dataFinal:moment(nowStart).subtract(3, 'days').format('YYYYMMDD')
                        // })

                        // console.log($scope.Busca={
                        // 	dataInicio:'20200601',
                        // 	dataFinal:'20200601'
                        // })


                        //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                        const response = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataInicio)

                        if (!response)
                            swal("Ops!", "Nenhum registro encontrado na data de " + moment(nowStart).format('DD/MM/YYY') + " a " + moment(nowStart).format('DD/MM/YYY'));

                        const _baixa1 = await simplified_vps($scope.Busca.dataInicio, $scope.Busca.dataFinal, 1)

                        //const  _baixa1  =  await donwload_Remota_simplified($scope.Busca.dataInicio,$scope.Busca.dataFinal)

                        if (_baixa1) {
                            $scope.baixasRemotas = _baixa1
                        }


                        $scope.filiais = response.data


                        const response_docs1 = await $http.get(config.baseUrl + "/api/documentosRoteirizados/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataInicio)
                        $scope.documentos = response_docs1.data


                        break;
                    case 2: // ontem


                        console.log($scope.Busca = {
                            dataInicio: moment(moment(nowStart).subtract(1, 'days')).format('YYYYMMDD'),
                            dataFinal: moment(moment(nowStart).subtract(1, 'days')).format('YYYYMMDD')
                        })


                        //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                        const responseOntem = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)

                        if (!responseOntem)
                            swal("Ops!", "Nenhum registro encontrado na data de " + moment($scope.Busca.dataInicio).format('DD/MM/YYY') + " a " + moment($scope.Busca.dataFinal).format('DD/MM/YYY'));

                        const _baixa2 = await simplified_vps($scope.Busca.dataInicio, $scope.Busca.dataFinal, 1)
                            // const _baixa2 = await donwload_Remota_simplified($scope.Busca.dataInicio, $scope.Busca.dataFinal)

                        if (_baixa2) {
                            $scope.baixasRemotas = _baixa2
                        }
                        $scope.filiais = responseOntem.data


                        const response_docsOntem = await $http.get(config.baseUrl + "/api/documentosRoteirizados/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)
                        $scope.documentos = response_docsOntem.data


                        break;
                    case 3: // ultimos 7 dias
                        console.log($scope.Busca = {
                            dataInicio: moment(moment(nowStart).subtract(7, 'days')).format('YYYYMMDD'),
                            dataFinal: moment(nowStart).format('YYYYMMDD'),
                        })


                        //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                        const response1 = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)

                        if (!response1)
                            swal("Ops!", "Nenhum registro encontrado na data de " + moment($scope.Busca.dataInicio).format('DD/MM/YYY') + " a " + moment($scope.Busca.dataFinal).format('DD/MM/YYY'));

                        const _baixa3 = await simplified_vps($scope.Busca.dataInicio, $scope.Busca.dataFinal, 1)
                            // const _baixa3 = await donwload_Remota_simplified($scope.Busca.dataInicio, $scope.Busca.dataFinal)

                        if (_baixa3) {
                            $scope.baixasRemotas = _baixa3
                        }

                        $scope.filiais = response1.data

                        const response_docs7Dias = await $http.get(config.baseUrl + "/api/documentosRoteirizados/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)
                        $scope.documentos = response_docs7Dias.data

                        break;
                    case 4: //ultimos 15 dias
                        console.log($scope.Busca = {
                            dataInicio: moment(moment(nowStart).subtract(15, 'days')).format('YYYYMMDD'),
                            dataFinal: moment(nowStart).format('YYYYMMDD'),
                        })


                        //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                        const response15Dias = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)

                        if (!response15Dias)
                            swal("Ops!", "Nenhum registro encontrado na data de " + moment($scope.Busca.dataInicio).format('DD/MM/YYY') + " a " + moment($scope.Busca.dataFinal).format('DD/MM/YYY'));

                        const _baixa4 = await simplified_vps($scope.Busca.dataInicio, $scope.Busca.dataFinal, 1)
                            // const _baixa4 = await donwload_Remota_simplified($scope.Busca.dataInicio, $scope.Busca.dataFinal)

                        if (_baixa4) {
                            $scope.baixasRemotas = _baixa4
                        }

                        $scope.filiais = response15Dias.data


                        const response_docs15ias = await $http.get(config.baseUrl + "/api/documentosRoteirizados/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)
                        $scope.documentos = response_docs15ias.data

                        break;
                    case 5: // ultimos dias dias
                        console.log($scope.Busca = {
                            dataInicio: moment(moment(nowStart).subtract(30, 'days')).format('YYYYMMDD'),
                            dataFinal: moment(nowStart).format('YYYYMMDD'),
                        })

                        //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                        const response30Dias = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)

                        if (!response30Dias)
                            swal("Ops!", "Nenhum registro encontrado na data de " + moment($scope.Busca.dataInicio).format('DD/MM/YYY') + " a " + moment($scope.Busca.dataFinal).format('DD/MM/YYY'));

                        const _baixa5 = await simplified_vps($scope.Busca.dataInicio, $scope.Busca.dataFinal, 1)
                            // const _baixa5 = await donwload_Remota_simplified($scope.Busca.dataInicio, $scope.Busca.dataFinal)

                        if (_baixa5) {
                            $scope.baixasRemotas = _baixa5
                        }

                        $scope.filiais = response30Dias.data

                        const response_docs30ias = await $http.get(config.baseUrl + "/api/documentosRoteirizados/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)
                        $scope.documentos = response_docs30ias.data

                        break;
                    case 6: //ultimo mes
                        console.log($scope.Busca = {
                            dataInicio: moment(moment(nowStart).subtract(1, 'month')).startOf('month').format('YYYYMMDD'),
                            dataFinal: moment(moment(nowStart).subtract(1, 'month')).endOf('month').format('YYYYMMDD'),
                        })


                        //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                        const responseMesAnt = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)

                        if (!responseMesAnt)
                            swal("Ops!", "Nenhum registro encontrado na data de " + moment($scope.Busca.dataInicio).format('DD/MM/YYY') + " a " + moment($scope.Busca.dataFinal).format('DD/MM/YYY'));

                        const _baixa6 = await simplified_vps($scope.Busca.dataInicio, $scope.Busca.dataFinal, 1)
                            // const _baixa6 = await donwload_Remota_simplified($scope.Busca.dataInicio, $scope.Busca.dataFinal)

                        if (_baixa6) {
                            $scope.baixasRemotas = _baixa6
                        }


                        $scope.filiais = responseMesAnt.data

                        const response_docsMesant = await $http.get(config.baseUrl + "/api/documentosRoteirizados/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)
                        $scope.documentos = response_docsMesant.data

                        break;
                    case 7: //ultimos 3 meses
                        console.log($scope.Busca = {
                            dataInicio: moment(moment(nowStart).subtract(3, 'month')).startOf('month').format('YYYYMMDD'),
                            dataFinal: moment(moment(nowStart).subtract(1, 'month')).startOf('month').format('YYYYMMDD'),
                        })

                        //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                        const responseUlt3Meses = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)

                        if (!responseUlt3Meses)
                            swal("Ops!", "Nenhum registro encontrado na data de " + moment($scope.Busca.dataInicio).format('DD/MM/YYY') + " a " + moment($scope.Busca.dataFinal).format('DD/MM/YYY'));

                        const _baixa7 = await simplified_vps($scope.Busca.dataInicio, $scope.Busca.dataFinal, 1)
                            // const _baixa7 = await donwload_Remota_simplified($scope.Busca.dataInicio, $scope.Busca.dataFinal)

                        if (_baixa7) {
                            $scope.baixasRemotas = _baixa7
                        }

                        $scope.filiais = responseUlt3Meses.data

                        const response_docs3mes = await $http.get(config.baseUrl + "/api/documentosRoteirizados/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)
                        $scope.documentos = response_docs3mes.data

                        break;
                    case 8: //ultimos 6 meses
                        console.log($scope.Busca = {
                            dataInicio: moment(moment(nowStart).subtract(6, 'month')).startOf('month').format('YYYYMMDD'),
                            dataFinal: moment(moment(nowStart).subtract(1, 'month')).startOf('month').format('YYYYMMDD'),
                        })

                        //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                        const respons6Meses = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)

                        if (!respons6Meses)
                            swal("Ops!", "Nenhum registro encontrado na data de " + moment($scope.Busca.dataInicio).format('DD/MM/YYY') + " a " + moment($scope.Busca.dataFinal).format('DD/MM/YYY'));

                        const _baixa8 = await simplified_vps($scope.Busca.dataInicio, $scope.Busca.dataFinal, 1)
                            // const _baixa8 = await donwload_Remota_simplified($scope.Busca.dataInicio, $scope.Busca.dataFinal)

                        if (_baixa8) {
                            $scope.baixasRemotas = _baixa8
                        }

                        $scope.filiais = respons6Meses.data

                        const response_docs6mes = await $http.get(config.baseUrl + "/api/documentosRoteirizados/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)
                        $scope.documentos = response_docs6mes.data
                        break;
                    case 9: // ultimo ano
                        console.log($scope.Busca = {
                            dataInicio: moment(moment(nowStart).subtract(12, 'month')).startOf('month').format('YYYYMMDD'),
                            dataFinal: moment(moment(nowStart).subtract(1, 'month')).startOf('month').format('YYYYMMDD'),
                        })

                        //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                        const respons12Meses = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)

                        if (!respons12Meses)
                            swal("Ops!", "Nenhum registro encontrado na data de " + moment($scope.Busca.dataInicio).format('DD/MM/YYY') + " a " + moment($scope.Busca.dataFinal).format('DD/MM/YYY'));

                        const _baixa9 = await simplified_vps($scope.Busca.dataInicio, $scope.Busca.dataFinal, 1)
                            // const _baixa9 = await donwload_Remota_simplified($scope.Busca.dataInicio, $scope.Busca.dataFinal)

                        if (_baixa9) {
                            $scope.baixasRemotas = _baixa9
                        }

                        $scope.filiais = respons12Meses.data

                        const response_docs12mes = await $http.get(config.baseUrl + "/api/documentosRoteirizados/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)
                        $scope.documentos = response_docs12mes.data

                        break;
                    case 10:


                        var dataIni = await findElement('#idIni');
                        var dataFim = await findElement('#IdFim');
                        console.log($scope.Busca = {
                            dataInicio: moment(dataIni.value).format('YYYYMMDD'),
                            dataFinal: moment(dataFim.value).format('YYYYMMDD')
                        })

                        //busca no back-end na solistica dados da dash relacionado as filiais (Planejamento)
                        const intervalo = await $http.get(config.baseUrl + "/api/listar/dashboard-manager-agroup/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)

                        if (!intervalo)
                            swal("Ops!", "Nenhum registro encontrado na data de " + moment($scope.Busca.dataInicio).format('DD/MM/YYY') + " a " + moment($scope.Busca.dataFinal).format('DD/MM/YYY'));

                        const _baixa10 = await simplified_vps($scope.Busca.dataInicio, $scope.Busca.dataFinal, 1)
                            // const _baixa10 = await donwload_Remota_simplified($scope.Busca.dataInicio, $scope.Busca.dataFinal)

                        if (_baixa10) {
                            $scope.baixasRemotas = _baixa10
                        }

                        $scope.filiais = intervalo.data

                        const response_docsinter = await $http.get(config.baseUrl + "/api/documentosRoteirizados/" + $scope.Busca.dataInicio + "/" + $scope.Busca.dataFinal)
                        $scope.documentos = response_docsinter.data

                        console.log('selecionou intervalo de datas');
                        break;

                }

                $scope.filiais.forEach(async function(item) {
                    item.canvas_percentual = [];
                    item.canvas = [];

                    item.canvas.push(item.QTD_MANUAL);
                    // item.canvas.push(item.QTD_OPERADOR);
                    item.canvas.push(item.QTD_ROUTEASY);


                    var routeasyPercent = (item.QTD_ROUTEASY / item.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);
                    // var operadorPercent = (item.QTD_OPERADOR / item.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);
                    var manualPercent = (item.QTD_MANUAL / item.TOTAL_DOCUMENTOS_ROTEIRIZADOS * 100);

                    item.canvas_percentual.push(manualPercent.toFixed(2))
                        // item.canvas_percentual.push(operadorPercent.toFixed(2))
                    item.canvas_percentual.push(routeasyPercent.toFixed(2))


                    // await $scope.acao1(item.COD_FILIAIS);


                })

                $scope.filiais.forEach(async function(item) {
                    await $scope.acao1(item.COD_FILIAIS);
                })

                $scope.$apply();



            }

            $scope.opcaAtiva = function(id) {


                opcoesEscolha.forEach(function(item) {
                    if (item.id == id) {
                        item.active = true
                    } else {
                        item.active = false
                    }
                })


                const reg = opcoesEscolha

                $scope.op_escolha = reg
            }

            async function init() {

                const now = new Date
                const data = moment(now).format("DD/MM/YYYY")

                // const  reg  =  opcoesEscolha.find(element => element.id ===1)
                const reg = opcoesEscolha

                $scope.op_escolha = reg
                $scope.date = data


                // if($scope.filiais.length>0){
                // 	$scope.filiais.forEach( async function(item){
                // 		await $scope.acao1(item.COD_FILIAIS);
                //    })
                //    await $scope.$apply() ;
                // }

            }

            init()

            function findElement(query) {
                //Funcion para realizar la busqueda del elemento.
                var id = document.querySelector(query);
                var elements = angular.element(id);
                return elements[0];
            }

            $scope.teste = async function(date) {

                await alert(date);

            }

            $scope.$watch("date", function(newValue, oldValue) {
                console.log(newValue, oldValue);
            });


            $scope.localizar = function() {
                alert('paulo')
            }
        })