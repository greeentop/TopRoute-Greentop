angular.module("TopRoute")
.controller("conferenciaController",
    function ($scope, $rootScope, $http,config,$filter, $mdBottomSheet,ngAudio,toastr,$location, $localStorage, $mdDialog, $mdToast,pickingListSERVICE) {


        //#region  // DECLARACAO DE CAMPOS DA TELA QUE SERA USADO EM TODO CONTEXO DO SISTEMA
        
        // var txtScanner             = findElement("#txtScannerConferencia");
        // txtScanner.focus();

        // $scope.audioExisteEmVeiculo = ngAudio.load("sons/plin.mp3");
        $scope.audioNaoAchou = ngAudio.load("sons/erro.mp3");

        var ultimo = undefined  

        //#endregion

        //#region METODOS  COM CHAMADA NO FRONT

        $scope.teste = function () {
            console.log('entrou no controller das caixas')
        }

        $scope.closeDivConferencia  =  function(item){
            document.getElementById("divModalConferencia").style.width = "0";
        }


        function rel_pickingList(veiculo) {


            pickingListSERVICE.pickingList(veiculo)

            return
            //[CRTC,REMENTENTE, DETINATARIO,CEP, CIDADE, ROT,  VOL, KG, RTS, PE, VL.MERCADORIA]
            var largColunstable1    = [60, 85, 85, 30, 40, 15, 15, 15,20, 15, 15, 40]
            var marginTable2        = [25, 0, 0, 0]
            var marginTable3        = [25, 0, 0, 0]
            var fontSizeOrdem = 10;

            var servicos = [];
            var pallet = [
                {
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
                                { text: 'Capacidade: ', style: 'colorText',fontSize: 10 },
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
                },
            ]
            var motorista = [
                //MOTORISTA
                {
                    columns: [
                        {
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
            var quatidadeTotal  = 0
            var volumeTotal     = 0
            var pesoTotal       = 0
            var pesoCubadoTotal = 0
            var ValorTotal      = 0
            veiculo.veiculo.DOCUMENTOS.forEach(function (item) {

                let fontSizePE =7
                let fontColorPE ="#242F53"
                let fillColorPE = 'white'
                if (item.COD_PRIORIDADE ==2){
                    fontSizePE  =  9
                    fontColorPE="#7C79A2"
                    
               }
               if (item.COD_PRIORIDADE ==4 || item.COD_PRIORIDADE==5){
                   fontSizePE  =  12
                   fontColorPE="#ff6f69"
                   fillColorPE='gray'
               }




                if(item.TIPO_SERVICO=='E'){
                    quatidadeTotalEntrega += 1 
                    quatidadeTotal += 1 
                    item.ORDEM  =  quatidadeTotal
                }

                // if(item.TIPO_SERVICO=='C'){
                //     quatidadeTotal += 1 
                //     item.ORDEM  =  quatidadeTotal
                // }

                if (item.TIPO_SERVICO == 'E') {




                    if(item.QT_VOLUMES){
                        volumeTotal     += parseInt(item.QT_VOLUMES)
                    }
                    if(item.PESO_NOTA){
                        pesoTotal       += parseInt( item.PESO_NOTA)
                    }
                    if(item.PESO_CALCULO){
                        pesoCubadoTotal += parseInt(item.PESO_CALCULO) 
                    }

                    var serv = {
                        columns: [
                            {
                                width: 40,
                                margin: [-30, 10, 0, 0],
                                text: item.ORDEM + ')',
                                style: 'filledHeader'
                            },

                            {
                                width: '*',
                                style: 'tableExample',
                                margin: [-25, 5, -10, 0],
                                table: {
                                    headerRows: 1,
                                    widths: largColunstable1,
                                    body: [
                                        [
                                            { text: 'Ctrc'          , fontSize: 9, style: 'colorText' },
                                            { text: 'Remetente'     , fontSize: 9, style: 'colorText' },
                                            { text: 'Destinatario'  , fontSize: 9, style: 'colorText' },
                                            { text: 'Cep'           , fontSize: 9, style: 'colorText' },
                                            { text: 'Cidade'        , fontSize: 9, style: 'colorText' },
                                            { text: 'Rot'           , fontSize: 9, style: 'colorText' },
                                            { text: 'Vol'           , fontSize: 9, style: 'colorText', alignment: 'right' },
                                            { text: 'Kg'            , fontSize: 9, style: 'colorText', alignment: 'center' },
                                            { text: 'Cub'           , fontSize: 9, style: 'colorText', alignment: 'center' },
                                            { text: 'Rts'           , fontSize: 9, style: 'colorText', alignment: 'center' },
                                            { text: 'P.E'           , fontSize: 9, style: 'colorText', alignment: 'center' },
                                            { text: 'Vl.Merc'       , fontSize: 9, style: 'colorText', alignment: 'right' }

                                        ],
                                        [
                                            { text: item.DOCUMENTO          , fontSize: 6, style: 'colorText' },
                                            { text: item.REMETENTE          , fontSize: 6, style: 'colorText' },
                                            { text: item.DESTINATARIO       , fontSize: 6, style: 'colorText' },
                                            { text: item.CEP.substr(0,5) + '-' + item.CEP.substr(5,3), fontSize: 6, style: 'colorText' },
                                            { text: item.CIDADE             , fontSize: 5, style: 'colorText' },
                                            { text: item.COD_ROTA           , fontSize: 6, style: 'colorText', alignment: 'center' },
                                            { text: item.QT_VOLUMES         , fontSize: 6, style: 'colorText', alignment: 'center' },
                                            { text: [{ text: item.PESO_NOTA, fontSize: 7, bold: true, alignment: 'right' },] },
                                            { text: [{ text: item.PESO_CALCULO, fontSize: 7, bold: true, alignment: 'right' },] },
                                            { text: item.QT_RETORNOS        , fontSize: 7, alignment: 'center' },
                                            { text: item.COD_PRIORIDADE, fontSize: fontSizePE, alignment: 'center', color:fontColorPE  },
                                            { text: item.VL_MERCADORIA.toLocaleString('pt-br', { minimumFractionDigits: 2 }), fontSize: 7, alignment: 'right' },
                                        ],
                                    ]
                                },

                                
                                // layout: 'lightHorizontalLines',
                                layout: {
                                    fillColor: function (rowIndex, node, columnIndex) {
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
                                    { text: item.ENDERECO.trim()  +  ' - '+ item.BAIRRO.trim() + ' - '+  item.CIDADE.trim() + ' ' + item.UF.trim()+ '  ' + item.CEP.substr(0,5) + '-' + item.CEP.substr(5,3), fontSize: 8, style: 'colorTextOrange', alignment:'left' },
                                    { text: ' - ' + item.COMPLEMENTO, fontSize: 9, style: 'colorTextOrange' }],
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
                    var msgAgendamento   = texto_agendamento.concat(item.DS_AGENDAMENTOS_TIPO != null ? item.DS_AGENDAMENTOS_TIPO : '' 
                    ,' '
                    , item.DT_AGENDAMENTO != null ? item.DT_AGENDAMENTO  :'' 
                    , ' '
                    ,item.DS_AGENDAMENTOS_PERIODO != null ? item.DS_AGENDAMENTOS_PERIODO.toLowerCase(): '' 
                    ,' '
                    ,item.HR_AGENDAMENTO_INICIO != null ? item.HR_AGENDAMENTO_INICIO: ''
                    ,'  '
                    ,item.HR_AGENDAMENTO_FIM != null ? item.HR_AGENDAMENTO_FIM: '' )
                    
                    let fontSizeAgedamento =7
                    let boldAgendamento  =  false
                    if (item.COD_PRIORIDADE ==2){
                        fontSizeAgedamento = 9
                        boldAgendamento =true
                    }

                    var notasVolumeGaiolas = {
                        margin: marginTable3,
                        style: 'tableGaiola',
                        table: {
                            widths  : [300, '*', '*'],
                            heights: ['auto', 'auto', 'auto'],
                            body: [
                                [
                                    { text: 'End Arm.: '    + item.END_ARM, fontSize: 7, bold: false, color: '#242F53' },
                                    { text: 'Notas'         + item.NOTAS, fontSize: 7, bold: false, color: '#242F53' },
                                    { text: 'Nr.Unitizador' + item.UNITIZADORES, fontSize: 7, bold: false, color: '#242F53' }
                                ],
                                [
                                    { text: msgAgendamento , fontSize: fontSizeAgedamento, bold: boldAgendamento, color: '#242F53' , italics:true },
                                    { text: 'Id. Volumes:'  + item.ID_VOLUMES, fontSize: 7, bold: false, color: '#242F53' },
                                    { text: 'Gaiolas:'      + item.GAIOLAS, fontSize: 7, bold: false, color: '#242F53' }
                                ],
                            ]
                        },
                        layout: 'lightHorizontalLines'

                    }


    
                    servicos.push(serv);
                    servicos.push(address);
                    servicos.push(notasVolumeGaiolas);
                    

                    // if(item.VL_MERCADORIA){
                    //     ValorTotal      += item.VL_MERCADORIA
                    // }


               

                }

            })



            var inclusaoCTRC = [
                {
                    margin  : [0, 20, 0, 0],
                    style: 'colorText',
                    fontSize: 10,
                    text:'Inclusão de CTRCs :   _____________/_____________/_____________/_____________/_____________/_____________/_____________'
                }
            ]

            var exclusaoCTRC = [
                {
                    margin  : [0, 5, 0, 0],
                    style: 'colorText',
                    fontSize: 10,
                    text:'Exclusão de CTRCs:   _____________/_____________/_____________/_____________/_____________/_____________/_____________'
                }
            ]
            var inclusaoMinutas = [
                {
                    margin  : [0, 5, 0, 0],
                    style: 'colorText',
                    fontSize: 10,
                    text:'Inclusão Minutas    :   _____________/_____________/_____________/_____________/_____________/_____________/_____________'
                }
            ] 

            var foorterTotalizador = [
                {
                    margin: [120, 5, 0, 0],

                    text:[
                        { text: 'Qtd Serviços: ', style: 'colorText', fontSize: 10, alignment: 'left' },
                        { text: quatidadeTotalEntrega, fontSize: 15, bold: true, color: '#FF5600' },


                        { text: '       Volume: ', style: 'colorText', fontSize: 10 },
                        { text: volumeTotal, fontSize: 15, bold: true, color: '#FF5600' },


                        { text: '       Peso: ', style: 'colorText', fontSize: 10 },
                        { text: pesoTotal, fontSize: 15, bold: true, color: '#FF5600' },

                        { text: '       Peso Real: ', style: 'colorText', fontSize: 10},
                        { text: pesoCubadoTotal, fontSize: 15, bold: true, color: '#FF5600' }

                        // { text: '       Valor: ', style: 'colorText', fontSize: 10, alignment: 'right' },
                        // { text: ValorTotal.toLocaleString('pt-br', { minimumFractionDigits: 2 }), fontSize: 15, bold: true, color: '#FF5600' },
                         
                    ]
                }
            ]

            var headerColeta = [
                { text: 'Coleta(s) roteirizada(s) - Apenas informativo (sem carregamento de saída)'
                , style: 'colorText'
                , fontSize: 15
                , bold: true
                , margin: [0, 20, 0, 8] },
            ]


            var responsavelLimpesa = [
                {
                    margin  : [0, 15, 0, 0],
                    style:'colorText',
                    fontSize:9,

                    text: [
                        {
                            text:'Responsável pelo Limpeza :   ________________________________________________________________               LACRE T __________ '
                        }
                    ]

                }
            ]


            var responsavelLimpeza1 = [
                {
                    margin  : [0, 5, 0, 0],
                    style:'colorText',
                    fontSize:9,
                    text: [
                        { text: 'Inicio: _____ /_____ /______   ____ : ____              Término: _____ /_____ /______   ____ : ____             LACRE L _________   ', style: 'colorText', fontSize: 10 }
                    ]

                }
            ]



            var responsaInicioFIm = [
                {
                    margin  : [0, 30, 0, 0],
                    text:[
                        { text:'CTRCs Carregados :   ________ '                     , style: 'colorText', fontSize: 8, alignment:'left'},
                        { text:'Resp. pelo carregamento : ____________________ '    , style: 'colorText', fontSize: 8, alignment:'left'},
                        { text: 'Inicio Carreg.: '                                  , style: 'colorText', fontSize: 8 },
                        { text: '___/___/_____  ___:___ '                           , style: 'colorText', fontSize: 8 },
                        { text: 'Término Carreg.: '                                 , style: 'colorText', fontSize: 8 },
                        { text: '___/___/_____  ___:___ '                           , style: 'colorText', fontSize: 8 },
                        
                    ]
                }
            ]


            servicos.push(foorterTotalizador)
            servicos.push(inclusaoCTRC)
            servicos.push(exclusaoCTRC)
            servicos.push(inclusaoMinutas)
            // servicos.push(CTRCCarregados)
            servicos.push(responsavelLimpesa)
            servicos.push(responsavelLimpeza1)
            servicos.push(responsaInicioFIm)
         

            servicos.push(headerColeta)


            veiculo.veiculo.DOCUMENTOS.forEach(function (item) {
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
                                                { text: item.CEP.substr(0,5) + '-' + item.CEP.substr(5,3), fontSize: 6, style: 'colorText' },
                                                { text: item.CIDADE, fontSize: 6, style: 'colorText' },
                                                { text: item.COD_ROTA, fontSize: 6, style: 'colorText', alignment: 'center' },
                                                { text: item.QT_VOLUMES, fontSize: 6, style: 'colorText', alignment: 'center' },
                                                { text: [{ text: item.PESO_NOTA, fontSize: 7, bold: true, alignment: 'right' },] },
                                                { text: item.QT_RETORNOS, fontSize: 7, alignment: 'center' },
                                                { text: item.COD_PRIORIDADE, fontSize: 7, alignment: 'center' },
                                                { text: item.VL_MERCADORIA, fontSize: 7, alignment: 'right' },
                                            ],
                                        ]
                                    },
                                    // layout: 'lightHorizontalLines',
                                    layout: {
                                        fillColor: function (rowIndex, node, columnIndex) {
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
                                    { text: item.ENDERECO.trim() + ' - ' + item.CIDADE.trim() + ' ' + item.UF.trim() + '  ' + item.CEP.substr(0,5) + '-' + item.CEP.substr(5,3), fontSize: 8, style: 'colorTextOrange', alignment:'left' },
                                    { text: ' - ' + item.COMPLEMENTO, fontSize: 9, style: 'colorTextOrange' }],
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
                            { text: veiculo.veiculo.FILIAL, fontSize: 10, bold: true, color: '#FF5600' },
                            { text: '               Data do Processamento:', style: 'colorText', fontSize: 10 },
                            { text: moment(veiculo.veiculo.DT_INCLUSAO_ROTEIRIZACAO).format('DD/MM/YYYY'), fontSize: 10, bold: true, color: '#FF5600' },

                        ]

                    },

                    {
                        width: '*',
                        margin: [30, 0, 0, 0],
                        text: [
                            { text: 'Veiculo: ', style: 'colorText', fontSize: 10,alignment: 'left' },
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
                        margin:10,
                        columns: [
                        {
                            fontSize: 9,
                            text:[
                            {
                            text: '--------------------------------------------------------------------------' +
                            '\n',
                            margin: [0, 20]
                            },
                            {
                            text: '© xyz pvt., ltd. ' + currentPage.toString() + ' of ' + pageCount,
                            }
                            ],
                            alignment: 'center'
                        }
                        ]
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
                    }, colorText: {
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



        $scope.pickingList = function (cod_roteirizacao, veiculo) {

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

            }
            catch (e) {
                // declarações para manipular quaisquer exceções
                //logMyErrors(e); // passa o objeto de exceção para o manipulador de erro
                swal("Ops!", e, "error");
                // toastr.error(e, 'Erro')
            } finally {
                // console.log("finally");
            }



        };


        $rootScope.RefreshConferencia  =  function(caixaSelecionadaConferencia){

            if(caixaSelecionadaConferencia){
                $scope.veiculosRetorno         = caixaSelecionadaConferencia.veiculos;
                $scope.servicosRotaConferencia = caixaSelecionadaConferencia.servicosCaixa
            }


            atuallizaConferencia();
        }


        function setTableRowPosition(row, nmtable) {
            var divTable   = findElement(nmtable.toString());
            divTable.scrollTop = row.offsetTop - divTable.offsetHeight + 50;
        }

        

        function setLineGrid(nmtable, scanner) {

            var element = findElement("#txtScannerConferencia");

            var table   = findElement(nmtable.toString());
            var rows    = table.rows; // todos os serviços  do grid
            var rowNew  = 0


            for (i = 1; i < rows.length; i++) {

                // LOCALIZAR POR DOCUMENTO
                if ( rows[i].cells[1].innerHTML.trim().substr(4, 20)== scanner ||
                     rows[i].cells[19].innerText.trim()             == scanner ) {

                    rowNew = rows[i];            
                    setTableRowPosition(rowNew,"#divTableDocumentosConferenciaAll");
                    
                    
                    var COD_VEICULOS_  =  rows[i].cells[18].innerText.trim()
                    
                    if (COD_VEICULOS_) {
                        if (parseInt(COD_VEICULOS_) > 0) {
                            $scope.openLink_AJS('', COD_VEICULOS_)
                        }
                    }
                    break;
                }

            }
        }


        $scope.onKeyUpTxtScannerConferencia = function (event) {
            if (event.keyCode == 13) {


                var txtScanner             = findElement("#txtScannerConferencia");
                var table = findElement("#tableDocumentosConferenciaAll");
                var rows    = table.rows;

                //loop procura em todo grid  se achar seleciona se nao achar manda o son quando o scanner estiver ativo 
                /* == Lógica ptoEmVeiculo  = '';
                var EmVeiculo           = '';
                

                
                element.focus();ara enfocar el elemento  == */
                
                /* == Fin de la Lógica para enfocar el elemento  == */
                var veiculoEnter = 0;
                var blnAchou     = false;


                $scope.servicosRotaConferencia.forEach(function (item) {

                    if (item.COD_BARRAS == txtScanner.value || item.NR_DOCUMENTO == txtScanner.value) {
                   
                   

                        $scope.veiculosRetorno.forEach(function(vei){
                            var idx  = vei.servicos.indexOf(item)
                            if(idx>0  ){
                                vei.servicos[idx].FL_CONFERIDO = true
                            }
                        })
                            


                        if(item.COD_VEICULOS ==null || item.COD_VEICULOS ==undefined){

                            $scope.audioNaoAchou.play();

                            swal(`Cte : ${item.NR_DOCUMENTO_FORMATADO} fora veículo!`, {
                                position: 'top-end',
                                icon: "warning",
                                showConfirmButton: false,
                                timer: 1800,
                            })
                        }


                        if (item.selected == true) {

                            if(item.COD_VEICULOS ==null || item.COD_VEICULOS ==undefined){

                                $scope.audioNaoAchou.play();

                                swal(`Cte : ${item.NR_DOCUMENTO_FORMATADO} fora veículo!`, {
                                    position: 'top-end',
                                    icon: "warning",
                                    showConfirmButton: false,
                                    timer: 1800,
                                })

                            }else{

                                swal("Já Conferido!", {
                                    position: 'top-end',
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1000,
                                })
                            }

                            setLineGrid('#tableDocumentosConferenciaAll', txtScanner.value)

                            txtScanner.value = "";
                            txtScanner.focus();

                        }

                        setLineGrid('#tableDocumentosConferenciaAll', txtScanner.value)

                        atuallizaConferencia();


                        blnAchou            = true;
                        item.selected       = true
                        item.FL_CONFERIDO   = true
                        veiculoEnter        = item.IDENT_VEICULOS

                        txtScanner.value = "";
                        txtScanner.focus();

                        // toastr.selecionaGrid("Documento: " + item.NR_DOCUMENTO_FORMATADO, 'Selecionado');

                    }

                });

                
                if (!blnAchou) {
                    txtScanner.value       = "";
                    $scope.audioNaoAchou.play();

                    


                    swal("Código de barras ou nrº Documento : " + txtScanner.value, "Documento não encontrado!", {
                        icon: "error"
                    })
                        .then((value) => {
                            txtScanner.value ="";
                            txtScanner.focus();
                        });
                    veiculoEnter = 0;

                }

            }

        }


        $scope.showGridBottomSheet = function () {
            console.log('paulo')
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'view/partials/BottomSheet-troca-veiculo/trocaVeiculo.html',
                controller: 'trocaVeiculoController',
                resolve: {
                    usuarioLogado: function (roteirizadorAPI, $rootScope, $localStorage, $location) {
                        return $localStorage.UsuarioLogado;
                    }
                },
                clickOutsideToClose: false
            }).then(function (clickedItem) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(clickedItem['name'] + ' - COD: ' + clickedItem['COD_FILIAIS'] + ' clicked!')
                        .position('top right')
                        .hideDelay(1500)
                );
            }).catch(function (error) {
                // User clicked outside or hit escape
            });
        };


        $scope.trocaselecao = function () {


            $scope.inverterSelecao = !$scope.inverterSelecao;

            $scope.servicosRotaConferencia.forEach(function (item) {

                item.selected = !item.selected
            })


            const setSelected = $filter("filter")($scope.servicosRotaConferencia, { selected: true  }, true);
            if(setSelected){
                totalizadorGridConferencia(setSelected)
            }

        }
        
        $scope.excluirServicoVeiculoCaixaRota =  function(acao){

            if(acao=='voltaGridPrincipal'){

                swal({
                    title       : "Descarregar itens selecionados ao grid principal?",
                    text        : "Ao confirmar os itens selecionados irão retornar ao grid principal, podendo ser adicionado a mesma caixa de rota ou outra.",
                    icon        : "warning",
                    buttons     : true,
                    dangerMode  : true,
                })
                    .then((willDelete) => {
                        if (willDelete) {

                            var itensSelecionados = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);

                            itensSelecionados.forEach(function (item) {
                                if (item.COD_VEICULOS == null) {
                                    item.ROTA_DOC_REAL  = null
                                    item.ORDEM_ENTREGA  = ""
                                    item.COD_VEICULOS   = 0
                                    item.IDENT_VEICULOS = ""
                                    item.FL_CONFERIDO   =false
                                    item.TIPO_ROUTER    = ''
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
            if(acao=='descarregarVeiculoCaixa'){1
                
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


                            var itens                   = []
                            var itensSelecionados       = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);
                            var itensSelecionadosCopy   =  angular.copy(itensSelecionados)

                            itensSelecionadosCopy.forEach(function(item){
                                if(item.COD_VEICULOS>0){
                                    item.COD_VEICULOS   =0
                                    item.IDENT_VEICULOS =""
                                    item.selected       =false
                                    item.FL_CONFERIDO   =false
                                    item.ORDEM_ENTREGA  = 0
                                    item.TIPO_ROUTER =  item.TIPO_ROUTER=="ROUTEASY"?"AJUSTE":item.TIPO_ROUTER
                                }
                            })

                            itens.push(itensSelecionados)
                            itens.push(itensSelecionadosCopy)

                            updateServicosVeiculo(itens,'descarregarVeiculoCaixa')



                            

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


        $scope.salvarStatusConferencia = function () {

            var servicosConferido = []
            
            $scope.servicosRotaConferencia.forEach(function (item) {

                if(item.selected==true){

                    if (item.COD_VEICULOS > 0 || item.IDENT_VEICULOS != '') {
                        
                        item.TIPO_ROUTER =  item.TIPO_ROUTER//=="ROUTEASY"?"AJUSTE":item.TIPO_ROUTER
                        item.FL_CONFERIDO  =true;
                        item.acao="CONFERIDO"
                        servicosConferido.push(item)
                    }
                }

            })

            var salvarConferencia = $filter("filter")(servicosConferido, { selected: true }, true);

            salvarStatusConferencia_(salvarConferencia)


            swal("Conferência!","Salvo com sucesso", {
                position: 'top-end',
                icon: "success",
                showConfirmButton: false,
                timer: 1700,
            });

            // swal("Conferência!", "Salva com sucesso !", {
            //     icon: "success",
            // });


        }

        function salvarStatusConferencia_(servicos) {

            if (servicos.length > 0) {


                // $scope.servicosRotaConferencia.forEach(function (value) {
                servicos.forEach(function (value) {

                    $http.put(config.baseUrl + "/api/conferencia/" + value.COD_ROTEIRIZACAO + "/" + value.ROTA + '/' + value.COD_DOCUMENTO + '/' + value.acao +'/'+ value.TIPO_ROUTER  )
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


        $scope.openLink_AJS = function (evt, animName) {


            // var elementoLink = angular.element(document.querySelector('#tablink-' + animName));//findElement("#divDocumentos");
            // var elementoLink =  angular.element(document.querySelectorAll('#tablink'));//findElement("#divDocumentos");


            //limpar a selecao atual
            var elementoLinkAll = angular.element(document.querySelectorAll('.tablink'));
            for (i = 0; i < elementoLinkAll.length; i++) {
                elementoLinkAll[i].className = elementoLinkAll[i].className = 'w3-bar-item w3-button tablink ng-scope';//.replace(" w3-orange", "");
        
                // elementoLinkAll[i].removeClass('w3-orange')
                

            }

            // elementoLinkAll[0].className += " w3-orange";

            var elemento = angular.element(document.querySelector('#textField-' + animName));//findElement("#divDocumentos");



            if(ultimo == undefined){
                elemento.removeClass('hide')
                elemento.addClass('show')
            }else if(elemento[0].id != ultimo[0].id){
                elemento.removeClass('hide')
                elemento.addClass('show')
            }


            if (ultimo != undefined   && elemento[0].id != ultimo[0].id  )   {
                ultimo.removeClass('show')
                ultimo.addClass('hide')
            }

            var tabSelecionada = angular.element(document.querySelector('#textTab-' + animName))
            if(tabSelecionada){
                tabSelecionada.addClass('w3-orange')
            }

            // if (evt != '') {
            //     if (evt.currentTarget.id != '') {
            //         evt.currentTarget.className += " w3-orange";
            //     }
            // }

            ultimo = elemento

        }




            
        function updateServicosVeiculo (itens, acao){
                
            if (acao == 'voltaGridPrincipal') {
                $http.put(config.baseUrl + "/api/PUT_ROTA_DOC_REAL", itens)
                .then(
                    function sucesso(reponse) {

                        
                    swal("itens! retornaram ao grid principal!", {
                        icon: "success",
                    });


                    itens.forEach(function(item){
                        console.log($scope.veiculosRetorno)

                        var idx  =  $scope.servicosRotaConferencia.indexOf(item)
                        if(idx>=0){
                            $scope.servicosRotaConferencia.splice(idx,1)
                        }
                    });


                    },
                    function errorCallback(error) {
                       swal("Ops!", "ops algum erro ocorreu, acionar suporte lado Solistica (integração)!", "error");
                    }
                )
                itens.forEach(function(item){
                    item.selected =false;
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

                        itens[0].forEach(function(item){
                            // console.log($scope.veiculosRetorno)

                            item.COD_VEICULOS   =   0
                            item.IDENT_VEICULOS =   ""
                            item.ORDEM_ENTREGA  =   ""
                            item.selected       =   false

                            
                            if($scope.veiculosRetorno != undefined || $scope.veiculosRetorno != null){
                                $scope.veiculosRetorno.forEach(function(serv){
                                    var idx  =  serv.servicos.indexOf(item)

                                    if(idx>=0){
                                        serv.servicos[idx].selected =  false;
                                        serv.servicos.splice(idx,1)
                                    }
                                })
                            }

                        });

                        var itensSelecionados       = $filter("filter")($scope.servicosRotaConferencia, { selected: true }, true);
                       

                        itensSelecionados.forEach(function(item){
                            item.selected       =  false
                            item.COD_VEICULOS   =  0
                            item.IDENT_VEICULOS =  ""
                            item.ORDEM_ENTREGA  = ""

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
                    .success(function (data, status) {
                        toastr.success('Serviço(s) inserido do veículo com sucesso', 'Aviso');
                    })
                    .error(function (data, status, header, config) {
                        toastr.error('ops algum erro ocorreu, acionar suporte lado Solistica (integração)', 'Aviso');
                    });

                carregarVeiculos()


                // $http.put(config.baseUrl + "/api/servicos",  itens).then(successCallback, function errorCallback(){});

            } else if (acao == "descarregar") {

                $http.put(config.baseUrl + "/api/servicos/del", itens)
                    .success(function (data, status) {
                        toastr.warning('Serviço(s) retirado do veículo com sucesso', 'Aviso');
                    })
                    .error(function (data, status, header, config) {
                        toastr.error('ops algum erro ocorreu, acionar suporte lado Solistica (integração)', 'Aviso');
                    });

                // $http.put(config.baseUrl + "/api/servicos/del", itens).then(successCallback, function errorCallback(){});
            }
        }

        function carregarVeiculos(tipo, rotaSelecionada) {



            if(tipo=='paulo'){

            }

            if (tipo == 'conferencia') {

                var vei = []
                $scope.lstVeiculos = listarVeiculos.data;

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


            } else {

                $scope.lstVeiculos = listarVeiculos.data;

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

        function totalizadorGridConferencia(servicos){

            $scope.contadorSelecteds = {
                qtd_Selecionados: 0,
                qtd_volumes     : 0,
                qtd_Peso        : 0,
                qtd_PesoReal    : 0,
                qtd_ValorMecaria: 0
            }

            var volumes     = 0;
            var peso        = 0;
            var pesoReal    = 0;
            var valorMerc   = 0;
            var valorFrete  = 0;

            servicos.forEach(function(value){

                if (value.PESO == null || value.PESO == undefined) {
                    value.PESO = 0
                }
                peso += parseFloat(value.PESO)
    
                if (value.PESO_REAL == null || value.PESO_REAL == undefined) {
                    value.PESO_REAL = 0
                }
                pesoReal += parseFloat(value.PESO_REAL)


                if (value.QT_VOLUME == null || value.QT_VOLUME == undefined) {
                    value.QT_VOLUME = 0
                }
                volumes += parseFloat(value.QT_VOLUME)
    

                if (value.VALOR == null || value.VALOR == undefined) {
                    value.VALOR = 0
                }
                if (value.VALOR.toFixed(2)) {
                    valorMerc = (parseFloat(valorMerc) + (value.VALOR));
                }
    
                if (value.FRETE.toFixed(2)) {
                    valorFrete = (parseFloat(valorFrete) + (value.FRETE));
                }
            })
            

            $scope.contadorSelecteds = {
                qtd_Selecionados: servicos.length,
                qtd_volumes: volumes,
                qtd_Peso: peso,
                qtd_PesoReal: pesoReal,
                qtd_ValorMecaria: valorMerc.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                qtd_ValorFrete: valorFrete.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
            }


        }


        $scope.setClickedRowConferencia = function (index, event, objeto) {

            var element         = findElement('#' + objeto);
            var rows            = element.rows;
            var codDocumento    = rows[index +1].cells[17].innerHTML.trim();
            var COD_VEICULOS_   = rows[index +1].cells[18].innerHTML.trim();

            var veiculos = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(COD_VEICULOS_)  }, true);
            var idx  =  $scope.veiculosRetorno.indexOf(veiculos[0])

            if(idx >-1){
                $scope.tabSelecioada =  idx
            }

           

            $scope.servicosRotaConferencia.forEach(function (value) {
               
                if (value.COD_DOCUMENTO == codDocumento.trim()) {
                    value.selected     = !value.selected;
                    atuallizaConferencia();
                    return
                }
            })

            const setSelected = $filter("filter")($scope.servicosRotaConferencia, { selected: true  }, true);
            if(setSelected){
                totalizadorGridConferencia(setSelected)
            }
        }
        
        //#endregion

        //#region  FUNÇÕES 




        function atuallizaConferencia() {

            $scope.veiculosRetorno.forEach(function (item) {
                item.qtdConferido = 0;
                item.servicos.forEach(function (serv) {
                    if ( serv.FL_CONFERIDO && serv.COD_VEICULOS > 0) {
                        item.qtdConferido = item.qtdConferido + 1
                    }
                   
                    $scope.$applyAsync();
                })

            })
        }


        function findElement(query) {
            //Funcion para realizar la busqueda del elemento.
            var id = document.querySelector(query);
            var elements = angular.element(id);
            return elements[0];
        }

        //#endregion

        //#region  COMENTADO

///**************************************************************************************************************************************** */

        // $scope.salvarStatusConferencia = function () {

        //     var servicosConferido = []

        //     $scope.servicosRotaConferencia.forEach(function (item) {

        //         if (item.selected == true) {

        //             if (item.COD_VEICULOS > 0 || item.IDENT_VEICULOS != '') {

        //                 item.FL_CONFERIDO = true;
        //                 item.acao = "CONFERIDO"
        //                 servicosConferido.push(item)

        //             }
        //         } else {

        //             // if (item.COD_VEICULOS > 0 || item.IDENT_VEICULOS != '') {

        //             //     item.FL_CONFERIDO  =false;
        //             //     item.acao="LIMPAR"
        //             //     servicosConferido.push(item)
        //             // }
        //         }

        //     })

        //     var salvarConferencia = $filter("filter")(servicosConferido, { selected: true }, true);

        //     salvarStatusConferencia_(salvarConferencia)



        //     swal("Conferência!", "Salva com sucesso !", {
        //         icon: "success",
        //     });


        // }

        // function salvarStatusConferencia_(servicos) {

        //     if (servicos.length > 0) {


        //         // $scope.servicosRotaConferencia.forEach(function (value) {
        //         servicos.forEach(function (value) {

        //             $http.put(config.baseUrl + "/api/conferencia/" + value.COD_ROTEIRIZACAO + "/" + value.ROTA + '/' + value.COD_DOCUMENTO + '/' + value.acao)
        //                 .then(function sucesso() {
        //                     // if (value.FL_CONFERIDO) {
        //                     //     // toastr.success(value.NR_DOCUMENTO_FORMATADO + ' veículo:' + value.IDENT_VEICULOS, 'Conferido');
        //                     // } else {
        //                     //     toastr.warning(value.NR_DOCUMENTO_FORMATADO + ' Conferência removida', 'Aviso');
        //                     // }
        //                 }
        //                     // ,
        //                     //     function errorCallback(error) {
        //                     //         toastr.error('Erro ao conferir, detalhe do erro (' + error.status + ')', 'Aviso');
        //                     //     }
        //                 );
        //             value.FL_CONFERIDO = true
        //             value.selected = false

        //         })

        //         // ATUALIZAR A QUANTIDADE CONFERIDA NA CAIXA DO VEICULO
        //         atuallizaConferencia()

        //         console.log($filter("filter")($scope.servicosRotaConferencia, { FL_CONFERIDO: true }, true))
        //     }

        // }

        // function atuallizaConferencia() {
        //     $scope.veiculosRetorno.forEach(function (item) {
        //         item.qtdConferido = 0;
        //         item.servicos.forEach(function (serv) {
        //             if (serv.selected == true || serv.FL_CONFERIDO && serv.COD_VEICULOS > 0) {
        //                 item.qtdConferido = item.qtdConferido + 1
        //             }

        //             // if (serv.FL_CONFERIDO) {
        //             //     item.qtdConferido = item.qtdConferido + 1
        //             // }
        //         })
        //     })
        // }

        // $scope.conferencia = function () {


        //     $scope.servicosRotaConferencia = []
        //     var radioConferencia = angular.element(document.querySelector('#idConferencia'));

        //     // var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: parseInt(5005) }, true);
        //     // console.log(reg)

        //     if (radioConferencia[0].checked == true) { // CONFERENCIA HABILITADA (SELECIONADA)

        //         //quantidade de rotas selecionadas para conferencia
        //         var qtdRotasSelected = $filter("filter")($scope.rotas, { on_off: true }, true);

        //         if (qtdRotasSelected.length > 1) {
        //             toastr.warning('Seleciona apenas uma rota para conferência!', "Aviso")

        //         } else {

        //             //abrir o modal com os grids para conferencia 
        //             var myconfer = angular.element(document.querySelector('#myConferencia'));
        //             if (myconfer) {
        //                 myconfer[0].style.width = "100%";
        //             }
        //             $scope.veiculosRetorno = []
        //             $scope.veiculosRetornoAux = []
        //             //carregar veiculos da rota de conferencia selecioanda  
        //             var vei = carregarVeiculos('conferencia', qtdRotasSelected);



        //             vei.forEach(function (vei) {

        //                 var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: parseInt(vei) }, true);

        //                 if (reg) {
        //                     reg[0].servicos = []

        //                     $scope.veiculosRetorno.push(reg[0])
        //                 }
        //             })


        //             qtdRotasSelected.forEach(function (rota) {
        //                 rota.services.forEach(function (serv) {

        //                     var veiculo = $filter("filter")($scope.veiculosRetorno, { COD_VEICULOS: parseInt(serv.COD_VEICULOS) }, true);

        //                     if (veiculo) {

        //                         if (veiculo.length > 0) {
        //                             if (serv.COD_VEICULOS == veiculo[0].COD_VEICULOS) {
        //                                 veiculo[0].servicos.push(serv)

        //                                 if (veiculo[0].qtdConferido == undefined) {
        //                                     veiculo[0].qtdConferido = 0
        //                                 }
        //                                 if (serv.FL_CONFERIDO == true) {
        //                                     veiculo[0].qtdConferido = parseInt(veiculo[0].qtdConferido) + 1
        //                                 }

        //                             }
        //                         }

        //                     }

        //                 })

        //             })

        //             $scope.servicosRotaConferencia = qtdRotasSelected[0].services;
        //             // console.log($scope.veiculosRetorno[0], $scope.servicosRotaConferencia, qtdRotasSelected)


        //         }


        //     } else { // CONFERENCIA DESABILITADA

        //         var myconfer = angular.element(document.querySelector('#myConferencia'));
        //         if (myconfer) {
        //             myconfer[0].style.width = "0";
        //         }

        //         toastr.warning('Conferencia não habilitada!', "Aviso")
        //     }
        // }


        // function carregarVeiculos(tipo, rotaSelecionada) {


        //     if (tipo == 'conferencia') {

        //         var vei = []
        //         $scope.lstVeiculos = listarVeiculos.data;

        //         if (rotaSelecionada != undefined) {
        //             rotaSelecionada[0].services.forEach(function (item) {
        //                 if (item.IDENT_VEICULOS != '') {
        //                     var idx = vei.indexOf(item.COD_VEICULOS)
        //                     if (idx < 0) {
        //                         vei.push(item.COD_VEICULOS)
        //                     }
        //                 }

        //             })

        //             return vei
        //         }


        //     } else {

        //         $scope.lstVeiculos = listarVeiculos.data;

        //         $scope.lstVeiculos.forEach(veiculos => {
        //             veiculos.IDENT_VEICULOS = leftPad(veiculos.IDENT_VEICULOS, 7); // 0000001
        //             veiculos.servicos = []
        //         })

        //         var contator = 0

        //         $scope.all.forEach(function (item) {

        //             var reg = $filter("filter")($scope.lstVeiculos, { COD_VEICULOS: item.COD_VEICULOS }, true);

        //             if (reg[0] != undefined) {
        //                 contator = contator + 1;
        //                 reg[0].servicos.push(item)
        //             }
        //         });

        //     }

        // }

        //#endregion

    });
