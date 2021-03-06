let Database = require('../models/Database');

class Fetch_Profiles extends Database{
    constructor(user_id){
        super();
        this.user_id = user_id;
    }
    fetch_profiles(callback){
        let sql = "SELECT * FROM users, views WHERE NOT users.id = "+this.user_id+" AND NOT(views.user1 = "+this.user_id+" AND views.user2 = users.id) ORDER BY users.id ";
        Database.conn.query(sql, function(err, result){
            if (err) throw err;
            return callback(result);
        });
    }

}

module.exports = Fetch_Profiles;