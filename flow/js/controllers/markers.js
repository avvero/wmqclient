function markersController($scope, page, config, $stateParams, $stompclient, Notification, $window) {
    $scope.config = config
    $scope.stompclient = $stompclient
    $scope.connection = null
    $scope.connect = function (connection) {
        $stompclient.connect(connection.url, function(){
            $scope.connection = connection
        })
    }
    $scope.connectByUrl = function (url) {
        $stompclient.connect(url, function(){
            $scope.connection = {
                url: url
            }
        })
    }
    $scope.subscribe = function (endpoint) {
        $window.location.href = "#follow/" + endpoint
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