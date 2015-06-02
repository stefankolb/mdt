/**
 * =============================================================================
 * MobileDevelopmentTools
 *
 * (c) Copyright 2015 Stefan Kolb <dev@stefankolb.de>
 * =============================================================================
 */

module.exports = {

  // ---------------------------------------------------------------------------
  // DIRECTORIES
  // ---------------------------------------------------------------------------

  dir: {

    // The directory where the project is built during development
    develop: 'build/develop',

    // The directory where the project is built for testing
    compile: 'build/compile',

    // The directory where the application is build for deployment
    deploy: 'build/deploy'

  },


  // -----------------------------------------------------------------------
  // APPLICATION/INTERNAL FILES
  // -----------------------------------------------------------------------

  files_internal: {

    scripts: [
      'src/scripts/app.js'
    ],

    assets: [

    ],

    sass: {

      dir_base: 'src/sass',

      file_base: 'src/sass/base.scss'

    }

  },


  // -----------------------------------------------------------------------
  // EXTERNAL FILES
  // -----------------------------------------------------------------------

  files_external: {

    scripts: [
      'bower_components/angularjs/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
    ],

    scripts_min: [

    ],

    assets: [

    ],

    sass: {

      importPaths: [
        'bower_components/bootstrap-sass/assets/stylesheets'
      ]

    }

  }

};
