var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = [
  { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
  { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  var idx=id-1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unkown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));


var app = module.exports = express.createServer();

app.configure(function() {
//  app.register('.haml', require('hamljs'));
  app.set('views',__dirname+ '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({secret:'keyboard cat'}));
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname+'/public'));
});


var SmisProvider = require('./smis/smis_provider').SmisProvider;
var SmisView = require('./smis/smis_view').SmisView;
var smis_view = new SmisView(new SmisProvider('localhost', 27017, 'test'));

var UploadView = require('./upload/upload_view').UploadView;
var upload_view = new UploadView();

app.get('/', smis_view.showItems.bind(smis_view));

app.get('/login', function(req, res){
  res.render('login', { user: req.user,baseurl:'/node',layout:false});
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
});

//app.get('/upload', upload_view.index.bind(upload_view));
app.get('/upload', upload_view.index.bind(upload_view));
app.post('/upload', upload_view.upload.bind(upload_view));
app.post('/upload/mongodb/save', upload_view.save.bind(upload_view));

app.get('/smis/search', smis_view.search.bind(smis_view));
app.get('/smis/:id', smis_view.getItem.bind(smis_view));
app.post('/smis/ajax/search', smis_view.searchWithField.bind(smis_view));
app.get('/smis/ajax/search', smis_view.listSearchFields.bind(smis_view));
app.get('/smis/ajax/row/:id', smis_view.getItemsByRowId.bind(smis_view));

app.listen(1337);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
