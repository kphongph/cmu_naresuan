var csv = require('csv');
var cp874 = require('../utils/cp874decoder');
var SmisProvider = require('../smis/smis_provider').SmisProvider;

var smis_provider = new SmisProvider('localhost', 27017, 'test');

function UploadView() { 
  this.basepath = '/node';
};

UploadView.prototype = {
  index: function(req,res) { 
    res.render('upload_form', {baseurl:this.basepath, layout:false});
  },
  upload: function(req,res) {
    var self = this;
    var rows = [];
    // cp874.decode('/tmp/66f14fd121c8946d9d1486f74cec5a0e', function(data_converted) {
    cp874.decode(req.files.upload.path, function(data_converted) {
      csv().from(data_converted)
      .on('data', function(data, index) {
        rows.push(data);
      })
      .on('end',function(count){
        res.render('upload_list', {baseurl:self.basepath, csv_raw:rows, layout:false});
      })
      .on('error',function(error){
        console.log(error.message);
      });
    });  
  },
  save: function(req,res) {
    var content = req.body.data;
    console.log(content);
    smis_provider.save(content,function(err,rowid) {
      if(err) {
        res.contentType('json');
        res.send('{"status":"error","message":"'+err+'"}');
      } else {
        res.contentType('json');
        res.send('{"status":"ok","row_id":"'+rowid+'"}');
      }
    });
  }
};

exports.UploadView = UploadView;
