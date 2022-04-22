
angular.module("TopRoute")
.controller("conferenciaServices",
    function ($scope, $rootScope, $http,config,$filter, ngAudio,toastr,$log,$location, $localStorage, $mdDialog, $mdToast) {
        var newId = 1;
        $rootScope.UsuarioLogado = $localStorage.UsuarioLogado;

        $scope.baixaTodos =  [];
        $scope.treeView =  [];
        $scope.ignoreChanges = false;
        $scope.newNode = {};
        $scope.originalData = [
            { id: 'ajson1', parent: '#', text: 'Paulo Fantin', state: { opened: false } },
            { id: 'filho0json1', parent: 'ajson1', text: 'Entregues', state: { opened: false }, type: 'star' },
            { id: 'filho1json1', parent: 'ajson1', text: 'Não Entregues', state: { opened: false } },
            { id: 'ajson2', parent: '#', text: 'Fabio Fioravante', state: { opened: false } },
            { id: 'ajson3', parent: 'ajson2', text: 'Entregues', state: { opened: false } },
            { id: 'filho0json3', parent: 'ajson3', text: 'conhecimento1', state: { opened: true } },
            { id: 'filho1json3', parent: 'ajson3', text: 'conhecimento2', state: { opened: true } },
            { id: 'ajson4', parent: 'ajson2', text: 'Não Entregues', state: { opened: false } },
            { id: 'filho0json4', parent: 'ajson4', text: 'conhecimento1', state: { opened: true } },
            { id: 'filho1json4', parent: 'ajson4', text: 'conhecimento2', state: { opened: true } },
            { id: 'filho2json4', parent: 'ajson4', text: 'conhecimento3', state: { opened: true } },
            { id: 'filho3json4', parent: 'ajson4', text: 'conhecimento4', state: { opened: true } }
        ];

        $scope.originalData1 = [
            {
                'text': 'Root node 2',
                'state': {
                    'opened': true,
                    'selected': true
                },
                'children': [
                    { 'text': 'Child 1' },
                    { 'text': 'Child 2' },
                ]
            },{
                
                'text': 'teste',
                'state': {
                    'opened': true,
                    'selected': true
                },
                'children': [
                    { 'text': 'Filho teste 1' },
                    { 'text': 'Filho teste 2' },
                ]
            }

        ]

        $scope.treeData1 = $scope.originalData1 ;

        $scope.treeData = $scope.originalData ;



        $scope.treeConfig = {
            core : {
                multiple : false,
                animation: true,
                error : function(error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                check_callback : true,
                worker : true
            },
            types : {
                default : {
                    icon : 'glyphicon glyphicon-flash'
                },
                star : {
                    icon : 'glyphicon glyphicon-star'
                },
                cloud : {
                    icon : 'glyphicon glyphicon-cloud'
                }
            }
            // ,
            // version : 1,
            // plugins : ['types','search']
        };

        $scope.reCreateTree = function() {
            $scope.ignoreChanges = true;
            angular.copy(this.originalData,this.treeData);
            $scope.treeConfig.version++;
        };

        $scope.simulateAsyncData = function() {
            $scope.promise = $timeout(function(){
                $scope.treeData.push({ id : (newId++).toString(), parent : $scope.treeData[0].id, text : 'Async Loaded' })
            },3000);
        };

        $scope.addNewNode = function() {
            $scope.treeData.push({ id : (newId++).toString(), parent : $scope.newNode.parent, text : $scope.newNode.text });
        };

        $scope.setNodeType = function() {
            var item = _.findWhere(this.treeData, { id : this.selectedNode } );
            item.type = this.newType;
            toaster.pop('success', 'Node Type Changed', 'Changed the type of node ' + this.selectedNode);
        };

        $scope.readyCB = function() {
            $timeout(function() {
                $scope.ignoreChanges = false;
                toaster.pop('success', 'JS Tree Ready', 'Js Tree issued the ready event')
            });
        };

        $scope.createCB  = function(e,item) {
            $timeout(function() {toaster.pop('success', 'Node Added', 'Added new node with the text ' + item.node.text)});
        };

        $scope.applyModelChanges = function() {
            return !$scope.ignoreChanges;
        };
        $scope.selectNodeCB = function(node, selected, event) {
            alert(selected)
            return !$scope.ignoreChanges;
        };


        $scope.treeEventsObj = {
            'ready': readyCB,
            'create_node': createNodeCB,
            'select_node': selectNodeCB,   // on node selected callback
            'setNodeType': setNodeType
          }
      

        function readyCB() {
            $log.info('ready called');
        };
    
        function createNodeCB(e,item) {
            $log.info('create_node called');
        };


        
        

        
        function selectNodeCB(node, selected, event) {


            if(selected.node.parents.length<3)
                return


                const docs = $filter("filter")($scope.documents, { COD_DOCUMENTO: parseInt(selected.node.id) }, true)[0]
    
                if(!docs)
                    //mandar msg para o ususario falando que nao achou o serviço
                    $log.error(docs);
                
                $scope.documentoClicado = docs
    
                
                $http.get("http://toproute.com.br/api/simplifiled-conhecimento/" + selected.node.id +'/'+ $rootScope.UsuarioLogado.FilialSetada.COD_FILIAIS)
                .then(
                    function sucesso(response) {
                        $scope.baixa = response.data
    

                        if($scope.baixa.length==0){
                            $scope.imgBaixa = ""
                            $scope.MostraimgBaixa = false
                        }else{

                            if($scope.baixa[0].completed_values_file_photo.replace('{{"',"").replace('"}}',"").replace('{{NULL}}','')==""){
                                $scope.imgBaixa = ""
                                $scope.MostraimgBaixa = false
                            }else{
                                $scope.imgBaixa = $scope.baixa[0].completed_values_file_photo.replace('{{"',"").replace('"}}',"")
                                $scope.MostraimgBaixa = true
                            }
                        }
                        
    
                    },
                    function errorCallback(error) {
                        swal("Ops!", "Erro ao buscar dados da baixa na api externa do toproute " + error.data.tionMessage + "(" + edata.Message + ") !", "error");
                    }
                )
    
                if(!$scope.baixa)
                    $log.error(JSON.stringify({msg:'sem dados da baixa'}));
    
    
    
                $log.info($scope.baixa )
    
                // $scope.$apply();
            

        
        
        };

        function setNodeType() {
            var item = _.findWhere($scope.treeData, { id : $scope.selectNodeCB } );
            item.type = this.newType;
            
        };





        $scope.q='' 


        $scope.q='' 
        $scope.servicos =  []
        $scope.clientes =  []
        $scope.clientesDistinct =  []
        $scope.servicosExecutados   =  []
        $scope.servicosPendentes    =  []
        $scope.documentsCopy    = null; 

        $scope.closeDivConferencia  =  function(item){
            document.getElementById("divModalConferenciaServiceBotica").style.width = "0";
        }

        const t  =  []
        const teste1 = ['Paulo1','1', '1']
        const teste2 = ['Paulo2','2', '2']
        const teste3 = ['Paulo3','3', '3']
        const teste4 = ['Paulo4','4', '4']

        t.push(teste1)
        t.push(teste2)


         
        $scope.testData1 = [{
            name: 'PAULO',
            data: [
                ["coluna1", "coluna2", "coluna3"],
                teste1,
                teste2,
                teste3,
                teste4
            ]
        }];
    
        
        $scope.testData = [{
            name: 'PAULO',
            data: [
                ["coluna1", "coluna2", "coluna3"],
                t
            ]
        }];

        $scope.excel = {
            down: function() {},
            data: [{
                name: 'cliente-text',
                data: [
                    [1, 2, 3],
                    ['hello', 'ng-', 'excel']
                ]
            }, {
                name: 'sheet2',
                data: [
                    ['data = [{name:\'sheetName\',data:[[]]}]'],
                    ['xlsfilename=fileName']
                ]
            }]
        };



        $scope.teste  = function(item){

            var box = document.getElementById('box');

            if(box){
                $scope.q =  box.options[box.selectedIndex].text
            }
        
        
        }

        $rootScope.RefreshConferenciaservices  =  function(conferenciaServices){

            


            

            $scope.clientes =  []
            $scope.clientesDistinct =  []

            if(conferenciaServices){
                $scope.documents         = conferenciaServices.documents;

                $scope.documentsCopy     = angular.copy($scope.documents);
                

                //PEGA TODOS OS REMETENTE E COLOCA EM UM ARRAY DE CLIENTES AONDE SERA AGRUPADO LOGO ABAIXO
                conferenciaServices.documents.forEach(function(item) {
                    $scope.clientes.push( item.REMETENTE)
                });
                //AGRUPA POR REMETENTEN
                $scope.clientes = $scope.clientes.filter((v, i, a) => a.indexOf(v) === i); 

                //PEGA TODOS OS REMETENTES AGRUPADOS E JOGA DENTRO DO OBJETO 
                $scope.clientes.forEach(function(item) {


                    var reg = $filter("filter")($scope.documentsCopy, { REMETENTE: item }, true)

                    $scope.clientesDistinct.push({REMETENTE:item ,  qtd: reg.length })
                })


            }

            $scope.change =  async function () {


                const box =  await document.getElementById('box');

                if (box) {
                    const find = await box.options[box.selectedIndex].text.split('(')
                    if (find.length > 0)
                        $scope.q = find[0]

                }

                const docs = await $filter("filter")($scope.documentsCopy, { REMETENTE: $scope.q.trim() }, true)



                const pendentes  = await $filter("filter")($scope.documentsCopy, { REMETENTE: $scope.q.trim() }, true)

                if (docs) {
                    if ($scope.q == 'TODOS') {
                        $scope.documents = $scope.documentsCopy
                    } else {
                        $scope.documents = docs
                    }
                }


                $scope.counterExec = 0;
                $scope.counterPend = 0;

                $scope.servicosExecutados = [];
                $scope.servicosPendentes = [];

                $scope.documents.map(function (item) {
                    if (item.MANIFESTO_COD_CONHECIMENTOS > 0) {
                        // $scope.counterExec++;
                        $scope.servicosExecutados.push(item)
                    } else {
                        $scope.servicosPendentes.push(item)
                        // $scope.counterPend++;
                    }
                });

                console.log($scope.counterExec, $scope.counterPend)

            };


           

            
            $scope.treeView=[];
            $scope.clientesDistinct.forEach(function(item){


               

                const docs              =  $filter("filter")($scope.documents, { REMETENTE: item.REMETENTE }, true)
                const qtd_Docs_mani     =  $filter("filter")(docs, { MANIFESTO_COD_CONHECIMENTOS: 0 }, true)
                const semfoto           =  $filter("filter")(docs, { foto: ''}, true)

                const ElemetPai = { 
                    id: item.REMETENTE, 
                    parent: '#', 
                    text: item.REMETENTE  +  '(' +  docs.length+')', 
                    state: { opened: false },
                    icon:"img/ico/remetente.png"
                 }

                $scope.treeView.push(ElemetPai);


                const ElemetEntregues = { 
                    
                    id: 'ElemetEntregues_' +item.REMETENTE , 
                    parent: item.REMETENTE, 
                    text: 'Entregues', 
                    text: 'Entregues'  + '(' +  parseInt(docs.length - qtd_Docs_mani.length)  + ')', 
                    state: { opened: false }, 
                    type: 'star' ,
                    icon:"img/ico/entregues.png"
                    
                }
                $scope.treeView.push(ElemetEntregues);

                const ElemetNEntregues = { 
                    id: 'ElemetNEntregues_' +item.REMETENTE , 
                    parent: item.REMETENTE, 
                    text: 'Não Entregues'  + '(' +  qtd_Docs_mani.length  + ')', 
                    state: { opened: false } ,
                    icon:"img/ico/Nentregues1.png"
                    
                }
                $scope.treeView.push(ElemetNEntregues);

            
                
                if (docs) {

                    docs.map(function (doc) {


                        const docs = $filter("filter")($scope.documents, { COD_DOCUMENTO: parseInt(doc.COD_DOCUMENTO) }, true)[0]
    
                        if(!docs)
                            $log.error(docs);

                        var img = undefined
                        
                        if(docs.MANIFESTO_COD_CONHECIMENTOS>0){
                            img="img/ico/service.png" 
                        }else{
                            img="img/ico/servicephoto.png" 
                        }
                        
                        if (doc.MANIFESTO_COD_CONHECIMENTOS > 0 ) {
                            const docs_manifestado = {
                                id: doc.COD_DOCUMENTO,
                                parent: 'ElemetEntregues_' + item.REMETENTE,
                                text: doc.NR_DOCUMENTO_FORMATADO,
                                state: { opened: false },
                                icon: docs.MANIFESTO_COD_CONHECIMENTOS>0? "img/ico/servicephoto.png" :"img/ico/service.png" 
                                //icon: imgfoto.foto == "" ? "img/ico/service.png" : "img/ico/servicephoto.png"
                            }
                            $scope.treeView.push(docs_manifestado)
                        } else {

                            if(docs.MANIFESTO_COD_CONHECIMENTOS>0 ){
                                const docs_manifestado_ = {
                                    id: doc.COD_DOCUMENTO,
                                    parent: 'ElemetEntregues_' + item.REMETENTE,
                                    text: doc.NR_DOCUMENTO_FORMATADO,
                                    state: { opened: false },
                                    icon: docs.MANIFESTO_COD_CONHECIMENTOS>0? "img/ico/servicephoto.png" :"img/ico/service.png" 
                                }
                                $scope.treeView.push(docs_manifestado_)

                            } else{

                                const docs_Nmanifestado = {
                                    id: doc.COD_DOCUMENTO,
                                    parent: 'ElemetNEntregues_' + item.REMETENTE,
                                    text: doc.NR_DOCUMENTO_FORMATADO,
                                    state: { opened: false },
                                    icon: docs.MANIFESTO_COD_CONHECIMENTOS>0? "img/ico/servicephoto.png" :"img/ico/service.png" 
                                }
                                $scope.treeView.push(docs_Nmanifestado)
                            }
                        }
                        
                      
                    });
                }

                //"icon" : "/static/3.3.10/assets/images/tree_icon.png",

             
                
            })

        
            


        

        }



    });
