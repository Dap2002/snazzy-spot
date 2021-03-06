// required npm modules
const http = require('http');
const express = require('express');
const path = require('path');
const Register_User = require('./api/Register_User');
const Login_User = require('./api/Login_User');

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
const session = require("express-session");
app.use(session({secret: 'ssshhhhh'}));
var sess;

const {check, validationResult} = require("express-validator");
// Format for a route: app.post('/intended route', (request, result)=>{doSomething})
app.post("/api/register",
    check('full_name').isLength({min: 3}),
    check('email').isEmail(),
    check('password').isStrongPassword(),
    check('bio').isLength({min: 10, max: 200}),
    check('snapchat').isLength({min: 2, max: 128}),
    (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.send({"success": false});
        } else {
            let new_user = new Register_User(request.body);
            new_user.insert_new_user(function (result) {
                response.send({"success": result});
            });
        }
    });


app.post("/api/login", (request, response)=>{
    sess = request.session;
   let login_session = new Login_User(request.body);
   login_session.check_user(function(result){
       if(!result){
           response.send({"success": false});
       }
       else{
           sess.userid = result[0]["id"];
           sess.loggedInStatus = true;
           sess.username = result[0]["full_name"];
           response.send({success:true});
       }
   });
});
