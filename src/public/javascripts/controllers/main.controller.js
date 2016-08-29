(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('MainController', MainController);

    function MainController($scope, $rootScope, $http, panelService, taskService) {
        $scope.panels = [];

        $scope.detailedTask = null;

        $scope.createPanel = function (name) {
            var newPanel = {
                name: name ? name : 'New Panel',
                tasks: [],
                newTask: { id: '', created_by: '', title: '', created_at: '', edit_mode: false }
            };

            if ($rootScope.isLoggedIn) {
                panelService.save(newPanel, function (response) {
                    newPanel.id = response.id;
                    $scope.panels.push(newPanel);
                }, function (error) {
                    handleAuthorizationError(error);
                });
            } else {
                $scope.panels.push(newPanel);
            }
        };

        $scope.createPanel('Welcome');

        $scope.createTask = function (panel) {
            var test = $rootScope.isLoggedIn;
            if (!panel.newTask.title)
                return;

            panel.newTask.created_at = Date.now();
            panel.newTask.created_by = 'Pedro';

            panel.tasks.push(panel.newTask);
            $scope.detailedTask = panel.newTask;
            panel.newTask = { id: '', created_by: '', title: '', created_at: '' };

            if ($rootScope.isLoggedIn) {
                taskService.save({ panelId: panel.id }, panel.newTask, function (response) {
                    panel.newTask.id = response.id;
                }, function (error) {
                    handleAuthorizationError(error);
                });
            }
            
        };

        $scope.edit = function (task) {
            task.edit_mode = true;
            $scope.detailedTask = task;
        }

        $scope.save = function (panel, task) {
            task.edit_mode = false;
            taskService.update({ panelId: panel.id, id: task.id }, task, function (response) {
                task.id = response.id;
            });
        }

        $scope.editDetails = function () {
            $scope.details_edit_mode = true;
        }

        $scope.saveDetails = function () {
            $scope.details_edit_mode = false;

            //save
        };


        function handleAuthorizationError(error) {
            if (error.status === 401) {
                isLoggedIn = false;
                $window.location.href = '#/Login';
            } else {
                throw error;
            }
        }
    }
})();