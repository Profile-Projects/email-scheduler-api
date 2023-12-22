const db = require("../db/db");
const CrudRepository = require("./CrudRepository");

const tableName = "users";
const columns = ["sid", "customer_sid", "name", "email"];
const json_column_names = [];

class UserRepository extends CrudRepository {
    constructor() {
        super(tableName, columns, json_column_names)
    }
};

module.exports = UserRepository;