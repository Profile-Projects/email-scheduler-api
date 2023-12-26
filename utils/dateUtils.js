const postGresTimestamp = (date) => {
    let newDate;
    if (!date) {
        newDate = new Date();
    } else {
        newDate = date;
    }
    return newDate.toISOString();
};

const getImmediateDate = () => {
    const now = new Date();
    const minutesToAdd = 0;
    now.setMinutes(now.getMinutes() + minutesToAdd);
    return postGresTimestamp(now);
}

const getScheduledAt = ({ days = 0, hours = 0, minutes = 0 }) => {
    const now = new Date();
    now.setDate( now.getDate() + days);
    now.setHours(now.getHours() + hours);
    now.getMinutes(now.getMinutes() + minutes);
    return postGresTimestamp(now);
};


module.exports = {
    postGresTimestamp,
    getImmediateDate,
    getScheduledAt
}