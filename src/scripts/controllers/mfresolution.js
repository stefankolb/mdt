/**
 * =============================================================================
 * MobileDevelopmentToolkit
 *
 * (c) Copyright 2015 Stefan Kolb <dev@stefankolb.de>
 * =============================================================================
 */

'use strict';

/**
 * @ngdoc controller
 * @name mdt.controller:MFResolutionCtrl
 * @description
 *
 * Controller for the `resolution` media feature.
 *
 * @requires $scope
 */
angular.module('mdt').controller('MFResolutionCtrl', [ '$scope',
  function($scope) {

    /**
     ***************************************************************************
     * PRIVATE
     ***************************************************************************
     */


    /**
     ***************************************************************************
     * PUBLIC
     ***************************************************************************
     */
    
    /**
     * @ngdoc property
     * @name resolutions
     * @propertyOf mdt.controller:MFResolutionCtrl
     * @returns {Array} List of all resolutions that should be checked
     */
    $scope.resolutions = [];
    
    // Fill resolutions
    for (var i = 72, ii = 300; i <= ii; i++) {
      $scope.resolutions.push(i);
    }
    
  }
]);
