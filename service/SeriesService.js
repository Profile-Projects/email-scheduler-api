const SeriesRepository = require("../repository/SeriesRepository");
const CrudService = require("./CrudService");

const seriesRepository = new SeriesRepository();

class SeriesService extends CrudService {
    
    constructor() {
        super(seriesRepository, "SS")
    }
};

module.exports = SeriesService;