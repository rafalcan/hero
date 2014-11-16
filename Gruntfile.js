'use strict';

module.exports = function( grunt ) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Configurations
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: {
      app: 'app',
      pub: 'app/public',
      dist: 'dist'
    },
    develop: {
      serve: {
        file: 'app.js'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      view: {
        files: ['<%= paths.app %>/*.html']
      },
      js: {
        files: ['<%= paths.pub %>/js/**/*.js']
      },
      css: {
        files: ['<%= paths.pub %>/sass/{,*/}*.{scss,sass}'],
        tasks: ['sass:dev', 'autoprefixer']
      },
      tpl: {
        files: ['<%= paths.pub %>/tpl/{,*/}*.hbs']
      }
    },
    sass: {
      dist: {
        options: {
          loadPath: '<%= paths.pub %>/sass/',
          style: 'compressed',
          precision: 10
        },
        files: [{
          expand: true,
          cwd: '<%= paths.pub %>/sass/',
          src: ['*.scss'],
          dest: '<%= paths.pub %>/css/',
          ext: '.css'
        }]
      },
      dev: {
        options: {
          loadPath: '<%= paths.pub %>/sass/',
          style: 'nested'
        },
        files: [{
          expand: true,
          cwd: '<%= paths.pub %>/sass/',
          src: ['*.scss'],
          dest: '<%= paths.pub %>/css/',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 3 versions', 'ie 9', 'Firefox > 3', 'Safari > 4', 'iOS > 5']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.pub %>/css/',
          src: '{,*/}*.css',
          dest: '<%= paths.pub %>/css/'
        }]
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.sass-cache',
            '<%= paths.dist %>/*',
            '!<%= paths.dist %>/.git*'
          ]
        }]
      },
      serve: '.sass-cache'
    },
    open: {
      serve: {
        path: 'http://hero.local/'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= paths.pub %>/js/{,*/}*.js',
        '!<%= paths.pub %>/js/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    requirejs: {
      app: {
        options: {
          baseUrl: '<%= paths.pub %>/js',
          name: 'cfg',
          out: '<%= paths.dist %>/<%= paths.pub %>/js/cfg.js',
          mainConfigFile: '<%= paths.pub %>/js/cfg.js',

          keepBuildDir: true,
          optimize: 'uglify2',
          preserveLicenseComments: false,
          useStrict: true,
          wrap: true,
        }
      }
    },
    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      files: {
        src: [
          '<%= paths.dist %>/<%= paths.pub %>/css/*.css',
          '<%= paths.dist %>/<%= paths.pub %>/js/vendors/*.js',
          '<%= paths.dist %>/<%= paths.pub %>/js/*.js',
          //'<%= paths.dist %>/<%= paths.pub %>/img/{,*/}*.{png,jpg,jpeg,gif,webp}',
          //'<%= paths.dist %>/<%= paths.pub %>/fnt/*'
        ]
      }
    },
    useminPrepare: {
      options: {
        dest: '<%= paths.dist %>/<%= paths.app %>'
      },
      html: ['<%= paths.app %>/*.html']
    },
    usemin: {
      options: {
        assetsDirs: ['<%= paths.dist %>/<%= paths.app %>']
      },
      html: ['<%= paths.dist %>/<%= paths.app %>/*.html'],
      css: ['<%= paths.dist %>/<%= paths.pub %>/css/*.css']
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: '<%= paths.pub %>/img',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= paths.dist %>/<%= paths.pub %>/img'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.pub %>/img',
          src: '{,*/}*.svg',
          dest: '<%= paths.dist %>/<%= paths.pub %>/img'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: false,
          useShortDoctype: true,
          customAttrSurround: [
            [/\{\{#[^}]+\}\}/, /\{\{\/[^}]+\}\}/]
          ]
        },
        files: [{
          expand: true,
          cwd: '<%= paths.dist %>/<%= paths.app %>',
          dest: '<%= paths.dist %>/<%= paths.app %>',
          src: '*.html'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      node: {
        files: [{
          expand: true,
          dot: true,
          dest: '<%= paths.dist %>/',
          src: [
            'package.json',
            '*.md',
            'LICENSE'
          ]
        }]
      },
      app: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.app %>/',
          dest: '<%= paths.dist %>/<%= paths.app %>/',
          src: [
            '*.html'
          ]
        }]
      },
      pub: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.pub %>',
          dest: '<%= paths.dist %>/<%= paths.pub %>',
          src: [
            'img/**/*.{webp}',
            '*.{ico,png,txt,htaccess}'
          ]
        }]
      }
    },
    concurrent: {
      serve: [
        'sass:dev'
      ],
      test: [
        'sass:dev'
      ],
      start: [
        'sass:dist',
        'imagemin',
        'svgmin'
      ],
      end: [
        'copy:node',
        'copy:app',
        'copy:pub'
      ]
    },
  });

  // Tasks
  grunt.registerTask('serve', [
    'clean:serve',
    'concurrent:serve',
    'autoprefixer',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:start',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'requirejs:app',
    'concurrent:end',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
