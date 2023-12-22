const getNumber = (sid= "") => {
    const numberStr = sid.substring(2);
    return parseInt(numberStr);
};

module.exports = {
    getNumber
}