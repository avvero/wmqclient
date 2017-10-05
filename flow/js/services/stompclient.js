angular.module('stompclient', [])
    .factory('$stompclient', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        'use strict';

    var client = {}
    var _stompclient = {}
    var _data = []
    var _subscriptions = []

    _stompclient.connected = false;

    _stompclient.connect = function (endpoint, callback, errorCallback) {
        if (_stompclient.connected) client.disconnect()
        client = Stomp.client("ws://" + endpoint + "/stomp", "v11.stomp");
        var login = ""
        var passcode = ""
        client.connect(login, passcode, function() {
            $rootScope.$apply(function (scope) {
                callback()
            })
        }, function(error) {
            $rootScope.$apply(function (scope) {
                errorCallback(error)
            })
        })
    };

    var apply = function(callback) {
        $rootScope.$apply(function (scope) {
            callback
        });
    }

    _stompclient.using = function (endpoint, callbacks) {

    };

    _stompclient.publish = function() {

    }

    _stompclient.disconnect = function (callback) {
        client.disconnect()
        _stompclient.connected = false
        _subscriptions = []
    };

    _stompclient.subscribe = function (destination, callback) {
        //todo topics only
        var destinationType = "/topic" 
        var subscription = client.subscribe(destinationType + "/" + destination, function (message) {
            message.destinationType = destinationType
            message.destination = destination
            try {
                message.body = JSON.parse(message.body)    
            } catch (err) {}
            $rootScope.$apply(function (scope) {
                callback(message)
            });
        }, {});
        subscription.destinationType = destinationType
        subscription.destination = destination
        _subscriptions.push(subscription)
    }

    _stompclient.send = function (destination, headers, body) {
        client.send(destination, headers, body)
    };

    return _stompclient;
}]);
