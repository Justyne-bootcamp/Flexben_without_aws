const common = require('./common.js');

function getCompanyCode(employee_id){
    let query = `SELECT code FROM company
    INNER JOIN employee ON company.company_id = employee.company_id
    WHERE employee_id = ${employee_id}`

    return common.executeQuery(query);
}

module.exports = { getCompanyCode };