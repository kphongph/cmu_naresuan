var http = require('http');
var util = require('util');
var url = require('url');
var csv = require('csv');
var fs = require('fs');
var formidable = require('formidable');

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();    
    var content = '';
    form.onPart = function(part) {
        if (!part.filename) {
        // let formidable handle all non-file parts
            form.handlePart(part);
        } else { 
            part.addListener('data', function(data) {    
                content += data; 
            });
        }
    };
    
    form.parse(req, function(err, fields, files) {          
        res.writeHead(200, {'content-type': 'text/plain; charset=utf-8'});
        console.log('start csv');
        csv().from(content)
        .on('data', function(data, index) {
            console.log('data');
            res.write('each row:'+'#'+index+' '+JSON.stringify(data)+'\n\n');      
        })
        .on('end',function(count){
            console.log('end');
            res.write('Number of lines: '+count);
            res.end(util.inspect({fields: fields, files: files}));
        })
        .on('error',function(error){
            console.log('error');
            res.write(error.message);
        });
      
        console.log('end csv');
    });
    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
}).listen(1337);
