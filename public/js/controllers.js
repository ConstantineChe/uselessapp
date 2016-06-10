'use strict';

/* Controllers */

function AppCtrl($scope, $http, $rootScope, $location) {
    $http({method: 'GET', url: '/api/user'}).
        success(function(data, status, headers, config) {
            $scope.name = data.name;
            $rootScope.$emit('ChangeUser', data);
        }).
        error(function(data, status, headers, config) {
            $scope.name = 'Error!'
        });
    $rootScope.$on('ChangeUser', function(ev, user){
        $scope.name = user.name;
        $rootScope.user = user;
        if (user) {
            $rootScope.authenticated = true;
        } else {
            $rootScope.authenticated = false;
        }
    });
    $rootScope.logout = function() {
        $http.get('/logout').then(function(res) {
            $rootScope.$emit('ChangeUser', false);
        });
        $location.path('/');
    };
}

function NavCtrl($scope, $http, $rootScope, $location) {
     $rootScope.$on('ChangeUser', function(ev, user) {
         if (user) {
             $scope.authenticated = true;
         } else {
             $scope.authenticated = false;
         }
     });
}


function BoardCtrl($log, $scope, $http, chatSocket, $rootScope) {
    $http({method: 'GET', url: '/api/board'}).
        success(function(data, status, headers, config) {
            console.log(data);
            var threads = data.map(function(thread) {
                var lastPosts = thread.posts.slice(Math.max(thread.posts.length - 5, 0));
                thread.posts = lastPosts;
                return thread;
            });
            $scope.threads = threads;
        });
    $scope.messageLog = 'Ready to chat!';
    $scope.publish = function() {
        $log.debug('sending message', $scope.post.text);
        chatSocket.emit('thread', $rootScope.user, {
            text: $scope.post.text,
            title: $scope.post.title
        });
        $log.debug('message sent', $scope.post.text);
    };
    $scope.$on('socket:broadcastBoard', function(event, data) {
        $log.debug('got a message', event.name);
        if (!data.payload) {
            $log.error('invalid message', 'event', event,
                       'data', JSON.stringify(data));
            return;
        }
        if ($scope.threads && data.payload == $scope.threads[$scope.threads.length -1]) {
            return;
        }
        $scope.$apply(function() {
            console.log(data.payload);
            if (!$scope.threads) {
                $scope.threads = [];
            }
            $scope.threads.push(data.payload);
        });
    });
}

function ThreadCtrl($scope, $http, $location, $rootScope, $routeParams, chatSocket) {
    var id = $routeParams.id;
    $http({method: 'GET', url: '/api/thread?id=' + id}).
        success(function(data, status, headers, config) {
            console.log(data);
            $scope.thread = data;
        });
    $scope.publish = function() {
        chatSocket.emit('post', $rootScope.user, {
            post: {
                text: $scope.post.text,
                title: $scope.post.title
            },
            threadId: id
        });
    };
    $scope.$on('socket:broadcastThread', function(event, data) {
        console.log('got thread');
        if (data.threadId != id) {
            return;
        }
        if ($scope.posts && data.payload == $scope.posts[$scope.posts.length -1]) {
            return;
        }
        $scope.$apply(function() {
            console.log(data.payload);
            if (!$scope.posts) {
                $scope.posts = [];
            }
            $scope.thread.posts.push(data.payload);
        });
    });

}


function LoginCtrl($scope, $http, $location, $rootScope) {
    $scope.login = function() {
        $http.post('/login', $scope.user).
            success(function(data) {
                $scope.name = data.name;
                $rootScope.$emit('ChangeUser', data);
                $location.path('/');
            });
    };
}


function LogoutCtrl($rootScope, $location, $http) {
    $http.get('/logout').then(function(res) {
        $rootScope.$emit('ChangeUser', false);
    });
    $location.path('/');
}
LogoutCtrl.$inject = [];

function SignupCtrl($scope, $http, $location)
{
    $scope.signup = function() {
        $http.post('/signup', $scope.user).
            success(function(data) {
                $location.path('/');
            });
    };
}
