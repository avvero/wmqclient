function sendDialogController(message, $scope, $uibModalInstance) {
    $scope.message = {
        destinationType: "/topic/",
        destination: "",
        // headers: message.headers,
        body: message.body ? JSON.stringify(message.body) : '{"connections":[{"url":"f2g.avvero.pw:61614","destinations":["jms.topic.test"]}]}'
    }
    $scope.ok = function () {
        $uibModalInstance.close($scope.message);
    }
    $scope.showSelector = false
    $scope.selectorStyle = ""
    $scope.showDestionationSelector = function () {
        $scope.showSelector = !$scope.showSelector
        if ($scope.showSelector) {
            $scope.selectorStyle = "block"
        } else {
            $scope.selectorStyle = "none"
        }
    }
    $scope.setDestionationType = function (destinationType) {
        $scope.message.destinationType = destinationType
        $scope.showDestionationSelector()
    }
}