var express = require('express');
var formidable = require('formidable');
var csv = require('csv');
var fs = require('fs');
var cp874 = require('./utils/cp874decoder');
var csvparser = require('./utils/parser');

var smis= require('./models/smis').Smis;

var app = express.createServer();
var basepath = '/node'

app.configure(function() {
  app.register('.haml', require('hamljs'));
  app.set('view engine', 'haml');
  app.use(express.static(__dirname+'/public'));
  app.use(express.bodyParser());
});

app.get('/', function(req, res) {
  res.render('upload_form', {baseurl:basepath});
});

app.post('/upload', function(req, res) {
  var obj_list = [];
  // cp874.decode(req.files.upload.path, function(data) {
  console.log(req.body.parser_configure);
  cp874.decode('/tmp/66f14fd121c8946d9d1486f74cec5a0e', function(data_converted) {
    csv().from(data_converted)
    .on('data', function(data, index) {
      obj_list.push(data);
    })
    .on('end',function(count){
      var test_list =csvparser.parse(obj_list,JSON.parse(req.body.parser_configure), function() {
      });
      // smis
      for(var i=0;i<test_list.length;i++) {
        var smis_model = new smis();
        smis_model.parse(test_list[i]);
        console.log(smis_model.person.pid);
        smis_model.person.save();
      }
      res.render('upload_list', {baseurl:basepath, object_list:test_list,csv_raw:obj_list});
    })
    .on('error',function(error){
      console.log(error.message);
    });
  });
});

app.listen(1337);
