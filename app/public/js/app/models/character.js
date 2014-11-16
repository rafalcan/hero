'use strict';

define([
  'settings',
  'backbone'
],
function( settings, Backbone ) {

  var Character = Backbone.Model.extend({
    gravity: settings.tile * settings.constants.gravity,
    maxDy: settings.tile * settings.constants.maxDy,
    impulse: settings.tile * settings.constants.impulse,
    acceleration: settings.constants.maxDx / settings.constants.acceleration,
    friction: settings.constants.maxDx / settings.constants.friction,
    start: {
      x: 80,
      y: 460,
    },
    defaults: {
      maxDx: settings.tile * settings.constants.maxDx,
      type: 'hero',
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      up: false,
      left: false,
      right: false,
      falling: false
    }
  });

  return Character;

});
