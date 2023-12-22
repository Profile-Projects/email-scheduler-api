const db = require("../db/db");
const CrudRepository = require("./CrudRepository");

const tableName = "users";
const columns = ["sid", "customer_sid", "name", "email", "props"];
const json_column_names = ["props"];

class UserRepository extends CrudRepository {
    constructor() {
        super(tableName, columns, json_column_names)
    }
};

module.exports = UserRepository;