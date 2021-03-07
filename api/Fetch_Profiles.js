let Database = require('../models/Database');

class Fetch_Profiles extends Database{
    constructor(user_id){
        super();
        this.user_id = user_id;
    }
    fetch_profiles(callback){
        let sql = "SELECT * FROM users U WHERE id NOT IN(SELECT user2 FROM views WHERE user1=?) AND U.id!=?";
        Database.conn.query(sql,[this.user_id, this.user_id], function(err, result){
            if (err) throw err;
            return callback(result);
        });
    }
}

module.exports = Fetch_Profiles;
