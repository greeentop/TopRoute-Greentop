/* Esta classe CSS controla o efeito que anima a tela de pré-carregamento quando ela termina de carregar:*/

(function () {
    'use strict';



    angular.module('TopRoute').directive("mAppLoading", function ($animate) {

        return ({
            link: link,
            restrict: "C"
        });

        /* Esta função vincula os eventos JavaScript ao scope.*/
        function link(scope, element, attributes) {
            /* NOTE: Estou utilizando o .eq(1) para não estilizar o Style block.*/
            $animate.leave(element.children().eq(1)).then(
                function cleanupAfterAnimation() {
                    element.remove();
                    scope = element = attributes = null;
                });
        }
    });

})();



