const Database = require("../models/Database");



class ManageUser extends Database {
    constructor() {
        super();
        this.matches_list = [];
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

    static matches_list_final = [];

    fetch_matches(userId, callback){
        Database.conn.query("SELECT * FROM users, views, photos WHERE users.id='"+userId+"' AND views.user1='"+userId+"' AND views.accept ='1' GROUP BY views.user2;", function(err, result){
            if (err) throw err;
            let query_string = "SELECT DISTINCT user1 FROM users, views WHERE ";
            for (let i in result) {
                let user2Id = result[i]["user2"];
                query_string += " views.user1='" + user2Id + "' AND views.accept='1' AND views.user2='" + userId + "' ";
                if(i != result.length-1){
                    query_string+= "OR";
                }
            }
            query_string+="ORDER BY views.user1";
            Database.conn.query(query_string, function(err, result2){
               if (err) throw err;
               console.log(userId);
               let new_array = [];
               for (let i in result2){
                   if (result2[i]["id"] != userId){
                       new_array.push(result[i]);
                   }
               }
              return callback(new_array);
            });

        });
    }

}
module.exports = ManageUser;
