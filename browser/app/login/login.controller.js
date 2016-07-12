'use strict'

app.controller('LoginCtrl', function ($scope, AuthFactory) {

	$scope.submitLogin = function() {
		AuthFactory.login($scope.email, $scope.password);
	}
})