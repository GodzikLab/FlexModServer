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
            $scope.r = {};
            var testSeq = ">1A50:A|PDBID|CHAIN|SEQUENCE\nMERYENLFAQLNDRREGAFVPFVTLGDPGIEQSLKIIDTLIDAGADALELGVPFSDPLADGPTIQNANLRAFAAGVTPAQCFEMLALIREKHPTIPIGLLMYANLVFNNGIDAFYARCEQVGVDSVLVADVPVEESAPFRQAALRHNIAPIFICPPNADDDLLRQVASYGRGYTYLLSRSGVTGAENRGALPLHHLIEKLKEYHAAPALQGFGISSPEQVSAAVRAGAAGAISGSAIVKIIEKNLASPKQMLAELRSFVSAMKAASRA";


            var req = {
                method: 'POST',
                url: 'http://modflex/phps/mastersBySequence.php',
                data : {sequence:testSeq},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                cache: $templateCache
            };

            $http(req).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
              //  console.log(response);
                $scope.r.hits = response.data;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
//            // replace this json with server script call later
//            var result = {
//                id: 12345,
//                hits: [{
//                        "PDB": "1ujp",
//                        "chain": "A",
//                        "masterID": "1ujpA",
//                        "masterDbID": "13292",
//                        "score": "4.000e-26",
//                        "ident": 32.02,
//                        "flex": 5,
//                        "rmsd": 2.467,
//                        "size": 2,
//                        "representatives": [{
//                                "pdb": "1wxj",
//                                "chain": "A",
//                                "length": "271",
//                                "description": ">1wxj_A mol:protein length:271  tryptophan synthase alpha chain",
//                                "seqres": "MTTLEAFAKARSEGRAALIPYLTAGFPSREGFLQAVEEVLPYADLLEIGLPYSDPLGDGPVIQRASELALRKGMSVQGALELVREVRALTEKPLFLMTYLNPVLAWGPERFFGLFKQAGATGVILPDLPPDEDPGLVRLAQEIGLETVFLLAPTSTDARIATVVRHATGFVYAVSVTGVTGMRERLPEEVKDLVRRIKARTALPVAVGFGVSGKATAAQAAVADGVVVGSALVRALEEGRSLAPLLQEIRQGLQRLEANPGLKESSKKPLP",
////                                "ligands": ["3-(INDOL-3-YL)PROPYL PHOSPHATE"],
//                                img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"
//                            }, {
//                                "pdb": "1wxj",
//                                "chain": "A",
//                                "length": "271",
//                                "description": ">1wxj_A mol:protein length:271  tryptophan synthase alpha chain",
//                                "seqres": "MTTLEAFAKARSEGRAALIPYLTAGFPSREGFLQAVEEVLPYADLLEIGLPYSDPLGDGPVIQRASELALRKGMSVQGALELVREVRALTEKPLFLMTYLNPVLAWGPERFFGLFKQAGATGVILPDLPPDEDPGLVRLAQEIGLETVFLLAPTSTDARIATVVRHATGFVYAVSVTGVTGMRERLPEEVKDLVRRIKARTALPVAVGFGVSGKATAAQAAVADGVVVGSALVRALEEGRSLAPLLQEIRQGLQRLEANPGLKESSKKPLP",
//                                "ligands": ["3-(INDOL-3-YL)PROPYL PHOSPHATE"],
//                                img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"
//                            }]
//                    }, {
//                        "PDB": "1ujp",
//                        "chain": "A",
//                        "masterID": "1ujpA",
//                        "masterDbID": "13292",
//                        "score": "4.000e-26",
//                        "ident": 32.02,
//                        "flex": 5,
//                        "rmsd": 2.467,
//                        "size": 2,
//                        "representatives": [{
//                                "pdb": "1wxj",
//                                "chain": "A",
//                                "length": "271",
//                                "description": ">1wxj_A mol:protein length:271  tryptophan synthase alpha chain",
//                                "seqres": "MTTLEAFAKARSEGRAALIPYLTAGFPSREGFLQAVEEVLPYADLLEIGLPYSDPLGDGPVIQRASELALRKGMSVQGALELVREVRALTEKPLFLMTYLNPVLAWGPERFFGLFKQAGATGVILPDLPPDEDPGLVRLAQEIGLETVFLLAPTSTDARIATVVRHATGFVYAVSVTGVTGMRERLPEEVKDLVRRIKARTALPVAVGFGVSGKATAAQAAVADGVVVGSALVRALEEGRSLAPLLQEIRQGLQRLEANPGLKESSKKPLP",
//                                "ligands": ["3-(INDOL-3-YL)PROPYL PHOSPHATE"],
//                                img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"
//                            }, {
//                                "pdb": "1wxj",
//                                "chain": "A",
//                                "length": "271",
//                                "description": ">1wxj_A mol:protein length:271  tryptophan synthase alpha chain",
//                                "seqres": "MTTLEAFAKARSEGRAALIPYLTAGFPSREGFLQAVEEVLPYADLLEIGLPYSDPLGDGPVIQRASELALRKGMSVQGALELVREVRALTEKPLFLMTYLNPVLAWGPERFFGLFKQAGATGVILPDLPPDEDPGLVRLAQEIGLETVFLLAPTSTDARIATVVRHATGFVYAVSVTGVTGMRERLPEEVKDLVRRIKARTALPVAVGFGVSGKATAAQAAVADGVVVGSALVRALEEGRSLAPLLQEIRQGLQRLEANPGLKESSKKPLP",
//                                "ligands": ["3-(INDOL-3-YL)PROPYL PHOSPHATE"],
//                                img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"
//                            }]
//                    }]
//            };
//
//            $scope.r = result;


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
        }]
        )
    ;