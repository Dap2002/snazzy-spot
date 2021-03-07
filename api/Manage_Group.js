const Database = require("../models/Database");

class ManageGroup extends Database {
    constructor() {
        super()
    }

    create_group(name, description, user, callback) {
        let passcode = Math.random().toString(36).substring(7);
        Database.conn.query(`INSERT INTO \`groups\`(group_name, group_description, group_passcode) VALUES(?,?,'${passcode}');`, [name, description], (err, response) => {
            callback();
        })
    }
}
module.exports = ManageGroup
