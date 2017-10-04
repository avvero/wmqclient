function flowController($scope, $stompclient, $timeout, $stateParams, localStorageService, $uibModal, page, 
    hotkeys, $location) {
    if (!$stompclient.connected) {
        $location.path('#')
    }    
    $scope.REMOVE_FROM_QUEUE_INTERVAL = 100
    $scope.BLINK_DELAY = 1500
    $scope.SCROLL_SPEED = 3
    $scope.SCROLL_ELEMENT_H = 17
    $scope.logFilterValue = '';
    $scope.logSearchValue = '';
    $scope.isStopped = false; // остановили обновление страницы
    $scope.isSelectMode = false; //
    $scope.pageLogLimit = $scope.VISIBLE_LOGS_QUANTITY;
    $scope.currentMarker = $stateParams.marker
    page.setTitle($stateParams.marker)
    // События
    $scope.items = [];
    $scope.selected = [];
    $scope.caret = {
        position: 0,
        tension: 0,
        min: 0,
        max: 1000
    }
    $scope.caret2 = {
        position: 0
    }
    $scope.$watch('logSearchValue', function(newValue, oldValue) {
        if (newValue != "") {
            $scope.isStopped = true
        }
    });
    hotkeys.add({
        combo: 'ctrl+f',
        callback: function(event) {
            event.preventDefault();
            $scope.showSearch = !$scope.showSearch
        }
    });
    hotkeys.add({
        combo: 'ctrl+space',
        callback: function(event) {
            $scope.isStopped = !$scope.isStopped
        }
    });
    $scope.lastMessage = null
    $scope.send = function (message) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/send.html',
            controller: sendDialogController,
            resolve: {
                message: function ($q, $http) {
                    var deferred = $q.defer();
                    deferred.resolve({
                        destinationType: message ? message.destinationType: "/topic",
                        destination: message ? message.destination: $stateParams.marker,
                        headers: message ? message.headers : {},
                        body: message ? message.body : '', 
                    })
                    return deferred.promise;
                }
            }
        });
        modalInstance.result.then(function (message) {
            //todo topics only
            console.info(message)
            $scope.lastMessage = message
            $stompclient.send(message.destinationType + "/" + message.destination, message.headers, message.body);
        }, function () { });
    }
    /**
     * SELECT
     */
    $scope.nullFunction = function () {
    }
    $scope.setSelected = function (entry, tag) {
        var list = $scope.selected
        if (!entry[tag]) {
            list.push(entry)
        } else {
            var index = list.indexOf(entry);
            if (index > -1) {
                list.splice(index, 1);
            }
        }
        entry[tag] = !entry[tag]
    }
    $scope.chooseEntry = function (entry) {
        $scope.caret.tension = 0
        $scope.caret.position = $scope.items.length - entry.idx - 1
        //$('.flow')[0].scrollTop = 0
        $scope.blink(entry)
    }
    $scope.blink = function(entry) {
        entry.blink = true
        $timeout(function () {
            entry.blink = null
        }, $scope.BLINK_DELAY);
    }
    $scope.selectPrev = function(position) {
        var list = $scope.selected.sort(function(a,b) {return b.idx - a.idx})
        var prev = null
        for (var i = 0; i < list.length; i++) {
            var entryPosition = $scope.items.length - list[i].idx - 1
            if (entryPosition < position) {
                prev = list[i]
            }
        }
        if (prev != null) {
            $scope.chooseEntry(prev)
        }
    }
    $scope.selectNext = function(position) {
        var list = $scope.selected.sort(function(a,b) {return b.idx - a.idx})
        var prev = null
        for (var i = 0; i < list.length; i++) {
            var entryPosition = $scope.items.length - list[i].idx - 1
            if (entryPosition > position) {
                prev = list[i]
                break;
            }
        }
        if (prev != null) {
            $scope.chooseEntry(prev)
        }
    }
    /* QUEUE */
    $scope.queue = [];
    $scope.remove = function (index) {
        $scope.items.splice(index, 1);
    }
    $scope.addToQueue = function (logEntry) {
        $scope.queue.push(logEntry)
    }
    $scope.removeFromQueue = function (applyScope) {
        $timeout(function () {
            applyScope = false
            if ($scope.queue.length != 0 && !$scope.isStopped) {
                // Возможно нужно добавлять порциями
                var times = $scope.getTimes($scope.queue)
                for (var t = 0; t < times; t++) {
                    var logEntry = $scope.queue.shift();
                    logEntry.idx = $scope.items.length
                    $scope.items.push(logEntry)
                    applyScope = true
                }
            }
            $scope.removeFromQueue(applyScope)
        }, $scope.REMOVE_FROM_QUEUE_INTERVAL, applyScope);
    }
    $scope.removeFromQueue(false)
    //XXX
    $scope.getTimes = function (queue) {
        if (queue.length > 1000) return 1000;
        if (queue.length > 100) return 100;
        if (queue.length > 10) return 10;
        return 1;
    };
    $scope.clear = function () {
        $scope.items = []
        $scope.selected = []
    }
    $scope.onMessageReceive = function (event) {
        console.info(event)
        $scope.addToQueue(event)
    }
    /***
     * STOMP
     */
    $scope.stompClient = $stompclient
    $scope.stompSubscription = null
    $stompclient.subscribe($stateParams.marker, $scope.onMessageReceive)
    /**
     * При закрытии делаем disconnect
     */
    $scope.$on('$destroy', function () {
        $scope.disconnect()
    })
    $scope.disconnect = function () {
        $scope.stompClient.disconnect()
    }
    /**
     * VIEW
     */
        // Уровни событий
    $scope.showDebug = true;
    $scope.showInfo = true;
    $scope.showWarn = true;
    $scope.showError = true;
    $scope.showTrace = true;
    $scope.scrollToTop = function () {
        $scope.caret.position = 0
        $scope.caret.tension = 0
        $('.flow')[0].scrollTop = 0
    }
    $scope.scrollToBottom = function () {
        if ($scope.items.length - 1 > 0) {
            $scope.caret.position = $scope.items.length - 10
            $scope.caret.tension = 0
            var raw = $('.flow')[0]
            raw.scrollTop = raw.scrollHeight - raw.clientHeight
        }
    }
    $scope.showSettings = false;
    $scope.showSearch = false;

    $scope.getButtonItemLengthClass = function (length, d1, d2) {
        if (length <= d1) return 'btn-success'
        if (length > d1 && length < d2) return 'btn-warning'
        if (length >= d2) return 'btn-danger'
    }

    $scope.showOptionsDialog = function () {
        var options = {
            showMdc: $scope.isOptionOn('view.showMdc'),
            showChart: $scope.isOptionOn('view.showChart'),
            isDebugMode: $scope.isOptionOn('app.isDebugMode')
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'views/options.html',
            controller: optionsDialogController,
            resolve: {
                options: function ($q, $http) {
                    var deferred = $q.defer();
                    deferred.resolve(options)
                    return deferred.promise;
                }
            }
        });
        modalInstance.result.then(function (options) {
            $scope.setOption('view.showMdc', options.showMdc)
            $scope.setOption('view.showChart', options.showChart)
            $scope.setOption('app.isDebugMode', options.isDebugMode)
        }, function () {

        });
    }
    $scope.getShift = function (tension) {
        if ($scope.caret.tension >= 0) {
            return 'margin-top:-'+$scope.caret.tension * $scope.SCROLL_ELEMENT_H+'px'
        } else {
            if (typeof(tension) == "undefined") {
                return 'position: fixed; visibility: hidden;'
            } else {
                return 'margin-top:-'+(tension + $scope.caret.tension) * $scope.SCROLL_ELEMENT_H+'px'
            }
        }
    }

    /**
     * LocalStorage
     *
     */
    $scope.optionCache = {}
    $scope.changeBoolOption = function (option) {
        var value = !!localStorageService.get(option)
        var newValue = !value
        localStorageService.set(option, newValue)

        $scope.optionCache[option] = newValue
    }
    $scope.setOption = function (option, value) {
        localStorageService.set(option, value)

        $scope.optionCache[option] = value
    }
    $scope.isOptionOn = function (option) {
        if (typeof($scope.optionCache[option]) == "undefined") {
            $scope.optionCache[option] = !!localStorageService.get(option)
        }
        return $scope.optionCache[option]
    }
    $scope.setDefaultOption = function (option, value) {
        if (localStorageService.get(option) == null) {
            $scope.setOption(option, value)
        }
    }
    $scope.setDefaultOption('view.showMdc', true)
    $scope.setDefaultOption('view.showChart', false)
    $scope.setDefaultOption('view.hideHelp', false)
    $scope.setDefaultOption('app.isDebugMode', false)
}