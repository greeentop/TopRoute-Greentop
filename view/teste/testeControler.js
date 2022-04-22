
angular.module("TopRoute").controller("testeController", ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) { 
    $scope.ListOfEmployee; 
    $scope.Status; 
 
    $scope.Close = function () { 
        $location.path('/EmployeeList'); 
    }     ,
    

    $scope.ordens = [
        {nome:'Paulo', Ordem:1},
        {nome:'Daniel', Ordem:2},
        {nome:'Thalita', Ordem:3},
        {nome:'Eloisa', Ordem:4},
        {nome:'Vitoria', Ordem:5},
        {nome:'Fred', Ordem:6}
    ]
 

    $scope.ler = function () {

        //Get all employee and bind with html table 
        $http.get("flhjk4jvq1/ApiOTM/api/listar/roteirizacao").success(function (data) {
            $scope.ListOfEmployee = data;
        })
            .error(function (data) {
                $scope.Status = "data not found";
            });
    }




    $scope.$on('dragToReorder.reordered', function($event, reordered) {
        var base  = reordered.from - reordered.to ; 
       
        reordered.item.ORDEM_ENTREGA =  reordered.to +1;
        var index = reordered.from; 
  
  
        if ( base <0){
          for (let index = reordered.from; index <= reordered.to; index++) {
            var contador  = index +1 ;
            $scope.detalheItensVeiculo[index].ORDEM_ENTREGA = contador;
            $scope.wayPoints = [];
            angular.forEach($scope.detalheItensVeiculo, function (value, key) {
              $scope.point = {};
              $scope.point = {
                'location': {
                  'ORDEM_ENTREGA': parseFloat(value.ORDEM_ENTREGA),
                  'lat': parseFloat(value.lat),
                  'lng': parseFloat(value.lng),
                  'tipo': value.IDENT_TIPO_DOCUMENTOS
                }, stopover: true
              }
              $scope.wayPoints.push($scope.point);
            });
  
          }
       }else{
          for (let index = reordered.to; index <= reordered.from; index++) {
              var contador  = index +1 ;
              $scope.detalheItensVeiculo[index].ORDEM_ENTREGA = contador;
              $scope.wayPoints = [];
              angular.forEach($scope.detalheItensVeiculo, function (value, key) {
                $scope.point = {};
                $scope.point = {
                  'location': {
                    'ORDEM_ENTREGA': parseFloat(value.ORDEM_ENTREGA),
                    'lat': parseFloat(value.lat),
                    'lng': parseFloat(value.lng),
                    'tipo': value.IDENT_TIPO_DOCUMENTOS
                  }, stopover: true
                }
                $scope.wayPoints.push($scope.point);
              });
                
  
          }
       }
        //alert("Moved " + reordered.item.name + " from " + reordered.from + " to " + reordered.to); 
        // console.log("Moved " + reordered.item.name + " from " + reordered.from + " to " + reordered.to);
  
  
      });
    
 
    //Add new employee 
    $scope.Add = function () { 
        var employeeData = { 
            FirstName: $scope.FirstName, 
            LastName: $scope.LastName, 
            Address: $scope.Address, 
            Salary: $scope.Salary, 
            DOB: $scope.DOB, 
           // DepartmentID: $scope.DepartmentID 
        }; 
        debugger; 
        $http.post("api/employee/AddEmployee", employeeData).success(function (data) { 
            $location.path('/EmployeeList'); 
        }).error(function (data) { 
            console.log(data); 
            $scope.error = "Something wrong when adding new employee " + data.ExceptionMessage; 
        }); 
    } 
 
    //Fill the employee records for update 
 
    if ($routeParams.empId) { 
        $scope.Id = $routeParams.empId; 
 
        $http.get('api/employee/GetEmployee/' + $scope.Id).success(function (data) { 
            $scope.FirstName = data.FirstName; 
            $scope.LastName = data.LastName; 
            $scope.Address = data.Address; 
            $scope.Salary = data.Salary; 
            $scope.DOB = data.DOB 
            //$scope.DepartmentID = data.DepartmentID 
        }); 
 
    } 
 
    //Update the employee records 
    $scope.Update = function () { 
        debugger; 
        var employeeData = { 
            EmployeeID: $scope.Id, 
            FirstName: $scope.FirstName, 
            LastName: $scope.LastName, 
            Address: $scope.Address, 
            Salary: $scope.Salary, 
            DOB: $scope.DOB 
            //DepartmentID: $scope.DepartmentID 
        }; 
        if ($scope.Id > 0) { 
             
            $http.put("api/employee/UpdateEmployee", employeeData).success(function (data) { 
                $location.path('/EmployeeList'); 
            }).error(function (data) { 
                console.log(data); 
                $scope.error = "Something wrong when adding updating employee " + data.ExceptionMessage; 
            }); 
        } 
    } 
 
 
    //Delete the selected employee from the list 
    $scope.Delete = function () { 
        if ($scope.Id > 0) { 
             
            $http.delete("api/employee/DeleteEmployee/" + $scope.Id).success(function (data) { 
                $location.path('/EmployeeList'); 
            }).error(function (data) { 
                console.log(data); 
                $scope.error = "Something wrong when adding Deleting employee " + data.ExceptionMessage; 
            }); 
        } 
 
    } 
}]); 