'use strict';

/**
 * @ngdoc function
 * @name modFlexApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the modFlexApp
 */
angular.module('modFlexApp')
    .controller('SearchCtrl', ['$scope', '$location', '$http', '$templateCache', '$interval',
        function ($scope, $location, $http, $templateCache, $interval) {
            var baseUrl = 'http://modflex/phps/';
            // store the interval promise for status starck
            var promise;
            // store the interval promise for status starck
            var promiseAnimation;
            // uncomment when developing UI
         //   $scope.useTestFasta();

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

            $scope.modelingRequest = function (r) {
                if (r.modelUrl) {
                    return;
                }
                r.modelingStatus = 'started';
                r.modelingMsg = 'Modeling running...';

                var req = {
                    method: 'POST',
                    url: baseUrl + 'startModel.php',
                    data: {
                        sequence: testSeq,
                        pdbID: r.pdb,
                        chainID: r.chain,
                        sessionID: session
                    },
//                    cache: $templateCache,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                };

//                console.log(req);

                $http(req).then(function successCallback(response) {
//                    console.log(response.data);
                    if (response.data.message) {
                        // r.errorMessage = response.data.message;
                        r.modelingStatus = 'error';
                        r.modelingMsg = 'Error occured: ' + response.data.message;
                    } else {
                        r.jobId = response.data.JobId;
                        promise = $interval(function () {
                            $scope.trackModelStatus(r);
                        }, 1000);
                    }
                }, function errorCallback(response) {
                    r.modelingStatus = 'error';
                    r.modelingMsg = 'Error occured. ';
                });

            };

            $scope.trackModelStatus = function (r) {
                var req = {
                    method: 'GET',
                    url: baseUrl + 'checkModelStatus.php?modelID=' + r.jobId
                        + '&sessionID=' + session,
                    //  cache: $templateCache,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                };

//                console.log(req);
                var wait = function () {
                    $http(req).then(
                        function successCallback(response) {
//                            console.log(response.data);
                            //Done, In process, failed,  Not exist.
                            if (response.data.Status === "Progress" || response.data.Status === "In process") {
//                                $interval(wait, 1000);
                            } else if (response.data.Status === "Failed") {
                                $scope.stop();
                                r.modelingStatus = 'error';
                                r.modelingMsg = 'modeling error occured. Click to retry. '
                            } else if (response.data.Status === "Done") {
                                $scope.stop();
                                r.modelUrl = response.data.url;

                                r.modelingStatus = 'done';
                                r.modelingMsg = 'Model ready. Click to download.';
                            }
                        }, function errorCallback(response) {
                        $scope.stop();
                        r.modelingStatus = 'error';
                        r.modelingMsg = 'Error occured. ';
                    });
                };

                wait();
            };

            $scope.searchRequest = function () {
//                console.log(session);
//                console.log($scope.sessionObject);

                if ($scope.sessionObject.needSearch) {
                    var req = {
                        method: 'POST',
                        url: baseUrl + 'mastersBySequence.php',
                        data: {sequence: testSeq, sessionID: session},
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        cache: $templateCache
                    };

                    $http(req).then(function successCallback(response) {
//                    console.log(response.data);

                        if (response.data.message) {
                            $scope.hasErrors = true;
                            $scope.errorMessage = response.data.message;
                        } else {
                            $scope.sessionObject.hits = response.data;
                            assignImageStack($scope.sessionObject.hits);
                            $scope.r.hits = $scope.sessionObject.hits;
                            $scope.finished = true;
                        }
                    }, function errorCallback(response) {
                        $scope.hasErrors = true;
                        $scope.errorMessage = "Error occured";
                    });
                } else {
                    //this is pre-processed object, dont reset anything and dont run new search
                    console.log("wont search again");
                    $scope.r.hits = $scope.sessionObject.hits;
                    for (var i in $scope.r.hits) {
                        var rhits = $scope.r.hits[i].representatives;
                        for (var j in rhits) {
                            if (rhits[j].selected) {
                                $scope.analysisCart.push(rhits[j]);
                            }
                        }
                    }

                    assignImageStack($scope.sessionObject.hits);
                    $scope.hasSelection = $scope.analysisCart.length > 0;
                    $scope.finished = true;
                }
            };

            $scope.searchRequest();

            // temp function go generate array of images for spinning
            var assignImageStack = function (hits) {
                for (var i in hits) {
                    var rhits = hits[i].representatives;
                    var imgs = [];
                    //{{r.pdb}}{{r.chain}}.{{hit.masterID}}.pdb.jpg
                    for (var r in rhits) {
                        imgs.push(rhits[r].pdb + rhits[r].chain + "." + hits[i].masterID + ".pdb.jpg");
                    }
                    Array.prototype.push.apply(imgs, imgs);
                    for (var r = 0; r < rhits.length; r++) {
                        rhits[r].imgs = imgs.slice(r, r + rhits.length);
                    }
                }
            };


            $scope.startAnimation = function (r) {
                var i = 0;
                r.slide = r.imgs[i];

                promiseAnimation = $interval(function () {
                    r.slide = r.imgs[i++];
                    if (i >= r.imgs.length) {
                        i = 0;
                    }
                }, 700, 0);
            };

            $scope.stopAnimation = function (r) {
                $interval.cancel(promiseAnimation);
                r.slide = r.imgs[0];
            };
            $scope.stop = function () {
                $interval.cancel(promise);
            };

            $scope.$on('$destroy', function () {
                $scope.stop();
                $scope.stopAnimation();
            });
        }]
        )
    ;