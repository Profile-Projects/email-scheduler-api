const db = require("../db/db");
const CrudRepository = require("./CrudRepository");

const tableName = "user_series";
const columns = ["sid","user_sid", "series_sid", "state", "props"];
const json_column_names = ["state", "props"];

class UserSeriesRepository extends CrudRepository {
    constructor() {
        super(tableName, columns, json_column_names)
    }
};

module.exports = UserSeriesRepository;