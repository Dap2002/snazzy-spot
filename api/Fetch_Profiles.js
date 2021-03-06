let Database = require('../models/Database');

class Fetch_Profiles extends Database{
    constructor(user_id){
        super();
        this.user_id = user_id;
    }
    fetch_profiles(){
        let sql = "SELECT * FROM users, views WHERE ";
    }

}

module.exports = Fetch_Profiles;