angular.module("TopRoute")
	.controller("toolbar-partials-Controller",
		function ($scope, $rootScope, $location, $localStorage, $window, $mdDialog, $mdBottomSheet, $mdToast, ) {


			$rootScope.usuarioLogado = $localStorage.UsuarioLogado;


			$scope.openDashManager = function () {


				console.log($rootScope.usuarioLogado)
				if ($scope.usuarioLogado.LOGIN_USUARIOS == 'PAULORCF'
					|| $scope.usuarioLogado.LOGIN_USUARIOS == 'FABIOCFI'
					|| $scope.usuarioLogado.LOGIN_USUARIOS == 'KLEBAVMF') {

					$location.path('/Dashboard/Manager');
				} else {

					swal("Acesso negado dashboard gerencial!", " Solicitar acesso ao Fábio Fioravante / Paulo Fantin : ", {
						icon: "error",
					});
				}


			};

			$rootScope.login = $localStorage.LoggeIn;

			$scope.showPrompt = function (ev) {

				swal("serviços recolocados no grid principal!", {
					icon: "warning",
				})
				// Appending dialog to document.body to cover sidenav in docs app
				var confirm = $mdDialog.prompt()
					.title('What would you name your dog?')
					.textContent('Bowser is a common name.')
					.placeholder('Dog name')
					.ariaLabel('Dog name')
					.initialValue('Buddy')
					.targetEvent(ev)
					.required(true)
					.ok('Okay!')
					.cancel('I\'m a cat person');

				$mdDialog.show(confirm).then(function (result) {
					$scope.status = 'You decided to name your dog ' + result + '.';
				}, function () {
					$scope.status = 'You didn\'t name your dog.';
				});
			};


			$scope.logoff = function () {
				$localStorage.LoggeIn = false;
				$rootScope.login = $localStorage.LoggeIn;
			}




			$scope.showGridBottomSheet = function () {
				$scope.alert = '';
				$mdBottomSheet.show({
					templateUrl: 'view/partials/BottomSheet/gridBottomSheet.html',
					controller: 'GridBottomSheetCtrl',
					resolve: {
						usuarioLogado: function (roteirizadorAPI, $rootScope, $localStorage, $location) {
							return $localStorage.UsuarioLogado;
						}
					},
					clickOutsideToClose: false
				}).then(function (clickedItem) {
					$mdToast.show(
						$mdToast.simple()
							.textContent(clickedItem['name'] + ' - COD: ' + clickedItem['COD_FILIAIS'] + ' clicked!')
							.position('top right')
							.hideDelay(1500)
					);
				}).catch(function (error) {
					// User clicked outside or hit escape
				});
			};

			$scope.$watch("login", function (newValue, oldValue) {

				if (newValue == false) {
					$localStorage.LoggeIn = $rootScope.login;
					$localStorage.UsuarioLogado = {};
					$location.path('/login');
				}

			});

		});
