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
    .controller('AppCtrl', ['$scope', '$location', function ($scope, $location) {
            // controller for the whole app
            // include getting list of jobs from local storage/db later
            $scope.querySequence = '';
            $scope.testFasta = ">1A50:A|PDBID|CHAIN|SEQUENCE\nMERYENLFAQLNDRREGAFVPFVTLGDPGIEQSLKIIDTLIDAGADALELGVPFSDPLADGPTIQNANLRAFAAGVTPAQCFEMLALIREKHPTIPIGLLMYANLVFNNGIDAFYARCEQVGVDSVLVADVPVEESAPFRQAALRHNIAPIFICPPNADDDLLRQVASYGRGYTYLLSRSGVTGAENRGALPLHHLIEKLKEYHAAPALQGFGISSPEQVSAAVRAGAAGAISGSAIVKIIEKNLASPKQMLAELRSFVSAMKAASRA";


            $scope.search = function () {
                $location.path('search');
            };

            $scope.useTestFasta = function () {
                $scope.querySequence = $scope.testFasta;
            };
        }])
    ;

