var SmisProvider = require('../smis/smis_provider.js').SmisProvider;
var BSON = require('mongodb').BSONPure;

var smisProvider = new SmisProvider('localhost', 27017, 'test');

console.log('FindAll');

var oid = new BSON.ObjectID('4fa88a9bce2cde24530000d3');

 
smisProvider.findAll(function(err, docs) {
  console.log('callback');
  var dict = {};
  for(var i=0;i<docs.length;i++) {
    var doc=docs[i];
    if(doc.name) {
      if(!(doc.name in dict)) {
        console.log(doc.name);
        dict[doc.name]='added';
      }
    }
//    console.log(JSON.stringify(doc));
  }
});
