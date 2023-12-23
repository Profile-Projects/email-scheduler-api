const SeriesRepository = require("../repository/SeriesRepository");
const CrudService = require("./CrudService");

const EmailTemplateService = require("./EmailTemplateService");

const {
    SERIES_CONFIG, getTemplateSids, getTemplateProps, getCustomerProps

} = require("../utils/seriesConfigUtil");


const emailTemplateService = new EmailTemplateService();

const seriesRepository = new SeriesRepository();

class SeriesService extends CrudService {
    
    constructor() {
        super(seriesRepository, "SS");
    }

    async insert({
        values
    }) {
        const [
            steps,
            customer_sid,
            name
        ] = values;
        
        const email_template_sids = getTemplateSids({ steps });

        const templateMap = await emailTemplateService.findByIds({
            values: email_template_sids,
            listType: "map"
        });

        let series_config = {
            ...SERIES_CONFIG,
            steps,
            user_props: getTemplateProps({
                email_template_sids,
                prop_name: "user_placeholder_props",
                templateMap
            }),
            customer_props: getCustomerProps({
                email_template_sids,
                templateMap
            })
        };
        const series_sid = await super.insert({
            values: [customer_sid, name, series_config]
        });

        return series_sid;

    }
};

module.exports = SeriesService;