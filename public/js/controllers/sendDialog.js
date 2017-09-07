function sendDialogController(message, $scope, $uibModalInstance) {
    $scope.message = {
        destination: "jms.topic.test",
        // headers: message.headers,
        body: message.body ? JSON.stringify(message.body) : '{"connections":[{"url":"f2g.avvero.pw:61614","destinations":["jms.topic.test"]}]}'
    }
    $scope.ok = function () {
        $uibModalInstance.close($scope.message);
    }
}