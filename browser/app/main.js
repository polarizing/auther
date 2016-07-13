'use strict';

var app = angular.module('auther', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {

	$urlRouterProvider.when('/auth/:provider', function () {
	  window.location.reload();
	});
	
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
});
