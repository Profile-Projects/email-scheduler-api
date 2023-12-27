
const getUserPropsForSeries = ({ user, series, customer }) => {
    const { user_props = [], customer_props = [] } = series?.config || {};
    const { props: available_user_props } = user;
    const user_series_props = {};
    for(const key of user_props) {
        if (available_user_props[key]) {
            user_series_props[key] = available_user_props[key];
        }
    } 
    return {
        // user_props: user_series_props,
        // customer_props
    }
};

module.exports = {
    getUserPropsForSeries
};