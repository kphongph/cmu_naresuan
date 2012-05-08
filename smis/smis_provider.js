var mongo = require('mongodb');
var Db = mongo.Db;
var Server = mongo.Server;

var collection_name = 'test_collection';

SmisProvider = function(host, port, db_name){
  this.db = new Db(db_name, new Server(host, port, {auto_reconnect:true}, {})); 
};


SmisProvider.prototype.getCollection = function(callback) {
  var self = this;
  this.db.open(function(err, db) {
    db.collection(collection_name, function(error, smis_collection) {
      if(error) callback(error);
      else {
        callback(null, smis_collection);
        db.close();
      }
    });
  });
};

SmisProvider.prototype.save = function(data, callback) {
  this.getCollection(function(error, smis_collection) {
    if(error) {
      callback(error);
    } else {
      smis_collection.insert({'type':'smis'}, function(error, result) {
        if(error) {
          console.log(error);
          callback(error,null);
        } else {
          var row_id = result[0]._id;
          for(var idx=0;idx<data.length;idx++) {
            smis_collection.insert({'row_id':row_id,
               'name':data[idx]['name'],'value':data[idx]['value']});
          }
          callback(null,row_id);
        }
      });
    }
  });
};

SmisProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, smis_collection) {
    if(error) {
      callback(error);
    } else {
      smis_collection.find().toArray(function(error, results) {
        if(error) {
          callback(error);
        } else { 
          callback(null, results);
        }
      });
    }
  });
};

exports.SmisProvider = SmisProvider
