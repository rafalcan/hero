'use strict';

define([
  'settings',
  'backbone',
  'models/world',
],
function( settings, Backbone, World ) {

  var WorldView = Backbone.View.extend({
    model: World,
    initialize: function( context ) {
      this.context = context;
    },
    render: function() {
      var cols = 0,
        rows = 0;

      for (rows = 0; rows < this.model.get('rows'); rows++) {
        for (cols = 0; cols < this.model.get('cols'); cols++) {
          var item = this.model.get('data')[rows][cols];

          if ( item === 1 || item === 2) {
            this.context.fillStyle = ( item === 1 ) ? settings.colors.wall : settings.colors.roof;
            this.context.fillRect(cols * settings.tile, rows * settings.tile, settings.tile, settings.tile);
          }
        }
      }
    }
  });

  return WorldView;

});
