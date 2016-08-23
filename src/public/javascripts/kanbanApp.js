var app = angular.module('kanbanApp', ['ngResource']);

app.factory('panelService', function($resource) {
  return $resource('/api/panels/:id'); // Note the full endpoint address
});

app.factory('taskService', ['$resource', function($resource) {
  return $resource('/api/panels/:panelId/tasks/:id', null, {
   'update': { method:'PUT' }
  });
}]);

app.controller('mainController', function($scope, $http, panelService, taskService) {
  
  $scope.panels = [];
  
  $scope.detailedTask = null;
  
  $scope.createPanel = function(name) {
    var newPanel = { 
      name: name ? name : 'New Panel', 
      tasks: [],
      newTask: { created_by: '', title: '', created_at: '', edit_mode: false }
    };
    
    panelService.save(newPanel, function(response) {
      newPanel.id = response.id;
      $scope.panels.push(newPanel);
    });
  };
  
  $scope.createPanel('Welcome');
  
	$scope.createTask = function(panel) {
    if (!panel.newTask.title)
      return;
      
		panel.newTask.created_at = Date.now();
		panel.newTask.created_by = 'Pedro';
		
    taskService.save({panelId: panel.id}, panel.newTask, function(response) {
      panel.newTask.id = response.id;
      panel.tasks.push(panel.newTask);
      $scope.detailedTask = panel.newTask;
      panel.newTask = { created_by: '', title: '', created_at: '' };
    })
	};
  
	$scope.edit = function(task) {
		task.edit_mode = true;
    $scope.detailedTask = task;
	}
	
	$scope.save = function(panel, task) {
		task.edit_mode = false;
    taskService.update({panelId: panel.id, id: task.id}, task, function(response) {
      task.id = response.id;
    });
	}
  
  $scope.editDetails = function() {
    $scope.details_edit_mode = true;
  }
  
  $scope.saveDetails = function() {
    $scope.details_edit_mode = false;
    
    //save
  }
});

app.directive('kbBlurOnEnter', function() {
   return {
    restrict: 'A',
    link: function($scope, $element, $attrs, $controller) {
      
      $element.bind("keypress", function(event) {
        
        var keyCode = event.which || event.keyCode;

        //Enter keyCode => 13
        if (keyCode === 13) {
          event.srcElement.blur(); 
          event.preventDefault();
        }
      });
    }
  };
});


app.directive('kbEnterKeypress', function() {

  return {
    restrict: 'A',
    link: function($scope, $element, $attrs, $controller) {
      
      $element.bind("keypress", function(event) {
        
        var keyCode = event.which || event.keyCode;

        //Enter keyCode => 13
        if (keyCode === 13) {
          $scope.$apply(function() {
            $scope.$eval($attrs.kbEnterKeypress);
          });
          
          event.preventDefault();
        }
      });
    }
  };
});

app.directive('kbClickFocusInput', function() {

  return {
    restrict: 'A',
    link: function($scope, $element, $attrs, $controller) {
      
      $element.bind("click", function() {
         this.parentElement.getElementsByTagName('textarea')[0].focus();
      });
    }
  };
});