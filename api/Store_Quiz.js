let Database = require("../models/Database");

class Store_Quiz extends Database{
    constructor(response_list) {
        this.responses = response_list;
    }
    check_responses(){

    }
}

module.exports = Store_Quiz;