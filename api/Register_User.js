const Database = require ("../models/Database");

class Register_User extends Database{
    constructor(user_data){
        super();
        this.user_data = user_data;
    }
    insert_new_user(callback){
        let md5 = require("md5");
        this.user_data = this.sanitize_inputs(this.user_data);
        this.user_data["password"] = md5(this.user_data["password"]);
        Database.conn.query("INSERT INTO users (full_name, email, password, bio, snapchat_handle) VALUES " +
            "('"+this.user_data['full_name']+"', '"+this.user_data['email']+"', '"+this.user_data['password']+"','"+this.user_data['bio']+"', '"+this.user_data['snapchat']+"');", function(err){
            console.debug("Attempted to add new user.");
            if (err) {
                return callback(false);
            }
            else{
                return callback(true);
            }
        });
    }
}

module.exports = Register_User;