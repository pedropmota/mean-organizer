(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('MainController', MainController);

    function MainController($scope, $rootScope, $http, $window, panelService, taskService) {
        $scope.panels = [];

        $scope.detailedTask = null;

        $scope.createPanel = function (name) {
            var newPanel = {
                name: name ? name : 'New Panel',
                tasks: [],
                newTask: { id: '', created_by: '', title: '', created_at: '', edit_mode: false }
            };

            if (!$rootScope.isLoggedIn) {
                $scope.panels.push(newPanel);
                return;
            }

            panelService.save(newPanel, function (response) {
                newPanel.id = response.id;
                $scope.panels.push(newPanel);
            }, function (error) {
                handleAuthorizationError(error);
            });
        };

        $scope.createPanel('Welcome');

        $scope.createTask = function (panel) {
            if (!panel.newTask.title)
                return;

            if (!$rootScope.isLoggedIn) {
                panel.newTask.created_at = Date.now();
                panel.newTask.created_by = 'Anonymous';
                panel.tasks.push(panel.newTask);
                
                $scope.detailedTask = panel.newTask;
                panel.newTask = { id: '', created_by: '', title: '', created_at: '' };
                return;
            }

            taskService.save({ panelId: panel.id }, panel.newTask, function (response) {
                panel.newTask.id = response.id;
                panel.newTask.created_at = response.created_at;
                panel.newTask.created_by = response.created_by;
                panel.tasks.push(panel.newTask);
                
                $scope.detailedTask = panel.newTask;
                $scope.detailedTask.panelId = panel.id;
                panel.newTask = { id: '', created_by: '', title: '', created_at: '' };
            }, function (error) {
                handleAuthorizationError(error);
            });
            
        };

        $scope.edit = function (panel, task) {
            task.edit_mode = true;
            $scope.detailedTask = task;
            $scope.detailedTask.panelId = panel.id;
        }

        $scope.save = function (panel, task) {
            task.edit_mode = false;
            
            if (!$rootScope.isLoggedIn) {
                task.modified_at = Date.now();
                return;
            }

            taskService.update({ panelId: panel.id, id: task.id }, task, function (response) {
                task.modified_at = response.modified_at;
            }, function (error) {
                handleAuthorizationError(error);
            });
        }

        $scope.editDetails = function () {
            $scope.details_edit_mode = true;
        }

        $scope.saveDetails = function () {
            $scope.details_edit_mode = false;

            if (!$rootScope.isLoggedIn) {
                $scope.detailedTask.modified_at = Date.now();
                return;
            }

            taskService.update({ panelId: $scope.detailedTask.panelId, id: $scope.detailedTask.id }, $scope.detailedTask, function (response) {
                $scope.detailedTask.modified_at = response.modified_at;
            }, function (error) {
                handleAuthorizationError(error);
            });
        };


        function handleAuthorizationError(error) {
            if (error.status === 401) {
                $rootScope.isLoggedIn = false;
                $window.location.href = '#/Login';
            } else {
                throw error;
            }
        }
    }
})();