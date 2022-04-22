angular.module("TopRoute").factory("pickingListSERVICE", function($http, config, toastr, $location, $localStorage) {


    var rel_pickingList_All = function(veiculo) {


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
        veiculo.servicos.forEach(function(item) {

            let fontSizePE = 7
            let fontColorPE = "#242F53"
            let fillColorPE = 'white'

            // if (item.COD_PRIORIDADE ==2){
            //      fontSizePE  =  9
            //      fontColorPE="#7C79A2"

            // }
            if (item.COD_PRIORIDADE == 1 || item.COD_PRIORIDADE == 2 || item.COD_PRIORIDADE == 3 || item.COD_PRIORIDADE == 4 || item.COD_PRIORIDADE == 5) {
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


        veiculo.servicos.forEach(function(item) {
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
                title: 'PickingList',
                author: 'solistica',
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
                        { text: veiculo.FILIAL, fontSize: 10, bold: true, color: '#FF5600' },
                        { text: '               Data do Processamento:', style: 'colorText', fontSize: 10 },
                        { text: moment(veiculo.DT_INCLUSAO_ROTEIRIZACAO).format('DD/MM/YYYY'), fontSize: 10, bold: true, color: '#FF5600' },

                    ]

                },

                {
                    width: '*',
                    margin: [30, 0, 0, 0],
                    text: [
                        { text: 'Veiculo: ', style: 'colorText', fontSize: 10, alignment: 'left' },
                        { text: veiculo.IDENT_VEICULOS, fontSize: 10, bold: true, color: '#FF5600', alignment: 'left' },

                    ]
                },

                {
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAABMCAIAAAAtGDQDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABG3SURBVHhe7ZwHXFTH9sfPNljYpfcmYkDsCAgkYgRFRH2GSOwaNZoYEzX6ecYSjS0WYmyJSh5ijTWieco/UWNvUSLYFSyICCi9SduFdcv/zN4rsg/YvQuyLPn4/SzLzNy7u3N/d+bMOTP3XpZCoYC36Ao2/f8tOuGt3Drlrdw65a3cOuWt3DpFV54J/sqLXCjMhLJ8qCgGiRhEZVgKPEMwMAJjMzCxBgtHsGkLhsb0R/6JNKfcJVnwOBFSE+HJNci4A+IyUMiJ7uQXqXclLBb+kXcWG9gcsHGFtj7g4Q/v+EM7H+Dx6d3+ETSD3Bl34eZRSDgMz5NBJgG5nC7XDhZwuGBkAt3CoEc4eIWB0ILe0pp5c3Jj442PhbNbIOMeSKvpwjcCmw18EwgYCsETwbMn6QStljchd0k2nIqGs1uhrICYi+aDawBuvhA+F3wHk7bfCmma3DjcHf8J/twAFSXEHOsGFBqN+6gV0LWf0u63JhorN37q6m+wbx4Upr8e9HQJtnS/ITD2B+LMtB4aJXdJDvwyE67FgewlXdJSoPv48RoIGt9aDLr2ciedg82fQkE6nW1x0La8NwombQRBK3BdtJT7+AY48C1UV9JZ/QGH0Jn7waE9ndVXGMstlxFLjaOiTEqX6Bvm9jD3D3inB53VS5jJjVpvmwrntjXVzzMwBmtnMLMDY3MSuyMYBKHDjmE9jgelOY2NiV4htII5cdChF53VPxjIjRJvnwZntjRSa4wM3QOg4/vQIQgc2xPFeTxg40s5uOGv47nEIfdlNVQWk6D/wUV4FA9ZDxr5c0JL+OY4eATQWT2DgdyHlsLhFUQUbXH3h15jibtmZqvF1AeqLC4nEwAXd0HiERI6aYuFIyw+B46edFaf0CQ3xuU/jwephM4ypENviJhPOjVfSJc0AjzBL3Lg7HY4HQ2leXQhQ1y7w5JzeuirqJU7+xEsDoTyIjrLBFs3GLkC/D4EQwFd0kSweoWZcGQlaexanXV0xr/YSZssvaFhubFxLekFKVfpLBMCx5Awz9LpzcfWaNxvn4Qd06Ewgy7RCJsDU3+B9z+ms/pBw3LHrSIuNsPxyoAPoyKh/1SyXNB85D+F6Elw/wKd1QiOGT/cIqZcb2igr73IhT/WMNUa7ca0PTBwZvNqjaClmn2EzMQypDSfjPM6mztjQANy75tLfGEmoMTT9xAJdGMlBebERKC3wxC0+Om36bQeUJ9GBRlkLYYRLJgYRQZGXU6Eorfz5U7weJfOqgdHV7SK6r0vHVKf3IdXMp0VCZ0CwZ+0wGwctvFpu0l0ygR03tHF0g/qKPWyisysMsHOHUZHttiqioMHjFtLupdG0Ks5v5NOtzR15L4SC+WFdFo9n0a1cBzRcxR49afT6rm8lzQjPaCO3Jf3MRrKO/eFLn3pNDPQ43z2PO/6zQfxCffuP3wqEmt3/DKZfNW63d+v3YWvnFxlg+BwL7uPH5cRuCC7e7lMbScrySbzMA1w5OiFiDHzFi3fUlWlZfCsPap+t0wKk22hsoTOqmHhGegaQqcZkPwgbUP0wXvJqeUVIplUZmRkaGNjMTS8z+jh/U2EjK7jeflS2sF3JFXbuF9Xd+vijolh4+bfvE3scozL1VCTHLJfQ3wwpyx8yaaYQ9Q3TJ081NLClNrSq/+U7BwyMxP7y3I/385UYTOh2rpTE0D0gk6rwdpVq0nOB4/SJ3654sz5xLz8YpGoqlry8kVpxePUZ1Exh6jjbDT/Cgt0srfyMSrqytfURO6drqwU7dz7x4495FVW/toXiBgc5GBn5e/bycO9DV3UbKjKfevPGp9JYQAKAShMQGGE3ZYqe0XIZK0imo2bDxYWkbNoaiL4bEL4wnmTPvqwj4O9VeR3U9s37QgnjBkUu2vlzs4p9rxapslQWXOhas2fJUFVOZ1WZebUEQd3R26LWmBuZkIXNRuqJi/jDr5hLeW2oMAuzmGRkV8OLKkCXgAHDSY1C9u5j/IfU9LSs6jEyKH9vpk1nsUiFiwrp9DR3hrT1CakUlR16/bDu8lPKipEfL5Bxw5uvt071HT5evkr/nZ5hZhr0K1baakjT4x1rrZi3xJbJpeaF0sMBGypp6DMl1NsXiEpquacP3aqxnCev3TDxck2JNgff//k2QSq3MfL09HBWrkd0I7fuvPo7v0npaXlPC7Xs70rNn9rK3Nqa3ZuYfL9tJTUTLSNBgY8j3bO/j0629laUlvVoGq75/nIX9ySOymFrgOrUsHJQMXZsL2IeL6MGTHhWxwhMeHqYv/t3Im+Xp4WdUS8m5y67PvtSQ+eSCT04hyHw27r6jh7xpj+fQPwrNRruwdEzExJfYaJNY43Itwyxbac+Te8z2Q5VsnoVs1ly70si3f7X0l8aDMprWetQwVU58rprWw2y91rmFy5ivTzutkD+/fExMOU9GU/7Lh1J6W6mh482Wy2W1uH1cu+8vZqfyju3Kbog6g49SkEq+fqYrd0weTegd5USUOoGBOFtKghrRGFgCVzQcPtDMbqWlxdRkSEcLnk+DOe5U6btWb4+AXLV+9Ag15zpp+mZ0+ZsermnUeoNe7pYG9taGiArsiTtOez5m/AJkztpgZs11jz07kOxzKdKa3tjcW2RmKZgjXAJZtnqgB7BY/9Wm0Om40vOqNKbl7RlJk/XE1MQq1RZTwrpqYCVJbD4fB45Jvbu7vgF2GJlaWZnY0l7oMHkp6ZO2/RzyKRmPqShlAxJnLT0oa0plCYsOR2nmwmwUUtIsKDcXjctf9YWloWNtK09Gx8/d/RS19NGT5+zCBsGj/95wCOorgnHsCq76bh8eQXlixaHvMwJUMsro5cuyvw3W7UVzWE3IIFbFZ2pbFCWTcHY9HGwGsWhpKHJabBjmRpwsuhZPNIi08PlFLnOGr9nDbOdti0yYdV2bn3KDqsmBAKjJYt/NzHqwMO7pf/vj0orKe9rRWWe3XxiNkw707S44AeXbAL4qbFK7bi1+YVFD9+8tyrq4fya+pHtXUbMpgCdLLXUm3SlMaOCNu/fVn0j3OHhgfb2pDgqLikLHLdrmtKI5NwLVm5I0z97KOQ4B4uznZotRfM/oSy7Ggin2drcmCUVertmCfkkiuNcsVG8xJ8/pPUnsfGDk+2CXlSD5uKmop7erTp6Fn/5VdXrt6lEh+F9xkyOKiNix2e/knjPqC0pjA1FdpaW5w8c3XrzrirryqPVGpq3aodqlZ3awgFv5GzrDjOhIYErF7x1b5t39krRxVs6afOJmCirEKk3AUcHWyoBIKtj07hYVRqOAwKT/Oy9e9d97UpNObI0spMDqe7Tr8S8E2Cd5VUacpZjJZby1/5iM5OrytTw0updEN07OiJiz6fsWrNhr37D506duJKjVXUiKrcLzW3W1YBsxC/Fuhr7z1w4nl2PlYLG6yzky1aQ2oT9lN8d21jT2WPn4qnRifc87+/n6cOw9CA51TrNCClZRV0ShWsvZd1yabAxL19/5rXPcmEJ3kpZx/PdL6Ua6vc+trPqxmQ69LODYcvwpnz1ypenWbsi1Rlzl+4sWnzwazsfGNj/rhRA9atnLErZnGNUcrN0zBrrSI3W2ysIYCXASs9U6v5ejS+3y7bvHjlljGTFs+Ysx4NMY6KaOOorX4+HfF91NBQym4cO3ll2tdrY3bGfb1g49ZfflfuAkM+CMLOi1ZSKFRemgKwbNX2J09p55KCVU3qJJZyFiR6/zveL7HAmseW1VjmPBEfpGAmcOLy6LFqycotcxdFFReXUtnaDB8SgqMfJq7dvD95emTM9sOr1u8eO2nxxuiDeCyp6c/lcvJb7m5Okz8Z8q5/F2xMNY17fdT+qJjf6Ex9qAyVLJE5yPJA2EAbVwA7W8ESPSRzbFwDulATz7Lyrt8iBvp5Vj6+qEKKoF7eoX39MTF6WCg6gr8fu4TeyLmL1/FF7YD4+XaaPWMsngsWix0+qPe+2BNYiFpjOPrOq2aIsIrQT4Vfn7U9l2WPo2VC/uveIOBK/ayLsOaCni6hwRbHTpHJk4TryfjqG9RjQL//nTfvHxIwfvTAfbEn0W5Qu1Hlj9OeWVqaBvh25hsaYKfE+AAbEJ6Y7NwCM1MhWm20jdk5hSfO/D19yjDqI3XhLF26lE5ipf8+xHqaQSIxQ2WAUxsJsHMUbAyVUeug8eR6JWagsxES7GcqNBZXSVA1HpdjYiJwc3X8eGTYvFkTqAkT9LF6B3Z3cbLD4B7bDvqC1D6fjB00f9aEmkgHuwLGFNUSiaWFWZ/evmiU/k5MwhIbWXGwYeY71RWOZmJToVQk47JZCkOO3MJA0tGidH6newHSIjZGtWHT/Ad/KJXKUBeBgI8xpFtbR28vzzMXruG4YmNt0S/Yr42LPSr4XkBXdzfn0vJKhVyBWYHQCCuDo+XwiBC0e65tHPLyi7CeYnEV14AbGNBt2aIpPbw7lJWLMGx2drIbPCCQqnBdVMOc6E/hwg4UGgNLhSm+o3eFBp0EOKwyYNVcXTzjVwgcRacZg+e/oKAERUeB7GwthIJ6ZqYwlsvNL8I+q2YfNO4S1MuYj0JgR8YOAQvf5eck81hyBTYRY6g05haAoUTO4YPMVirmi+R0zTelkdVOALTI1NiLJxtNMAaxlARGfEMqPqDAs4K+XUWFGO0Yju3YAugNSguJ7jm2cRMTY4yNsSZYiCdSXFVtwONi0EDtVhdVuS/tgZ8nEKuhHp/BMPd3nS6YqSEnBWZ10nyRl5kdbH4ObLXztM2PqmfiFcZodebOCSjIpNMtzrntmrVGOgUB63XLbSlU5TazJYtSGpFJ4YJ+LEeJSuGvPXRaPd3C9KE7qsqNMFw0OP4jFKu4Yi3Dn5vIlcoaQT/KK5ROtyh15B4wA7g8Oq0GcRn89h2jXtx85D8l970xoXMfsHSm0y1KHbnt3aEdsxsAzu+A28QLbhmk1bBzBlQwu1w05HM9GdjryI0M+jejS0ewaW/5HHKf0Fldgt7U0fVw8xidVY+9B3gPotMtTX2y+keAC7MV0pJs2DRW64uvm058LPx3uWaHlSJ8DrliVD+oT270BYctYeqipiboWvHEI7DtC/KIDiY4d4ZeY+i0HtCA0fD/iDiqDLl3Fn4cAXlpdLb5oBzQ6InE/2MCmwNjvn9jF/a/CRqQGweWz6K1WJB8cAkiBxDdm89XqXwBsQth25dMtUbeGwE+/6LT+oFqEP8//LkBdn+thYJ8AQyaBQO/AtN6JuYbD1Yg7TrsnUtOKnOsXWFFvF5dS4+olVsuh59GQoK6Cdx6cPWCiAXQfQAYabeCXA8KOXGuT0QRpxM9feYYGJFZna796KzeoFZupLIEVoRC2g06yxQWec5L38+gW38wtyM2VFuqReQq4Yu7IP6A1uMw/tzY1TB4Fp3VJzTJjaBnHRkGeY3yr23bQde+4BMObb3IDaY4aqkJN3AkFL0gQXnyeeJTP7pMRNcWjBgGzoRxaxpzjpsfBnIj6bdhbUSTnvJgagvOnUjI6uQJVm3IgzGoWy7RLleUQGku5KeTO4VzUkijbvSzlfBcYpeauKnZ7xJqLMzkRlBx9PZyH9NZPQSbc+gXMG6d3mqNMJYbyU2FjWOIk8D8IzoDx8YP5sCwRS2+gKAebeRGygrIvaSJh/XrMRum1jD+J3gfo0f9WGBqGC3lRtDaHt8AcZHa3bzdTODA6BFAIjL0PlsD2stNga7hnq/JHRiylnsclcACwqbDh3Ob9KAD3dJYuRGphPjFcauIx9K4Z480GrTUGMKMWAZtu9MlrYQmyE2B1vx0NJzdRp742sRn7TABhXb3J6Oi98DW8nS12jRZborSfBL+nd1KvJdmuaWORZ4B2zmYrMtgu9bLEIYJb0huCjQvSWfJ4xzvnCI3ZzZdd2y/Ribk+WkBQ8mcMJOrBPSbNyp3DeJyeHgZHv4F9y9CbgqJxSVVTO07hweGRmQYbOdHlnQ79SZLBPqx0th0mkfu2lQUwbP7xMhQMXpxFplyqq6knyjB45NpW6EVmDuAnRs4diBLi46e5CFhqPs/juaX+y21aH2De6vmrdw65a3cOgTg/wGafiPveLFJQgAAAABJRU5ErkJggg==',
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
        // docDefinition.dom = JSON.stringify(docInfo);
        // docDefinition.dom = JSON.parse (docDefinition.dom);
        // pdfMake.createPdf (docDefinition.dom) .download ("SampleDom.pdf");

    }


    var rel_pickingList = function(veiculo) {


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





            // if (item.COD_PRIORIDADE ==2){
            //      fontSizePE  =  9
            //      fontColorPE="#7C79A2"

            // }
            if (item.COD_PRIORIDADE == 1 || item.COD_PRIORIDADE == 2 || item.COD_PRIORIDADE == 3 || item.COD_PRIORIDADE == 4 || item.COD_PRIORIDADE == 5) {
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
                title: 'PickingList',
                author: 'solistica',
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
                    image: 'data:image/png;base64,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',
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


    var rel_pickingListNEW = function(veiculos) {

    }


    return {
        pickingList: rel_pickingList,
        pickingListAll: rel_pickingList_All,
        pickingListNEW: rel_pickingListNEW


    };
});