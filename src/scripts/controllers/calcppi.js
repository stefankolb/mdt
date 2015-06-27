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
 * @name mdt.controller:CalcPPICtrl
 * @description
 *
 * Controller for calculating a screen's pixels per inch (PPI). Additionally,
 * performs some other calculations, e.g. screen dimensions in inch and
 * centimeters, to display in the UI.
 *
 * @requires $scope
 * @requires mdt.service:ConvertSrv
 */
angular.module('mdt').controller('CalcPPICtrl', [ '$scope', 'ConvertSrv',
  function($scope, convertSrv) {
    
    /**
     ***************************************************************************
     * PRIVATE
     ***************************************************************************
     */
    
    /**
     * @ngdoc method
     * @name _round
     * @methodOf mdt.controller:CalcPPICtrl
     * @description
     *
     * Rounds a value to the given place value.
     *
     * @example
     * <pre>
     * 	var roundedValue = _round(12.34567, 2); // -> 12.35
     * </pre>
     * 
     * @param {Number} value The value you want to round to
     * @param {Number} placeValue The place value to round 'value' to
     * @returns {Number} The rounded number
     * @private
     */
    var _round = function(value, placeValue) {
      return parseFloat(value.toFixed(placeValue));
    };
    
    
    /**
     * @ngdoc method
     * @name _calcSurface
     * @methodOf mdt.controller:CalcPPICtrl
     * @description
     *
     * Calculates the surface area of a rectangle specified by width and 
     * height (both unitless).
     *
     * @example
     * <pre>
     * 	var surface = _calcSurface(200, 200); // -> 40000
     * </pre>
     *
     * @param {Number} width The width of a rectangle (w/o any unit)
     * @param {Number} height The height of a rectangle (w/o any unit)
     * @returns {Number} The surface area of a rectangle
     * @private
     */
    var _calcSurface = function(width, height) {
      return width * height;
    };
    
    
    /**
     * @ngdoc method
     * @name _calcDimFromPixels
     * @methodOf mdt.controller:CalcPPICtrl
     * @description
     *
     * Calculates dimensions of a rectangle in inches and centimeters based on
     * the provided width and height (in pixels) as well as the rectangle's
     * diagonal size (in inches).
     *
     * @example
     * <pre>
     * 	var widthInPixels = 1920;
     * 	var heightInPixels = 1080;
     * 	var diagonalInInch = 22;
     * 	var dim = _calcDimFromPixels(widthInPixels, heightInPixels, diagonalInInch);
     * 	console.log(dim);
     * 	
     * 	//  { 
     * 	//    widthInInch: 19.174661816740084, 
     * 	//    heightInInch: 10.785747271916296, 
     * 	//    widthInCM: 48.70364101451981, 
     * 	//    heightInCM: 27.395798070667393
     * 	//  }
     * </pre>
     *
     * @param {Number} width The width of a rectangle in pixels (w/o unit)
     * @param {Number} height The height of a rectangle in pixels (w/o unit)
     * @param {Number} diagonal The diagonal of a rectangle in inch (w/o unit)
     * @returns {Object} Object containing width and height in inch and cm
     * @private
     */
    var _calcDimFromPixels = function(width, height, diagonal) {
      var ratio = height / width;
      var ratioQ = Math.pow(ratio, 2) + 1;
      var diagonalQ = Math.pow(diagonal, 2);
      
      var widthInch = Math.sqrt(diagonalQ / ratioQ);
      var heightInch = ratio * widthInch;
      var widthCM = convertSrv.convertInchToCM(widthInch);
      var heightCM = convertSrv.convertInchToCM(heightInch);
      
      return {
        widthInch: widthInch,
        heightInch: heightInch,
        widthCM: widthCM,
        heightCM: heightCM
      };
    };
    
    
    /**
     * @ngdoc method
     * @name _calcPPI
     * @methodOf mdt.controller:CalcPPICtrl
     * @description
     *
     * Calculates the pixels per inch (PPI) within a rectangle whose
     * dimensions are provided via the 'width', 'height' and 'diagonal'
     * parameters.
     * 
     * @example
     * <pre>
     * 	var ppi = _calcPPI(1920, 1080, 22); // -> 100.13214409464992
     * </pre>
     * 
     * @param {Number} width The width of a rectangle in pixels (w/o unit)
     * @param {Number} height The height of a rectangle in pixels (w/o unit)
     * @param {Number} diagonal The diagonal of a rectangle in inch (w/o unit)
     * @returns {Number} The amount of pixels per inch
     * @private
     */
    var _calcPPI = function(width, height, diagonal) {
      var powWidth = Math.pow(width, 2);
      var powHeight = Math.pow(height, 2);
      var ppi = Math.sqrt(powWidth + powHeight) / diagonal;
      
      return ppi;
    };
    
    
    /**
     * @ngdoc method
     * @name _calcDotPitch
     * @methodOf mdt.controller:CalcPPICtrl
     * @description
     *
     * Calculates the dot pitch, i.e. the distance betweend pixels, for 
     * provided amount of PPI.
     *
     * @example
     * <pre>
     * 	var dotPitch = _calcDotPitch(100); // -> 0.254
     * </pre>
     * 
     * @param  {Number} ppi The pixels per inch to calculate dot pitch for
     * @returns {Number} The calculated dot pitch for 'ppi' parameter
     * @private
     */
    var _calcDotPitch = function(ppi) {
      return (convertSrv.UNIT_INCH * 10) / ppi;
    };
    
    
    /**
     ***************************************************************************
     * PUBLIC
     ***************************************************************************
     */
    
    /**
     * @ngdoc property
     * @name info
     * @propertyOf mdt.controller:CalcPPICtrl
     * @returns {Object} Key/Value-pairs with information to show in the UI
     */
    $scope.info = { };
    
    /**
     * @ngdoc property
     * @name resolutionHorizontal
     * @propertyOf mdt.controller:CalcPPICtrl
     * @returns {String | null} The horizontal resolution of a screen (in pixels)
     */
		$scope.resolutionHorizontal = null;
    
    /**
     * @ngdoc property
     * @name resolutionVertical
     * @propertyOf mdt.controller:CalcPPICtrl
     * @returns {String | null} The vertical resolution of a screen (in pixels)
     */
		$scope.resolutionVertical = null;
    
    /**
     * @ngdoc property
     * @name sizeDiagonal
     * @propertyOf mdt.controller:CalcPPICtrl
     * @returns {String | null} The diagonal size of a screen (in inch)
     */
		$scope.sizeDiagonal = null;
    
    
    /**
     * @ngdoc method
     * @name calc
     * @methodOf mdt.controller:CalcPPICtrl
     * @description
     *
     * Performs the actual calculation of various values to show in the UI:
     *  * width and height in both inch and centimeters
     *  * surface area of the screen
     *  * pixels per inch
     *  * dot pitch
     */
		$scope.calc = function() {
      var dim = _calcDimFromPixels($scope.resolutionHorizontal, $scope.resolutionVertical, $scope.sizeDiagonal);
      var surfaceInch = _calcSurface(dim.widthInch, dim.heightInch);
      var surfaceCM = _calcSurface(dim.widthCM, dim.heightCM);
      var ppi = _calcPPI($scope.resolutionHorizontal, $scope.resolutionVertical, $scope.sizeDiagonal);
      var dotPitch = _calcDotPitch(ppi);
      
      $scope.info = {
        'Width': _round(dim.widthInch, 2) + ' inch (' + _round(dim.widthCM, 2) + ' cm)',
        'Height': _round(dim.heightInch, 2) + ' inch (' + _round(dim.heightCM, 2) + ' cm)',
        'Surface': _round(surfaceInch, 2) + ' inch\u00B2 (' + _round(surfaceCM, 2) + ' cm\u00B2)',
        'PPI': _round(ppi, 2),
        'Dot Pitch': _round(dotPitch, 4) + ' mm'
      };
		};
    
  }
]);
