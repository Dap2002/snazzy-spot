// required npm modules
const http = require('http');
const express = require('express');
const path = require('path');

let app = express();
app.use(express.json());
app.use(express.static(__dirname+"/front-end"));
app.use(express.static(__dirname +"/web"));
//static content
app.use("/css", express.static("/web/css"));
app.use('/js', express.static(__dirname + '/web/js'));
app.use('/images', express.static(__dirname + '/web/mages'));
app.use("./js", express.static("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"));

const server = http.createServer(app);
const port = 5000;
server.listen(port);
console.debug('Server listening on port ' + port);
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
