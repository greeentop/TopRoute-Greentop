(function() {
  'use strict';

  angular
      .module('TopRoute')
      .directive('loading', loading);

  loading.$inject = ['$window'];
  
  function loading ($window) {
      return {
          templateUrl: 'view/loading.html'
      }
  }
})();