(function() {
    'use strict';

    var app = angular.module('app', ['ngResource', 'ngRoute']);
    
    app.run(function($http, $rootScope) {
        $http.get('/auth/login-status').then(function onSuccess(response) {
            $rootScope.isLoggedIn = response.data.isLoggedIn;
            $rootScope.currentUser = response.data.username;
        });
    });

})();