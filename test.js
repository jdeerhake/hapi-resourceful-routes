var expect = require( "expect.js" ),
  makeResource = require( "./index.js" );


function noop() {};
var config = { handler : "indexConfigHandler" };

var controller = {
  show    : noop,
  index   : config,
  create  : noop,
  edit    : noop,
  "new"   : noop,
  destroy : noop
};

var routes = makeResource({ resource : "thing", controller : controller })

//Index w/ custom config
expect( routes[0] ).to.eql({ path : "/things", method : "GET", config : config });

//New
expect( routes[1] ).to.eql({ path : "/things/new", method : "GET", handler : noop });

//Create
expect( routes[2] ).to.have.property( "path", "/things" );
expect( routes[2] ).to.have.property( "method", "POST" );

//Show
expect( routes[3] ).to.have.property( "path", "/things/{id}" );
expect( routes[3] ).to.have.property( "method", "GET" );

//Edit
expect( routes[4] ).to.have.property( "path", "/things/{id}/edit" );
expect( routes[4] ).to.have.property( "method", "GET" );

//Destroy
expect( routes[5] ).to.have.property( "path", "/things/{id}" );
expect( routes[5] ).to.have.property( "method", "DELETE" );

//empty (no update)
expect( routes[6] ).to.not.be.ok();