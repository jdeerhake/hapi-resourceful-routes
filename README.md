hapi-resourceful
================

Generates Rails-y resourceful routes for use with the [Hapi](http://spumko.github.io/) router.

Usage
-----

Given a simple controller API:

```javascript
var thingsController = {
  index : function( request ) {
    request.reply({ things : [ ... ] });
  },
  show : function( request ) {
    request.reply({ thing: 'thing number ' + request.params.thing_id });
  },
  edit :
  ...
}
````

You can generate routes by supplying a name:

```javascript
var resource = require( "hapi-resourceful" )

hapiServer.route( resource({
  name : "thing",
  controller : thingsController
}) );
```

Which is equivalent to:

```javascript
hapiServer.route([
  {
    method : "GET",
    path : "/things",
    handler : thingsController.index
  },
  {
    method : "GET",
    path : "/things/{thing_id}",
    handler : thingsController.show
  },
  ...
]);
```

Controller actions are mapped as follows:

    index    :  GET     /things
    new      :  GET     /things/new
    create   :  POST    /things
    show     :  GET     /things/{thing_id}
    edit     :  GET     /things/{thing_id}/edit
    update   :  PUT     /things/{thing_id}
    destroy  :  DELETE  /things/{thing_id}


Nesting
-------

In order to nest a resource inside another, include another resource definition using the key sub:

```javascript
var resource = require( "hapi-resourceful" )

hapiServer.route( resource({
  name : "thing",
  controller : thingsController,
  sub : {
    name : "widget",
    controller : widgetsController
  }
}) );
```

Which would generate routes like this:

    /things
    /things/{thing_id}
    /things/{thing_id}/widgets
    /things/{thing_id}/widgets/{widget_id}

Resouces can be nested multiple levels deep.


Options
-------

  - `name` (required) - Singular name of resource
  - `controller` (required) - Object containing one or more handler functions OR Hapi route config objects
  - `namespace` - String containing a namespace to prefix to each route. (eg `admin` would give the route `/admin/things/{thing_id}`)
  - `plural` - String containing the pluralization of the name to override the automatically generated guess
  - `sub` - Another object containing these options to describe a nested resource


Inspiration/Links
-----------------

  - [Rails](http://guides.rubyonrails.org/routing.html)
  - [express-resource](https://github.com/visionmedia/express-resource)