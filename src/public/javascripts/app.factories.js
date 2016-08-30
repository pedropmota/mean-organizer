(function () {
    'use strict';

    var app = angular.module('app');

    app.factory('panelService', ['$resource', function ($resource) {
        return $resource('/api/panels/:id');
    }]);

    app.factory('taskService', ['$resource', function ($resource) {
        return $resource('/api/panels/:panelId/tasks/:id', null, {
            'update': { method: 'PUT' }
        });
    }]);

})();