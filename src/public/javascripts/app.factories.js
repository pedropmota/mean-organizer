(function () {
    'use strict';

    var app = angular.module('app');

    app.factory('panelService', ['$resource', function ($resource) {
        return $resource('/api/panels/:id', null, {
            'update': { method: 'PUT' }
        });
    }]);

    app.factory('taskService', ['$resource', function ($resource) {
        return $resource('/api/panels/:panelId/tasks/:id', null, {
            'update': { method: 'PUT' }
        });
    }]);

})();