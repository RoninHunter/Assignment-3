
/* Dependencies */
var mongoose    = require('mongoose'), 
    Listing     = require('../models/listings.server.model.js'),
    coordinates = require('./coordinates.server.controller.js');
    
/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions refer back to this tutorial 
  https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/
  or
  https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d
  

  If you are looking for more understanding of exports and export modules - 
  https://www.sitepoint.com/understanding-module-exports-exports-node-js/
  or
  https://adrianmejia.com/getting-started-with-node-js-modules-require-exports-imports-npm-and-beyond/
 */



///////////////////////////////////////////////////////////////////////////////////////
// BUISNESS LOGIC for SERVER SIDE RESOURCE PROCESSING
///////////////////////////////////////////////////////////////////////////////////////

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    listing.coordinates = { latitude: req.results.lat, longitude: req.results.lng };
  }
 
  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
        //console.log(err);
        res.status(400).send(err);
    } else {
        //console.log(listing)
        res.json(listing);
    }
  });
};


/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};


///////////////////////////////////////////////////////////////////////////////////////
/* Update a listing - note the order in which this function is called by the router*/
exports.update = function(req, res) {
  var listing = req.listing;

  /* Replace the listings's properties with the new properties found in req.body */
  /*save the coordinates (located in req.results if there is an address property) */
  listing.name        = req.body.name;
  listing.code        = req.body.code;
  listing.address     = req.body.address;
  
  if(req.results) {
    listing.coordinates = { latitude: req.results.lat, longitude: req.results.lng };
  }

  listing.updated_at  = new Date();

  /* Save the listing */
  listing.save(function(err){
    if(!err){
      res.json(listing);
    }else{
      console.log("Update Failed: ", err);
      res.status(400).send(err); 
    }
  });
 
};


///////////////////////////////////////////////////////////////////////////////////
/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;

  /* Add your code to remove the listins */
  Listing.findOneAndDelete(req.params.listingId, function(err){
    if(!err){
      res.json(listing);
    }else{
      console.log("Delete Failed: ", err);
      res.status(400).send(err);
    }
  });

};


//////////////////////////////////////////////////////////////////////////////////
/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  /* Add your code */
  Listing.find({}, function(err, docs){
    if(!err){
      res.json(docs);
    }else{
      console.log("List Failed: ", err);
      res.status(400).send(err);
    }
  });

};


/* 
/////////////////////////////////////////////////////////////////////////////////////
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  HINT: Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {

  Listing.findById(id).exec(function(err, listing) {

    if(!err) {
      req.listing = listing;
      next();
    } else {
      console.log("Listing ID could not be found: ", err);
      res.status(400).send(err);
    }

  });

};