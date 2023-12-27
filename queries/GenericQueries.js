const insertQuery = (
    tableName,
    columnNames
) => {
    return generateInsertQuery(tableName, columnNames);
}

/**
 * 
 * Fetch Queries
 */

const findByIdsQuery = ({tableName, values}) => generateFindByIdsQuery(tableName, values);

const findByIdQuery = ({
    tableName,
    sid
}) => `SELECT * FROM ${tableName} where ${sid} = $1`;

const findAllQuery = tableName => `Select * from ${tableName}`;

const findAllByColumnQuery = ({ tableName, colName }) => 
  `SELECT * FROM ${tableName} where ${colName} = $1`;

const findAllByColumnIdsQuery = ({ tableName, colName, values }) => generateFindByIdsQuery(tableName, values, colName);

const findMaxSidQuery = ({tableName, sid}) => `Select max(${sid}) from ${tableName}`;

const fetchByColumnsQuery = ({ tableName, columnObjList }) => generateFindByColumns(tableName, columnObjList);

/**
 * 
 * Update Queries
 */

const updateQuery = ({ tableName, sid, sidValue, columnsToUpdate}) => {
    return generateUpdateQuery(tableName, columnsToUpdate, 
        ` ${sid} = $1`);
}

const generateInsertQuery = (table, columnsToUpdate) => {
    let query =  `INSERT INTO ${table} (`;
    let values_str = '';
    for (const [index, column] of columnsToUpdate.entries()) {
      query += ` ${column} `;
      values_str += `$${index +1}`
      if (index !== columnsToUpdate.length - 1) {
        query += ', ';
        values_str += ", ";
      }
    }
    query += ' ) VALUES ( ' + values_str + " ) RETURNING *;";
    console.log(`insert query : ${query}`);
    return query;
  }

const generateUpdateQuery = (table, columnsToUpdate, whereClause) => {
    let query = `UPDATE ${table} SET`;
  
    for (const [index, column] of columnsToUpdate.entries()) {
      query += ` ${column} = $${index + 2}`;
  
      if (index !== columnsToUpdate.length - 1) {
        query += ',';
      }
    }
  
    if (whereClause) {
      query += ` WHERE ${whereClause};`;
    }
  
    return query;
  };


const generateFindByColumns = (table, columnObjList, values) => {
  let query =  `SELECT * FROM ${table} where `;
  let colStr = columnObjList.map(({ col, val}) => {
    return ` ${col} = '${val}' `;
  }).join(" AND ");
  return `${query} ${colStr} ;`
};


const generateFindByIdsQuery = (table, sids = [], column = "sid") => {
  let query = `SELECT * FROM ${table} where ${column} in ( `;
  let sidsStr = sids.map(sid => `'${sid}'`).join(", ");
  return query + sidsStr + ");";
}

const deleteQuery = ({
    tableName,
    sid,
    value
}) => `DELETE FROM ${tableName} where ${sid} = $1`;

module.exports = {
    insertQuery,
    findAllQuery,
    findAllByColumnQuery,
    findByIdsQuery,
    findByIdQuery,
    findMaxSidQuery,
    updateQuery,
    deleteQuery,
    findAllByColumnIdsQuery,
    fetchByColumnsQuery
};