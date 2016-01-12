'use strict';

/**
 * @ngdoc function
 * @name modFlexApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the modFlexApp
 */
angular.module('modFlexApp')
    .controller('AboutCtrl', ['$scope', '$location', function ($scope, $location) {
            $scope.isActive = ($location.url() === "/about");
        }]);