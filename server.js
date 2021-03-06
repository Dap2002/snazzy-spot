// required npm modules
const http = require('http');
const express = require('express');
const path = require('path');
const Register_User = require('./api/Register_User');

let app = express();
app.use(express.json());
//static content
app.use("/", express.static(__dirname + '/web'));
app.use("./js", express.static("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"));

const server = http.createServer(app);
const port = 5000;
server.listen(port);
console.debug('Server listening on port ' + port);
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post("/register.html", function(request, response){
    response.send("hello");
    let new_user = new Register_User(request.body);
});
