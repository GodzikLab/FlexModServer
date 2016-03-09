'use strict';

/**
 * @ngdoc function
 * @name modFlexApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the modFlexApp
 */
angular.module('modFlexApp')
    .controller('MainCtrl', ['$scope', function ($scope) {

        }])
    .controller('ContactsCtrl', ['$scope', function ($scope) {

        }])
    .controller('HeaderCtrl', ['$scope', '$location', function ($scope, $location) {
            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };
        }])
    .controller('AppCtrl', ['$scope', '$location', 'localStorageService',
        function ($scope, $location, localStorageService) {
            // controller for the whole app
            // include getting list of jobs from local storage/db later
            $scope.querySequence = '';
            $scope.testFasta = ">1A50:A|PDBID|CHAIN|SEQUENCE\nMERYENLFAQLNDRREGAFVPFVTLGDPGIEQSLKIIDTLIDAGADALELGVPFSDPLADGPTIQNANLRAFAAGVTPAQCFEMLALIREKHPTIPIGLLMYANLVFNNGIDAFYARCEQVGVDSVLVADVPVEESAPFRQAALRHNIAPIFICPPNADDDLLRQVASYGRGYTYLLSRSGVTGAENRGALPLHHLIEKLKEYHAAPALQGFGISSPEQVSAAVRAGAAGAISGSAIVKIIEKNLASPKQMLAELRSFVSAMKAASRA";
            $scope.sessionObject = {};

            var lastQuery = localStorageService.get('lastQuery') || {};
            var queriesSaved = localStorageService.get('queries');

            $scope.lastQuery = lastQuery || {};
            $scope.queries = queriesSaved || [];

            $scope.$watch('queries', function () {
                localStorageService.set('queries', $scope.queries);
            }, true);

            $scope.$watch('sessionObject', function () {
                if ($scope.sessionObject.sequence) {
                    localStorageService.set('lastQuery', $scope.sessionObject);
                }
            }, true);

            $scope.search = function () {
                var duplicate = checkDuplicates($scope.querySequence, $scope.queries);
                if (!duplicate) {
                    var sessionId = $scope.generateSessionId();

                    $scope.sessionObject = {
                        title: $scope.titleFromSeq($scope.querySequence),
                        sequence: $scope.querySequence,
                        sessionId: sessionId,
                        needSearch: true
                    };
                    $scope.queries.push($scope.sessionObject);

                } else {
                    $scope.sessionObject = duplicate;
                }
                $scope.lastQuery = $scope.sessionObject;
                $location.path('search');
            };

            $scope.clear = function () {
                $scope.querySequence = '';
            };

            $scope.titleFromSeq = function (seq) {
                var idx = seq.indexOf('\n');

                if (idx >= 1) {
                    return seq.substr(0, idx);
                } else {
                    return seq.substr(0, 17) + '...';
                }
            };

            $scope.useTestFasta = function () {
                $scope.querySequence = $scope.testFasta;
                $scope.sessionObject = {
                    title: $scope.titleFromSeq($scope.querySequence),
                    sequence: $scope.querySequence,
                    sessionId: 'testFastaSessionId',
                    needSearch: true
                };
                $scope.lastQuery = $scope.sessionObject;
            };

            $scope.useQuery = function (index) {
                $scope.sessionObject = $scope.queries[index];
                $scope.sessionObject.needSearch = false;
                $scope.querySequence = $scope.sessionObject.sequence;
                $scope.lastQuery = $scope.sessionObject;
                $location.path('search');
            };

            $scope.removeQuery = function (index) {
                $scope.queries.splice(index, 1);
            };

            $scope.clearRecentQueries = function () {
                $scope.queries = [];
            };

            $scope.generateSessionId = function () {
                return "" + Math.floor(Date.now() / 1000) + Math.floor((Math.random() * 100) + 1);
            };

            var checkDuplicates = function (seq, data) {
                for (var i in data) {
                    var so = data[i];
                    if (so.sequence === seq) {
                        console.log("Sequnces already used, returning it.");

                        return so;
                    }
                }
                return null;
            };
        }])
    ;

