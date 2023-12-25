const parseJsonProps = (obj, props = []) => {

    return Object.entries(obj).map((key, value) => {
        if (props.includes(key)) {
            return JSON.parse(value);
        }
        return value;
    });
};

const formatItemsByType = (items, type) => {
    if (type === "array") {
        return items;
    }
    if (type === "set") {
        return new Set(...items);
    }

    if (type === "map") {
        const map = new Map();
        items.forEach(item => {
            const { sid } = item;
            map.set(sid, item);
        });
        return map;
    }
};

const removeDuplicates = (list = []) => {
    const set = new Set();
    return list.filter(item => {
        if (set.has(item)) return false;
        set.add(item);
        return true;
    }) || [];
};


const getPropMapFromList = (list, prop, displayProp) => {
    const map = new Map();
    list.forEach(item => {
        const { [prop]: sid, [displayProp]: showProp } = item;
        if (!map.has(sid)) {
            map.set(sid, []);
        }
        map.set(sid, [...map.get(sid), showProp])
    });
    return map;
}

const formatJson = (jsonStr) => {
    try {
        return JSON.parse(jsonStr)
    } catch(err) {
        throw new Error("JSON string not parsable");
    }
}

const copyOnlyNonEmptyObj = (obj) => {
    const formatted_obj = {};
    for(const [key, val] of Object.entries(obj)) {
        if (val) {
            formatted_obj[key] = val;
        }
    }
    return formatted_obj;
}

module.exports = {
    parseJsonProps,
    formatItemsByType,
    removeDuplicates,
    getPropMapFromList,
    formatJson,
    copyOnlyNonEmptyObj
}