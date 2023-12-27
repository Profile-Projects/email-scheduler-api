const BadRequestException = require("../exceptions/BadRequestException");
const UserSeriesRepository = require("../repository/UserSeriesRepository");
const { getTemplatePropsForTemplates } = require("../utils/emailTemplateUtils");
const { SERIES_STATE, getTemplateSids } = require("../utils/seriesConfigUtil");
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
        const { props: user_props} = user;


        const series = await seriesService.findById({ value: series_sid });

        const { steps = []} = series?.config;

        // get all templateSids
        const email_template_sids = getTemplateSids({ steps });
        
        // getTemplateMap
        const templateMap = await emailTemplateService.findByIds({ values: email_template_sids, listType: "map"});
    
        // get all user_props for template
        const required_user_props = getTemplatePropsForTemplates({
            email_template_sids,
            templateMap
        });

        // Validate Series and User are of same customer
        this.validateUserForSeries({
            user,
            series
        }) 

        // validate user has all props required for all template else throw error with props requried with list
        this.validateUserPropsRequired({
            provided_props: user_props,
            required_props: required_user_props
        })

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

    validateUserPropsRequired({ provided_props, required_props }) {
        const keys = Object.keys(provided_props);
        for(const required_prop of required_props) {
            if (!keys.includes(required_prop)) {
                throw new BadRequestException({ message: `User needs prop ${required_prop} for getting added to series`});
            }
        }
    }

    validateUserForSeries({ series, user }) {
        const { customer_sid: series_customer_sid } = series;
        const { customer_sid: user_customer_sid, sid: user_sid } = user;
        if (series_customer_sid !== user_customer_sid) {
            throw new BadRequestException({ message: `Series belongs to another customer. User ${user_sid} is currently part of ${ user_customer_sid}. `})
        }
        return ; 
    }
};

module.exports = UserSeriesService;