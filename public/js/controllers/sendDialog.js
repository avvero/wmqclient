function sendDialogController(data, $scope, $uibModalInstance) {
    $scope.message = {
        destination: "jms.topic.test",
        headers: { 
            priority: 9 
        },
        body: "Pub/Sub over STOMP!"
    }
    $scope.ok = function () {
        $uibModalInstance.close($scope.message);
    }
}