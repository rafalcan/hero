'use strict';

define([
  'settings',
  'underscore',
  'backbone',
  'views/world',
  'views/player',
  'views/villain'
],
function( settings, _, Backbone, WorldView, PlayerView, VillainView ) {

  var AppView = Backbone.View.extend({
    el: '#main',
    last: Date.now(),
    events: {

    },
    initialize: function() {
      //Canvas
      this.canvas = $('<canvas id="canvas" class="app" width="'+ settings.width +'" height="'+ settings.height +'">');
      this.context = this.canvas[0].getContext('2d');
      this.$el.append( this.canvas );

      //Views
      this.worldView = new WorldView( this.context );
      this.playerView = new PlayerView( this.context );
      this.villainView = new VillainView( this.context, this.playerView.model );

      //Frame
      this.frame();
    },
    update: function( delta ) {
      this.playerView.update( delta );
      this.villainView.updates( delta );
    },
    render: function( delta ) {
      //Clear the canvas
      this.context.clearRect(0, 0, settings.width, settings.height);

      //Renders
      this.worldView.render();
      this.playerView.render( delta );
      this.villainView.render( delta );
    },
    frame: function() {
      var now = Date.now(),
        delta = Math.min(1, (now - this.last) / 1000);

      this.update( delta );
      this.render( delta );
      this.last = now;

      requestAnimationFrame(_.bind(function() {
        this.frame();
      }, this));
    }
  });

  return {
    init: function() {
      new AppView();
    }
  };

});
