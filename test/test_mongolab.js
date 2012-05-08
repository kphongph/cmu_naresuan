var mongo = require('mongodb');

var server = new mongo.Server('localhost', 27017, {auto_reconnect:true});
var db = new mongo.Db('test', server);

db.open(function(err, db) {
  if(!err) {
    console.log("We are connected");
    var collection = new mongo.Collection(db, 'test_collection');
//    collection.remove();
    collection.find({"name":"เลขประจำตัว 13 หลัก"}).toArray(function(err, items) {
      for(index in items) {
        console.log("Found "+JSON.stringify(items[index]));
      }
      db.close(function(err, result) {
        if(!err) {
          console.log("Db closed");
        }
      });
    });
  } else {
    console.log("Error "+err);
  }
});

