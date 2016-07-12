'use strict';

app.controller('SignupCtrl', function ($scope, AuthFactory) {
	$scope.submitSignup = function () {
		AuthFactory.signup($scope.email, $scope.password);
	}
})