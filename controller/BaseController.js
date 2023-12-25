const DatabaseException = require("../exceptions/DatabaseException");
const InternalServerErrorException = require("../exceptions/InternalServerErrorException");
const NotFoundException = require("../exceptions/NotFoundException");

class BaseController {

    constructor(app) {
        this.app = app;
        // this.initAppHandlers();
    }

    initAppHandlers() {
        this.app.use((err, req, res, next) => {

            switch(err) {
                case err instanceof NotFoundException:
                    return this.handleNotFoundException({res, err});
                case err instanceof InternalServerErrorException:
                    return this.handleInternalServerErrorException({ err, res });
                case err instanceof DatabaseException:
                    return this.handleDatabaseException({ err, res });
                default:
                    return this.handleDatabaseException({ res, err })
            }
        })
    }

    handleNotFoundException({
        err,
        res,
    }) {
        const {message = "Sid not found" } = err || {};
        return res.status(404).json({ message })
    }

    handleInternalServerErrorException({
        err,
        res,
    }) {
        const {message = "Internal Server Error" } = err || {};
        return res.status(500).json({ message })
    }

    handleDatabaseException({
        err,
        res
    }) {
        const { message = "Database exception" } = err || {};
        return res.status(500).json({ message });
    }
}

module.exports = BaseController;