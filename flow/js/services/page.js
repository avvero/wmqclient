angular.module('flow').factory('page', function () {
    var title = 'WMQ client';
    return {
        title: function () {
            return title;
        },
        setTitle: function (newTitle) {
            title = newTitle
        }
    };
});