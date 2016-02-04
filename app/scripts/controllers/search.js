'use strict';

/**
 * @ngdoc function
 * @name modFlexApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the modFlexApp
 */
angular.module('modFlexApp')
    .controller('SearchCtrl', ['$scope', '$location', '$http', '$templateCache',
        function ($scope, $location, $http, $templateCache) {
            $scope.isActive = ($location.url() === "/search");
            $scope.filtLigand = false;
            $scope.hasErrors = false;
            $scope.finished = false;
            $scope.r = {};
            console.log('seq:' + $scope.querySequence);
            var testSeq = $scope.querySequence;

            $scope.getSelected = function () {
                var list = [];
                for (var i in $scope.r) {
                    if (i.selected) {
                        var j = i;
                        list.push(j);
                    }
                }
                return list;
            };

            $scope.switchLigandFilter = function () {
                $scope.filtLigand = !$scope.filtLigand;
            };

            $scope.matchFilters = function () {
                return function (r) {
                    if ($scope.filtLigand) {
                        return $scope.hasLigand(r);
                    } else {
                        return r;
                    }
                };
            };

            $scope.hasLigand = function (item) {

                return (item.ligands && item.ligands.length > 0);
            };


            $scope.searchRequest = function () {
                var req = {
                    method: 'POST',
                    url: 'http://modflex/phps/mastersBySequence.php',
                    data: {sequence: testSeq},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    cache: $templateCache
                };

                $http(req).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log(response);

                    if (response.data.message) {
                        $scope.hasErrors = true;
                        $scope.errorMessage = response.data.message;
                    } else {
                        $scope.r.hits = response.data;
                        $scope.finished = true;
                    }
                }, function errorCallback(response) {
                    $scope.hasErrors = true;
                        $scope.errorMessage = "Error occured";
                });

            };


            $scope.searchRequest()

        }]
        );
//        .controller(SearchStartCtrl){
//
//        }
//    ;