'use strict';

define([
  'backbone',
  'models/character',
],
function( Backbone, Character ) {

  var Villains = Backbone.Collection.extend({
    model: Character
  });

  return new Villains();

});
