const common = require("./common");

function getMenu(){
    let query = `SELECT code, name, description FROM category`;

    return common.executeQuery(query);
}

module.exports = { getMenu };