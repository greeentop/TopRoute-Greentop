angular.module("TopRoute")
    .controller("documento-manifestado-ctrl",
        function ($scope, itens, $window, $document, $routeParams
            , $filter, $location, $rootScope, $http, config
            , $route, $anchorScroll, $localStorage, $mdDialog, $mdSidenav) {


                $scope.teste  = itens

                console.log($scope.teste)


        });
