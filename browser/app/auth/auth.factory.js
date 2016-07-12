'use strict';

app.factory('AuthFactory', function ($http, $state) {
	var auth = { currentUser: null, currentUserId: null }

	auth.signup = function(email, password) {
		$http.post('/api/users', {email: email, password: password })
			.then(function (response) {
				auth.currentUser = response.data;
				auth.currentUserId = response.data.id;
				console.log(auth);
				$state.go('stories');
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
				console.log(auth);
				$state.go('stories');
			})
			.catch(function (err) {
				alert('BAD');
			});		
	}

	auth.logout = function () {
		$http.get('/logout')
			.then(function (response) {
				auth.currentUser = null;
				auth.currentUserId = null;
				$state.go('login');
			})
			.catch(function (err) {
				alert('???????');
			});
	}

	auth.getCurrentUser = function () {
		return this.currentUser;
	}

	return auth;
})