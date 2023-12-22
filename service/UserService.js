const UserRepository = require("../repository/UserRepository");
const CrudService = require("./CrudService");

const userRepository = new UserRepository();

class UserService extends CrudService {
    
    constructor() {
        super(userRepository, "US")
    }
};

module.exports = UserService;