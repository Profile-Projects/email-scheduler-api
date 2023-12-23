const UserSeriesRepository = require("../repository/UserSeriesRepository");
const { SERIES_STATE } = require("../utils/seriesConfigUtil");
const { getUserPropsForSeries } = require("../utils/userUtils");
const CrudService = require("./CrudService");
const SeriesService = require("./SeriesService");
const UserService = require("./UserService");

const userRepository = new UserSeriesRepository();

const userService = new UserService();
const seriesService = new SeriesService();

class UserSeriesService extends CrudService {
    
    constructor() {
        super(userRepository, "UE")
    }

    async insert({ values }) {
        const [
            user_sid,
            series_sid
        ] = values;

        const user = await userService.findById({ value: user_sid });

        const series = await seriesService.findById({ value: series_sid });

        const props = getUserPropsForSeries({
            user,
            series
        });
        
        return await super.insert({ 
            values: [user_sid, series_sid, SERIES_STATE, props]
        })
    }
};

module.exports = UserSeriesService;