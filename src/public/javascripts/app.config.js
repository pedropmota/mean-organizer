(function () {
    'use strict';
    angular.module('app')
        .config(function ($routeProvider, $locationProvider) {

            $routeProvider

                .when('/', {
                    templateUrl: 'main.html',
                    controller: 'MainController',
                })

                .when('/Login', {
                    templateUrl: 'login.html',
                    controller: 'AuthController'
                })

                .when('/Register', {
                    templateUrl: 'register.html',
                    controller: 'AuthController'
                })

        });
})();