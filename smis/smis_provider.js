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

SmisProvider.prototype.findById = function(id,callback) {
  this.getCollection(function(error, smis_collection) {
    if( error ) callback(error)
      else {
        smis_collection.findOne({_id: smis_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
  });
};

SmisProvider.prototype.findByRowId = function(id,callback) {
  this.getCollection(function(error, smis_collection) {
    if( error ) callback(error)
      else {
        smis_collection.find({row_id: id}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
  });
};

SmisProvider.prototype.findByRowIdStr = function(id,callback) {
  this.getCollection(function(error, smis_collection) {
    if( error ) callback(error)
      else {
        smis_collection.find({row_id: smis_collection.db.bson_serializer.ObjectID.createFromHexString(id)}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
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


SmisProvider.prototype.filter = function(query, callback) {
  this.getCollection(function(error, smis_collection) {
    if(error) {
      callback(error);
    } else {
      smis_collection.find(query).toArray(function(error, results) {
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
