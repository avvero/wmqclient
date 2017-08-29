function connectionDialogController(connection, $scope, $uibModalInstance) {
    $scope.connection = {
        url: "ws://f2g.avvero.pw:61614/stomp"
    }
    $scope.ok = function () {
        $uibModalInstance.close($scope.connection);
    }
}