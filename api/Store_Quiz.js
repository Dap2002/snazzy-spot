let Database = require("../models/Database");

class Store_Quiz extends Database{
    constructor(response_list) {
        super();
        this.responses = response_list;
    }
    check_responses(){
        for(let i in this.responses){
            this.responses[i] = parseInt(this.responses[i]);
            if( typeof(this.responses[i]) !== "number" || this.responses[i] <0 || this.responses[i] >10){
                console.debug(typeof this.responses[i]);
                return false;
            }
        }
        return true;
    }
    store_responses(id, callback){
        let sql="UPDATE users " +
            "SET metric_1='"+this.responses[0]+
            "', metric_2='"+this.responses[1]+
            "', metric_3='"+this.responses[2]+
            "', metric_4='"+this.responses[3]+
            "', metric_5='"+this.responses[4]+
            "', metric_6='"+this.responses[5]+
            "', metric_7='"+this.responses[6]+
            "', metric_8='"+this.responses[7]+
            "' WHERE id='"+id+"'";

        Database.conn.query(sql, function(err, result){
            if (err) throw err;
            if(result.affectedRows == 1) return callback(true);
            else return callback(false);
        });

        //Database.conn.query();
    }
}

module.exports = Store_Quiz;