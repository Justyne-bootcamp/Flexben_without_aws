const common = require('./common.js');

function getCurrentCutoff(){
    let query = `SELECT flex_cutoff_id, start_date, end_date, cut_off_cap_amount FROM flex_cycle_cutoff
    WHERE is_active = 1 `;

    return common.executeQuery(query);
}

function getCapAmount(){
    let query = `SELECT cut_off_cap_amount FROM flex_cycle_cutoff
    WHERE is_active = 1`;

    return common.executeQuery(query);
}
module.exports = { getCurrentCutoff, getCapAmount };