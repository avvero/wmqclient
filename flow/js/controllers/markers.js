function markersController($scope, page, config, $stateParams, $stompclient, Notification) {
    $scope.config = config
    $scope.stompclient = $stompclient
    $scope.connection = null
    $scope.connect = function (connection) {
        $stompclient.connect(connection.url, function(){
            $scope.connection = connection
        })
    }
}

markersController.resolve = {
    config: function ($q, $http, $stateParams) {
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: 'config.json',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
            .success(function (data) {
                deferred.resolve(data)
            })
            .error(function (data) {
                deferred.reject("error value");
            });

        return deferred.promise;
    }
}