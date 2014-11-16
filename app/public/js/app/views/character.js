'use strict';

define([
  'settings',
  'underscore',
  'backbone',
  'models/world'
],
function( settings, _, Backbone, World ) {

  var CharacterView = Backbone.View.extend({
    world: World,
    tileToPixel: function( tile ) {
      return tile * settings.tile;
    },
    pixelToTile: function( pixel ) {
      return Math.floor( pixel / settings.tile );
    },
    tileCell: function( tileX, tileY ) {
      return this.world.get('data')[tileY][tileX];
    },
    bound: function( x, min, max ) {
      return Math.max( min, Math.min(max, x) );
    },
    overlap: function( x1, y1, w1, h1, x2, y2, w2, h2 ) {
      return !(((x1 + w1 - 1) < x2) ||
              ((x2 + w2 - 1) < x1) ||
              ((y1 + h1 - 1) < y2) ||
              ((y2 + h2 - 1) < y1));
    },
    update: function( delta, character ) {
      if ( character === undefined ) {
        character = this.model;
      }

      var gravity = character.gravity,
        maxDx = character.get('maxDx'),
        maxDy = character.maxDy,
        impulse = character.impulse,
        acceleration = character.acceleration,
        friction = character.friction,
        wasLeft = character.get('dx') < 0,
        wasRight = character.get('dx') > 0,
        falling = character.get('falling'),
        frict = friction * (falling ? 0.5 : 1),
        accel = acceleration * (falling ? 0.5 : 1),
        jumping = false,
        ddx = 0,
        ddy = gravity,
        accelBullet = settings.bullet / settings.constants.acceleration,
        bullets = character.get('bullets');

      //Movement
      if ( character.get('left') ) {
        ddx = ddx - accel;
      } else if ( wasLeft ) {
        ddx = ddx + frict;
      }

      if ( character.get('right') ){
        ddx = ddx + accel;
      } else if ( wasRight ) {
        ddx = ddx - frict;
      }

      if ( character.get('up') && !jumping && !falling ) {
        ddy = ddy - impulse;
        jumping = true;
      }

      character.set('x', character.get('x') + (delta * character.get('dx')));
      character.set('y', character.get('y') + (delta * character.get('dy')));
      character.set('dx', this.bound(character.get('dx') + (delta * ddx), -maxDx, maxDx));
      character.set('dy', this.bound(character.get('dy') + (delta * ddy), -maxDy, maxDy));

      if ( (wasLeft && (character.get('dx') > 0)) || (wasRight && (character.get('dx') < 0)) ) {
        character.set('dx', 0);
      }

      //Collision
      var tx = this.pixelToTile( character.get('x') ),
        ty = this.pixelToTile( character.get('y') ),
        nx = character.get('x') % settings.tile,
        ny = character.get('y') % settings.tile,
        cell = this.tileCell(tx, ty),
        cellRight = this.tileCell(tx + 1, ty),
        cellDown = this.tileCell(tx, ty + 1),
        cellDiagonal = this.tileCell(tx + 1, ty + 1);

      if ( character.get('dy') > 0 ) {
        if ( (cellDown && !cell) || (cellDiagonal && !cellRight && nx) ) {
          character.set('y', this.tileToPixel(ty));
          character.set('dy', 0);
          character.set('falling', false);
          jumping = false;
          ny = 0;
        }
      } else if ( character.get('dy') < 0 ) {
        if ( (cell && !cellDown) || (cellRight && !cellDiagonal && nx) ) {
          character.set('y', this.tileToPixel(ty + 1));
          character.set('dy', 0);
          cell = cellDown;
          cellRight = cellDiagonal;
          ny = 0;
        }
      }

      if ( character.get('dx') > 0 ) {
        if ( (cellRight && !cell) || (cellDiagonal && !cellDown && ny) ) {
          character.set('x', this.tileToPixel(tx));
          character.set('dx', 0);
        }
      } else if ( character.get('dx') < 0 ) {
        if ( (cell && !cellRight) || (cellDown && !cellDiagonal && ny) ) {
          character.set('x', this.tileToPixel(tx + 1));
          character.set('dx', 0);
        }
      }

      if ( character.get('type') === 'villain' ) {
        if ( character.get('left') && (cell || !cellDown) ) {
          character.set('left', false);
          character.set('right', true);
        } else if ( character.get('right') && (cellRight || !cellDiagonal) ) {
          character.set('right', false);
          character.set('left', true);
        }
      }

      character.set('falling', !(cellDown || (nx && cellDiagonal)));

      //Bullet
      _.each( bullets, _.bind(function( bullet ) {
        if ( bullet.active ) {
          //Movement
          bullet.x = ( bullet.pointAt === 'right' ) ? bullet.x + accelBullet : bullet.x - accelBullet;

          //Collision
          var tbx = this.pixelToTile( bullet.x ),
            tby = this.pixelToTile( bullet.y ),
            cBullet = this.tileCell(tbx, tby);

          if ( cBullet ) {
            bullet.active = false;
          }
        }
      }, this));
    }
  });

  return CharacterView;

});
