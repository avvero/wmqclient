angular.module('flow').directive('jms', ['$timeout', function ($timeout) {
    return {
        link: function($scope, element, attrs) {
            $scope.$watch(attrs.onClick, function(value){
                $scope.onClick = value
            });
        },
        templateUrl: 'views/jms.html'
    };
}])