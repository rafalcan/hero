'use strict';

var scripts = document.getElementsByTagName('script'),
  filePath = scripts[ scripts.length - 1 ].src,
  splitPath = filePath.split('/'),
  fileName = splitPath[ splitPath.length - 1 ],
  version = fileName.split('.')[1];

if ( version.length < 8 ) {
  var script = document.createElement('script');
  script.src = 'http://localhost:35729/livereload.js';
  document.body.appendChild( script );
}

require.config({
  baseUrl: 'public/js',
  paths: {
    collections: 'app/collections',
    models: 'app/models',
    views: 'app/views',
    ready: '../components/requirejs-domready/domReady',
    jquery: '../components/jquery/dist/jquery',
    backbone: '../components/backbone/backbone',
    underscore: '../components/lodash/dist/lodash'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    'app': {
      deps: [
        'jquery',
        'backbone'
      ]
    }
  },
  urlArgs: 'v=' + version
});

define('settings', {
  width: 1000,
  height: 600,
  tile: 40,
  bullet: 4,
  constants: {
    gravity: 9.8 * 6,
    maxDx: 40,
    maxDy: 20,
    acceleration: 1/2,
    friction: 1/8,
    impulse: 1500
  },
  colors: {
    wall: '#5a5a5c',
    roof: '#373738',
    player: '#70cb74',
    villain: {
      fast: '#fa6058',
      slow: '#b22520'
    },
    bullet: '#fbc74a'
  }
});

require([ 'ready!', 'app' ], function( doc, app ) {
  app.init();
});
