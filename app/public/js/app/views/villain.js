'use strict';

define([
  'settings',
  'underscore',
  'backbone',
  'collections/villains',
  'views/character'
],
function( settings, _, Backbone, Villains, CharacterView ) {

  var VillainView = CharacterView.extend({
    collection: Villains,
    initialize: function( context, player ) {
      this.context = context;
      this.player = player;
      this.collection.add([
        { maxDx: 150, x: 80, y: 120, right: true, type: 'villain', action: 'fast', dead: false },
        { maxDx: 150, x: 880, y: 200, right: true, type: 'villain', action: 'fast', dead: false },
        { maxDx: 50, x: 880, y: 520, left: true, type: 'villain', action: 'slow', dead: false },
        { maxDx: 50, x: 480, y: 300, left: true, type: 'villain', action: 'slow', dead: false }
      ]);
    },
    updates: function( delta ) {
      var player = this.player,
        bullets = player.get('bullets');

      this.collection.each(_.bind(function( villain ) {
        if ( !villain.get('dead') ) {
          this.update( delta, villain );

          _.each( bullets, _.bind(function( bullet ) {
            if ( bullet.active ) {
              if ( this.overlap(bullet.x, bullet.y, settings.bullet, settings.bullet, villain.get('x'), villain.get('y'), settings.tile, settings.tile) ) {
                bullet.active = false;
                villain.set('dead', true);
                player.set('points', player.get('points') + 50);
              }
            }
          }, this));

          if ( this.overlap(player.get('x'), player.get('y'), settings.tile, settings.tile, villain.get('x'), villain.get('y'), settings.tile, settings.tile) ) {
            if ( (player.get('dy') > 0) && (villain.get('y') - player.get('y') > settings.tile/2) ) {
              villain.set('dead', true);
              player.set('points', player.get('points') + 100);
            } else {
              player.set({
                x: player.start.x,
                y: player.start.y,
                dx: 0,
                dy: 0,
                killed: player.get('killed') + 1
              });
            }
          }
        }
      }, this));
    },
    render: function( delta ) {
      this.collection.each(_.bind(function( villain ) {
        if ( !villain.get('dead') ) {
          this.context.fillStyle = settings.colors.villain[villain.get('action')];
          this.context.fillRect(villain.get('x') + (villain.get('dx') * delta), villain.get('y') + (villain.get('dy') * delta), settings.tile, settings.tile);
        }
      }, this));
    }
  });

  return VillainView;

});
