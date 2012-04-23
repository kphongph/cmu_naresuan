var fs = require('fs');

exports.decode = function(path, callback) {
  var reader = fs.createReadStream(path);
  var utf8 = '';
  reader.on('data', function(data) {
    buf = new Buffer(data.length*3);
    index = 0;
    for(var i=0;i<data.length;i++) {
      if(data[i]<=160) {
        switch(data[i]) {
          case 133: 
            buf[index++] = 226;
            buf[index++] = 128;
            buf[index++] = 166;
            break;
          default:
            buf[index++] = data[i];
        }
      } else {
        if(data[i]<224) {
          buf[index++] = 224;
          buf[index++] = 184;
          buf[index++] = data[i] - 161 + 129;
        } else {
          buf[index++] = 224;
          buf[index++] = 185;
          buf[index++] = data[i] - 224 + 128;
        }
      }
    }
    utf8+=buf.toString('utf8',0, index);
  });

  reader.on('end', function() {
    callback(utf8);
  });
}

