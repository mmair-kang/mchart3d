var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

var server = app.listen(8000, function () {
  console.log('load Success!');
});

app.use('/app',express.static(__dirname + '/app'));
