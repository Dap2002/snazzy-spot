//include files
let sanitizer = require("sanitizer");
let md5 = require("md5");
require('dotenv').config()

class Database {
    //database connection files - local server must be configured with these details
    constructor(){
        this.mysql = require('mysql');
        Database.conn = this.mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
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
            "bio varchar(100),"+
            "image varchar(100),"+
            "snapchat_handle varchar(100),"+
            "metric_1 int, " +
            "metric_2 int, " +
            "metric_3 int," +
            "metric_4 int, " +
            "metric_5 int, " +
            "metric_6 int, " +
            "metric_7 int, " +
            "metric_8 int);", function(err){
            if(err) throw err;
        });
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


    check_user(data, callback){
        data = this.sanitize_inputs(data);
        let password = md5(data["password"]);
        let email = data["email"];
        Database.conn.query("SELECT * FROM users WHERE email='"+email+"' AND password='"+password+"'", function(err, result1){
            if(err) throw err;
            if(result1.length > 0){
                return callback(result1);
            }
            else{
                return callback(false);
            }
        });
    }
}

module.exports = Database;
