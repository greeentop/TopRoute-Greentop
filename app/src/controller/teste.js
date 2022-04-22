angular.module("TopRoute")
    .controller("testeController",
        function ($scope, $window,  $document, $routeParams
                ,  $filter, $location, $rootScope, $http, ngAudio, toastr, config
                , $route, $anchorScroll, $localStorage, $mdDialog,$mdSidenav) {


                    $scope.nome = [{name:'paulo' } , {name:'Roberto'},{name:'Chagas'},{name:'Fantin'}]
                    



                    console.log($scope.nome)
});