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
    deploy: 'build/deploy',
    
    // The directory where to generated source code documentation is stored
    docs: 'docs',
    
    // The directory used for temporary storing of build files
    temp: 'build/temp'

  },


  // -----------------------------------------------------------------------
  // APPLICATION/INTERNAL FILES
  // -----------------------------------------------------------------------

  files_internal: {

    scripts: [
      'src/scripts/app.js',
      'src/scripts/services/convert.js',
      'src/scripts/controllers/calcppi.js',
      'src/scripts/controllers/mqmindevicepixelratio.js'
    ],

    assets: [

    ],
    
    templates: [
      'src/partials/*.tpl.html'
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
      'bower_components/angular-ui-router/release/angular-ui-router.js'
    ],

    scripts_min: [
      'bower_components/angularjs/angular.min.js',
      'bower_components/angular-ui-router/release/angular-ui-router.min.js'
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
