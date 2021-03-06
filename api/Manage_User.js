const Database = require("../models/Database");

class ManageUser extends Database {
    constructor() {
        super()
    }

    static addImage(user, path, extension) {
        Database.conn.query('INSERT INTO photos(user, filename, extension) VALUES(?, ?,?)', [user, path, extension], (error, response) => {
            if (error) throw error;
            return response;
        })
    }

    static getImages(userID, callback) {
        Database.conn.query('SELECT * FROM photos where user = ?', userID, (err, response) => {
            callback(response);
        });
    }

    return_user_info(userId, callback){
        Database.conn.query("SELECT * FROM users WHERE id ='"+userId+"';", function(err, result){
            if (err) throw err;
            return callback(result);
        });
    }

    fetch_user_with_photos(userId, callback){
        Database.conn.query("SELECT * FROM users, photos WHERE users.id='"+userId+"' AND photos.user=users.id", function(err, result){
           if (err) throw err;
           return callback(result);
        });
    }

    add_accept(user1, user2, accept, callback){
        Database.conn.query("INSERT INTO views(user1, user2, accept) VALUES ("+user1+", "+user2+", "+accept+")", function(err,result){
           if (err) throw err;
           return callback(result);
        });
    }

    fetch_matches(userId, callback){
        Database.conn.query("SELECT * FROM users, ")
    }

}
module.exports = ManageUser;
