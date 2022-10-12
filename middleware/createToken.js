require('dotenv/config');
const jwt = require('jsonwebtoken');

function createToken(employee){
    return new Promise( (resolve, reject) => {
        jwt.sign(employee, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "3d"}, (err, token) => {
            
            if(err){
                console.log(err)
                reject(err);
            }

            resolve(token);
        });
    });
}

module.exports = { createToken };