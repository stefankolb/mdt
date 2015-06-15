/**
 * =============================================================================
 * MobileDevelopmentTools
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