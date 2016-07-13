'use strict';

app.factory('AuthFactory', function ($http, $state) {

	var auth = { currentUser: null, currentUserId: null }

	$http.get('/auth/me')
		.then (function (response) {
			auth.currentUser = response.data;
			auth.currentUserId = response.data.id;
		})

	auth.signup = function(email, password) {
		$http.post('/api/users', {email: email, password: password })
			.then(function (response) {
				auth.currentUser = response.data;
				auth.currentUserId = response.data.id;
				auth.login(email, password);
			})
			.catch(function (err) {
				alert('NO');
			});
	}

	auth.login = function (email, password) {
		$http.post('/login', {email: email, password: password })
			.then(function (response) {
				auth.currentUser = response.data;
				auth.currentUserId = response.data.id;
				console.log('auth factory', auth);
				$state.go('stories');
			})
			.catch(function (err) {
				alert('BAD');
			});		
	}

	auth.refresh = function () {

	}

	auth.logout = function () {
		$http.get('/logout')
			.then(function (response) {
				auth.currentUser = null;
				auth.currentUserId = null;
				console.log(auth);
				$state.go('login');
			})
			.catch(function (err) {
				alert('???????');
			});
	}

	auth.getCurrentUser = function () {
		return this.currentUser;
	}

	auth.getCurrentUserId = function () {
		return this.currentUserId;
	}

	return auth;
})