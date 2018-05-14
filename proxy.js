/**
 * ref. https://codeforgeek.com/2016/01/multiple-file-upload-node-js/
 */
var express = require('express');
var request = require('request');
var qs = require('querystring');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');


// file upload
var crypto = require('crypto');
var mime = require('mime');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });
  }
});
var upload = multer({ storage: storage })

// create server
var app = express();

// allow CORS request
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.use(express.static(path.join(__dirname, 'public')));
app.use('/photo', express.static('uploads'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/multiple-files', upload.array('photos', 10), (req, res) => {
	console.log(req.files);
	res.end('File is uploaded');
});

app.listen(45454, function() {
  console.log("Server Running at lcoalhost:45454");
});
