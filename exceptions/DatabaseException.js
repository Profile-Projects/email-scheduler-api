
class DatabaseException extends Error {
    constructor({tableName = "", err= "", action = ""}) {
        super(`Error while doing ${action} on ${tableName} : ${err}`);
        console.warn(`DB error while ${action} on ${tableName} with ${err}`);
    }
}

module.exports = DatabaseException;