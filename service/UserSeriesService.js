const UserSeriesRepository = require("../repository/UserSeriesRepository");
const { SERIES_STATE } = require("../utils/seriesConfigUtil");
const { getUserPropsForSeries } = require("../utils/userUtils");
const CrudService = require("./CrudService");
const EmailTemplateService = require("./EmailTemplateService");
const SeriesService = require("./SeriesService");
const UserService = require("./UserService");

const userSeriesRepository = new UserSeriesRepository();

const userService = new UserService();
const seriesService = new SeriesService();
const emailTemplateService = new EmailTemplateService();

class UserSeriesService extends CrudService {
    
    constructor() {
        super(userSeriesRepository, "UE", "userSeries")
    }

    async insert({ values }) {
        const [
            user_sid,
            series_sid
        ] = values;

        const user = await userService.findById({ value: user_sid });

        const { customer_sid } = user;

        const series = await seriesService.findById({ value: series_sid });

        const props = getUserPropsForSeries({
            user,
            series
        });
        
        const user_series_sid = await super.insert({ 
            values: [user_sid, series_sid, SERIES_STATE, props]
        });

        return {user_series_sid, series, user};
    }

    async updateStepIndex({ step_index, user_series_sid }) {
        const user_series = await super.findById({ value: user_series_sid });
        return await super.update({
            sidValue: user_series_sid,
            obj:{
                state: {
                    step_index
                }
            }
        })
    };
};

module.exports = UserSeriesService;