const UserSeriesRepository = require("../repository/UserSeriesRepository");
const CrudService = require("./CrudService");

const userRepository = new UserSeriesRepository();

class UserSeriesService extends CrudService {
    
    constructor() {
        super(userRepository, "UE")
    }
};

module.exports = UserSeriesService;