var express = require('express');

var app = module.exports = express.createServer();

app.configure(function() {
//  app.register('.haml', require('hamljs'));
  app.set('view engine', 'jade');
  app.use(express.static(__dirname+'/public'));
  app.use(express.bodyParser());
});


var SmisProvider = require('./smis/smis_provider').SmisProvider;
var SmisView = require('./smis/smis_view').SmisView;
var smis_view = new SmisView(new SmisProvider('localhost', 27017, 'test'));

var UploadView = require('./upload/upload_view').UploadView;
var upload_view = new UploadView();


// app.get('/upload', upload_view.index.bind(upload_view));
app.get('/upload', upload_view.upload.bind(upload_view));
app.post('/upload/mongodb/save', upload_view.save.bind(upload_view));
app.get('/', smis_view.showItems.bind(smis_view));

app.listen(1337);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


