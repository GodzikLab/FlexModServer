'use strict';

/**
 * @ngdoc function
 * @name modFlexApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the modFlexApp
 */
angular.module('modFlexApp')
    .controller('SearchCtrl', ['$scope', '$location', function ($scope, $location) {
            $scope.isActive = ($location.url() === "/search");
            $scope.filtLigand = false;

            // replace this json with server script call later
            var result = {
                id: 12345,
                hits: [{
                        "PDB": "1ujp",
                        "chain": "A",
                        "masterID": "1ujpA",
                        "masterDbID": "13292",
                        "score": "4.000e-26",
                        "ident": 32.02,
                        "flex": 5,
                        "rmsd": 2.467,
                        "size": 2,
                        "representatives": [{
                                "pdb": "1wxj",
                                "chain": "A",
                                "length": "271",
                                "description": ">1wxj_A mol:protein length:271  tryptophan synthase alpha chain",
                                "seqres": "MTTLEAFAKARSEGRAALIPYLTAGFPSREGFLQAVEEVLPYADLLEIGLPYSDPLGDGPVIQRASELALRKGMSVQGALELVREVRALTEKPLFLMTYLNPVLAWGPERFFGLFKQAGATGVILPDLPPDEDPGLVRLAQEIGLETVFLLAPTSTDARIATVVRHATGFVYAVSVTGVTGMRERLPEEVKDLVRRIKARTALPVAVGFGVSGKATAAQAAVADGVVVGSALVRALEEGRSLAPLLQEIRQGLQRLEANPGLKESSKKPLP",
//                                "ligands": ["3-(INDOL-3-YL)PROPYL PHOSPHATE"],
                                img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"
                            }, {
                                "pdb": "1wxj",
                                "chain": "A",
                                "length": "271",
                                "description": ">1wxj_A mol:protein length:271  tryptophan synthase alpha chain",
                                "seqres": "MTTLEAFAKARSEGRAALIPYLTAGFPSREGFLQAVEEVLPYADLLEIGLPYSDPLGDGPVIQRASELALRKGMSVQGALELVREVRALTEKPLFLMTYLNPVLAWGPERFFGLFKQAGATGVILPDLPPDEDPGLVRLAQEIGLETVFLLAPTSTDARIATVVRHATGFVYAVSVTGVTGMRERLPEEVKDLVRRIKARTALPVAVGFGVSGKATAAQAAVADGVVVGSALVRALEEGRSLAPLLQEIRQGLQRLEANPGLKESSKKPLP",
                                "ligands": ["3-(INDOL-3-YL)PROPYL PHOSPHATE"],
                                img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"
                            }]
                    }, {
                        "PDB": "1ujp",
                        "chain": "A",
                        "masterID": "1ujpA",
                        "masterDbID": "13292",
                        "score": "4.000e-26",
                        "ident": 32.02,
                        "flex": 5,
                        "rmsd": 2.467,
                        "size": 2,
                        "representatives": [{
                                "pdb": "1wxj",
                                "chain": "A",
                                "length": "271",
                                "description": ">1wxj_A mol:protein length:271  tryptophan synthase alpha chain",
                                "seqres": "MTTLEAFAKARSEGRAALIPYLTAGFPSREGFLQAVEEVLPYADLLEIGLPYSDPLGDGPVIQRASELALRKGMSVQGALELVREVRALTEKPLFLMTYLNPVLAWGPERFFGLFKQAGATGVILPDLPPDEDPGLVRLAQEIGLETVFLLAPTSTDARIATVVRHATGFVYAVSVTGVTGMRERLPEEVKDLVRRIKARTALPVAVGFGVSGKATAAQAAVADGVVVGSALVRALEEGRSLAPLLQEIRQGLQRLEANPGLKESSKKPLP",
                                "ligands": ["3-(INDOL-3-YL)PROPYL PHOSPHATE"],
                                img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"
                            }, {
                                "pdb": "1wxj",
                                "chain": "A",
                                "length": "271",
                                "description": ">1wxj_A mol:protein length:271  tryptophan synthase alpha chain",
                                "seqres": "MTTLEAFAKARSEGRAALIPYLTAGFPSREGFLQAVEEVLPYADLLEIGLPYSDPLGDGPVIQRASELALRKGMSVQGALELVREVRALTEKPLFLMTYLNPVLAWGPERFFGLFKQAGATGVILPDLPPDEDPGLVRLAQEIGLETVFLLAPTSTDARIATVVRHATGFVYAVSVTGVTGMRERLPEEVKDLVRRIKARTALPVAVGFGVSGKATAAQAAVADGVVVGSALVRALEEGRSLAPLLQEIRQGLQRLEANPGLKESSKKPLP",
                                "ligands": ["3-(INDOL-3-YL)PROPYL PHOSPHATE"],
                                img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"
                            }]
                    }]
//                    [
//                    {
//                        masterID: '101mA',
//                        masterDbID: 24322,
//                        score: 1,
//                        ident: 99,
//                        flex: 5,
//                        rmsd: 2.467,
//                        size: 3,
//                        representatives: [
//                            {pdbid: '102m', selected: true, hasLigand: true, img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '104m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"}
//                        ]
//                    },
//                    {
//                        masterID: '102mA',
//                        masterDbID: 24322,
//                        score: 1,
//                        ident: 99,
//                        flex: 5,
//                        rmsd: 2.467,
//                        size: 10,
//                        representatives: [
//                            {pdbid: '102m', hasLigand: true, img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '104m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '111m', selected: true, img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '102m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '104m', hasLigand: true, img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '102m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '104m', hasLigand: true, img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"}
//                        ]
//                    },
//                    {
//                        masterID: '103mA',
//                        masterDbID: 24322,
//                        score: 1,
//                        ident: 99,
//                        flex: 5,
//                        rmsd: 2.467,
//                        size: 4,
//                        representatives: [
//                            {pdbid: '102m', active: true, img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            {pdbid: '104m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            { pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            { pdbid: '102m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
//                            { pdbid: '104m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"}
//
//                        ]
//                    }
//
//                ]
            };

            $scope.r = result;


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