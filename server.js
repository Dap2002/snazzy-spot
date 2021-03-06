// required npm modules
const http = require('http');
const express = require('express');
const path = require('path');
const Register_User = require('./api/Register_User');
const Login_User = require('./api/Login_User');
const Manage_User = require('./api/Manage_User');
const Store_Quiz = require('./api/Store_Quiz');
const formidable = require('formidable')
const fs = require('fs');
let app = express();
let md5 = require("md5");
var uuid = require('uuid');

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

function isLoggedIn(req, res, next) {
    try {
        if (req.session.loggedInStatus) {
            next()
        } else {
            res.send({success: false, error: 'Not logged in!'});
        }
    } catch (e) {
        res.send({success: false, error: 'Not logged in!'});
    }
}
const {check, validationResult} = require("express-validator");
// Format for a route: app.post('/intended route', (request, result)=>{doSomething})
app.post("/api/register",
    check('full_name').isLength({min: 3}).escape(),
    check('email').isEmail().escape(),
    check('password').isStrongPassword().escape(),
    check('bio').isLength({min: 10, max: 200}).escape(),
    check('snapchat').isLength({min: 2, max: 128}).escape(),
    (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.send({"success": false, "errors":errors});
        } else {
            let new_user = new Register_User(request.body);
            new_user.insert_new_user(function (result) {
                if(result === true){
                    response.send({"success": result});
                }
                else{
                    response.send({"success": false, "errors":result});

                }
            });
        }
    });


app.post("/api/login", (request, response)=>{
    sess = request.session;
    let login_session = new Login_User(request.body);
    login_session.check_user(function(result){
        if (!result) {
            response.send({"success": false});
        } else {
            sess.userid = result[0]["id"];
            sess.loggedInStatus = true;
            sess.username = result[0]["full_name"];
            response.send({success: true});
        }
    });
});
app.get('/api/status', (req, res) => {
    try {
        if (req.session.loggedInStatus) {
            res.send({logged_in: true, username: req.session.username, id: req.session.userid})
        }
        else{
            res.send({logged_in: false})
        }
    } catch (e) {
        return res.send({logged_in: false})
    }
});

app.post("/api/submit_quiz", isLoggedIn, (request, response) => {
    sess = request.session;

    let quiz = new Store_Quiz(request.body.responses);
    console.debug(quiz.check_responses());
    if (quiz.check_responses()) {
        quiz.store_responses(sess.userid, function (result) {
            response.send({"success": result});
        });
    }
});

app.post('/api/images', isLoggedIn, (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req);
    const filename = uuid.v1();
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/web/profiles/' + filename + path.extname(file.name)
    });
    form.on('file', function (name, file) {
        Manage_User.addImage(req.session.userid, filename, path.extname(file.name))
        res.send({success: true})
    });
});

