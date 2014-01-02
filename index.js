var pluralize = require( "pluralize" ),
  Mustache = require( "mustache" );

var routeDefs = {
  index   : { method : "GET"   , path : "/{{resource}}"           },
  "new"   : { method : "GET"   , path : "/{{resource}}/new"       },
  create  : { method : "POST"  , path : "/{{resource}}"           },
  show    : { method : "GET"   , path : "/{{resource}}/{id}"      },
  edit    : { method : "GET"   , path : "/{{resource}}/{id}/edit" },
  update  : { method : "PUT"   , path : "/{{resource}}/{id}"      },
  destroy : { method : "DELETE", path : "/{{resource}}/{id}"      }
};

function makeRoute( resource, controller, action ) {
  var handler = controller[ action ],
    route = {
      path   : Mustache.render( routeDefs[ action ].path, { resource : resource }),
      method : routeDefs[ action ].method
    };

  if( !handler ) {
    return false;
  } else if( typeof handler === "function" ) {
    route.handler = handler;
  } else {
    route.config = handler;
  }

  return route;
}

function makeResource( options ) {
  var resource  = pluralize.plural( options.resource );

  return Object.keys( routeDefs )
          .map( makeRoute.bind( null, resource, options.controller ) )
          .filter(function( x ) { return x; });
}

module.exports = makeResource;