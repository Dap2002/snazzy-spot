const Database = require("../models/Database");

class ManageGroup extends Database {
    constructor() {
        super()
    }

    create_group(name, description, user, callback) {
        let passcode = Math.random().toString(36).substring(7);
        Database.conn.query(`INSERT INTO \`groups\`(group_name, group_description, group_passcode) VALUES(?,?,'${passcode}');`, [name, description], (result, rows) => {
            callback(rows.insertId, passcode);
        })
    }

    join_group(user, group_id, group_passcode, callback) {
        Database.conn.query(`SELECT *
                             from \`groups\`
                             WHERE group_id = ?
                               AND group_passcode = ?`, [group_id, group_passcode], (err, response) => {
                try {
                    if (response.length > 0) {
                        Database.conn.query(`INSERT INTO group_users(group_id, user_id)
                                             VALUES (?, ?)`, [group_id, user], (error, result) => {
                            callback(true)
                        })
                    } else {
                        callback(false)
                    }
                } catch (e) {
                    callback(false)
                }
            }
        )
    }

    get_groups(user, callback) {
        Database.conn.query(`SELECT *
                             FROM \`groups\` G,
                                  group_users U
                             WHERE U.user_id = ?
                               AND G.group_id = U.group_id`, [user], (err, response) => {
            callback(response);
        })
    }

    get_members(group_id, callback) {
        Database.conn.query(`SELECT *
                             FROM group_users GU,
                                  users U
                             WHERE GU.group_id = ?
                               AND GU.user_id = U.id`, [group_id], (err, response) => {
            callback(response)
        })
    }

}
module.exports = ManageGroup
