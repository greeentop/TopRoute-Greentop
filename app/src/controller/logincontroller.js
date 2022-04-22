angular.module("TopRoute")
    .controller("loginController",
        function ($scope, $window, toastr, $filter, $http, config, $timeout, $location, $rootScope,$localStorage ) {

            $scope.versionLogin  =  config.version

            $rootScope.UsuarioLogado  = [];    

            $rootScope.login = $localStorage.LoggeIn

            // $rootScope.usuario = {
            //     user: "ddf.daniboy@gmail.com",
            //     password: "12345678",
            //     nome:"paulo Fan"
            // }
            $scope.usuario = {
                user: "",
                password: "",
                nome:""
            }



            $scope.msg  =  function(){


                swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this imaginary file!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                      swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                      });
                    } else {
                      swal("Your imaginary file is safe!");
                    }
                  });

            };


            $scope.LoggeInSolistica  =  function(usuario){

                $localStorage.LoggeIn =false;

                sha1(usuario.password);
                var hash = sha1.create();
                hash.update(usuario.password);


                $http.get(config.baseUrl + '/api/login/' + $scope.usuario.user +'/\''+ hash.hex().toUpperCase() + '\'')
                .then(function (response) {
                   
                    //if(response.data.JSON_LOGIN.>0){

                    var resp   =  JSON.parse(response.data.JSON_LOGIN)[0]


                    if (resp.LOGIN_USUARIOS != undefined){

                            $rootScope.UsuarioLogado = [];

                            var  login  =  JSON.parse(response.data.JSON_LOGIN)[0]
    
                            $http.get(config.baseUrl + '/api/filiaisUsuario/' + login.COD_USUARIOS)
                            .then(function (response) {
                                $scope.userLogado = response.data
    
                                $rootScope.UsuarioLogado.push(JSON.parse($scope.userLogado[0]["JSON_FILIAIS_USUARIO"])[0])
                                $rootScope.UsuarioLogado[0].NM_DEPARTAMENTO_FUNCIONARIOS = login.NM_DEPARTAMENTO_FUNCIONARIOS
    
                                //fazer uma verificação de quando nao tiver nenhuma filial relacioanda ao login mandar msg contatar o deportamento superir para liberar aceosso ao sistemas de router
                                $localStorage.LoggeIn       =   true ; 
                                $localStorage.UsuarioLogado =   $rootScope.UsuarioLogado[0]
    
                                $localStorage.UsuarioLogado.COD_FILIAL_DEFAULT
                                var reg = $filter("filter")($localStorage.UsuarioLogado.FILIAIS_USUARIO, { COD_FILIAIS: $localStorage.UsuarioLogado.COD_FILIAL_DEFAULT }, true);
    
    
                                $localStorage.UsuarioLogado.FilialSetada  = reg[0] 
    
                                $localStorage.UsuarioLogado.Version  =  config.version;
    
    
                                $location.path('/Dashboard');
    
                            });
                    } else{
                        var msg  =  resp.DESCRICAO
                        swal(msg, "tente novamente!", "warning");
                        // toastr.info(resp.DESCRICAO, 'Aviso');

                    }


                }).catch(function (error) {
                    $scope.result = "ERROR " + error.status;
                    if (error.status == 400) {
                        swal("Good job!", "You clicked the button!", "error");
                        // toastr.info(error.data.error + ' tente novamente', 'Aviso');
                    }
                });

            };




            // console.log($scope.usuario)

            $scope.login = function () {

                var url = "http://localhost:3000/auth/authenticate";
                var config = {
                    headers: {
                        "Content-Type": "application/json",
                    }
                };
                try {


                    $scope.perfil = {}
                    $http.post(url, $scope.usuario, config)
                        .then(function (response) {
                            // $scope.result = "SUCCESS";
                            // $scope.dados = response.data.data;

                            toastr.success('Bom dia Senhor:' + response.data.user.nome + '\n'
                                + 'Email: ' + response.data.user.email
                                + 'Token: ' + response.data.token
                                , 'Sucesso')


                            $rootScope.loggedIn = true;
                            $scope.perfil = response.data

                            $location.path('/operadoresDashboard/' + $scope.perfil.token);

                        }).catch(function (response) {
                            $scope.result = "ERROR " + response.status;


                            if (response.status == 400) {

               


                                

                                toastr.info(response.data.error + ' tente novamente', 'Aviso');
                            }

                        });

                    // $location.path('/operadoresDashboard/' + $scope.perfil.token);

                } catch (error) {
                    toastr.error('Ops, algum erro ocorrei: \n' + response.data.erro, 'Erro');
                }






            }

        })        