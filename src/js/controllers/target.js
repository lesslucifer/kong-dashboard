angular.module('app').controller("TargetController", ["$scope", "Kong", "$location", "$routeParams", "Alert", "owner", function ($scope, Kong, $location, $routeParams, Alert, owner) {
    $scope.owner = owner;
    $scope.title = "Add a target";
    $scope.action = "Create";
    // default values on Target creation
    $scope.target = {
        upstream_id: owner.id,
        target: "",
        weight: 100
    };

    $scope.save = function () {
        var target = angular.copy($scope.target);
        Kong.post('/upstreams/' + owner.id + '/targets', target).then(function () {
            Alert.success('Target created');
            // clearing inputs.
            $scope.target = {};
            // clearing errors.
            $scope.error = {};
        }, function (response) {
            $scope.error = response.data;
        });
    }
}]);
