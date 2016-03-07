(function () {
    'use strict';
    angular.module('modFlexApp.directives')
        .directive('d3Heatmap', ['d3Service', function (d3Service) {
                return {
                    restrict: 'EA',
                    scope: {
                        data: "="
                    },
                    link: function (scope, iElement, iAttrs) {
                        d3Service.d3().then(function (d3) {
                            var svg = d3.select(iElement[0])
                                .append("svg")
                                .attr("width", "100%")
                                .attr("height", "150px");
                            // on window resize, re-render d3 canvas
                            window.onresize = function () {
                                return scope.$apply();
                            };
                            scope.$watch(function () {
                                return angular.element(window)[0].innerWidth;
                            }, function () {
                                return scope.render(scope.data);
                            }
                            );
                            // watch for data changes and re-render
                            scope.$watch('data', function (newVals, oldVals) {
                                return scope.render(newVals);
                            }, true);

                            // define render function
                            scope.render = function (newdata) {
                                if (!newdata || !newdata.data || newdata.data.length === 0) {
                                    return;
                                }

                                svg.selectAll("*").remove();

                                var margin = {top: 25, right: 25, bottom: 15, left: 25},
                                gridMin = 40, gridMax = 100,
                                    width = 430 - margin.left - margin.right,
                                    gridSize = Math.min(gridMax, Math.max(gridMin, Math.floor(width / (newdata.labels.length + 2)))),
                                    height = gridSize * (newdata.labels.length + 1) - margin.top - margin.bottom,
                                    width = height;

                                var svgview = svg.attr("width", width + margin.left + margin.right)
                                    .attr("height", height + margin.top + margin.bottom)
                                    .append("g")
                                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                                var gLabels = svgview.append("g");
                                var yLabels = gLabels.selectAll(".yLabel")
                                    .data(newdata.labels)
                                    .enter().append("text")
                                    .text(function (d) {
                                        return d;
                                    })
                                    .attr("x", 0)
                                    .attr("y", function (d, i) {
                                        return i * gridSize;
                                    })
                                    .style("text-anchor", "end")
                                    .attr("transform", "translate(6," + gridSize / 1.5 + ")")
                                    .attr("class", function (d, i) {
                                        return  "mono axis";
                                    })
                                    ;
                                var xLabels = gLabels.selectAll(".xLabel")
                                    .data(newdata.labels)
                                    .enter().append("text")
                                    .text(function (d) {
                                        return d;
                                    })
                                    .attr("x", function (d, i) {
                                        return i * gridSize;
                                    })
                                    .attr("y", 0)
                                    .style("text-anchor", "left")
                                    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                                    .attr("class", function (d, i) {
                                        return  "mono axis";
                                    });

                                var colorScale = d3.scale.linear()
                                    .domain([0, 0.0001, newdata.maxScore / 3, newdata.maxScore / 1.5, newdata.maxScore*0.9])
                                    .range(['white', 'green', 'yellow', 'orange', 'red']);

                                var gCards = svgview.append("g");

                                var cards = gCards.selectAll(".card")
                                    .data(newdata.data, function (d) {
                                        return d.pdb1 + ':' + d.pdb2;
                                    });

                                cards.append("title");
                                cards.enter().append("rect")
                                    .attr("x", function (d) {
                                        return (d.i2 - 1) * gridSize;
                                    })
                                    .attr("y", function (d) {
                                        return (d.i1 - 1) * gridSize;
                                    })
                                    .attr("rx", 4)
                                    .attr("ry", 4)
                                    .attr("class", "card bordered")
                                    .attr("width", gridSize)
                                    .attr("height", gridSize)
                                    .style("fill", 'white').attr("transform", "translate(10,0)");

                                cards.transition().duration(1000)
                                    .style("fill", function (d) {
                                        return colorScale(d.value);
                                    });

                                cards.select("title").text(function (d) {
                                    return d.value;
                                });

                                var dLabels = svgview.append("g");
                                var dataLabels = dLabels.selectAll(".dataLabel")
                                    .data(newdata.data, function (d) {
                                         return d.pdb1 + ':' + d.pdb2;
                                    });

                                dataLabels.enter().append("text")
                                    .text(function (d) {
                                        return d.value.toFixed(1);
                                    })
                                    .attr("x", function (d) {
                                        return (d.i2 - .5) * gridSize;
                                    })
                                    .attr("y", function (d) {
                                        return (d.i1 - .5) * gridSize;
                                    })
                                    .style("text-anchor", "left")
                                    .attr("class", function (d, i) {
                                        return  "mono cardvalues";
                                    });

                                cards.exit().remove();
                            };
                        });
                    }
                };
            }]);
}());