const { formatItemsByType } = require("../utils/jsonUtils");
const { getNumber } = require("../utils/sidUtils");

class CrudService {

    constructor(repository, sidPrefix) {
        this.repository = repository;
        this.sidPrefix = sidPrefix;
        this.nextSid = null;

        this.fetchAndSetNextSid();
    }

    async insert({ values }) {
        const sid = this.generateNextSid();
        await this.repository.insert({
            values: [sid, ...values]
        });

        return sid;
    }


    async findAll() {
        return await this.repository.findAll();
    }

    async findById({sid = "sid", value }) {
        return await this.repository.findById({ sid, value });
    }

    async findByIds({ sid = "sid", values, listType = "array" }) {
        if (!values.length) return formatItemsByType([], listType);
        const items = await this.repository.findByIds({ sid, values }) || [];
        return formatItemsByType(items, listType);
    }

    async findAllByColumn({ colName, colVal }) {
        return await this.repository.findAllByColumn({ colName, colVal});
    }

    async findAllByColumns({ columnObjList }){
        return await this.repository.findAllByColumns({ columnObjList });
    }

    async findAllByColumnIds({ colName, values }) {
        return await this.repository.findAllByColumnIds({ tableName: this.tableName, colName, values });
    }

    async update({
        sidValue,
        obj,
    }) {

        const columnsToUpdate = Object.keys(obj);
        const values = Object.values(obj);
        return await this.repository.update({
            sidValue,
            columnsToUpdate,
            values
        });
    }

    async delete({
        value
    }) {
        return await this.repository.delete({
            value
        });
    };

    async fetchAndSetNextSid() {
        const result = await this.repository.findMaxSid();
        const { max: existingSid = "XX00000" } = result || {};
        if (!result || !existingSid) {
            this.nextSid = 1;
            console.log(`new sid number is ${this.sidPrefix} ${this.nextSid}`);
            return;
        }
        this.nextSid = getNumber(existingSid) + 1;
        console.log(`next sid number is ${this.sidPrefix} ${this.nextSid}`);
    }

    // utils
    generateNextSid() {
        const nextSidStr = (this.nextSid + "").padStart(5, "0");
        this.nextSid += 1;
        return this.sidPrefix + nextSidStr;
    }
}

module.exports = CrudService;