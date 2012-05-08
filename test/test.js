var SmisProvider = require('./smis/smis_provider.js').SmisProvider;

var smisProvider = new SmisProvider('localhost', 27017, 'test');

console.log('FindAll');

smisProvider.findAll(function(err, docs) {
  console.log(docs);
});
