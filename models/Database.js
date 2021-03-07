//include files
let sanitizer = require("sanitizer");
let md5 = require("md5");
require('dotenv').config()

class Database {
    //database connection files - local server must be configured with these details
    constructor(){
        this.mysql = require('mysql');
        Database.conn = this.mysql.createConnection({
            host:"localhost",
            user: "root",
            password: "penpal1!",
            multipleStatements: true
        });
        Database.conn.connect(function(err) {
            if (err) throw err;
            console.debug("Connected!");
        });
        this.create_snazzy_database();
    }

    create_snazzy_database(){
        Database.conn.query("CREATE DATABASE IF NOT EXISTS snazzy_spot;", function(err){if(err) throw err;}); //create schema if not exists
        Database.conn.changeUser({database : 'snazzy_spot'}, function(err) {
            if (err) throw err;
        });
        //create tables in single query
        Database.conn.query("CREATE TABLE IF NOT EXISTS users(id int primary key auto_increment, " +
            "full_name varchar(50)," +
            "email varchar(50) unique, " +
            "password varchar(32), " +
            "bio TEXT," +
            "image varchar(100)," +
            "snapchat_handle varchar(100)," +
            "metric_1 int, " +
            "metric_2 int, " +
            "metric_3 int," +
            "metric_4 int, " +
            "metric_5 int, " +
            "metric_6 int, " +
            "metric_7 int, " +
            "metric_8 int);", function (err) {
            if (err) throw err;
        });
        Database.conn.query(`create table if not exists photos
                             (
                                 user      int         null,
                                 filename  varchar(36) unique not null,
                                 extension varchar(32) not null,
                                 primary key (filename),
                                 constraint photos_users_id_fk
                                     foreign key (user) references users (id)
                                         on update cascade on delete cascade

                             )
            comment 'table for storing all the photos';`, (err) => {
            if (err) throw err;
        });

        Database.conn.query("CREATE TABLE IF NOT EXISTS views (user1 int not null, user2 int not null, " +
            "accept int not null, foreign key(user1) references users(id) on update cascade on delete cascade, " +
            "foreign key(user2) references users(id) on update cascade on delete cascade)", function (err, result) {
            if (err) throw err;
        });

        Database.conn.query("create table if not exists `groups`(group_id int auto_increment primary key, group_name varchar(128) null, group_description text null);" +
            "create table if not exists group_users(group_id int null, user_id  int null, constraint group_users_groups_group_id_fk foreign key (group_id) references `groups` (group_id) on update cascade on delete cascade, constraint group_users_users_id_fk foreign key (user_id) references users (id) on update cascade on delete cascade);")
    }

    read_table(sql, callback){
        Database.conn.query(sql, function(err, results){
            if(err) throw err;
            return callback(results);
        });
    }

    sanitize_inputs(input_array){
        for (const field in input_array){
            input_array[field] = sanitizer.sanitize(input_array[field]);
        }
        return input_array;
    }

}

module.exports = Database;
