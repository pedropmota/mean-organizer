(function () {
    'use strict';

    angular
        .module('app')
        .controller('AuthController', AuthController);

    function AuthController($scope, $rootScope, $http, $window, panelService, taskService) {
        $scope.user = { username: '', password: '' };
        $scope.error_message = '';

        $scope.login = function () {
            $scope.error_message = ''
            $http.post('/auth/login', $scope.user).then(function successCallback(response) {
                
                handleAuthResponse(response);
            }, function errorCallback(error) {

            });
        };

        $scope.register = function () {
            $scope.error_message = '';
            $http.post('/auth/register', $scope.user).then(function onSuccess(response) {
                handleAuthResponse(response);
            });
        };

        function handleAuthResponse(response) {
            if (response.data.state === 'success') {
                $rootScope.isLoggedIn = true;
                $rootScope.currentUser = response.data.user.username;

                $rootScope.$emit("InsertAllPanels", function () {
                    $window.location.href = '#/';
                });
            } else {
                $scope.error_message = response.data.message;
            }
        }
    };
})();