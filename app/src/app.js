angular.module("TopRoute", [
    "ngRoute", "serialGenerator", 'mb-dragToReorder'
    // ,'ngAria'
    // ,"ngAnimate"
    // ,'ngMap'
    , 'ngAudio', 'ngMessages', 'ui.bootstrap', 'toastr'
    // ,'ngFileSaver'
    , 'chart.js', 'ngStorage', 'ngMaterial', 'ui.bootstrap.contextMenu', 'ngExcel', 'ngJsTree'

    // ,'bulma.modal'""
    // ,'ngMaterial'
    // ,'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.cellNav', 
]);


angular.module("TopRoute").config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        //   positionClass: 'toast-top-center',
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: true,
        timeout: 300,
        target: 'body'
    });
});

angular.module("TopRoute").run(function($templateCache) {
    $templateCache.removeAll();
});

// .run(['$anchorScroll', function($anchorScroll) {
//         $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
//       }])
// ;

// ["ngMessages"
// , "serialGenerator"
// ,'ngAnimate'
// ,'ngSanitize'
// ,'ui.sortable'
// ,'ngMap'



// setTimeout(
//     function asyncBootstrap() {
//         angular.bootstrap(document, ["TopRoute"]);
//     },
//     (6 * 1000)
//     //basta trocar o 3 para aumentar o                      
//     //tempo que a tela de pré-carregamento                       
//     //é exibida.
// );

// setTimeout(
//         function asyncBootstrap() {
//             angular.bootstrap(document, ["roteirizacaoItensController"]);
//         },
//         (6 * 1000)
//     );