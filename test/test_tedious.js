var Connection = require('tedious').Connection;

var config = {
    userName: 'sjsniper_pro',
    password: '02340234',
    server: 'db203.my-hosting-panel.com',
};

var connection = new Connection(config);
connection.on('connect', function(err) {
  if(err) console.log('Error' + err);
  else {
    console.log('Connected');
  }
});
