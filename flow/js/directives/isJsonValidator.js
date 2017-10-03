angular.module('flow').directive('jsonvalid', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(value) {
                try {
                    JSON.parse(value)
                    ctrl.$setValidity('jsonvalid', true);
                } catch (e) {
                    ctrl.$setValidity('jsonvalid', false);
                } 
                return value
            });
        }
    };
});