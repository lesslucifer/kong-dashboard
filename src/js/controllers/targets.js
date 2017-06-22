angular.module('app').controller("TargetsController", ["$scope", "Kong", "owner", function ($scope, Kong, owner) {
    $scope.owner = owner;
    $scope.targets = [];
    $scope.total = null;
    $scope.offset = null;

    var loaded_pages = [];
    $scope.loadMore = function() {
        var page = '/upstreams/' + owner.id + '/targets/active?';
        if ($scope.offset) {
            page += 'offset=' + $scope.offset + '&';
        }
        if (loaded_pages.indexOf(page) !== -1) {
            return;
        }
        loaded_pages.push(page);

        Kong.get(page).then(function(collection) {
            if ($scope.total === null) {
                $scope.total = 0;
            }
            $scope.targets.push.apply($scope.targets, collection.data);
            $scope.total += collection.total;
            $scope.offset = collection.offset ? collection.offset : null;
        });
    };
    $scope.loadMore();

    $scope.showDeleteModal = function (name, id) {
        $scope.current = {name: name, id: id};
        $('#deleteTarget').openModal();
    };

    $scope.abortDelete = function () {
        $('#deleteTarget').closeModal();
    };

    $scope.performDelete = function () {
        $('#deleteTarget').closeModal();
        Kong.delete('/upstreams/' + owner.id + '/targets/' + $scope.current.id).then(function () {
            $scope.total -= 1;
            $scope.targets.forEach(function(element, index) {
                if (element.id === $scope.current.id) {
                    element.weight = 0;
                }
            });
        });
    }
}]);

