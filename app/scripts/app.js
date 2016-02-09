'use strict';

/**
 * @ngdoc overview
 * @name modFlexApp
 * @description
 * # modFlexApp
 *
 * Main module of the application.
 */
angular
    .module('modFlexApp', [
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',
        'LocalStorageModule'
    ])
    .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
            localStorageServiceProvider.setPrefix('ls');
        }])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'ContactsCtrl',
                controllerAs: 'main'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .when('/search', {
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
