const db = require("../db/db");
const CrudRepository = require("./CrudRepository");

const tableName = "series";
const columns = ["sid", "customer_sid", "name", "config"];
const json_column_names = [];

class SeriesRepository extends CrudRepository {
    constructor() {
        super(tableName, columns, json_column_names)
    }
};

module.exports = SeriesRepository;