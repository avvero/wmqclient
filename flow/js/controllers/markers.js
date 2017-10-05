function markersController($scope, page, config, $stateParams, $stompclient, Notification, $window, 
    localStorageService) {
    page.setTitle('WMQ client')

    $scope.config = config
    $scope.stompclient = $stompclient
    $scope.connection = null
    $scope.callback = function(connection){
        $stompclient.connected = true
        $stompclient.endpoint = connection.url
        $scope.connection = connection
        $scope.saveConnectionsHistory(connection.url)
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
        $scope.saveEndpointsHistory(endpoint)
        $window.location.href = "#follow/" + endpoint
    }
    $scope.contains = function (list, entry) {
        for (var i = 0; i < list.length; i++) {
            if (entry == list[i]) {
                return true
            }        
        }
        return false
    }
    $scope.saveConnectionsHistory = function(newEntry) {
        if (!$scope.contains($scope.connectionsHistory, newEntry)) {
            $scope.connectionsHistory.unshift(newEntry)    
        }
        localStorageService.set("connectionsHistory", $scope.connectionsHistory)
    }
    $scope.connectionsHistory = localStorageService.get("connectionsHistory")
    if (!$scope.connectionsHistory) {
        $scope.connectionsHistory = []
        // for (var i = 0; i < $scope.config.connections.length; i++) {
        //     $scope.saveConnectionsHistory($scope.config.connections[i].url)
        // }
    }
    $scope.saveEndpointsHistory = function(newEntry) {
        if (!$scope.contains($scope.endpointsHistory, newEntry)){
            $scope.endpointsHistory.unshift(newEntry)    
        }
        localStorageService.set("endpointsHistory", $scope.endpointsHistory)
    }
    $scope.endpointsHistory = localStorageService.get("endpointsHistory")
    if (!$scope.endpointsHistory) {
        $scope.endpointsHistory = []
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