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

}
module.exports = ManageUser;
