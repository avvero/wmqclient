function sendDialogController(message, $scope, $uibModalInstance, localStorageService) {
    $scope.history = localStorageService.get("sendHistory") || []
    $scope.saveHistory = function(newEntry) {
        //if (!$scope.contains($scope.history, newEntry)){
        $scope.history.unshift(newEntry)    
        //}
        if ($scope.history.length > 10) {
            $scope.history.splice(-1,1)
        }
        localStorageService.set("sendHistory", $scope.history)
    }
    $scope.clearHeaders = function (headers) {
        var copy = jQuery.extend(true, {}, headers || {'amq-msg-type': 'text'})
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
    $scope.stringifyBody = function (body) {
        if (typeof body === 'object') {
            return JSON.stringify(body)
        } else {
            return body
        }
    }
    $scope.setMessage = function(entry) {
        $scope.message.headers =  $scope.clearHeaders(entry.headers),
        $scope.message.body =  entry.body ? $scope.stringifyBody(entry.body) : '{"foo":"bar"}'

        $scope.message.headerList = []
        for (var key in $scope.message.headers) {
            $scope.message.headerList.push({
                key: key,
                value: $scope.message.headers[key]
            })
        }
    }

    $scope.message = {
        destinationType: message.destinationType || "/topic",
        destination: message.destination || ""
    }
    $scope.setMessage(message)

    $scope.ok = function () {
        for (var i = 0; i < $scope.message.headerList.length; i++) {
            $scope.message.headers[$scope.message.headerList[i].key] = $scope.message.headerList[i].value
        }
        $scope.saveHistory($scope.message)
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
    $scope.contains = function (list, entry) {
        for (var i = 0; i < list.length; i++) {
            if (entry.body == list[i].body) {
                return true
            }        
        }
        return false
    }
    $scope.selectFromHistory = function(entry) {
        $scope.message = jQuery.extend(true, {}, entry)
    }
}