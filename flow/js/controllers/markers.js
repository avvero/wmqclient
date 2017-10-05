function markersController($scope, page, config, $stateParams, $stompclient, Notification, $window) {
    page.setTitle('WMQ client')

    $scope.config = config
    $scope.stompclient = $stompclient
    $scope.connection = null
    $scope.callback = function(connection){
        $stompclient.connected = true
        $stompclient.endpoint = connection.url
        $scope.connection = connection
    }
    $scope.errorCallback = function(error){
        $stompclient.connected = false
        Notification.error(error)
    }
    $scope.connect = function (connection) {
        $stompclient.connect(connection.url, function(){$scope.callback(connection)}, $scope.errorCallback)
    }
    $scope.disconnect = function () {
        $stompclient.disconnect()
    }
    $scope.connectByUrl = function (url) {
        $stompclient.connect(url, function(){$scope.callback({url: url})}, $scope.errorCallback)
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