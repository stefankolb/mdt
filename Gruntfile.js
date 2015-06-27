/**
 * =============================================================================
 * MobileDevelopmentToolkit
 *
 * (c) Copyright 2015 Stefan Kolb <dev@stefankolb.de>
 * =============================================================================
 */

'use strict';

module.exports = function(grunt) {

  // require it at the top and pass in the grunt instance
  require('time-grunt')(grunt);

  /**
   * ***************************************************************************
   * EXTERNAL MODULE IMPORT
   * ***************************************************************************
   */

  var _merge = require('lodash.merge');
  var _shell = require('shelljs');

  // Note: Install new modules by adding them to 'package.json' file located
  //       at the root level and do 'npm install' in the terminal afterwards.

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-postcss');


  /**
   * ***************************************************************************
   * INITIALIZATION
   * ***************************************************************************
   */

  var _appConfig;
  var _appVersion = 'v0.0.0';
  var _pathAssets = 'assets';
  var _pathAssetsScripts = 'assets/scripts';

  // Load application specific configuration from app.config.js file,
  // if it exists
  if (grunt.file.exists('./app.config.js')) {
    _appConfig = require('./app.config.js');
  } else {
    grunt.fail.warn('Could not load application specific configuration from ' +
      '"app.config.js". File does not exists!');
  }

  // Get application version from Git tag
  var gitTag = _shell.exec('git describe --tags --abbrev=0 --first-parent');
  if (gitTag && gitTag.code === 0) {
    _appVersion = gitTag.output.replace(/[ \f\t\v\r\n]*$/gm, '');
    _appConfig.appVersion = _appVersion;
  }
  
  
  /**
   * ***************************************************************************
   * TASK CONFIGURATION
   * ***************************************************************************
   */

  var _taskConfig = {

    pkg: grunt.file.readJSON('package.json'),


    // -------------------------------------------------------------------------
    // CLEAN
    // -------------------------------------------------------------------------

    clean: {

      develop: [
        '<%= dir.develop %>'
      ],

      compile: [
        '<%= dir.compile %>'
      ],
      
      deploy: [
        '<%= dir.deploy %>'
      ],
      
      docs: [
        '<%= dir.docs %>'
      ],
      
      temp: [
        '<%= dir.temp %>'
      ]

    },


    // -------------------------------------------------------------------------
    // COMPASS / SASS / SCSS
    // -------------------------------------------------------------------------

    compass: {

      develop: {
        options: {
          environment: 'development',
          outputStyle: 'compact',
          importPath: '<%= files_external.sass.importPaths %>',
          sassDir: '<%= files_internal.sass.dir_base %>',
          specify: '<%= files_internal.sass.file_base %>',
          cssDir: '<%= dir.develop %>/' + _pathAssets +'/',
          raw: 'preferred_syntac = :scss\n'
        }
      },

      compile: {
        options: {
          environment: 'production',
          outputStyle: 'compact',
          importPath: '<%= files_external.sass.importPaths %>',
          sassDir: '<%= files_internal.sass.dir_base %>',
          specify: '<%= files_internal.sass.file_base %>',
          cssDir: '<%= dir.compile%>/' + _pathAssets +'/',
          raw: 'preferred_syntac = :scss\n'
        }
      }

    },


    // -------------------------------------------------------------------------
    // CONCATINATION
    // -------------------------------------------------------------------------

    concat: {

      compile: {
        src: [
          '<%= files_internal.scripts %>',
          '<%= html2js.compile.dest %>'
        ],
        dest: '<%= dir.compile %>/' + _pathAssetsScripts + '/<%= pkg.name %>-' + _appVersion + '.js'
      }

    },


    // -------------------------------------------------------------------------
    // COPY
    // -------------------------------------------------------------------------

    copy: {

      develop: {
        files: [
          {
            cwd: '.',
            src: [
              '<%= files_external.scripts %>',
              '<%= files_internal.scripts %>'
            ],
            dest: '<%= dir.develop %>/' + _pathAssetsScripts,
            expand: true,
            flatten: true
          }
        ]
      },

      compile: {
        files: [
          {
            cwd: '.',
            src: [
              '<%= files_external.scripts_min %>'
            ],
            dest: '<%= dir.compile %>/' + _pathAssetsScripts,
            expand: true,
            flatten: true
          }
        ]
      }

    },


    // -------------------------------------------------------------------------
    // WATCH / DELTA
    // -------------------------------------------------------------------------

    delta: {

      options: {
        livereload: true,
        spawn: false
      },

      config: {
        files: [
          'app.config.js'
        ],
        tasks: [
          'develop'
        ]
      },

      html: {
        files: [
          'src/index.html',
          'src/partials/**/*.html'
        ],
        tasks: [
          'html2js:develop',
          'index:develop'
        ]
      },

      js: {
        files: [
          'src/scripts/**/*.js'
        ],
        tasks: [
          'jshint:develop',
          'karma:unit',
          'copy:develop',
          'index:develop'
        ]
      },

      jsspec: {
        files: [
          'src/tests/**/*.spec.js'
        ],
        tasks: [
          'karma:unit'
        ]
      },
      
      compass: {
        files: [
          '<%= files_internal.sass.dir_base %>/**/*.scss'
        ],
        tasks: [
          'compass:develop'
        ]
      }

    },
    
    
    // -------------------------------------------------------------------------
    // GITHUB PAGES DEPLOYMENT
    // -------------------------------------------------------------------------
    
    'gh-pages': {
      options: {
        base: '<%= dir.deploy %>',
        message: '[gh-pages] Deployment of version ' + _appVersion,
        user: {
          name: 'Stefan Kolb',
          email: 'dev@stefankolb.de'
        }
      },
      src: '**/*'
    },
    
    
    // -------------------------------------------------------------------------
    // HTML TEMPLATES
    // -------------------------------------------------------------------------
    
    html2js: {
      
      options: {
        module: 'templates',
        useStrict: true,
        singleModule: true,
      },
      
      develop: {
        src: '<%= files_internal.templates %>',
        dest: '<%= dir.develop %>/' + _pathAssetsScripts + '/templates.js'
      },
      
      compile: {
        src: '<%= files_internal.templates %>',
        dest: '<%= dir.temp %>/' + _pathAssetsScripts + '/templates.js'
      }
      
    },


    // -------------------------------------------------------------------------
    // JSHINT CODE QUALITY
    // -------------------------------------------------------------------------

    jshint: {

      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      },

      develop: [
        '<%= files_internal.scripts %>'
      ]

    },


    // -------------------------------------------------------------------------
    // INDEX
    // -------------------------------------------------------------------------

    index: {

      develop: {
        dest: '<%= dir.develop %>',
        src: {
          styles: [
            '<%= compass.develop.options.cssDir %>/**/*.css'
          ],
          scripts: [
            '<%= files_external.scripts %>',
            '<%= files_internal.scripts %>',
            '<%= html2js.develop.dest %>'
          ]
        }
      },

      compile: {
        dest: '<%= dir.compile %>',
        src: {
          styles: [
            '<%= compass.compile.options.cssDir %>/**/*.css'
          ],
          scripts: [
            '<%= files_external.scripts_min %>',
            '<%= dir.compile %>/' + _pathAssetsScripts + '/<%= pkg.name %>-<%= appVersion %>.min.js'
          ]
        }
      }

    },


    // -------------------------------------------------------------------------
    // KARMA TEST RUNNER
    // -------------------------------------------------------------------------

    karma: {

      unit: {
        options: {
          autoWatch: false,
          port: 9998,
          runnerPort: 9999,
          singleRun: true,
          files: [
            'src/tests/**/*.spec.js'
          ],
          frameworks: [
            'jasmine'
          ],
          browsers: [
            'Chrome'
          ],
          reporters: [
            'mocha'
          ]
        }
      }
    },


    // -------------------------------------------------------------------------
    // META INFORMATION
    // -------------------------------------------------------------------------
    
    meta: {
      
      banner: '/**\n' +
        ' * =============================================================================\n' + 
        ' * <%= pkg.name %> - ' + _appVersion + '\n' +
        ' * \n' +
        ' * (c) Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * =============================================================================\n' +
        ' */\n'
        
    },
    
    
    // -------------------------------------------------------------------------
    // CODE DOCUMENTATION
    // -------------------------------------------------------------------------
    
    ngdocs: {
      
      options: {
        dest: 'docs',
        html5Mode: false,
        startPage: '/',
        title: 'Mobile Development Toolkit (MDT) - Source Code Documentation',
        titleLink: '/mdt_docs/'
      },
      
      develop: {
        src: '<%= files_internal.scripts %>',
        title: 'API Documentation'
      }
      
    },
    
    
    // -------------------------------------------------------------------------
    // POSTCSS PROCESSING
    // -------------------------------------------------------------------------
    
    postcss: {
      
      options: {
        processors: [
          require('autoprefixer-core')({ browsers: 'last 1 version' })
        ]
      },
      
      develop: {
        map: true,
        src: '<%= dir.develop %>/' + _pathAssets + '/*.css'
      },
      
      compile: {
        src: '<%= dir.compile %>/' + _pathAssets + '/*.css'
      }
      
    },
    
    
    // -------------------------------------------------------------------------
    // MINIFICATION
    // -------------------------------------------------------------------------

    uglify: {

      options: {
        compress: {
          booleans: true,
          cascade: true,
          comparisons: true,
          conditionals: true,
          dead_code: true,
          drop_debugger: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          loops: true,
          properties: true,
          sequences: true,
          side_effects: true,
          unused: true,
          warnings: true
        },
        
        banner: '<%= meta.banner %>'
      },

      compile: {
        files: {
          '<%= dir.compile %>/assets/scripts/<%= pkg.name %>-<%= appVersion %>.min.js': [
            '<%= files_internal.scripts %>',
            '<%= html2js.compile.dest %>'
          ]
        }
      }

    }

  };


  /**
   * ***************************************************************************
   * TASK REGISTRATION
   * ***************************************************************************
   */

  // Combine application configuration and task configuration and init Grunt
  _merge(_taskConfig, _appConfig);
  grunt.initConfig(_taskConfig);

  // ---------------------------------------------------------------------------
  // SIMPLE TASKS
  // ---------------------------------------------------------------------------

  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', [
    'develop',
    'karma:unit',
    'delta'
  ]);

  grunt.registerTask('develop', [
    'clean:develop',
    'compass:develop',
    'postcss:develop',
    'html2js:develop',
    'copy:develop',
    'index:develop',
    'clean:temp'
  ]);

  grunt.registerTask('compile', [
    'clean:compile',
    'compass:compile',
    'postcss:compile',
    'html2js:compile',
    'copy:compile',
    'concat:compile',
    'uglify:compile',
    'index:compile',
    'clean:temp'
  ]);

  grunt.registerTask('deploy', [ 
    'compile',
    'clean:deploy',
    'prepare-deploy',
    'gh-pages'
  ]);
  
  grunt.registerTask('docs', [
    'clean:docs',
    'ngdocs:develop'
  ]);

  grunt.registerTask('default', [ ]);
  
  
  grunt.registerTask('prepare-deploy', 
    'Prepares deployment',
    function() {
      grunt.file.recurse(_appConfig.dir.compile,
        function(abspath, rootdir, subdir, filename) {
          var dest = subdir ? subdir + '/' + filename : filename;
          grunt.file.copy(abspath, _appConfig.dir.deploy + '/' + dest);
        }
      );
    }
  );

  // ---------------------------------------------------------------------------
  // MULTITASKS
  // ---------------------------------------------------------------------------

  grunt.registerMultiTask('index', 'Creates an index.html file',
    function() {
      var _mapper = function(path, file) {
        return path + '/' + file.substring(file.lastIndexOf('/') + 1, file.length);
      };

      var filesStyle = grunt.file.expand(this.data.src.styles);
      filesStyle = filesStyle.map(_mapper.bind(this, _pathAssets));
      var filesScript = grunt.file.expand(this.data.src.scripts);
      filesScript = filesScript.map(_mapper.bind(this, _pathAssetsScripts));

      grunt.file.copy('src/index.html',
        this.data.dest + '/index.html', {
          process: function(contents) {
            return grunt.template.process(contents, {
              data: {
                filesStyle: filesStyle,
                filesScript: filesScript
              }
            });
          }
        }
      );
    }
  );

};
