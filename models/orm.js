var Schema = require('jugglingdb').Schema
var schema = new Schema('mysql', { 
  host: '10.20.20.10',
  username: 'grad2',
  password: 'grad_nook',
  database: 'test',
});


Person = schema.define('person', {
  id: {type:String},
  firstname: {type:String},
  lastname: {type:String},
});

exports.Person = Person;
exports.orm_schema = schema
