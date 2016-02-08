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

            var queriesSaved = localStorageService.get('queries');

            $scope.queries = queriesSaved || [];

            $scope.$watch('queries', function () {
                localStorageService.set('queries', $scope.queries);
            }, true);

            $scope.search = function () {
                $scope.queries.push({title: $scope.titleFromSeq($scope.querySequence),
                    sequence: $scope.querySequence});
                $location.path('search');
            };

            $scope.clear = function () {
                $scope.querySequence = '';
            };

            $scope.titleFromSeq = function (seq) {
                var idx = seq.indexOf('\n');
                var title;
                if (idx >= 1) {
                    title = seq.substr(0, idx);
                } else {
                    title = seq.substr(0, 17) + '...';
                }
                return title;
            }

            $scope.useTestFasta = function () {
                $scope.querySequence = $scope.testFasta;
            };

            $scope.useQuery = function(index){
                var userObject = $scope.queries[index];
                $scope.querySequence = userObject.sequence;
                $location.path('search');

            };

            $scope.removeQuery = function (index) {
                $scope.queries.splice(index, 1);
            };
            $scope.clearRecentQueries = function () {
                $scope.queries = [];
            };
        }])
    ;

