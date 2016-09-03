(function () {
    'use strict';

    var app = angular.module('app');

    app.directive('kbBlurOnEnter', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs, $controller) {

                $element.bind("keypress", function (event) {

                    var keyCode = event.which || event.keyCode;

                    //Enter key => 13
                    if (keyCode === 13) {
                        event.srcElement.blur();
                        event.preventDefault();
                    }
                });
            }
        };
    });


    app.directive('kbEnterKeypress', function () {

        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs, $controller) {

                $element.bind("keypress", function (event) {

                    var keyCode = event.which || event.keyCode;

                    //Enter keyCode => 13
                    if (keyCode === 13) {
                        $scope.$apply(function () {
                            $scope.$eval($attrs.kbEnterKeypress);
                        });

                        event.preventDefault();
                    }
                });
            }
        };
    });

    app.directive('kbClickFocusInput', function () {

        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs, $controller) {

                $element.bind("click", function () {
                    var input = this.parentElement.getElementsByTagName('textarea')[0];
                    
                    if (!input)
                        input = this.parentElement.getElementsByTagName('input')[0];
                    
                    input.focus();
                });
            }
        };
    });

})();