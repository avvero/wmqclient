function placesController($scope, $timeout, $http, localStorageService, $uibModal, Notification, config) {
    $scope.config = config
    $scope.connection = {}
    $scope.newDestination = ""

    var _messages = []
    var client = {}
    $scope.connect = function (connection) {
        Notification.info("Opening Web Socket...")
        if (client.connected) client.disconnect()
        //optimistic
        // connection.connected = true
        try {
            client = Stomp.client("ws://" + connection.url + "/stomp", "v11.stomp");
            client.connect("", "", function () { });
        } catch (err) {
            Notification.error(err)
            // connection.connected = false
            return
        }
        $scope.connection = connection
        connection.subscriptions = []
    }
    $scope.disconnect = function (connection) {
        connection.subscriptions = []
        client.disconnect()
    }
    $scope.subscribe = function (connection, destination) {
        for (var i = 0; i < connection.subscriptions.length; i++) {
            if (connection.subscriptions[i].destination == destination) {
                return
            }
        }
        Notification.info("Subscribe to " + destination)
        subscription = client.subscribe(destination, function (message) {
            message.body = JSON.parse(message.body)
            console.info(message)
            _messages.push(message)
        }, {});
        subscription.destination = destination
        connection.subscriptions.push(subscription)
    }
    $scope.subscribeNew = function (connection, destination) {
        $scope.subscribe(connection, destination)
        $scope.newDestination = ""
    }
    $scope.unsubscribe = function (connection, destination) {
        var subscription = null
        for (var i = 0; i < connection.subscriptions.length; i++) {
            if (connection.subscriptions[i].destination == destination) {
                Notification.info("Undubscribe from " + destination)
                connection.subscriptions[i].unsubscribe()
                connection.subscriptions.splice(i, 1);
                return
            }
        }
    }
    $scope.messages = []
    // wrappers
    $scope.listen = function (delay) {
        $timeout(function () {
            var newMessages = _messages.splice(0, _messages.length)
            for (var i = 0; i < newMessages.length; i++) {
                $scope.messages.push(newMessages[i])
            }

            $scope.connection.connected = client.connected
            $scope.listen(100)
        }, delay, true);
    }
    $scope.listen(100)
    $scope.send = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/send.html',
            controller: sendDialogController,
            resolve: {
                data: function ($q, $http) {
                    var deferred = $q.defer();
                    deferred.resolve({})
                    return deferred.promise;
                }
            }
        });
        modalInstance.result.then(function (message) {
            console.info(message)
            client.send(message.destination, message.headers, message.body);
        }, function () { });
    }
    $scope.editConnection = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/connection.html',
            controller: connectionDialogController,
            resolve: {
                connection: function ($q, $http) {
                    var deferred = $q.defer();
                    deferred.resolve($scope.connection)
                    return deferred.promise;
                }
            }
        });
        modalInstance.result.then(function (connection) {
            if (!connection.url) return
            if (connection.url == $scope.connection.url) return

            localStorageService.set("url", connection.url)
            $scope.connection.url = connection.url
            client = Stomp.client($scope.connection.url, "v11.stomp");
            client.connect("", "", function () { });
        }, function () { });
    }
}

placesController.resolve = {
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