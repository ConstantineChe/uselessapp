'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp',
                         ['uselessApp.filters', 'uselessApp.services', 'uselessApp.directives','ngRoute', 'btford.socket-io']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider.when('/board', {templateUrl: 'partial/board', controller: BoardCtrl});
      $routeProvider.when('/login', {templateUrl: 'partial/login', controller: LoginCtrl});
      $routeProvider.when('/signup', {templateUrl: 'partial/signup', controller: SignupCtrl});
      $routeProvider.when('/thread/:id', {templateUrl: 'partial/thread', controller: ThreadCtrl});
    $routeProvider.otherwise({redirectTo: '/board'});
    $locationProvider.html5Mode(true);
  }]);
