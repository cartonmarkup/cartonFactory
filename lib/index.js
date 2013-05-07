var Help = require( "./help" );
var Factory = require( "./cartonFactory" );
var Document = require("./document");

module.exports = function ( settings, globalQuery ) {
  var i = arguments.length;
  var document = new Document;
  var factory = { selector: '#', showGrid: false };
  var globalQuery;

  while ( i-- ) {
    if ( typeof arguments[ i ] === 'object' ) for ( var x in  arguments[ i ] ) factory[ x ] = arguments[ i ][ x ];
  }

  return new Factory( factory , document, Help );
}