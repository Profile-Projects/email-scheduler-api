const NotFoundException = require("../exceptions/NotFoundException");
const { formatItemsByType } = require("../utils/jsonUtils");
const { getNumber } = require("../utils/sidUtils");

class CrudService {

    constructor(repository, sidPrefix, entity_name = "sid") {
        this.repository = repository;
        this.sidPrefix = sidPrefix;
        this.nextSid = null;
        this.entity_name = entity_name;
        this.fetchAndSetNextSid();
    }

    errorHandler({ action = "", message = ""}) {
        throw new InternalServerErrorException({ 
            sid: this.entity_name,
            action,
            message
        })
    }

    async insert({ values }) {
        try {
            const sid = this.generateNextSid();
            await this.repository.insert({
                values: [sid, ...values]
            });
    
            return sid;

        } catch(err) {
            this.errorHandler({ action: "insert", message: `Error while inserting ${err?.message}` });
        }
    }


    async findAll() {
        try {  
            return await this.repository.findAll();

        } catch(err) {
            this.errorHandler({ action: "fetch", message: `Error while fetching ${err?.message}` });
        }
    }

    async findById({sid = "sid", value }) {
        // try {  
            const entity = await this.repository.findById({ sid, value });
            if (!entity) {
                throw new NotFoundException({ sid: this.entity_name, val: value })
            }
            return entity;
        // } catch(err) {
        //     this.errorHandler({ action: "fetch", message: `Error while fetching ${err?.message}` });
        // }
    }

    async findByIds({ sid = "sid", values, listType = "array" }) {
        try {  
            if (!values.length) return formatItemsByType([], listType);
            const items = await this.repository.findByIds({ sid, values }) || [];
            return formatItemsByType(items, listType);
        } catch(err) {
            this.errorHandler({ action: "fetch", message: `Error while fetching ${err?.message}` });
        }
    }

    async findAllByColumn({ colName, colVal }) {
        try {  
            return await this.repository.findAllByColumn({ colName, colVal});
        } catch(err) {
            this.errorHandler({ action: "fetch", message: `Error while fetching ${err?.message}` });
        }
    }

    async findAllByColumns({ columnObjList }){
        try {  
            return await this.repository.findAllByColumns({ columnObjList });
        } catch(err) {
            this.errorHandler({ action: "fetch", message: `Error while fetching ${err?.message}` });
        }
    }

    async findAllByColumnIds({ colName, values }) {
        try { 
            return await this.repository.findAllByColumnIds({ tableName: this.tableName, colName, values });
        } catch(err) {
            this.errorHandler({ action: "fetch", message: `Error while fetching ${err?.message}` });
        }
    }

    async update({
        sidValue,
        obj,
    }) {
        try {    
            await this.findById({ value: sidValue});

            const columnsToUpdate = Object.keys(obj);
            const values = Object.values(obj);
            return await this.repository.update({
                sidValue,
                columnsToUpdate,
                values
            });
        } catch(err) {
            this.errorHandler({ action: "update", message: `Error while updating ${err?.message}` });
        }
    }

    async delete({
        value
    }) {
        try { 
            await this.findById({ value });
            return await this.repository.delete({
                value
            });
        } catch(err) {
            this.errorHandler({ action: "delete", message: `Error while deleting ${err?.message}` });
        }
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