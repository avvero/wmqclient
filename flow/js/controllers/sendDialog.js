function sendDialogController(message, $scope, $uibModalInstance) {
    $scope.headerList = []
    $scope.prepareHeaders = function (headers) {
        var copy = jQuery.extend(true, {}, headers || {})
        delete copy['content-length'];
        delete copy['destination'];
        delete copy['expires'];
        delete copy['message-id'];
        delete copy['priority'];
        delete copy['subscription'];
        delete copy['priority'];
        delete copy['timestamp'];
        return copy
    }

    $scope.message = {
        destinationType: message.destinationType || "/topic",
        destination: message.destination || "",
        headers: $scope.prepareHeaders(message.headers),
        body: message.body ? JSON.stringify(message.body) : '{"connections":[{"url":"f2g.avvero.pw:61614","destinations":["jms.topic.test"]}]}'
    }

    for (var key in $scope.message.headers) {
        $scope.headerList.push({
            key: key,
            value: $scope.message.headers[key]
        })
    }

    $scope.ok = function () {
        for (var i = 0; i < $scope.headerList.length; i++) {
            $scope.message.headers[$scope.headerList[i].key] = $scope.headerList[i].value
        }
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