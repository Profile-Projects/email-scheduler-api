 
 class InternalServerErrorException extends Error {
    constructor({sid = "", action = "", message = ""}) {
        super(`${sid} had internal error while ${action} with message ${message}`);
        console.warn(`${sid} had internal error while ${action} with message ${message}`)
    }
 }

 module.exports = InternalServerErrorException;