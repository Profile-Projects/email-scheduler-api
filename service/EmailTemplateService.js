const BadRequestException = require("../exceptions/BadRequestException");
const EmailTemplateRepository = require("../repository/EmailTemplateRepository");
const { getTemplatePlaceholdersFromContent, verifyPlaceholderProps } = require("../utils/emailTemplateUtils");
const { checkObjHasAnyProps } = require("../utils/jsonUtils");
const CrudService = require("./CrudService");
const CustomerService = require("./CustomerService");

const emailTemplateRepository = new EmailTemplateRepository();

const customerService = new CustomerService();

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

        const { props: customer_props } = await customerService.findById({ value: customer_sid });

        this.validateProps({
            content,
            customer_props,
            user_placeholder_props,
            customer_placeholder_props
        })

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

    async update({ sidValue, obj }) {

        const { props } = obj;
        const { props: oldProps, customer_sid } = await super.findById({ value: sidValue });

        const { props: customer_props } = await customerService.findById({ value: customer_sid });

        if (checkObjHasAnyProps({ props: ['content', 'customer_placeholder_props', 'user_placeholder_props'], obj: props })) {
            this.validateProps({
                content: props?.content || oldProps.content,
                user_placeholder_props: props?.user_placeholder_props || oldProps.user_placeholder_props,
                customer_placeholder_props: props?.customer_placeholder_props || oldProps.customer_placeholder_props,
                customer_props
            });
        }

        return await super.update({
            sidValue,
            obj
        })
    }

    validateProps({ content, user_placeholder_props, customer_placeholder_props, customer_props }) {
        const { 
            customer_props: template_customer_props,
            user_props: template_user_props
        } = getTemplatePlaceholdersFromContent({ content });



        if (!verifyPlaceholderProps({ provided_props: user_placeholder_props, found_props: template_user_props }) ||
            !verifyPlaceholderProps({ provided_props: customer_placeholder_props, found_props: template_customer_props})) {
                throw new BadRequestException({ message: `Placeholders on content doesnt match with provided customer or user placeholders`})
            }

        if (!verifyPlaceholderProps({ provided_props: customer_placeholder_props, found_props: Object.keys(customer_props) })) {
            throw new BadRequestException({ message: `Props provided on the template not found on customer props`});
        }
    }
};

module.exports = EmailTemplateService;