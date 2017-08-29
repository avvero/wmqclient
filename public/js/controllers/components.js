function placesController($scope, $timeout, $http) {
    //
    $scope.connection = {
        url: "ws://f2g.avvero.pw:61614/stomp"
    }
    // Stomp
    var _messages = []
    var client = Stomp.client($scope.connection.url, "v11.stomp");
    client.connect("", "", function () {
        client.subscribe("jms.topic.test",
            function (message) {
                console.info(message)
                _messages.push(message)
            }, {
                priority: 9
            }
        );
        //client.send("jms.topic.test", { priority: 9 }, "Pub/Sub over STOMP!");
    }
    );

    $scope.messages = []
    // wrappers
    $scope.listen = function (delay) {
        $timeout(function () {
            var newMessages = _messages.splice(0, _messages.length)
            for (var i = 0; i < newMessages.length; i++) {
                $scope.messages.push(newMessages[i])
            }
            $scope.listen(100)
        }, delay, true);
    }
    $scope.listen(100)
}