const CustomerRepository = require("../repository/CustomerRepository");
const CrudService = require("./CrudService");

const customerRepository = new CustomerRepository();

class CustomerService extends CrudService {
    
    constructor() {
        super(customerRepository, "CS", "Customer")
    }

};

module.exports = CustomerService;