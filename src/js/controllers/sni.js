angular.module('app').controller("SNIController", ["$scope", "Kong", "$location", "$routeParams", "Alert", "sni", function ($scope, Kong, $location, $routeParams, Alert, sni) {
    var orgSNI = angular.copy(sni);
    if ($routeParams.id) {
        $scope.sni = sni;
        $scope.title = "Edit SNI";
        $scope.action = "Save";
    } else {
        $scope.title = "Add an SNI";
        $scope.action = "Create";
        // default values on SNI creation
        $scope.sni = {
            ssl_certificate_id: undefined,
            created_at: new Date().getTime()
        };
    }

    function saveOrCreate(sni) {
        if (!$routeParams.id) {
            return Kong.post('/snis', sni);
        }
        else {
            return Kong.put('/snis', sni);
        }
    }

    $scope.save = function () {
        var sni = angular.copy($scope.sni);
        saveOrCreate(sni).then(function () {
            if ($routeParams.id) {
                Alert.success('SNI updated');
            } else {
                Alert.success('SNI created');
                // clearing inputs.
                $scope.sni = {};
            }
            // clearing errors.
            $scope.error = {};
        }, function (response) {
            $scope.error = response.data;
        });
    }
}]);
