const db = require("../db/db");
const CrudRepository = require("./CrudRepository");

const tableName = "schedule";
const columns = ["sid", "user_series_sid", "scheduled_at"];
const json_column_names = [];

class ScheduleRepository extends CrudRepository {
    constructor() {
        super(tableName, columns, json_column_names)
    }
};

module.exports = ScheduleRepository;