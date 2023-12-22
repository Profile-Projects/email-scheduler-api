const rootConfig = require('../config/default.json');

const getConfig = () => {
    
    const ENV = process.env.NODE_ENV || "local";
    const config = rootConfig[ENV];
    return config;
}


module.exports = getConfig();