var expect = require( "expect.js" ),
  resource = require( "../index.js" );

var utils = {
  noop   : function() {},
  config : { handler : function() {} }
};


describe( "Creating a single resource's routes", function() {
  var controller = {
    show    : utils.noop,
    index   : utils.config,
    create  : utils.noop,
    edit    : utils.noop,
    "new"   : utils.noop,
    destroy : utils.noop
  };

  var routes = resource({
    name : "thing",
    controller : controller
  });

  it( "should generate proper routes", function() {
    expect( routes[1] ).to.eql({ path : "/things/new",           method : "GET",    handler : utils.noop });
    expect( routes[4] ).to.eql({ path : "/things/{thing_id}/edit", method : "GET",    handler : utils.noop });
    expect( routes[5] ).to.eql({ path : "/things/{thing_id}",      method : "DELETE", handler : utils.noop });
  });

  it( "should maintain action order", function() {
    expect( routes[0] ).to.have.property( "path", "/things" );
    expect( routes[4] ).to.have.property( "path", "/things/{thing_id}/edit" );
  });

  it( "should use handler functions", function() {
    expect( routes[1] ).to.have.property( "handler", utils.noop );
  });

  it( "should use config when provided", function() {
    expect( routes[0] ).to.have.property( "config", utils.config );
  });

  it( "should not create routes with no actions", function() {
    expect( routes[6] ).to.not.be.ok(); // No update defined
  });

});

describe( "Routes with a namespace", function() {
  var controller = {
    show : utils.noop
  };

  var routes = resource({
    name : "thing",
    controller : controller,
    namespace : "stuff"
  });

  it( "should prefix the namespace to all routes", function() {
    expect( routes[0] ).to.have.property( "path", "/stuff/things/{thing_id}" );
  })
});

describe( "Nested resources", function() {
  var controller = {
    show : utils.noop
  },
  subController = {
    show : utils.noop,
    index : utils.noop,
    edit : utils.noop
  };

  var routes = resource({
    name : "thing",
    controller : controller,
    sub : {
      name : "widget",
      controller : subController
    }
  });

  it( "should generate parent routes first", function() {
    expect( routes[0] ).to.have.property( "path", "/things/{thing_id}" );
  });

  it( "should nest sub resources under a single parent", function() {
    expect( routes[1] ).to.have.property( "path", "/things/{thing_id}/widgets" );
    expect( routes[2] ).to.have.property( "path", "/things/{thing_id}/widgets/{widget_id}" );
  });
});

describe( "Pluralization", function() {
  var controller = {
    index : utils.noop
  };

  var routes = resource({
    name : "thing",
    plural : "manyThings",
    controller : controller
  });

  it( "should allow manually defined inflection", function() {
    expect( routes[0] ).to.have.property( "path", "/manyThings" );
  });
});