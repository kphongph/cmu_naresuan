var orm = require('./orm');

var Smis = function() {
  this.person = null;
  this.parse = function(parsed_obj) {
    this.person = new orm.Person();
    this.person.id = parsed_obj.id.replace(/[-\s+]/g,'');
    var result = parsed_obj.name.match(/(\w+)\s(\w+)/);
    if(result) {
      this.person.firstname = result[1];
      this.person.lastname = result[2];
    }
   // this.person.firstname = parsed_obj.name.replace(/[-\s+]/g,'');
  };
}

exports.Smis = Smis
