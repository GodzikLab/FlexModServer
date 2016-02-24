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
            var baseUrl = 'http://modflex/phps/';
            // uncomment when developing UI
//             $scope.useTestFasta();

            $scope.isActive = ($location.url() === "/search");
            $scope.sortType = 'score'; // default sort type
            $scope.sortReverse = false;  // default sort order

            $scope.filtLigand = false;
            $scope.hasErrors = false;
            $scope.finished = false;
            $scope.r = {};
            $scope.analysisCart = [];

            $scope.hasSelection = false;
            // console.log('seq:' + $scope.querySequence);
            var testSeq = $scope.querySequence,
                session = $scope.sessionObject.sessionId;

            $scope.addtocart = function (r) {
                r.selected = !r.selected;
                if (r.selected) {
                    $scope.analysisCart.push(r);
                    // $scope.modellingRequest(r);
                } else {
                    var ix = $scope.analysisCart.indexOf(r);
                    if (ix > -1)
                        $scope.analysisCart.splice(ix, 1);
                }

                $scope.hasSelection = $scope.analysisCart.length > 0;
            };

            $scope.clearSelection = function () {
                $scope.analysisCart = [];
            };

            $scope.getSelected = function () {
                return $scope.analysisCart();
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

            $scope.itemDescription = function (r) {
                return "<b>PDBID</b>: " + r.pdb;
            };

            $scope.modellingRequest = function (r) {
                if (r.modelUrl) {
                    return;
                }
                r.modellingStatus = 'started';
                r.modellingMsg = 'Modelling running...';

                var req = {
                    method: 'POST',
                    url: baseUrl + 'startModel.php',
                    data: {
                        sequence: testSeq,
                        pdbID: r.pdb,
                        chainID: r.chain,
                        sessionID: session
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                };

                console.log(req);

                $http(req).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data.message) {
                        // r.errorMessage = response.data.message;
                        r.modellingStatus = 'error';
                        r.modellingMsg = 'Error occured: ' + response.data.message;
                    } else {
                        r.jobId = response.data.JobId;
                        $scope.trackModelStatus(r);
                    }
                }, function errorCallback(response) {
                    r.modellingStatus = 'error';
                    r.modellingMsg = 'Error occured. ';
                });

            };

            $scope.trackModelStatus = function (r) {
                var req = {
                    method: 'GET',
                    url: baseUrl + 'checkModelStatus.php',
                    data: {
                        modelID: r.jobId,
                        sessionID: session
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                };

                console.log(req);
                var wait = function () {
                    $http(req).then(
                        function successCallback(response) {
                            console.log(response.data);
                            //Done, In process, failed,  Not exist.
                            if (response.data.Status === "Progress") {
                                setTimeout(wait, 1000);
                            } else if (response.data.Status === "Failed") {
                                r.modellingStatus = 'error';
                                r.modellingMsg = 'Modelling error occured. Click to retry. '
                            } else if (response.data.Status === "Done") {

                                r.modelUrl = response.data.modelURL;

                                r.modellingStatus = 'done';
                                r.modellingMsg = 'Model ready. Click to download.';
                            }
                        }, function errorCallback(response) {
                        console.log(response);
                        r.modellingStatus = 'error';
                        r.modellingMsg = 'Error occured. ';
                    });
                };
                wait();

            };


            $scope.searchRequest = function () {
//                console.log(session);
//                console.log($scope.sessionObject);
                var req = {
                    method: 'POST',
                    url: baseUrl + 'mastersBySequence.php',
                    data: {sequence: testSeq, sessionId: session},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    cache: $templateCache
                };

                $http(req).then(function successCallback(response) {
                    console.log(response.data);

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

            $scope.searchRequest();

        }]
        )
    ;