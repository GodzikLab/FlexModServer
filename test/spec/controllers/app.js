'use strict';

describe('Controller: AboutCtrl', function () {

  // load the controller's module
  beforeEach(module('modFlexApp'));

  var AppCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AppCtrl = $controller('AppCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});