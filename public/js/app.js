angular.module("flow", [
    'ngRoute',
    'ui.router',
    'ngSanitize',
    'ui.bootstrap',
    'LocalStorageModule'
])
angular.module("flow").constant('constants', {
    version: "1.0.0"
})
// configure our routes
angular.module("flow").config(function ($routeProvider, $stateProvider, $urlRouterProvider,
    localStorageServiceProvider, constants) {

    $urlRouterProvider.otherwise("/")

    $stateProvider
        .state('index', {
            url: "/",
            views: {
                "single": {
                    templateUrl: 'views/components.html',
                    controller: placesController
                }
            }
        })
    localStorageServiceProvider
        .setPrefix('com.avvero.wmqclient.' + constants.version)
        .setStorageType('localStorage')
})
angular.module("flow").run(function ($rootScope) {

})

angular.module("flow").controller('mainController', function ($scope) {

})