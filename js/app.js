angular.module('myApp', ['ui.router'])

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    
    /**********/
    /** CORS **/
    /**********/

    $httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;
    //$httpProvider.defaults.headers.common["X-Requested-With"];
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    $httpProvider.defaults.headers.common['Authorization'] = 'Basic'
    
    /************/
    /** routes **/
    /************/

    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('login', {
        url: '/',
        views: {
          'main': {
            controller: 'LoginCtrl',
            templateUrl: 'partials/login.tmpl.html',
          },
        },
      })
      .state('projects', {
        url: '/projects',
        views: {
          'main': {
            controller: 'ProjectsCtrl',
            templateUrl: 'partials/projects.tmpl.html'
          }
        },
        /*
        resolve: {
          projects: function ($rootScope) {
            $http.get('http://127.0.0.1:5000/projects')
              .success(function (result) {
                console.log('success: projects', result.projects);
                return result;
              })
              .error(function (result) {
                console.log("Error: " + result);
              });
          }
        }
        */
      })
  })

  .service('AuthService', function ($http, $rootScope, $state) {
    return {
      /**
       * Encodes username:password as base64 and 
       * constructs the Authorization header
       *
       * @param {object} credentials - username, password 
       */
      encodeAuthHeader: function (credentials) {
        if (!('username' in credentials && 'password' in credentials)) {
          throw new Error('The credentials object must contain a valid username and password.')
        }
        var encoded = btoa(credentials.username + ':' + credentials.password);
        $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
      },
      login: function (credentials) {
        this.encodeAuthHeader(credentials);
        
        return $http
          .get('http://127.0.0.1:5000/login')
          .success(function (result) {
            // go to projects state
            console.log('done');
            $state.go('projects');
          })
          .error(function (result) {
            console.log("Error: " + result);
        });
      },
      logout: function () {
        // for the element just go to logout url,
        // rest should be handled in the route
        $state.go('logout');
      },
    }
  })

  .controller('LoginCtrl', function ($rootScope, AuthService) {
    this.login = function (credentials) {
      AuthService.login(credentials);
    };
  })

  .controller('ProjectsCtrl', function ($rootScope, $scope, $http) {
    var self = this;
    this.getProjects = function () {
      return $http
        .get('http://127.0.0.1:5000/projects')
        .success(function (result) {
          console.log('success: projects', result.projects);
          return result;
        })
        .error(function (result) {
          console.log("Error: " + result);
        });
    };
    this.getProjects().then( function (result) {
      self.projects = JSON.parse(result.data.projects);
    });
  })

