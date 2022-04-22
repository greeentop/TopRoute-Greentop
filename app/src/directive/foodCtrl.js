// var foodApp = angular.module('foodApp',[]);

// foodApp.controller('foodCtrl',function($scope){
// 	$scope.selectedRow = 0;
// 	$scope.foodItems = [{
// 		name:'Noodles',
// 		price:'10',
// 		quantity:'1'
// 	},
// 	{
// 		name:'Pasta',
// 		price:'20',
// 		quantity:'2'
// 	},
// 	{
// 		name:'Pizza',
// 		price:'30',
// 		quantity:'1'
// 	},
// 	{
// 		name:'Chicken tikka',
// 		price:'100',
// 		quantity:'1'
// 	}];
// 	$scope.setClickedRow = function(index){
// 		$scope.selectedRow = index;
// 	}
	
// 	$scope.$watch('selectedRow', function() {
// 		console.log('Do Some processing');
// 	});
// });

angular.module("TopRoute").directive('arrowSelector',['$document',function($document){
	return{
		restrict:'A',
		link:function(scope,elem,attrs,ctrl){


			
			var elemFocus = false;             
			elem.on('mouseenter',function(){
				elemFocus = true;
				console.log(elemFocus);
				scope.selectedRow = 0;
			});
			elem.on('mouseleave',function(){
				elemFocus = false;
				console.log(elemFocus);
				scope.selectedRow = -1;
			});
			// $document.bind('click',function(e,scope){

			// 	if(e.shiftKey ){
			// 		alert('paul');
			// 	}

			// });
			$document.bind('keydown',function(e){
				if(elemFocus){


				
					if(e.keyCode==27) {
						angular.forEach(scope.result, function (value, key) {
							value.selected =false;
						});
						scope.start=  -1 ;
					}



					//control+L limpar selecionado grid
					if(e.ctrlKey==true && e.shiftKey==true && e.keyCode==65){

						
							angular.forEach(scope.result, function (value, key) {
								if(value.status!="emVeiculo"){
									value.selected =true 	;
								}
							});
						
					}


					//control+L limpar selecionado grid
					if(e.ctrlKey==true && e.keyCode==76){

						angular.forEach(scope.result, function (value, key) {
							value.selected =false;
						});

					}

					if(e.keyCode == 38  ){

						if(e.keyCode == 38  && e.shiftKey){
							if (scope.selectedRow==0){
								scope.result[0].selected = !scope.result[0].selected;
							}else{
								if(scope.result[scope.selectedRow].IDENT_VEICULOS==""){
									scope.result[scope.selectedRow].selected = !scope.result[scope.selectedRow].selected;
								}
								
							}

								
							var achou  = false;
							angular.forEach(scope.result, function (value, key) {

								if (value.selected  ==true){
									scope.habilitarConfiguracoes=true;
									achou =true;
								}else{
									if(!achou ){
										scope.habilitarConfiguracoes=false;
									}
								}
							});
							
							

						}
					

						if(scope.selectedRow == 0){
							return;
						}
						scope.selectedRow--;
						scope.$apply();
						e.preventDefault();

					}
					if(e.keyCode == 40){
						
						
						if(e.keyCode == 40  && e.shiftKey){
							if(scope.result[scope.selectedRow].IDENT_VEICULOS==""){
								scope.result[scope.selectedRow].selected = !scope.result[scope.selectedRow].selected;
								//console.log(scope.selectedRow);
							}
							
							var achou  = false;
							angular.forEach(scope.result, function (value, key) {

								if (value.selected  ==true){
									scope.habilitarConfiguracoes=true;
									achou =true;
								}else{
									if(!achou ){
										scope.habilitarConfiguracoes=false;
									}
								}
							});


						}	

						if(scope.selectedRow == scope.result.length - 1){
							return;
						}
						//scope.setTableRowPositionDirective(scope.selectedRow);
						scope.selectedRow++;
						


						scope.$apply();
						e.preventDefault();
					}
				}
			});
		}
		
	};
}]);