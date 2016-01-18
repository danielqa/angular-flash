/*! angular-flash - v1.0.0 - 2015-03-19
 * https://github.com/sachinchoolur/angular-flash
 * Copyright (c) 2015 Sachin; Licensed MIT */
(function() {
    'use strict';
    var app = angular.module('flash', []);

    app.run(['$rootScope', function($rootScope) {
        // initialize variables
        $rootScope.flash = {};
        $rootScope.flash.text = [];
        $rootScope.flash.type = '';
        $rootScope.flash.timeout = 5000;
        $rootScope.hasFlash = false;
    }]);

    // Directive for compiling dynamic html
    app.directive('dynamic', ['$compile', function($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    }]);

    // Directive for closing the flash message
    app.directive('closeFlash', ['$compile', 'Flash', function($compile, Flash) {
        return {
            link: function(scope, ele) {
                ele.on('click', function() {
                    Flash.dismiss();
                });
            }
        };
    }]);

    // Create flashMessage directive
    app.directive('flashMessage', ['$compile', '$rootScope', function($compile, $rootScope) {
        return {
            restrict: 'A',
            template: '<div role="alert" ng-show="hasFlash" class="alert {{flash.addClass}} alert-{{flash.type}} alert-dismissible ng-hide alertIn alertOut">' +
                        '<button type="button" class="close" close-flash>' +
                            '<span aria-hidden="true">&times;</span>' +
                            '<span class="sr-only">Close</span>' +
                        '</button>' +
                        '<span class="glyphicon glyphicon-ok" ng-if="flash.type === \'success\'"></span>' +
                        '<span class="glyphicon glyphicon-warning-sign glyphicon-alert-big" ng-if="flash.type === \'danger\'"></span>' +
                        '<span class="glyphicon glyphicon-info-sign glyphicon-alert-big" ng-if="flash.type === \'info\'"></span>' +
                        '<span class="glyphicon glyphicon-exclamation-sign glyphicon-alert-big" ng-if="flash.type === \'warning\'"></span>' +
                        '<div ng-repeat="message in flash.text">' +
                            '<span dynamic="message"></span>' +
                        '</div>' +
                      '</div>',
            link: function(scope, ele, attrs) {
                // get timeout value from directive attribute and set to flash timeout
                $rootScope.flash.timeout = parseInt(attrs.flashMessage, 10);
            }
        };
    }]);

    app.factory('Flash', ['$rootScope', '$window', '$timeout',
        function($rootScope, $window, $timeout) {

            var dataFactory = {},
                timeOut;

            // Create flash message
            dataFactory.create = function(type, text, addClass) {
                var $this = this;
                $timeout.cancel(timeOut);
                $rootScope.flash.type = type;
                $rootScope.flash.text = angular.isArray(text) ? text : [text];
                $rootScope.flash.addClass = addClass;
                $timeout(function() {
                    $rootScope.hasFlash = true;
                }, 100);
                timeOut = $timeout(function() {
                    $this.dismiss();
                }, $rootScope.flash.timeout);

                angular.element('body')[0].scrollTop = 0;
            };

            // Cancel flashmessage timeout function
            dataFactory.pause = function() {
                $timeout.cancel(timeOut);
            };

            // Dismiss flash message
            dataFactory.dismiss = function() {
                $timeout.cancel(timeOut);
                $timeout(function() {
                    $rootScope.hasFlash = false;
                });
            };
            return dataFactory;
        }
    ]);
}());