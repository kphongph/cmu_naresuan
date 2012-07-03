exports.parse = function(data_list, configure, callback) {
  var obj_list = [];
  for(var row=0;row<data_list.length;row++) {
    var obj={};
    var found = false;
    for(var col=0;col<data_list[row].length;col++) { 
      for(var header in configure.headers) {
        if(!('index_col' in configure.headers[header])) {
          if(configure.headers[header].title == data_list[row][col]) {
            configure.headers[header]['index_col']=col;
            console.log(row+' '+col+' '+header);
            console.log(configure.headers[header]);
            console.log('index_col '+configure.headers[header]['index_col']);
          }
        } else {
          if(configure.headers[header]['index_col']==col) {
            if(configure.headers[header].title != data_list[row][col]) {
              obj[header] = data_list[row][col];
              found=true;
            }
          }
        }
      }
    }
    if(found) {
      var validated=true;
      // validate content
      for(var key in configure.headers) {
        // required
        if('required' in configure.headers[key]) {
          if(configure.headers[key].required) {
            if(!(key in obj)||(obj[key].length==0)) { 
              validated=false;  
              break;
            }
          }
        }
       
        if(('regex' in configure.headers[key])) {
          console.log(obj[key].match(configure.headers[key].regex));
          if(!obj[key].match(new RegExp(configure.headers[key].regex))) {
              validated=false;  
              break;
          }
        }
      }
      if(validated) {
        obj_list.push(obj);
      }
    }
  }
  return obj_list;
};
