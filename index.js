var pluralize = require( "pluralize" ),
  Mustache = require( "mustache" );

Mustache.tags = [ "<%", "%>" ];

var routeDefs = {
  index   : { method : "GET"   , path : "/<% pl %>"     },
  "new"   : { method : "GET"   , path : "/<% pl %>/new" },
  create  : { method : "POST"  , path : "/<% pl %>"     },
  show    : { method : "GET"   , path : "/<% pl %>/{<% s %>_id}"      },
  edit    : { method : "GET"   , path : "/<% pl %>/{<% s %>_id}/edit" },
  update  : { method : "PUT"   , path : "/<% pl %>/{<% s %>_id}"      },
  destroy : { method : "DELETE", path : "/<% pl %>/{<% s %>_id}"      }
};

function Resource( name, opts ) {
  this.name = name;
  this.namespace = opts.namespace ? "/" + opts.namespace : "";
  this.parent = opts.parent;
}

Resource.prototype = {
  route : function( action ) {
    return {
      method : routeDefs[ action].method,
      path : this.path( action )
    };
  },
  path : function( action ) {
    return [
      this.namespace,
      this.parent ? this.parent.path( "show" ) : "",
      Mustache.render( routeDefs[ action ].path, this )
    ].join( "" );
  },
  pl : function() {
    return pluralize.plural( this.name );
  },
  s : function() {
    return pluralize.singular( this.name );
  }
};


function makeRoute( resource, controller, action ) {
  var handler = controller[ action ],
    route = resource.route( action );

  if( !handler ) {
    return false;
  } else if( typeof handler === "function" ) {
    route.handler = handler;
  } else {
    route.config = handler;
  }

  return route;
}

function getRoutes( options ) {
  var resource = new Resource( options.resource, options ),
    routes = Object.keys( routeDefs )
               .map( makeRoute.bind( null, resource, options.controller ) )
               .filter(function( x ) { return x; });

  if( options.sub ) {
    options.sub.parent = resource;
    routes = routes.concat( getRoutes( options.sub ) );
  }

  return routes;
}

module.exports = getRoutes;