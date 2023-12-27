
class BadRequestException extends Error {
    constructor({ message }) {
        super(message);
        console.warn(`${message}`)
    }
};

module.exports = BadRequestException;