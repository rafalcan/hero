'use strict';

define([
  'settings',
  'underscore',
  'backbone',
  'models/character',
  'views/character'
],
function( settings, _, Backbone, Character, CharacterView ) {

  var PlayerView = CharacterView.extend({
    el: 'body',
    pointAt: 'right',
    model: new Character(),
    events: {
      'keydown': 'keyDown',
      'keyup': 'keyUp'
    },
    initialize: function( context ) {
      this.context = context;
      this.model.set({
        x: this.model.start.x,
        y: this.model.start.y,
        killed: 0,
        points: 0,
        bullets: []
      });

      this.model.on('change:killed', function( model, killed ) {
        this.$el.find('#killed').text( killed );
      }, this);

      this.model.on('change:points', function( model, points ) {
        this.$el.find('#points').text( points );
      }, this);
    },
    key: function( event, down ) {
      event.preventDefault();

      switch( event.keyCode ) {
        case 38:
          this.model.set('up', down);
          return false;
        case 37:
          if ( down ) {
            this.pointAt = 'left';
          }

          this.model.set('left', down);
          return false;
        case 39:
          if ( down ) {
            this.pointAt = 'right';
          }

          this.model.set('right', down);
          return false;
        case 32:
          if ( down ) {
            this.shoot();
          }
          return false;
      }
    },
    keyDown: function( event ) {
      this.key( event, true );
    },
    keyUp: function( event ) {
      this.key( event, false );
    },
    shoot: function() {
      var player = this.model,
        bullets = player.get('bullets');

      bullets.push({
        x: ( this.pointAt === 'right' ) ? player.get('x') + settings.tile : player.get('x') - settings.bullet,
        y: player.get('y') + (settings.tile / 2),
        pointAt: this.pointAt,
        active: true
      });
    },
    render: function( delta ) {
      var player = this.model,
        bullets = player.get('bullets');

      _.each( bullets, _.bind(function( bullet ) {
        if ( bullet.active ) {
          this.context.fillStyle = settings.colors.bullet;
          this.context.fillRect(bullet.x, bullet.y, settings.bullet, settings.bullet);
        }
      }, this));

      this.context.fillStyle = settings.colors.player;
      this.context.fillRect(player.get('x') + (player.get('dx') * delta), player.get('y') + (player.get('dy') * delta), settings.tile, settings.tile);
    }
  });

  return PlayerView;

});
