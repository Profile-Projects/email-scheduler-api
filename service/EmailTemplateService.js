const EmailTemplateRepository = require("../repository/EmailTemplateRepository");
const CrudService = require("./CrudService");

const emailTemplateRepository = new EmailTemplateRepository();

class EmailTemplateService extends CrudService {
    
    constructor() {
        super(emailTemplateRepository, "ET", "EmailTemplate")
    };

    async insert({
        content,
        user_placeholder_props,
        customer_placeholder_props,
        signature,
        salutation,
        cc,
        bcc,
        customer_sid,
        name
    }) {

        const props = {
            content,
            user_placeholder_props,
            customer_placeholder_props,
            signature,
            salutation,
            cc,
            bcc
        };

        const email_template_sid = await super.insert({
            values: [customer_sid, props, name]
        });
        return email_template_sid;
    }
};

module.exports = EmailTemplateService;