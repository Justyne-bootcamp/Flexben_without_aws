const common = require("./common");

function setEmployeeToken(employeeId, token){
    let query = ` INSERT INTO token
    (employee_id, date_created, status, token_value)
    VALUES(${employeeId}, NOW(), 1, '${token}')`;

    return common.executeQuery(query);
}

function getTokenByEmployeeId(employeeId){
    let query = `SELECT employee_id FROM token WHERE employee_id = ${employeeId}`;

    return common.executeQuery(query);
}

function updateTokenValue(employeeId, token){
    let query = `UPDATE token
    SET token_value = '${token}', status = 1
    WHERE employee_id = ${employeeId}`;

    return common.executeQuery(query);
}

function updateTokenStatus(status, employeeId){
    let query = `UPDATE token
    SET status = ${status}
    WHERE employee_id = ${employeeId}`;

    return common.executeQuery(query);
}

function getTokenStatus(token){
    let query = `SELECT status
    FROM token
    WHERE token_value = '${token}'`;

    return common.executeQuery(query);
}

module.exports = { setEmployeeToken, getTokenByEmployeeId, updateTokenValue, updateTokenStatus, getTokenStatus };