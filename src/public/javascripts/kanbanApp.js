var app = angular.module('kanbanApp', ['ngResource', 'ngRoute']).run(function($http, $rootScope) {
  $http.get('/auth/login-status').then(function onSuccess(response) {
    $rootScope.isLoggedIn = response.data.isLoggedIn;
    $rootScope.currentUser = response.data.username;
  });
});

app.factory('panelService', ['$resource', function($resource) {
  return $resource('/api/panels/:id');
}]);

app.factory('taskService', ['$resource', function($resource) {
  return $resource('/api/panels/:panelId/tasks/:id', null, {
   'update': { method:'PUT' }
  });
}]);

app.factory('authService', ['$window', function($window) {
  return {
    isLoggedIn: false,
    username: '',
    setAsLoggedIn: function(userName) {
      isLoggedIn = true;
      username = userName;
    },
    handleAuthorizationError: function(error) {
      if (error.status === 401) {
        isLoggedIn = false;
        $window.location.href = '#/Login';
      } else {
        throw error;
      }
    }
  };
}]);

app.controller('mainController', function($scope, $rootScope, $http, authService, panelService, taskService) {
  
  $scope.panels = [];
  
  $scope.detailedTask = null;
  
  $scope.createPanel = function(name) {
    var newPanel = { 
      name: name ? name : 'New Panel', 
      tasks: [],
      newTask: { created_by: '', title: '', created_at: '', edit_mode: false }
    };

    if (authService.isLoggedIn) {
      panelService.save(newPanel, function(response) {
        newPanel.id = response.id;
        $scope.panels.push(newPanel);
      }, function(error) {
        authService.handleAuthorizationError(error);
      });
    } else { 
      $scope.panels.push(newPanel);
    }
  };
  
  $scope.createPanel('Welcome');
  
	$scope.createTask = function(panel) {
    var test = $rootScope.isLoggedIn;
    if (!panel.newTask.title)
      return;
      
		panel.newTask.created_at = Date.now();
		panel.newTask.created_by = 'Pedro';
		
    if (authService.isLoggedIn) {
      taskService.save({panelId: panel.id}, panel.newTask, function(response) {
        panel.newTask.id = response.id;
      }, function(error) {
        authService.handleAuthorizationError(error);
      });
    }
    panel.tasks.push(panel.newTask);
    $scope.detailedTask = panel.newTask;
    panel.newTask = { created_by: '', title: '', created_at: '' };
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

app.controller('loginController', function($scope, $rootScope, $http, $window, panelService, taskService) {
  $scope.user =  { username: '', password: '' };
  $scope.error_message = '';

  $scope.login = function() {
    $rootScope.globalTest = 'from controller!';
    $scope.error_message = ''
    $http.post('/auth/login', $scope.user).then(function successCallback(response) {
      if (response.data.state === 'success') {
        $rootScope.isLoggedIn = true;
        $rootScope.currentUser = response.data.user.username;
        $window.location.href = '#/';
      } else {
        $scope.error_message = response.data.message;
      }
    }, function errorCallback(error) {

    });
  };

  $scope.register = function() {
    $scope.error_message = '';
    $http.post('/auth/register', $scope.user).then(function onSuccess(response) {
      if (response.data.state === 'success') {
        $rootScope.isLoggedIn = true;
        $rootScope.currentUser = response.data.user.username;
        $window.location.href = '#/';
      } else {
        $scope.error_message = response.data.message;
      }
    }, function onError(error) {

    });
  };
});

app.config(function($routeProvider, $locationProvider) {

  $routeProvider
  
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController',

    })

    .when('/Login', {
      templateUrl: 'login.html',
      controller: 'loginController'
    })

    .when('/Register', {
      templateUrl: 'register.html',
      controller: 'loginController'
    })

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