const db = require("../db/db");
const CrudRepository = require("./CrudRepository");

const tableName = "email_template";
const columns = ["sid", "customer_sid", "props"];
const json_column_names = ["props"];

class EmailTemplateRepository extends CrudRepository {
    constructor() {
        super(tableName, columns, json_column_names)
    }
};

module.exports = EmailTemplateRepository;