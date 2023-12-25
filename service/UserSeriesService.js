const UserSeriesRepository = require("../repository/UserSeriesRepository");
const { SERIES_STATE } = require("../utils/seriesConfigUtil");
const { getUserPropsForSeries } = require("../utils/userUtils");
const CrudService = require("./CrudService");
const EmailTemplateService = require("./EmailTemplateService");
const ScheduleService = require("./ScheduleService");
const SeriesService = require("./SeriesService");
const UserService = require("./UserService");

const userRepository = new UserSeriesRepository();

const userService = new UserService();
const seriesService = new SeriesService();
const scheduleService = new ScheduleService();
const emailTemplateService = new EmailTemplateService();

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

        // initiate first step if trigger type is immediate

        const { steps } = series?.config;
        const [ first_step ] = steps;
        
        const user_series_sid = await super.insert({ 
            values: [user_sid, series_sid, SERIES_STATE, props]
        });

        if (scheduleService.checkStepForTrigger({ step: first_step})) {
            const { email_template_sid } = first_step;
            const email_template = await emailTemplateService.findById({ value: email_template_sid });
            await scheduleService.executeStep({
                step: first_step,
                step_index: 0,
                series,
                user,
                email_template,
                user_series_sid
            });
        }
    }
};

module.exports = UserSeriesService;