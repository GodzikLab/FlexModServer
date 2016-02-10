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

            // uncomment when developing UI
             $scope.useTestFasta();

            $scope.isActive = ($location.url() === "/search");
            $scope.sortType = 'score'; // default sort type
            $scope.sortReverse = false;  // default sort order

            $scope.filtLigand = false;
            $scope.hasErrors = false;
            $scope.finished = false;
            $scope.r = {};
          //  $scope.r = {sequence:$scope.querySequence, title:$scope.querySequence.substring(0, 15)+'...'};
            $scope.selectedList = [];

            $scope.hasSelection = false;
            // console.log('seq:' + $scope.querySequence);
            var testSeq = $scope.querySequence,
                session = $scope.sessionObject.sessionId;

            $scope.select = function (r) {
                r.selected = !r.selected;
                if (r.selected) {
                    $scope.selectedList.push(r);
                    $scope.modellingRequest(r);
                } else {
                    var ix = $scope.selectedList.indexOf(r);
                    if (ix > -1)
                        $scope.selectedList.splice(ix, 1);
                }

                $scope.hasSelection = $scope.selectedList.length > 0;
            };

            $scope.clearSelection = function () {
                $scope.selectedList = [];
            };

            $scope.getSelected = function () {
                return $scope.selectedList();
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

            $scope.isComplex = function (item) {
                return (item.ligands && item.ligands.length > 0);
            };

            $scope.itemDescription = function(r){
                return "<b>PDBID</b>: "+r.pdb;
            }

            $scope.modellingRequest = function (r) {
                if (r.modelUrl) {
                    return;
                }

                r.modellingDone = false;
                var req = {
                    method: 'POST',
                    url: 'http://modflex/phps/startModel.php',
                    data: {sequence: testSeq,
                        pdbID: r.pdbid,
                        chainID: r.chain},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                };


                $http(req).then(function successCallback(response) {
                    r.modellingDone = true;
                    if (response.data.message) {
                        r.errorMessage = response.data.message;

                    } else {
                        r.modelUrl = response.data.modelURL;
                    }
                }, function errorCallback(response) {
                    r.errorMessage = "Error occured";
                    r.modellingDone = true;
                });

            };

            $scope.searchRequest = function () {
                console.log(session);
                console.log($scope.sessionObject);
                var req = {
                    method: 'POST',
                    url: 'http://modflex/phps/mastersBySequence.php',
                    data: {sequence: testSeq, sessionId:session},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    cache: $templateCache
                };

                $http(req).then(function successCallback(response) {
                    //console.log(response);

                    if (response.data.message) {
                        $scope.hasErrors = true;
                        $scope.errorMessage = response.data.message;
                    } else {
                        $scope.r.hits = response.data;
                        $scope.finished = true;

                       // $scope.jobs.push($scope.r);
                      //  localStorage.setItem('jobs', JSON.stringify($scope.jobs));
                    }
                }, function errorCallback(response) {
                    $scope.hasErrors = true;
                    $scope.errorMessage = "Error occured";
                });

            };


            $scope.searchRequest();

        }]
        )
//    .controller('ModellingCtrl', ['$scope', '$http',
//        function ($scope, $http) {
//
//        }
//    ]);
    ;