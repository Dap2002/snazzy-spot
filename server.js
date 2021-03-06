// required npm modules
const http = require('http');
const express = require('express');
const path = require('path');
const Register_User = require('./api/Register_User');
const Login_User = require('./api/Login_User');
const Manage_User = require('./api/Manage_User');
const Store_Quiz = require('./api/Store_Quiz');
const Fetch_Profile = require('./api/Fetch_Profiles');
const Manage_Group = require('./api/Manage_Group');
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
app.get('/api/images', isLoggedIn, (req, res) => {
    Manage_User.getImages(req.session.userid, (response) => {
        res.send(response);
    })
});

app.post('/api/fetch_profiles', isLoggedIn, (request, response) => { //add isloggedin
    sess = request.session;
    let profiles = new Fetch_Profile(sess.userid);
    profiles.fetch_profiles(function(res){
        response.send(res);
    });
});

app.post('/api/fetch_user_metrics', isLoggedIn, (request, response) => { //add isloggedin
    sess = request.session;
    let user = new Manage_User();
    user.return_user_info(sess.userid, function (user_metrics) {
        response.send(user_metrics);
    });
});

app.post('/api/fetch_profile', isLoggedIn, (request, response) => { //add isloggedin
    sess = request.session;
    let user = new Manage_User();
    user.fetch_user_with_photos(request.body.profile_id, function (res) {
        response.send(res);
    });
});

app.post('/api/accept_reject', isLoggedIn, (request, response) => {
    sess = request.session;
    const acceptOrReject = new Manage_User();
    acceptOrReject.add_accept(sess.userid, request.body.profile_id, request.body.accept, function (result) {
        if (result["affectedRows"] === 1) {
            response.send({"success": true});
        } else {
            response.send({"success": false});
        }
    });
});

app.post('/api/fetch_matches', isLoggedIn, (request, response) => {
    sess = request.session;
    const matches = new Manage_User();
    matches.fetch_matches(sess.userid, function (result) {
        response.send(result)
    });
});

app.post('/api/fetch_snap', isLoggedIn, (request, response) => {
    let snapcode = require('snapcode');
    console.debug(request.body);
    snapcode.username(request.body.snap, function (svg) {
        response.send({"svg": svg});
    });
});
app.post('/api/group/create', isLoggedIn, check('name').isLength({min: 3, max: 128}),
    check('description').isLength({min: 1}), (req, res) => {
        const group = new Manage_Group();
        group.create_group(req.body.name, req.body.description, req.session.userid, (group_id, passcode) => {
            console.log(group_id, passcode)
            group.join_group(req.session.userid, group_id, passcode, (response) => {
                res.send({success: response});
            });
        });
    });
app.post('/api/group/join', isLoggedIn, (req, res) => {
    const group = new Manage_Group();
    group.join_group(req.session.userid, req.body.id, req.body.password, (response) => {
        res.send({success: response});
    });
});
app.post('/api/group/add', isLoggedIn, (req, res) => {
    const group = new Manage_Group();
    group.add_group(req.session.userid, req.body.group_id, (response) => {
        res.send({success: response})
    })
})
app.post('/api/group/people', isLoggedIn, (req, res) => {
    const group = new Manage_Group();
    group.get_members(req.body.id, (response) => {
        res.send(response)
    });
});
app.get('/api/group/load', isLoggedIn, (req, res) => {
    const group = new Manage_Group();
    group.get_groups(req.session.userid, (response) => {
        res.send(response);
    });
});
app.get('/api/logout', isLoggedIn, (req, res) => {
    req.session.destroy();
    res.send({success: true});
});

