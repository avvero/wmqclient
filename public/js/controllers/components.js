function placesController($scope, $timeout, $http, localStorageService, $uibModal) {
    var storedUrl = localStorageService.get("url")
    $scope.connection = {
        url: storedUrl
    }
    var _messages = []
    var client = {}
    if (!!storedUrl) {
        // Stomp
        client = Stomp.client($scope.connection.url, "v11.stomp");
        client.connect("", "", function () {
            client.subscribe("jms.topic.test",
                function (message) {
                    console.info(message)
                    _messages.push(message)
                }, {
                    priority: 9
                }
            );
        });
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
            $scope.connection.subscriptions = client.subscriptions
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