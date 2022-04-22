angular.module('TopRoute').value('config', {

    /****************************************************
        CONEXAO COM API BACK-END (BANCO DE DADOS)
    *****************************************************/
    baseUrl: 'https://newsitex.expressojundiai.com.br/ApiOTM'
        //baseUrl: 'http://localhost/ApiOTM'
        //baseUrl: "http://homologacao.femsalogistica.com.br/ApiOTM"
        //statusbaseUrl: "http://localhost/ApiTopRoute"

    /****************************************************
        VERSIONAMENTO
    *****************************************************/
    ,
    version: 'Versão 1.0.0'

    /****************************************************
        USARA PARA A DASH MANAGER QUE ESTA INATIVA AGORA
    *****************************************************/
    ,
    baseUrl_TR_IRBR: 'https://greentop.com.br/api/v1',
    baseUrl_VPS: 'http://toproute.com.br/api/simplifiled'


    /*****************************************************
        REAL TIME F5
    *****************************************************/
    ,
    //baseUrlRealTime: 'https://realtime.greentop.com.br/'
    baseUrlRealTime: 'http://localhost:3000/'
})