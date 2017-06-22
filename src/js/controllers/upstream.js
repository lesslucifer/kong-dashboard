angular.module('app').controller("UpstreamController", ["$scope", "Kong", "$location", "$routeParams", "Alert", "upstream", function ($scope, Kong, $location, $routeParams, Alert, upstream) {
    var orgUpstream = angular.copy(upstream);
    if ($routeParams.id) {
        $scope.upstream = upstream;
        $scope.title = "Edit Upstream";
        $scope.action = "Save";
        if (upstream.orderlist && angular.equals({}, upstream.orderlist)) { upstream.orderlist= [];}
    } else {
        $scope.title = "Add an Upstream";
        $scope.action = "Create";
        // default values on Upstream creation
        $scope.upstream = {
            slots: 100
        };
    }

    $scope.save = function () {
        var upstream = angular.copy($scope.upstream);
        if (upstream.slots != orgUpstream.slots) {
            upstream.orderlist = undefined;
        }
        Kong.put('/upstreams', upstream).then(function () {
            if ($routeParams.id) {
                Alert.success('Upstream updated');
            } else {
                Alert.success('Upstream created');
                // clearing inputs.
                $scope.upstream = {};
            }
            // clearing errors.
            $scope.error = {};
        }, function (response) {
            $scope.error = response.data;
        });
    }
}]);
