const common = require('./common.js');

function getEmployeeByEmail(employee){

    let query = `SELECT employee.employee_id, CONCAT(firstname, ' ', lastname) as name, email, role.name AS role FROM employee
    INNER JOIN role ON employee.role_id = role.role_id
    INNER JOIN account ON employee.employee_id = account.employee_id
    WHERE email = '${employee.email}' AND password = '${employee.password}'
    LIMIT 1`;

    return common.executeQuery(query);
}

function getEmployeeById(employeeId){
    let query = `SELECT firstname, lastname
    FROM employee
    WHERE employee_id = ${employeeId}`;

    return common.executeQuery(query);
}

module.exports = { getEmployeeByEmail, getEmployeeById };