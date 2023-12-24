
const getLast10MinutesSchedulesNotCompletedQuery = ({
    tableName,
}) => {
    return  `SELECT * FROM ${tableName} where scheduled_at >= NOW() - INTERVAL '10 minutes' AND mark_complete is false`
}

module.exports = {
    getLast10MinutesSchedulesNotCompletedQuery
};