angular.module('app').controller("CertificateController", ["$scope", "Kong", "$location", "$routeParams", "Alert", "certificate", function ($scope, Kong, $location, $routeParams, Alert, certificate) {
    var orgCertificate = angular.copy(certificate);
    if ($routeParams.id) {
        $scope.certificate = certificate;
        certificate.snis = certificate.snis.join(',');
        $scope.title = "Edit Certificate";
        $scope.action = "Save";
    } else {
        $scope.title = "Add an Certificate";
        $scope.action = "Create";
        // default values on Certificate creation
        $scope.certificate = {
            id: undefined,
            snis: ""
        };
    }

    function saveOrCreate(certificate) {
        if (!$routeParams.id) {
            return Kong.post('/certificates', certificate);
        }
        else {
            delete certificate.snis;
            return Kong.put('/certificates', certificate);
        }
    }

    $scope.isAdd = function () {
        return $routeParams.id == null;
    }

    $scope.save = function () {
        var certificate = angular.copy($scope.certificate);
        saveOrCreate(certificate).then(function () {
            if ($routeParams.id) {
                Alert.success('Certificate updated');
            } else {
                Alert.success('Certificate created');
                // clearing inputs.
                $scope.certificate = {};
            }
            // clearing errors.
            $scope.error = {};
        }, function (response) {
            $scope.error = response.data;
        });
    }
}]);
