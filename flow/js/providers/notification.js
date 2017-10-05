angular.module('flow').factory('Notification', function () {
    this.info = function (text) {
        var noti = {
            id: -1,
            title: 'Information',
            time: 2000,
            text: text,
            class_name: 'gritter-info'
        }
        $.gritter.add(noti);
    }
    this.error = function (text) {
        var noti = {
            id: -1,
            title: 'Error',
            time: 5000,
            text: text,
            class_name: 'gritter-error'
        }
        noti.class_name = 'gritter-error'
        $.gritter.add(noti);
    }
    this.success = function (text) {
        var noti = {
            id: -1,
            title: 'Success',
            time: 3000,
            text: text,
            class_name: 'gritter-success'
        }
        $.gritter.add(noti)
    }
    this.successBg = function (text) {
        var noti = {
            id: -1,
            title: 'Success',
            time: 3000,
            text: text,
            class_name: 'gritter-success'
        }
        $.gritter.add(noti)
    }
    return this;
});