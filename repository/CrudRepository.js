const db = require("../db/db");
const { insertQuery, findAllByColumnIdsQuery, fetchByColumnsQuery, findMaxSidQuery, findByIdQuery, findByIdsQuery, updateQuery } = require("../queries/GenericQueries");


class CrudRepository {

    constructor(tableName, columns,json_column_names = []) {
        this.tableName = tableName;
        this.columns = columns;
        this.sid = "sid";
        this.json_column_names = json_column_names;
        this.format_indices = this.getFormatIndices();
    }

    async insert({ values }) { 
        const query = insertQuery(this.tableName, this.columns, this.format({values}));
        const result = await db.query(query, [...values]);
        return this.getRow(result);
    }

    async findMaxSid() {
        const query = findMaxSidQuery({ tableName: this.tableName, sid: this.sid });
        const result = await db.query(query);
        return this.getRow(result);
    }

    async findByIds({ values}) {
        const query = findByIdsQuery({
            tableName: this.tableName,
            values
        });
        const result = await db.query(query);
        return this.getRows(result);
    }

    async findById({ sid = "sid", value}) {
        const query = findByIdQuery({ tableName: this.tableName, sid });
        const result = await db.query(query, [value]);
        return this.getRow(result);
    };

    async findAll() {
        const query = findAllQuery(this.tableName);
        const result = await db.query(query);

        return this.getRows(result);
    }

    async findAllByColumn({colName, colVal}) {
        const query = findAllByColumnQuery({ tableName: this.tableName, colName });
        const result = await db.query(query, [colVal]);
        return this.getRows(result);
    };

    async findAllByColumnIds({ colName, values }) {
        const query = findAllByColumnIdsQuery({ tableName: this.tableName, colName, values });
        const result = await db.query(query);
        return this.getRows(result);
    };

    async findAllByColumns({ columnObjList }) {
        const query = fetchByColumnsQuery({ tableName: this.tableName, columnObjList });
        const result = await db.query(query);
        return this.getRows(result);
    };
    
    async update({
        sidValue,
        columnsToUpdate,
        values
    }) {
        const query = updateQuery({ 
            tableName: this.tableName, 
            sid: this.sid,
            sidValue, 
            columnsToUpdate
        });

        const { rowCount = 0} = await db.query(query, [sidValue, ...values]);
        return rowCount;
    }

    async delete({ value, sid = "sid" }) {
        const query = deleteQuery({ tableName: this.tableName, sid, value});
        const result = await db.query(query, [value]);
        return this.getRow(result);
    }

    getRow(result) {
        if (result?.rows?.length > 0) {
            // return this.parser(result.rows[0]);
            return result.rows[0];
        }
        return null;
    };

    getRows(result) {
        if (result?.rows?.length > 0) return result.rows;
        return [];
    };

    format({ values }) {
        return values.map((value, index) => {
            if (this.format_indices.indexOf(index) > -1) return JSON.stringify(value);
            return value;
        })
    }

    parser(row) {
        const parsed_row = {};
        for(let key of this.json_column_names) {
            if (row[key]) {
                parsed_row[key] = JSON.parse(row[key])
            }
        }
        return {
            ...row,
            ...parsed_row
        }
    }

    getFormatIndices() {
        return this.json_column_names.map(name => this.columns.indexOf(name));
    }
}

module.exports = CrudRepository;