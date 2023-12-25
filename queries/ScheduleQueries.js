
const getLast10MinutesSchedulesNotCompletedQuery = ({
    tableName,
}) => {
    return  `SELECT * FROM ${tableName} where scheduled_at >= NOW() - INTERVAL '10 minutes' AND scheduled_at <= NOW() AND mark_complete is false`
}

module.exports = {
    getLast10MinutesSchedulesNotCompletedQuery
};