const common = require('./common.js');

function addReimbursementDetail(form, reimbursement_id){
    console.log(reimbursement_id);
    let query = `INSERT INTO flex_reimbursement_detail
    (flex_reimbursement_id, or_number, name_of_establishment, tin_of_establishment, amount, category_id, date_submitted, status)
    VALUES (
        ${reimbursement_id},
        '${form.or_number}',
        '${form.name_of_establishment}',
        '${form.tin_of_establishment}',
        ${form.amount},
        ${form.category_id},
        '0000-00-00',
        'draft')`;
    
    return common.executeQuery(query);
}

function submitReimbursementDetail(reimbursementDetailId){
    let query = `UPDATE flex_reimbursement_detail
    SET status = 'submitted', date_submitted = NOW()
    WHERE flex_reimbursement_detail_id = ${reimbursementDetailId}`;

    return common.executeQuery(query);
}
function getReimbursementAmount(reimbursementDetailId){
    let query = `SELECT amount FROM flex_reimbursement_detail
    WHERE flex_reimbursement_detail_id = ${reimbursementDetailId}`;

    return common.executeQuery(query);
}

function deleteItemOnList(reimbursementDetailId){
    let query = `DELETE FROM flex_reimbursement_detail
    WHERE flex_reimbursement_detail_id = ${reimbursementDetailId} AND status = 'draft'`;

    return common.executeQuery(query);
}

function getTotalSubmittedAmount(reimbursementId){
    let query = `SELECT SUM(amount) as submitted_amount
    FROM flex_reimbursement_detail
    WHERE flex_reimbursement_id = ${reimbursementId} AND status = 'submitted'`;

    return common.executeQuery(query);
}

function getReimbursementId(reimbursementDetailId){
    let query = `SELECT flex_reimbursement_id
    FROM flex_reimbursement_detail
    WHERE flex_reimbursement_detail_id = ${reimbursementDetailId}`;

    return common.executeQuery(query);
}

function getReimbursementDetailById(reimbursementDetailId){
    let query = `SELECT flex_reimbursement_detail_id, flex_reimbursement_id
    FROM flex_reimbursement_detail
    WHERE flex_reimbursement_detail_id = ${reimbursementDetailId}`;

    return common.executeQuery(query);
}

function getReimbursementDetailSummary(reimbursementDetailId){
    let query = `SELECT CONCAT(firstname, ', ', lastname) as name,
    employee_number,
    flex_reimbursement_detail.date_submitted,
    or_number,
    tin_of_establishment,
    category.name,
    total_reimbursement_amount,
    transaction_number,
    flex_reimbursement_detail.name_of_establishment,
    flex_reimbursement_detail.amount,
    flex_reimbursement_detail.status
    FROM flex_reimbursement_detail
    INNER JOIN flex_reimbursement on flex_reimbursement_detail.flex_reimbursement_id = flex_reimbursement.flex_reimbursement_id
    INNER JOIN employee ON flex_reimbursement.employee_id = employee.employee_id
    INNER JOIN flex_cycle_cutoff ON flex_reimbursement.flex_cutoff_id = flex_cycle_cutoff.flex_cutoff_id
    INNER JOIN category ON flex_reimbursement_detail.category_id = category.category_id
    WHERE flex_reimbursement_detail.status = 'submitted'
    AND flex_reimbursement_detail.flex_reimbursement_detail_id = ${reimbursementDetailId}`;

    return common.executeQuery(query);

}

function getReimbursementSummary(reimbursementlId){
    let query = `SELECT category.name,
    date_submitted,
    or_number,
    name_of_establishment,
    tin_of_establishment,
    amount,
    flex_reimbursement_detail.status
    FROM flex_reimbursement_detail
    INNER JOIN category ON flex_reimbursement_detail.category_id = category.category_id
    WHERE flex_reimbursement_id = ${reimbursementlId}`;

    return common.executeQuery(query);
}

module.exports = { addReimbursementDetail,
    submitReimbursementDetail,
    getReimbursementAmount,
    getTotalSubmittedAmount,
    getReimbursementId,
    deleteItemOnList,
    getReimbursementDetailById,
    getReimbursementDetailSummary,
    getReimbursementSummary };