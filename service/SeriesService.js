const SeriesRepository = require("../repository/SeriesRepository");
const CrudService = require("./CrudService");

const EmailTemplateService = require("./EmailTemplateService");

const {
    SERIES_CONFIG, getTemplateSids, getTemplateProps, getCustomerProps, formatSteps

} = require("../utils/seriesConfigUtil");
const InternalServerErrorException = require("../exceptions/InternalServerErrorException");


const emailTemplateService = new EmailTemplateService();

const seriesRepository = new SeriesRepository();

class SeriesService extends CrudService {
    
    constructor() {
        super(seriesRepository, "SS", "Series");
    }

    errorHandler({ action = "", message = ""}) {
        throw new InternalServerErrorException({ sid : this.entity_name, message, action });
    }

    async insert({
        values
    }) {
        try {
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
    
            const formatted_steps = formatSteps({ steps });
    
            let series_config = {
                ...SERIES_CONFIG,
                steps: formatted_steps,
                // user_props: getTemplateProps({
                //     email_template_sids,
                //     prop_name: "user_placeholder_props",
                //     templateMap
                // }),
                // customer_props: getTemplateProps({
                //     email_template_sids,
                //     templateMap,
                //     prop_name: "customer_placeholder_props",
                // })
            };
            const series_sid = await super.insert({
                values: [customer_sid, name, series_config]
            });
    
            return series_sid;
            
        } catch(err) {
            this.errorHandler({ action: "insert", message: `Error while inserting ${err?.message}`});
        }
    }
};

module.exports = SeriesService;