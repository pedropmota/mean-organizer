(function () {
    'use strict';
    angular.module('app')
        .config(function ($routeProvider, $locationProvider) {

            $routeProvider

                .when('/', {
                    templateUrl: 'partials/main.html',
                    controller: 'MainController',
                })

                .when('/Login', {
                    templateUrl: 'partials/login.html',
                    controller: 'AuthController'
                })

                .when('/Register', {
                    templateUrl: 'partials/register.html',
                    controller: 'AuthController'
                })

                .when('/Contact', {
                    templateUrl: 'partials/contact.html'
                })

                .when('/About', {
                    templateUrl: 'partials/about.html'
                })

        });
})();