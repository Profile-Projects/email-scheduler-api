
class NotFoundException extends Error {
    constructor({ sid = "sid", val = "", message = "" }) {
        super(`${sid} not found for ${val} ${message}`);
        console.warn(`${sid} not found for ${val}`)
    }
}

module.exports = NotFoundException;