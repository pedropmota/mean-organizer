var app = angular.module('kanbanApp', []);

app.controller('mainController', function($scope) {
  
  $scope.columns = [];
  
  $scope.detailedTask = null;
  
  $scope.createColumn = function(name) {
    $scope.columns.push({ 
      name: name ? name : 'New Column', 
      tasks: [],
      newTask: { created_by: '', title: '', created_at: '', edit_mode: false }
    });
  }
  
  $scope.createColumn('Welcome');
  
	$scope.createTask = function(column) {
    if (!column.newTask.title)
      return;
      
		column.newTask.created_at = Date.now();
		column.newTask.created_by = 'Pedro';
		column.tasks.push(column.newTask);
    
    $scope.detailedTask = column.newTask;
    
		column.newTask = { created_by: '', title: '', created_at: '' };
	};
  
	$scope.edit = function(task) {
		task.edit_mode = true;
    $scope.detailedTask = task;
	}
	
	$scope.save = function(task) {
		task.edit_mode = false;
	  
		//save
	}
  
  $scope.editDetails = function() {
    $scope.details_edit_mode = true;
  }
  
  $scope.saveDetails = function() {
    $scope.details_edit_mode = false;
    
    //save
  }
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