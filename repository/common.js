require('dotenv/config');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
  });

function isNotEmptyNullUndefined(string){
    return !(string == "" || string == null || string == undefined);
}

function executeQuery(query){
    return new Promise ((resolve, reject) => {
        connection.query(query, (err, result) => {
            if(err)
                reject(err);
            resolve(result);
        });
    });
}

module.exports = { isNotEmptyNullUndefined, executeQuery };