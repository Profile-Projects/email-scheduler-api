const USER_PROPS = {
    "name": "NAME",
    "country": "COUNTRY",
    "age": "AGE",
    "gender": "GENDER",
}

const SERIES_STATE = {
    step_index: 0
}

const SERIES_STRATEGY = {
    "Serial": "SERIAL"
};

const EMAIL_TEMPLATE_STEP = {
    email_template_sid: ""
};

const SERIES_CONFIG = {
    strategy: SERIES_STRATEGY.Serial,
    steps: [],
    user_props: [],
    customer_props: []
};

const getTemplateSids = ({ steps = [] }) => steps.map(template => template.email_template_sid );

const getTemplateProps = ({ email_template_sids, templateMap, prop_name  = "" }) => {
    const props = new Set();
    email_template_sids.forEach(email_template_sid => {
        const { props: template_props } = templateMap.get(email_template_sid);
        const { [prop_name]: values } = template_props;
        values.forEach(val => props.add(val));
    });
    return Array.from(props);
};

const getCustomerProps = ({ email_template_sids, templateMap}) => {
    let props = {};
    email_template_sids.forEach(email_template_sid => {
        const { props: template_props } = templateMap.get(email_template_sid);
        const { customer_placeholder_props } = template_props;
        props = { ...props, ...customer_placeholder_props };
    })
    return props;
};

module.exports = {
    SERIES_CONFIG,
    SERIES_STRATEGY,
    SERIES_CONFIG,
    SERIES_STATE,
    getTemplateSids,
    getTemplateProps,
    getCustomerProps
};