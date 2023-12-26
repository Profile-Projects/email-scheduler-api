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


module.exports = {
    EMAIL_TEMPLATE_CONFIG,
    DEFAULT_SIGNATURE,
    DEFAULT_SALUTATION,
    COMPANY_EMAIL,
    replacePlaceholders
};