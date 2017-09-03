function sendDialogController(data, $scope, $uibModalInstance) {
    $scope.message = {
        destination: "jms.topic.test",
        headers: { 
            priority: 9 
        },
        body: '{"connections":[{"url":"f2g.avvero.pw:61614","destinations":["jms.topic.test"]}]}'
    }
    $scope.ok = function () {
        $uibModalInstance.close($scope.message);
    }
}