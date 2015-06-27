/**
 * =============================================================================
 * MobileDevelopmentToolkit
 *
 * (c) Copyright 2015 Stefan Kolb <dev@stefankolb.de>
 * =============================================================================
 */

'use strict';

/**
 * @ngdoc overview
 * @name mdt
 * @description
 *
 * # Mobile Development Toolkit (MDT)
 *
 * Set of tools to aid development of web sites and web apps for mobile devices.
 *
 * @requires ui.router
 * @requires templates
 */

var app = angular.module('mdt', [ 'ui.router', 'templates' ]);

// Configure mdt module
app.config([ '$stateProvider', '$locationProvider', '$urlRouterProvider',
  function($stateProvider, $locationProvider, $urlRouterProvider) {
    // Route to default state for unknown states
    $urlRouterProvider.otherwise('/');
    
    // Configure location provider
    $locationProvider.hashPrefix("!");
    
    // Register application states
    $stateProvider.state('/', {
      url: '/',
      templateUrl: 'partials/start.tpl.html'
    });
    $stateProvider.state('mfdevicepixelratio', {
      url: '/mfdevicepixelratio',
      templateUrl: 'partials/mfdevicepixelratio.tpl.html'
    });
    $stateProvider.state('mforientation', {
      url: '/mforientation',
      templateUrl: 'partials/mforientation.tpl.html'
    });
    $stateProvider.state('mfresolution', {
      url: '/mfresolution',
      templateUrl: 'partials/mfresolution.tpl.html'
    });
    $stateProvider.state('mfwidthheight', {
      url: '/mfwidthheight',
      templateUrl: 'partials/mfwidthheight.tpl.html'
    });
    $stateProvider.state('calcppi', {
      url: '/calcppi',
      templateUrl: 'partials/calcppi.tpl.html'
    });
  }
]);

app.controller('RootCtrl', [ 
  function() {
    
  }
]);

// http://stackoverflow.com/a/18249428/3917816
app.directive('parseStyle', function($interpolate) {
    return function(scope, elem) {
        var exp = $interpolate(elem.html()),
            watchFunc = function () { return exp(scope); };

        scope.$watch(watchFunc, function (html) {
            elem.html(html);
        });
    };
});

/**
 * =============================================================================
 * MobileDevelopmentToolkit
 *
 * (c) Copyright 2015 Stefan Kolb <dev@stefankolb.de>
 * =============================================================================
 */

'use strict';

/**
 * @ngdoc service
 * @name mdt.service:ConvertSrv
 * @description
 *
 * Provides methods to convert units into other units.
 */

angular.module('mdt').factory('ConvertSrv', [
	function() {

		/**
		 ***************************************************************************
		 * PRIVATE
		 ***************************************************************************
		 */

		/**
		 * @ngdoc property
		 * @name _UNIT_INCH
		 * @propertyOf mdt.service:ConvertSrv
		 * @description
		 *
		 * The factor to convert centimeters to inch and vice versa
		 * 
		 * @returns {Number} 2.54
		 * @private
		 */
		var _UNIT_INCH = 2.54;


		/**
		 * @ngdoc method
		 * @name _convertCMToInch
		 * @methodOf mdt.service:ConvertSrv
		 * @description
		 *
		 * Converts values in centimeters (cm) to inch (in).
		 *
		 * @param {Number} value A value in centimeters to convert to inch
		 * @returns {Number} The 'value' param converted to inch
		 * @private
		 */
		var _convertCMToInch = function(value) {
			return value / _UNIT_INCH;
		};


		/**
		 * @ngdoc method
		 * @name _convertInchToCM
		 * @methodOf mdt.service:ConvertSrv
		 * @description
		 *
		 * Converts values in inch (in) to centimeters (cm).
		 *
		 * @param {Number} value A value in inch to convert to centimeters
		 * @returns {Number} The 'value' param converted to centimeters
		 * @private
		 */
		var _convertInchToCM = function(value) {
			return value * _UNIT_INCH;
		};


		/**
		 *****************************************************************************
		 * PUBLIC
		 *****************************************************************************
		 */

		return {

			/**
			 * @ngdoc property
			 * @name UNIT_INCH
			 * @propertyOf mdt.service:ConvertSrv
			 * @description
			 *
			 * Public representation of 
			 * {@link mdt.service:ConvertSrv#properties__unit_inch _UNIT_INCH} 
			 */
			UNIT_INCH: _UNIT_INCH,

			/**
			 * @ngdoc method
			 * @name convertCMToInch
			 * @methodOf mdt.service:ConvertSrv
			 * @description
			 *
			 * Public representation of 
			 * {@link mdt.service:ConvertSrv#methods__convertcmtoinch _convertCMToInch} 
			 */
			convertCMToInch: _convertCMToInch,

			/**
			 * @ngdoc method
			 * @name convertInchToCM
			 * @methodOf mdt.service:ConvertSrv
			 * @description
			 *
			 * Public representation of 
			 * {@link mdt.service:ConvertSrv#methods__convertinchtocm _convertInchToCM} 
			 */
			convertInchToCM: _convertInchToCM

		};
	}
]);
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
 * @name mdt.controller:MFDevicePixelRatioCtrl
 * @description
 *
 * Controller for the `device-pixel-ratio` media feature.
 *
 * @requires $scope
 */
angular.module('mdt').controller('MFDevicePixelRatioCtrl', [ 
  function() {
		
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
		
	}	
]);

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
 * @name mdt.controller:MFOrientationCtrl
 * @description
 *
 * Controller for the `orientation` media feature.
 *
 * @requires $scope
 */
angular.module('mdt').controller('MFOrientationCtrl', [ 
  function() {
		
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
		
	}	
]);

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
 * @name mdt.controller:MFWidthHeightCtrl
 * @description
 *
 * Controller for the `(device-)width/height` media feature.
 *
 * @requires $scope
 */
angular.module('mdt').controller('MFWidthHeightCtrl', [
  function() {

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
    
    
  }
]);

angular.module('templates', []).run(['$templateCache', function($templateCache) {
  "use strict";
  $templateCache.put("partials/calcppi.tpl.html",
    "<!DOCTYPE html>\n" +
    "<div class=\"container-fluid\" ng-controller=\"CalcPPICtrl\">\n" +
    "	\n" +
    "	<ol class=\"breadcrumb\">\n" +
    "		<li><a ui-sref=\"/\">Start</a></li>\n" +
    "		<li class=\"active\">Calculate PPI</li>\n" +
    "	</ol>\n" +
    "	\n" +
    "	<h1>Calculate PPI</h1>\n" +
    "	\n" +
    "	<p class=\"lead\">\n" +
    "		This tool lets you calculate a device screen's pixels per inch (PPI) based \n" +
    "		on the horizontal and vertical resolution in pixels as well as the screen's\n" +
    "		diagonal size in inch.\n" +
    "	</p>\n" +
    "	\n" +
    "	<div class=\"container-fluid row\">\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<h3>Screen Info</h3>\n" +
    "			<br />\n" +
    "			<form ng-submit=\"calc()\">\n" +
    "				<div class=\"form-group form-group-sm row\">\n" +
    "					<label class=\"col-sm-12 control-label\" for=\"screenWidth\">Horizontal Resolution (px)</label>\n" +
    "					<div class=\"col-sm-4\">\n" +
    "						<input id=\"screenWidth\" type=\"number\" class=\"form-control\" ng-model=\"resolutionHorizontal\" placeholder=\"0\" required />\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				<div class=\"form-group form-group-sm row\">\n" +
    "					<label class=\"col-sm-12 control-label\" for=\"screenHeight\">Vertical Resolution (px)</label>\n" +
    "					<div class=\"col-sm-4\">\n" +
    "						<input id=\"screenHeight\" type=\"number\" class=\"form-control\" ng-model=\"resolutionVertical\" placeholder=\"0\" required />\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				<div class=\"form-group form-group-sm row\">\n" +
    "					<label class=\"col-sm-12 control-label\" for=\"sizeDiagonal\">Diagonal Size (inch)</label>\n" +
    "					<div class=\"col-sm-4\">\n" +
    "						<input id=\"sizeDiagonal\" type=\"number\" class=\"form-control\" ng-model=\"sizeDiagonal\" placeholder=\"0\" required />\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				<button type=\"submit\" class=\"btn btn-primary\">Calculate</button>\n" +
    "			</form>\n" +
    "		</div>\n" +
    "		\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<h3>Result</h3>\n" +
    "			<table class=\"table table-striped\">\n" +
    "				<thead>\n" +
    "					<tr>\n" +
    "						<th>Info</th>\n" +
    "						<th>Value</th>\n" +
    "					</tr>\n" +
    "				</thead>\n" +
    "				<tbody>\n" +
    "					<tr ng-repeat=\"(key, value) in info\">\n" +
    "						<td>{{ key }}</td>\n" +
    "						<td>{{ value }}</td>\n" +
    "					</tr>\n" +
    "				</tbody>\n" +
    "			</table>\n" +
    "		</div>\n" +
    "		\n" +
    "	</div>\n" +
    "	\n" +
    "</div>");
  $templateCache.put("partials/mfdevicepixelratio.tpl.html",
    "<!DOCTYPE html>\n" +
    "<div class=\"container-fluid\" ng-controller=\"MFDevicePixelRatioCtrl\">\n" +
    "	\n" +
    "	<ol class=\"breadcrumb\">\n" +
    "		<li><a ui-sref=\"/\">Start</a></li>\n" +
    "		<li class=\"active\">Media Feature - device-pixel-ratio</li>\n" +
    "	</ol>\n" +
    "	\n" +
    "	<h1>Media Feature - device-pixel-ratio</h1>\n" +
    "	\n" +
    "	<p class=\"lead\">\n" +
    "		This tools helps you see whether or not the device supports the \n" +
    "		<code>device-pixel-ratio</code> media feature.\n" +
    "	</p>\n" +
    "	\n" +
    "	<div class=\"container-fluid\">\n" +
    "		<div class=\"panel panel-default\">\n" +
    "			<div class=\"panel-heading\"><code>device-pixel-ratio</code></div>\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"tool-mf-dpr-container\">\n" +
    "					<button class=\"btn btn-lg btn-block btn-danger mf-dpr-default\">not supported</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-10\">1.0</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-11\">1.1</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-12\">1.2</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-13\">1.3</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-14\">1.4</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-15\">1.5</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-16\">1.6</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-17\">1.7</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-18\">1.8</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-19\">1.9</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-20\">2.0</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-21\">2.1</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-22\">2.2</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-23\">2.3</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-24\">2.4</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-25\">2.5</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-26\">2.6</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-27\">2.7</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-28\">2.8</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-29\">2.9</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-30\">3.0</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"panel panel-default\">\n" +
    "			<div class=\"panel-heading\">Prefixed for WebKit (<code>-webkit-min-device-pixel-ratio</code>)</div>\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"tool-mf-dpr-container\">\n" +
    "					<button class=\"btn btn-lg btn-block btn-danger mf-dpr-default\">not supported</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-10\">1.0</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-11\">1.1</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-12\">1.2</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-13\">1.3</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-14\">1.4</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-15\">1.5</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-16\">1.6</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-17\">1.7</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-18\">1.8</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-19\">1.9</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-20\">2.0</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-21\">2.1</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-22\">2.2</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-23\">2.3</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-24\">2.4</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-25\">2.5</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-26\">2.6</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-27\">2.7</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-28\">2.8</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-29\">2.9</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-webkit-30\">3.0</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"panel panel-default\">\n" +
    "			<div class=\"panel-heading\">Prefixed for Opera (<code>-o-min-device-pixel-ratio</code>)</div>\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"tool-mf-dpr-container\">\n" +
    "					<button class=\"btn btn-lg btn-block btn-danger mf-dpr-default\">not supported</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-10\">1.0</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-11\">1.1</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-12\">1.2</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-13\">1.3</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-14\">1.4</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-15\">1.5</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-16\">1.6</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-17\">1.7</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-18\">1.8</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-19\">1.9</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-20\">2.0</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-21\">2.1</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-22\">2.2</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-23\">2.3</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-24\">2.4</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-25\">2.5</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-26\">2.6</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-27\">2.7</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-28\">2.8</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-29\">2.9</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-o-30\">3.0</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"panel panel-default\">\n" +
    "			<div class=\"panel-heading\">Prefixed for Mozilla (<code>min--moz-device-pixel-ratio</code>)</div>\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"tool-mf-dpr-container\">\n" +
    "					<button class=\"btn btn-lg btn-block btn-danger mf-dpr-default\">not supported</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-10\">1.0</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-11\">1.1</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-12\">1.2</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-13\">1.3</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-14\">1.4</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-15\">1.5</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-16\">1.6</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-17\">1.7</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-18\">1.8</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-19\">1.9</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-20\">2.0</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-21\">2.1</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-22\">2.2</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-23\">2.3</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-24\">2.4</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-25\">2.5</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-26\">2.6</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-27\">2.7</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-28\">2.8</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-29\">2.9</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-dpr mf-dpr-moz-30\">3.0</button>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	\n" +
    "</div>\n" +
    "");
  $templateCache.put("partials/mforientation.tpl.html",
    "<!DOCTYPE html>\n" +
    "<div class=\"container-fluid\" ng-controller=\"MFOrientationCtrl\">\n" +
    "	\n" +
    "	<ol class=\"breadcrumb\">\n" +
    "		<li><a ui-sref=\"/\">Start</a></li>\n" +
    "		<li class=\"active\">Media Feature - orientation</li>\n" +
    "	</ol>\n" +
    "	\n" +
    "	<h1>Media Feature - orientation</h1>\n" +
    "	\n" +
    "	<p class=\"lead\">\n" +
    "		This tools helps you to see whether or not the device supports the\n" +
    "		<code>orientation</code> media feature.\n" +
    "	</p>\n" +
    "	\n" +
    "	<div class=\"container-fluid\">\n" +
    "		<div class=\"panel panel-default\">\n" +
    "			<div class=\"panel-heading\"><code>orientation</code></div>\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"tool-mf-orientation-container\">\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-orientation mf-orientation-portrait\">portrait</button>\n" +
    "					<button class=\"btn btn-lg btn-block btn-primary mf-orientation mf-orientation-landscape\">landscape</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
  $templateCache.put("partials/mfresolution.tpl.html",
    "<!DOCTYPE html>\n" +
    "<div class=\"container-fluid\" ng-controller=\"MFResolutionCtrl\">\n" +
    "	\n" +
    "	<ol class=\"breadcrumb\">\n" +
    "		<li><a ui-sref=\"/\">Start</a></li>\n" +
    "		<li class=\"active\">Media Feature - resolution</li>\n" +
    "	</ol>\n" +
    "	\n" +
    "	<h1>Media Feature - resolution</h1>\n" +
    "	\n" +
    "	<p class=\"lead\">\n" +
    "		This tool helps you to see whether or not the device supports the\n" +
    "		<code>resolution</code> media feature.\n" +
    "	</p>\n" +
    "	\n" +
    "	<div class=\"container-fluid\">\n" +
    "		<div class=\"panel panel-default\">\n" +
    "			<div class=\"panel-heading\"><code>resolution</code> (dpi)</div>\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"tool-mf-resolution-container\">\n" +
    "					<button class=\"btn btn-lg btn-block btn-danger mf-resolution-default\">not supported</button>\n" +
    "					<button ng-repeat=\"resolution in resolutions\"\n" +
    "					        class=\"btn btn-lg btn-block btn-primary mf-resolution mf-resolution-dpi-{{ resolution }}\">\n" +
    "									{{ resolution }}dpi\n" +
    "					</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"panel panel-default\">\n" +
    "			<div class=\"panel-heading\"><code>resolution</code> (dpcm)</div>\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"tool-mf-resolution-container\">\n" +
    "					<button class=\"btn btn-lg btn-block btn-danger mf-resolution-default\">not supported</button>\n" +
    "					<button ng-repeat=\"resolution in resolutions\"\n" +
    "									class=\"btn btn-lg btn-block btn-primary mf-resolution mf-resolution-dpcm-{{ resolution }}\">\n" +
    "									{{ resolution }}dpcm\n" +
    "					</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"panel panel-default\">\n" +
    "			<div class=\"panel-heading\"><code>resolution</code> (dppx)</div>\n" +
    "			<div class=\"panel-body\">\n" +
    "				<div class=\"tool-mf-resolution-container\">\n" +
    "					<button class=\"btn btn-lg btn-block btn-danger mf-resolution-default\">not supported</button>\n" +
    "					<button ng-repeat=\"resolution in resolutions\"\n" +
    "									class=\"btn btn-lg btn-block btn-primary mf-resolution mf-resolution-dppx-{{ resolution }}\">\n" +
    "									{{ resolution }}dppx\n" +
    "					</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
  $templateCache.put("partials/mfwidthheight.tpl.html",
    "<!DOCTYPE html>\n" +
    "<div class=\"container-fluid\" ng-controller=\"MFWidthHeightCtrl\">\n" +
    "	\n" +
    "	<ol class=\"breadcrumb\">\n" +
    "		<li><a ui-sref=\"/\">Start</a></li>\n" +
    "		<li class=\"active\">Media Feature - (device-)width/height</li>\n" +
    "	</ol>\n" +
    "	\n" +
    "	<h1>Media Feature - (device-)width/height</h1>\n" +
    "	\n" +
    "	<p class=\"lead\">\n" +
    "		This tool helps you to see whether or not the device supports the\n" +
    "		<code>(device-)width/height</code> media feature.\n" +
    "	</p>\n" +
    "	\n" +
    "	<h2>Custom</h2>\n" +
    "	<p>\n" +
    "		If you want to test for a specific width/height, enter horizontal and \n" +
    "		vertical resolution in pixels and watch the results.\n" +
    "	</p>\n" +
    "	<div class=\"row\">\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"col-sm-12 form-group form-group-sm row\">\n" +
    "				<label class=\"control-label\" for=\"custom-width\">width (incl. unit, e.g. 320px)</label>\n" +
    "				<div>\n" +
    "					<input id=\"custom-width\" class=\"form-control\" ng-model=\"customResolutionHorizontal\" placeholder=\"0x\" required />\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"col-sm-12  form-group form-group-sm row\">\n" +
    "				<label class=\"control-label\" for=\"custom-height\">height (incl. unit, e.g. 480px)</label>\n" +
    "				<div>\n" +
    "					<input id=\"custom-height\" class=\"form-control\" ng-model=\"customResolutionVertical\" placeholder=\"0x\" required />\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"tool-mf-widthheight-container\">\n" +
    "		<button class=\"btn btn-lg btn-block btn-danger mf-widthheight-default\">Nope!</button>\n" +
    "		<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-custom\">Yes!</button>\n" +
    "	</div>\n" +
    "	<br />\n" +
    "	<p>\n" +
    "		If you want to test for a specific device-width/-height, enter horizontal and \n" +
    "		vertical resolution in pixels and watch the results.\n" +
    "	</p>\n" +
    "	<div class=\"row\">\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"col-sm-12 form-group form-group-sm row\">\n" +
    "				<label class=\"control-label\" for=\"custom-device-width\">device-width (incl. unit, e.g. 320px)</label>\n" +
    "				<div>\n" +
    "					<input id=\"custom-device-width\" class=\"form-control\" ng-model=\"customDeviceResolutionHorizontal\" placeholder=\"0x\" required />\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"col-sm-12  form-group form-group-sm row\">\n" +
    "				<label class=\"control-label\" for=\"custom-device-height\">device-height (incl. unit, e.g. 480px)</label>\n" +
    "				<div>\n" +
    "					<input id=\"custom-device-height\" class=\"form-control\" ng-model=\"customDeviceResolutionVertical\" placeholder=\"0x\" required />\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"tool-mf-widthheight-container\">\n" +
    "		<button class=\"btn btn-lg btn-block btn-danger mf-widthheight-default\">Nope!</button>\n" +
    "		<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-device-custom\">Yes!</button>\n" +
    "	</div>\n" +
    "	\n" +
    "	\n" +
    "	<h2>Defaults</h2>\n" +
    "	<p>\n" +
    "		Default breakpoints for <code>(device-)width</code> are: \n" +
    "		320px, 480px, 768px, 1024px, 1200px and 1600px.<br />\n" +
    "		Default breakpoints for <code>(device-)height</code> are: \n" +
    "		320px, 480px, 720px, 960px, 1080px, 1200px and 1440px.\n" +
    "	</p>\n" +
    "	<div class=\"container-fluid row\">\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"panel panel-default\">\n" +
    "				<div class=\"panel-heading\"><code>width</code></div>\n" +
    "				<div class=\"panel-body\">\n" +
    "					<div class=\"tool-mf-widthheight-container\">\n" +
    "						<button class=\"btn btn-lg btn-block btn-danger mf-widthheight-default\">not supported</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-w0\">narrower than 320px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-w320\">between 320px and 480px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-w480\">between 480px and 768px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-w768\">between 768px and 1024px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-w1024\">between 1024px and 1200px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-w1200\">between 1200px and 1600px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-w1600\">wider than 1600px</button>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">	\n" +
    "			<div class=\"panel panel-default\">\n" +
    "				<div class=\"panel-heading\"><code>device-width</code></div>\n" +
    "				<div class=\"panel-body\">\n" +
    "					<div class=\"tool-mf-widthheight-container\">\n" +
    "						<button class=\"btn btn-lg btn-block btn-danger mf-widthheight-default\">not supported</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dw0\">narrower than 320px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dw320\">between 320px and 480px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dw480\">between 480px and 768px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dw768\">between 768px and 1024px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dw1024\">between 1024px and 1200px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dw1200\">between 1200px and 1600px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dw1600\">wider than 1600px</button>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"panel panel-default\">\n" +
    "				<div class=\"panel-heading\"><code>height</code></div>\n" +
    "				<div class=\"panel-body\">\n" +
    "					<div class=\"tool-mf-widthheight-container\">\n" +
    "						<button class=\"btn btn-lg btn-block btn-danger mf-widthheight-default\">not supported</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-h0\">smaller than 320px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-h320\">between 320px and 480px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-h480\">between 480px and 720px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-h720\">between 720px and 960px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-h960\">between 960px and 1080px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-h1080\">between 1080px and 1200px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-h1200\">between 1200px and 1440px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-h1440\">larger than 1440px</button>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"panel panel-default\">\n" +
    "				<div class=\"panel-heading\"><code>device-height</code></div>\n" +
    "				<div class=\"panel-body\">\n" +
    "					<div class=\"tool-mf-widthheight-container\">\n" +
    "						<button class=\"btn btn-lg btn-block btn-danger mf-widthheight-default\">not supported</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dh0\">smaller than 320px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dh320\">between 320px and 480px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dh480\">between 480px and 720px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dh720\">between 720px and 960px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dh960\">between 960px and 1080px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dh1080\">between 1080px and 1200px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dh1200\">between 1200px and 1440px</button>\n" +
    "						<button class=\"btn btn-lg btn-block btn-primary mf-widthheight-dh1440\">larger than 1440px</button>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	\n" +
    "	<style type=\"text/css\" parse-style>\n" +
    "		@media screen and (width: {{ customResolutionHorizontal }}) and (height: {{ customResolutionVertical }}) { \n" +
    "			.tool-mf-widthheight-container button.mf-widthheight-custom {\n" +
    "				display: block; \n" +
    "			}\n" +
    "		}\n" +
    "		@media screen and (device-width: {{ customDeviceResolutionHorizontal }}) and (device-height: {{ customDeviceResolutionVertical }}) { \n" +
    "			.tool-mf-widthheight-container button.mf-widthheight-device-custom {\n" +
    "				display: block; \n" +
    "			}\n" +
    "		}\n" +
    "	</style>\n" +
    "\n" +
    "</div>");
  $templateCache.put("partials/start.tpl.html",
    "<!DOCTYPE html>\n" +
    "<div class=\"container-fluid row\">\n" +
    "	\n" +
    "	<div class=\"container-fluid\">\n" +
    "		<div class=\"jumbotron\">\n" +
    "		  <h1>Welcome!</h1>\n" +
    "		  <p>Mobile Development Toolkit (MDT) is a collection of tools to aid \n" +
    "				development of web sites and web applications for mobile devices.</p>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	\n" +
    "	<div class=\"container-fluid row\">\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"panel panel-default\">\n" +
    "				<div class=\"panel-heading\">Calculate Device PPI</div>\n" +
    "				<div class=\"panel-body\">\n" +
    "				  Use this tool to calculate a device screen's pixels per inch (PPI).<br />\n" +
    "					<br />\n" +
    "					<button class=\"btn btn-primary\" ui-sref=\"calcppi\">Calculate PPI</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	\n" +
    "	<h3 class=\"container-fluid\">Media Features</h3>\n" +
    "	\n" +
    "	<div class=\"container-fluid row\">\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"panel panel-default\">\n" +
    "				<div class=\"panel-heading\">Media Feature: resolution</div>\n" +
    "				<div class=\"panel-body\">\n" +
    "					Use this tool to check for support of the <code>resolution</code>\n" +
    "					media feature.<br />\n" +
    "					<br />\n" +
    "					<button class=\"btn btn-primary\" ui-sref=\"mfresolution\">\n" +
    "						Test <code>resolution</code> media feature\n" +
    "					</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"panel panel-default\">\n" +
    "				<div class=\"panel-heading\">Media Feature: device-pixel-ratio</div>\n" +
    "				<div class=\"panel-body\">\n" +
    "				  Use this tool to check for support of the \n" +
    "					<code>device-pixel-ratio</code> media feature.<br />\n" +
    "					<br />\n" +
    "					<button class=\"btn btn-primary\" ui-sref=\"mfdevicepixelratio\">\n" +
    "						Test <code>device-pixel-ratio</code> media feature\n" +
    "					</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"panel panel-default\">\n" +
    "				<div class=\"panel-heading\">Media Feature: orientation</div>\n" +
    "				<div class=\"panel-body\">\n" +
    "				  Use this tool to check for support of the <code>orientation</code>\n" +
    "					media feature.<br />\n" +
    "					<br />\n" +
    "					<button class=\"btn btn-primary\" ui-sref=\"mforientation\">\n" +
    "						Test <code>orientation</code> media feature\n" +
    "					</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"col-xs-12 col-sm-6 col-md-6 col-lg-6\">\n" +
    "			<div class=\"panel panel-default\">\n" +
    "				<div class=\"panel-heading\">Media Feature: (device-)width/height)</div>\n" +
    "				<div class=\"panel-body\">\n" +
    "				  Use this tool to check for support of the <code>(device-)width/height</code>\n" +
    "					media feature.<br />\n" +
    "					<br />\n" +
    "					<button class=\"btn btn-primary\" ui-sref=\"mfwidthheight\">\n" +
    "						Test <code>(device-)width/height</code> media feature\n" +
    "					</button>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	\n" +
    "</div>");
}]);
