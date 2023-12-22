const ScheduleRepository = require("../repository/ScheduleRepository");
const UserRepository = require("../repository/UserRepository");
const CrudService = require("./CrudService");

const userRepository = new ScheduleRepository();

class ScheduleService extends CrudService {
    
    constructor() {
        super(userRepository, "SC")
    }
};

module.exports = UserService;