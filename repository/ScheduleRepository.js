const db = require("../db/db");
const { getLast10MinutesSchedulesNotCompletedQuery } = require("../queries/ScheduleQueries");
const CrudRepository = require("./CrudRepository");

const tableName = "schedule";
const columns = ["sid", "user_series_sid", "scheduled_at"];
const json_column_names = [];

class ScheduleRepository extends CrudRepository {
    constructor() {
        super(tableName, columns, json_column_names)
    }

    async fetchLast10MinutesSchedules() {
        const query = getLast10MinutesSchedulesNotCompletedQuery({ tableName });
        const result = await db.query(query);
        return this.getRows(result);
    }
};

module.exports = ScheduleRepository;