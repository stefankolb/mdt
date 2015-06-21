/**
 * =============================================================================
 * MobileDevelopmentTools
 *
 * (c) Copyright 2015 Stefan Kolb <dev@stefankolb.de>
 * =============================================================================
 */

'use strict';

/**
 * @ngdoc controller
 * @name mdt.controller:MQResolutionCtrl
 * @description
 *
 * Controller for identifying resolution media queries.
 *
 * @requires $scope
 */
angular.module('mdt').controller('MQResolutionCtrl', [ '$scope',
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
     * @propertyOf mdt.controller:MQResolutionCtrl
     * @returns {Array} List of all resolutions that should be checked
     */
    $scope.resolutions = [];
    
    // Fill resolutions
    for (var i = 72, ii = 300; i <= ii; i++) {
      $scope.resolutions.push(i);
    }
    
  }
]);
