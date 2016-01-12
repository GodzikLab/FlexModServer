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


            // replace this json with server script call later
            var result = {
                id: 12345,
                hits: [
                    {
                        masterID: '101mA',
                        masterDbID: 24322,
                        score: 1,
                        ident: 99,
                        flex: 5,
                        rmsd: 2.467,
                        size: 3,
                        representatives: [
                            {id: 0, pdbid: '102m', active: true, img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 1, pdbid: '104m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 2, pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"}
                        ]
                    },
                    {
                        masterID: '102mA',
                        masterDbID: 24322,
                        score: 1,
                        ident: 99,
                        flex: 5,
                        rmsd: 2.467,
                        size: 10,
                        representatives: [
                            {id: 1, pdbid: '102m', active: true, img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 2, pdbid: '104m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 3, pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 4, pdbid: '102m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 5, pdbid: '104m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 6, pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 7, pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 8, pdbid: '102m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 9, pdbid: '104m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 10, pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"}
                        ]
                    },
                    {
                        masterID: '103mA',
                        masterDbID: 24322,
                        score: 1,
                        ident: 99,
                        flex: 5,
                        rmsd: 2.467,
                        size: 4,
                        representatives: [
                            {id: 1, pdbid: '102m', active: true, img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 2, pdbid: '104m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 3, pdbid: '111m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 4, pdbid: '102m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"},
                            {id: 5, pdbid: '104m', img: "http://www.rcsb.org/pdb/images/1ksr_asr_r_250.jpg"}

                        ]
                    }

                ]
            };

            $scope.r = result;
        }]
        )
    ;