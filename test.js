var smis= require('./models/smis').Smis;
var orm= require('./models/orm');

var smis_model = new smis();
smis_model.parse({'id':'12-545-678   9','name':'pornthip12 mensin'});

orm.Person.exists(smis_model.person.id,function(err, exists) {
  if(err) throw err;
  if(exists) {
    smis_model.person.save(function(err) {
      if(err) throw err;
    });
  } else {
    orm.Person.create(smis_model.person, function(err) {
      if(err) throw err;
    });
  }
});

console.log(smis_model.person);
console.log(smis_model.person.id);
console.log(smis_model.person.firstname);
console.log(smis_model.person.lastname);

