var express = require('express');
var app = express.createServer();


app.configure(function() {
  app.register('.haml', require('hamljs'));
  app.set('view engine', 'haml');
  app.use(express.bodyParser());
});

app.get('/', function(req, res) {
  res.render('index', {});
});

app.listen(1337);
