 const DEFAULT_SIGNATURE = "";
 const DEFAULT_SALUTATION = ""
 const COMPANY_EMAIL = "aemailscheduler@gmail.com"

const EMAIL_TEMPLATE_CONFIG = {
    content: "",
    user_placeholder_props: [],
    customer_placeholder_props: {},
    signature: DEFAULT_SIGNATURE,
    salutation: DEFAULT_SALUTATION,
    image_props: 
        {


        },
    cc:[],
    bcc: [],
    subject: ""
};

const replacePlaceholders = ({ user_props, customer_props, content}) => {
    let replaced_content = `${content}`;

    for(let key of Object.keys(user_props)) {
        const replace_for = `\$\{user.${key}\}`;
        replaced_content = replaced_content.replace(replace_for, user_props[key]);
    }


    for(let key of Object.keys(customer_props)) {
        const replace_for = `\$\{${key}\}`;
        replaced_content = replaced_content.replace(replace_for, customer_props[key]);
    }
    console.log(" Email content replaced with values" + replaced_content);
    return replaced_content;
}

const getTemplatePlaceholdersFromContent = ({ content }) => {
    const customer_props = new Set();
    const user_props = new Set();
    const WRAPPER_REGEX = /\$\{([^}]*)\}/g;
    const USER_PROPS_REGEX = /^user\./;
    const place_holders = content.match(WRAPPER_REGEX).map(str => str.slice(2, -1));
    for(const place_holder of place_holders) {
        if (place_holder.match(USER_PROPS_REGEX)) {
            user_props.add(place_holder.slice(5));
        } else {
            customer_props.add(place_holder);
        }
    }
    return {
        customer_props: Array.from(customer_props),
        user_props: Array.from(user_props)
    };
}

const verifyPlaceholderProps = ({ provided_props = [], found_props = []}) => {
    if (provided_props.length < found_props.length) return false;
    for(const found_prop of found_props) {
        if (provided_props.indexOf(found_prop) == -1) return false;
    }
    return true;
};

const getTemplatePropsForTemplates = ({ email_template_sids, templateMap, prop_name = "user_placeholder_props"}) => {
    const props = new Set();

    email_template_sids.forEach(email_template_sid => {
        const email_template = templateMap.get(email_template_sid);
        const { [prop_name]: values } = email_template?.props;
        values.map(val => props.add(val));
    });
    return Array.from(props);
};

module.exports = {
    EMAIL_TEMPLATE_CONFIG,
    DEFAULT_SIGNATURE,
    DEFAULT_SALUTATION,
    COMPANY_EMAIL,
    replacePlaceholders,
    getTemplatePlaceholdersFromContent,
    verifyPlaceholderProps,
    getTemplatePropsForTemplates
};