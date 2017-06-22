angular.module('app').controller("UpstreamsController", ["$scope", "Kong", function ($scope, Kong) {
    $scope.upstreams = [];
    $scope.total = null;
    $scope.offset = null;

    var loaded_pages = [];
    $scope.loadMore = function() {
        var page = '/upstreams?';
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
            $scope.upstreams.push.apply($scope.upstreams, collection.data);
            $scope.total += collection.total;
            $scope.offset = collection.offset ? collection.offset : null;
        });
    };
    $scope.loadMore();

    $scope.showDeleteModal = function (name, id) {
        $scope.current = {name: name, id: id};
        $('#deleteUpstream').openModal();
    };

    $scope.abortDelete = function () {
        $('#deleteUpstream').closeModal();
    };

    $scope.performDelete = function () {
        $('#deleteUpstream').closeModal();
        Kong.delete('/upstreams/' + $scope.current.id).then(function () {
            $scope.total -= 1;
            $scope.upstreams.forEach(function(element, index) {
                if (element.id === $scope.current.id) {
                    $scope.upstreams.splice(index, 1);
                }
            });
        });
    }
}]);

