const Database = require ("../models/Database");

class Register_User extends Database{
    constructor(user_data){
        super();
        console.debug(user_data);

    }
}

module.exports = Register_User;