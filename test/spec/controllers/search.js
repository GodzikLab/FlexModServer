'use strict';

describe('Controller: SearchCtrl', function () {

  // load the controller's module
  beforeEach(module('modFlexApp'));

  var SearchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location, $http, $templateCache, $interval) {
    scope = $rootScope.$new();
    SearchCtrl = $controller('SearchCtrl', {
      $scope: scope,
      $location:$location,
      $http:$http,
      $templateCache:$templateCache,
      $interval:$interval
    });
  }));


});
