const common = require('./common.js');

function addReimbursementItem(form, cutoffId, companyCode){

    let query = `INSERT INTO flex_reimbursement
    (employee_id, flex_cutoff_id, status, date_submitted)
    VALUES (${form.employeeId}, ${cutoffId}, 'draft', '0000-00-00')`;

    return common.executeQuery(query);
}

function getFlexReimbursementByEmployeeId(employeeId){
    let query = `SELECT flex_reimbursement_id, flex_cutoff_id FROM flex_reimbursement
    WHERE employee_id = ${employeeId}`;

    return common.executeQuery(query);
}

function updateTotalAmount(flex_reimbursement_id, amount){
    let query = `UPDATE flex_reimbursement
    SET total_reimbursement_amount = total_reimbursement_amount+${amount}
    WHERE flex_reimbursement_id = ${flex_reimbursement_id}`;

    return common.executeQuery(query);
}

function updateTotalAmountToSubmittedAmount(flex_reimbursement_id, amount){
    let query = `UPDATE flex_reimbursement
    SET total_reimbursement_amount = ${amount}
    WHERE flex_reimbursement_id = ${flex_reimbursement_id}`;

    return common.executeQuery(query);
}

function updateTotalAmountDeductAmount(flex_reimbursement_id, amount){
    let query = `UPDATE flex_reimbursement
    SET total_reimbursement_amount = total_reimbursement_amount-${amount}
    WHERE flex_reimbursement_id = ${flex_reimbursement_id} AND status = 'draft'`;

    return common.executeQuery(query);
}

function submitReimburement(reimbursementId, reimbursement){
    let query = `UPDATE flex_reimbursement
    SET status = 'submitted',
    date_submitted = NOW(),
    transaction_number = CONCAT('${reimbursement.code}-${reimbursement.flex_cutoff_id}-', REPLACE(CURDATE(), '-', ''), '-',${reimbursementId})
    WHERE flex_reimbursement_id = ${reimbursementId}`;

    return common.executeQuery(query);
}

function getTotalAmount(reimbursementId){
    let query = `SELECT total_reimbursement_amount
    FROM flex_reimbursement
    WHERE flex_reimbursement_id = ${reimbursementId}`;

    return common.executeQuery(query);
}

async function getReimbursementListSubmitted(flexCutoffId){
    let query = `SELECT CONCAT(firstname, ', ', lastname) as name,
    employee_number,
    employee.employee_id,
    transaction_number,
    date_submitted,
    total_reimbursement_amount,
    status
    FROM flex_reimbursement
    INNER JOIN employee ON flex_reimbursement.employee_id = employee.employee_id
    INNER JOIN flex_cycle_cutoff ON flex_reimbursement.flex_cutoff_id = flex_cycle_cutoff.flex_cutoff_id
    WHERE status = 'submitted' AND flex_cycle_cutoff.flex_cutoff_id = ${flexCutoffId}`;

    return common.executeQuery(query);
}

function resolveReimbursement(reimbursementId, value){
    let query = `UPDATE flex_reimbursement
    SET status = '${value}'
    WHERE flex_reimbursement_id = ${reimbursementId}`;

    return common.executeQuery(query);
}

function searchReimbursement(form){
    let query = `SELECT CONCAT(firstname, ', ', lastname) as name,
    employee.employee_id,
    employee_number,
    transaction_number,
    flex_reimbursement.date_submitted,
    total_reimbursement_amount,
    flex_reimbursement.flex_cutoff_id,
    flex_reimbursement.status,
        GROUP_CONCAT(
            JSON_OBJECT(
            'flex_reimbursement_detail_id', flex_reimbursement_detail_id,
            'or_number',	or_number,
            'name_of_establishment',	name_of_establishment,
            'amount',	amount
            )
        ) as flex_reimbursement_detail_id
    FROM flex_reimbursement
    INNER JOIN employee ON flex_reimbursement.employee_id = employee.employee_id
    INNER JOIN flex_cycle_cutoff ON flex_reimbursement.flex_cutoff_id = flex_cycle_cutoff.flex_cutoff_id
    INNER JOIN flex_reimbursement_detail ON flex_reimbursement.flex_reimbursement_id = flex_reimbursement_detail.flex_reimbursement_id
    WHERE 1=1`;

    if(common.isNotEmptyNullUndefined(form.firstname)){
        query = query.concat(` AND firstname LIKE '%${form.firstname}%'`);
    }
    if(common.isNotEmptyNullUndefined(form.lastname)){
        query = query.concat(` AND lastname LIKE '%${form.lastname}%'`);
    }
    if(common.isNotEmptyNullUndefined(form.employeeId)){
        query = query.concat(` AND flex_reimbursement.employee_id = ${form.employeeId}`);
    }
    query = query.concat(` GROUP BY flex_reimbursement.flex_reimbursement_id`);

    console.log(query);
    return common.executeQuery(query);
}

function getReimbursementSummary(employeeId){
    let query = `SELECT CONCAT(firstname, ', ', lastname) as name,
    employee.employee_id,
    employee_number,
    transaction_number,
    flex_reimbursement.date_submitted,
    total_reimbursement_amount,
    flex_reimbursement.flex_cutoff_id,
    flex_reimbursement.status
    FROM flex_reimbursement
    INNER JOIN employee ON flex_reimbursement.employee_id = employee.employee_id
    INNER JOIN flex_cycle_cutoff ON flex_reimbursement.flex_cutoff_id = flex_cycle_cutoff.flex_cutoff_id
    WHERE employee.employee_id = ${employeeId}
    AND flex_cycle_cutoff.is_active = 1`;

   return common.executeQuery(query);
}

function getReimbursementById(reimbursementId){
    let query = `SELECT company.code, flex_cutoff_id
    FROM flex_reimbursement
    INNER JOIN employee ON flex_reimbursement.employee_id
    INNER JOIN company ON employee.company_id = company.company_id
    WHERE flex_reimbursement_id = ${reimbursementId}`;

    return common.executeQuery(query);
}

module.exports = { addReimbursementItem,
    getFlexReimbursementByEmployeeId,
    submitReimburement,
    getTotalAmount,
    updateTotalAmount,
    updateTotalAmountToSubmittedAmount,
    updateTotalAmountDeductAmount,
    getReimbursementListSubmitted,
    resolveReimbursement,
    searchReimbursement,
    getReimbursementSummary,
    getReimbursementById };