'use strict';

/**
 * @ngdoc function
 * @name modFlexApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the modFlexApp
 */
angular.module('modFlexApp')
    .controller('MainCtrl'
//, ['$scope', function ($scope) {
//
//        }]
        )

    .controller('ContactsCtrl'
//, ['$scope', function ($scope) {
//        }]
    )

    .controller('HeaderCtrl', ['$scope', '$location', function ($scope, $location) {
            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };
        }])
    ;

