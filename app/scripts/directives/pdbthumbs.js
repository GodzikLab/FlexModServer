(function () {
    'use strict';
    angular.module('modFlexApp.directives')
        .directive('pdbthumbs', ['$interval', function ($interval) {
                return {
                    restrict: 'EA',
                    scope: {
                        slides: "=",
                        interval: "="
                    },
                    template: '<img ng-src="http://modflex.org/thumbnails/{{currentSlide}}" ' +
                        'style="margin:auto;" '+//ng-mouseenter="startAnimation()" ng-mouseleave="stopAnimation()" ' +
                        'class="img-responsive img-representative-tmb">',
                    link: function (scope, iElement, iAttrs) {
                        // store the interval promise for status starck
                        var promiseAnimation;
                        scope.currentSlide = scope.slides[0];

// watch for data changes and re-render
                        scope.$watch('slides', function (newVals, oldVals) {
                            scope.slides = newVals;
                            scope.currentSlide = scope.slides[0];
                            //   return scope.startAnimation(newVals);
                        }, true);

                        iElement.bind('mouseenter', function (e) {
                            scope.startAnimation();
                        });
                        iElement.bind('mouseleave', function (e) {
                            scope.stopAnimation()
                        });


                        scope.startAnimation = function () {
                            if (scope.slides.length < 2) {
                                return;
                            }
                            var i = 0;
//                            scope.slides = newslides;
                            scope.currentSlide = scope.slides[i];
                            promiseAnimation = $interval(function () {
                                scope.currentSlide = scope.slides[i++];
                                if (i >= scope.slides.length) {
                                    i = 0;
                                }
                            }, 700, 0);
                        };

                        scope.stopAnimation = function (r) {
                            $interval.cancel(promiseAnimation);
                            scope.currentSlide = scope.slides[0];
                        };
                    }
                };
            }]);
}());
