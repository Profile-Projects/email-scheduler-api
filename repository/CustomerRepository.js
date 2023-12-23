const db = require("../db/db");
const CrudRepository = require("./CrudRepository");

const tableName = "customer";
const columns = ["sid", "organization_name", "phone_number", "email", "address", "props"];
const json_column_names = ["address", "props"];

class CustomerRepository extends CrudRepository {
    constructor() {
        super(tableName, columns, json_column_names)
    }
};

module.exports = CustomerRepository;