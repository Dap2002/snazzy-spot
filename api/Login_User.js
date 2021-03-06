const Database = require ("../models/Database");
const md5 = require("md5");

class Login_User extends Database{
    constructor(user_data) {
        super();
        this.login_data = user_data;
    }
    check_user(callback){
        this.login_data = this.sanitize_inputs(this.login_data);
        let password = md5(this.login_data["password"]);
        let email = this.login_data["email"];
        Database.conn.query("SELECT * FROM users WHERE email='"+email+"' AND password='"+password+"'", function(err, result1){
            if(err) throw err;
            if(result1.length > 0){
                return callback(result1);
            }
            else{
                return callback(false);
            }
        });
    }

}

module.exports = Login_User;