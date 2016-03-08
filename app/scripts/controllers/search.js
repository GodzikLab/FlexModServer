'use strict';

/**
 * @ngdoc function
 * @name modFlexApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the modFlexApp
 */
angular.module('modFlexApp')
    .controller('SearchCtrl', ['$scope', '$location', '$http', '$templateCache', '$interval', '$window',
        function ($scope, $location, $http, $templateCache, $interval, $window) {
            var baseUrl = 'http://modflex.org/phps/';
            // store the interval promise for status starck
            var promise;
            // store the interval promise for status starck
            var promiseAnimation;
            // uncomment when developing UI
//            $scope.useTestFasta();
//
            $scope.pdbToMaster = [];
            // temp function go generate array of images for spinning
            var assignImageStack = function (hits) {
                for (var i in hits) {
                    var rhits = hits[i].representatives;
                    var imgs = [];
                    //{{r.pdb}}{{r.chain}}.{{hit.masterID}}.pdb.jpg
                    for (var r in rhits) {
                        imgs.push(rhits[r].pdb + rhits[r].chain + "." + hits[i].masterID + ".pdb.jpg");
                        $scope.pdbToMaster[rhits[r].pdb + rhits[r].chain] = hits[i].masterID
                    }
                    Array.prototype.push.apply(imgs, imgs);
                    for (var r = 0; r < rhits.length; r++) {
                        rhits[r].imgs = imgs.slice(r, r + rhits.length);
                    }
                }
            };
            var parseNamesFromDesc = function (hit) {
                hit.representatives.forEach(function (rep) {
                    rep.proteinNames = rep.proteinNames.trim();
                    if (!rep.proteinNames || rep.proteinNames === "") {
                        var chunks = rep.description.split(" ");
                        if (chunks.length > 3) {
                            rep.names = chunks.splice(3).join(" ").trim();
                        }
                    } else {
                        rep.names = rep.proteinNames;
                    }
                });
            };
            $scope.isActive = ($location.url() === "/search");
            $scope.sortType = 'score'; // default sort type
            $scope.sortReverse = false; // default sort order

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
                    if (ix > -1) {
                        $scope.analysisCart.splice(ix, 1);
                    }
                }
                $scope.hasSelection = $scope.analysisCart.length > 0;
            };

            $scope.clearSelection = function () {
                $scope.analysisCart.forEach(function (i) {
                    i.selected = false;
                });
                $scope.analysisCart = [];
            };

            $scope.getSelected = function () {
                return $scope.analysisCart();
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
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                };
//                console.log(req);

                $http(req).then(function successCallback(response) {
//                    console.log(response.data);
                    if (response.data.message) {
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
                    url: baseUrl + 'checkModelStatus.php?modelID=' +
                        r.jobId + '&sessionID=' + session,
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
                                r.modelingMsg = 'modeling error occured. Click to retry. ';
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
//                if (!$scope.sessionObject.sequence) {
//                    console.log("Using last query");
//                    $scope.sessionObject = $scope.lastQuery;
//                }

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
                            $scope.sessionObject.hits.forEach(parseNamesFromDesc);
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

            $scope.openPOSALink = function () {
                var url = "http://posa.godziklab.org/POSAn-cgi/POSA.pl?",
                    q = "",
                    p = "&pdbId[]=",
                    c = "&chainId[]=";
                $scope.analysisCart.forEach(function (i) {
//                    console.log(i);

                    q += p + i.pdb + c + i.chain;

                });
                q = q.substring(1);
                $window.open(url + q, '_blank');
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
                if (!r)
                    return;
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
    .controller('RMSDCtrl', ['$scope', '$location', '$http', 'd3Service', '$templateCache',
        function ($scope, $location, $http, d3Service, $templateCache) {
            $scope.heatmapData = {};
            $scope.matrixReady = true;
            $scope.selectedPair = ["Select pair for comparison"];
            $scope.selectedPairSlides = [];

            var baseUrl = 'http://modflex.org/phps/',
                session = $scope.sessionObject.sessionId;

            $scope.updateRMSD = function () {
                $scope.matrixReady = false;
                var pdbs = [];// ['1dfjI', '2z64A', '4fs7A', '4df0A'];
                $scope.analysisCart.forEach(function (i) {
                    pdbs.push(i.pdb + i.chain);
                });
                pdbs.sort();
                var pdbst = pdbs.join(",");

                var req = {
                    method: 'GET',
                    url: baseUrl + 'rmsdMatrix.php?jobID=' + session + '&pdbs=' + pdbst,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    cache: $templateCache
                };

                $scope.heatmapData.labels = pdbs;
                $scope.heatmapData.data = [];
                $scope.heatmapData.maxScore = 0;

                d3Service.d3().then(function (d3) {
                    $http(req).then(function successCallback(response) {
//                        console.log(response.data);
                        if (response.data) {
                            pdbs.forEach(function (p) {
                                $scope.heatmapData.data.push(
                                    {
                                        pdb1: p,
                                        pdb2: p,
                                        value: 0,
                                        i1: pdbs.indexOf(p) + 1,
                                        i2: pdbs.indexOf(p) + 1
                                    });

                            });
                            response.data.forEach(function (a) {
                                $scope.heatmapData.maxScore = $scope.heatmapData.maxScore < a[2]
                                    ? a[2] : $scope.heatmapData.maxScore;

                                $scope.heatmapData.data.push({
                                    pdb1: a[0],
                                    pdb2: a[1],
                                    value: a[2],
                                    i1: pdbs.indexOf(a[0]) + 1,
                                    i2: pdbs.indexOf(a[1]) + 1
                                });
                                $scope.heatmapData.data.push({
                                    pdb2: a[0],
                                    pdb1: a[1],
                                    value: a[2],
                                    i2: pdbs.indexOf(a[0]) + 1,
                                    i1: pdbs.indexOf(a[1]) + 1
                                });
                            });

//                            console.log($scope.heatmapData);
                            $scope.matrixReady = true;
                            $scope.selectedPair = ["Select pair for comparison"];
                             $scope.selectedPairSLides = [];
                        } else {
                            //set some error message
                        }

                    }, function errorCallback(response) {
//                    r.modelingStatus = 'error';
//                    r.modelingMsg = 'Error occured. ';
                    });


                });

            };

            $scope.selectPair = function (d, i) {
                $scope.$apply(function () {
                    $scope.selectedPair = [d.pdb1, d.pdb2];
                    $scope.selectedPairSlides = [
                        d.pdb1+"."+$scope.pdbToMaster[d.pdb1]+".pdb.jpg",
                        d.pdb2+"."+$scope.pdbToMaster[d.pdb2]+".pdb.jpg"];
                });
            };
        }
    ])
    ;