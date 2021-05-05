"use strict";

var express = require('express');

var _require = require('express/lib/response'),
    contentType = _require.contentType;

var app = express();
app.use('/add-product', function (req, res, next) {
  var z = res.end('');
});
app.use('/', function (req, res, next) {
  res.send('path is /');
});
app.listen(8000, function () {
  console.log("Server started on port");
});