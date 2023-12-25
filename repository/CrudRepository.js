const db = require("../db/db");
const DatabaseException = require("../exceptions/DatabaseException");
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
        try {
            const query = insertQuery(this.tableName, this.columns, this.format({values}));
            const result = await db.query(query, [...values]);
            return this.getRow(result);
        } catch(err) {
            throw new DatabaseException({
                tableName: this.tableName,
                action: "insert",
                err
            })
        }
    }

    async findMaxSid() {
        try { 
            const query = findMaxSidQuery({ tableName: this.tableName, sid: this.sid });
            const result = await db.query(query);
            return this.getRow(result);
        } catch(err) {
            throw new DatabaseException({
                tableName: this.tableName,
                action: "fetch",
                err
            })
        }
    }

    async findByIds({ values}) {
        try { 
            const query = findByIdsQuery({
                tableName: this.tableName,
                values
            });
            const result = await db.query(query);
            return this.getRows(result);
        } catch(err) {
            throw new DatabaseException({
                tableName: this.tableName,
                action: "fetch",
                err
            })
        }
    }

    async findById({ sid = "sid", value}) {
        try { 
            const query = findByIdQuery({ tableName: this.tableName, sid });
            const result = await db.query(query, [value]);
            return this.getRow(result);
        } catch(err) {
            throw new DatabaseException({
                tableName: this.tableName,
                action: "fetch",
                err
            })
        }
    };

    async findAll() {
        try { 
            const query = findAllQuery(this.tableName);
            const result = await db.query(query);
            return this.getRows(result);
        } catch(err) {
            throw new DatabaseException({
                tableName: this.tableName,
                action: "fetch",
                err
            })
        }
    }

    async findAllByColumn({colName, colVal}) {
        try { 
            const query = findAllByColumnQuery({ tableName: this.tableName, colName });
            const result = await db.query(query, [colVal]);
            return this.getRows(result);
        } catch(err) {
            throw new DatabaseException({
                tableName: this.tableName,
                action: "fetch",
                err
            })
        }
    };

    async findAllByColumnIds({ colName, values }) {
        try { 
            const query = findAllByColumnIdsQuery({ tableName: this.tableName, colName, values });
            const result = await db.query(query);
            return this.getRows(result);
        } catch(err) {
            throw new DatabaseException({
                tableName: this.tableName,
                action: "fetch",
                err
            })
        }
    };

    async findAllByColumns({ columnObjList }) {
        try { 
            const query = fetchByColumnsQuery({ tableName: this.tableName, columnObjList });
            const result = await db.query(query);
            return this.getRows(result);
        } catch(err) {
            throw new DatabaseException({
                tableName: this.tableName,
                action: "fetch",
                err
            })
        }
    };
    
    async update({
        sidValue,
        columnsToUpdate,
        values
    }) {
        try { 
            const query = updateQuery({ 
                tableName: this.tableName, 
                sid: this.sid,
                sidValue, 
                columnsToUpdate
            });

            const { rowCount = 0} = await db.query(query, [sidValue, ...this.format({values})]);
            return rowCount;
        } catch(err) {
            throw new DatabaseException({
                tableName: this.tableName,
                action: "fetch",
                err
            })
        }
    }

    async delete({ value, sid = "sid" }) {
        try { 
            const query = deleteQuery({ tableName: this.tableName, sid, value});
            const result = await db.query(query, [value]);
            return this.getRow(result);
        } catch(err) {
            throw new DatabaseException({
                tableName: this.tableName,
                action: "fetch",
                err
            })
        }
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