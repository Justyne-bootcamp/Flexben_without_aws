require('dotenv/config');
const jwt = require('jsonwebtoken');
const tokenRepository = require('../repository/tokenRepository.js');

const verifyEmployee = async (req, res, next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null)
        return res.sendStatus(401);

    if(await isInValidToken(token)){
        return res.sendStatus(401);
    }
    else{

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err)
                return res.sendStatus(403);
            
            req.user = user;
            next();
        });
    }
}

const verifyHr = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null)
        return res.sendStatus(401);
    
    if(await isInValidToken(token)){
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err)
            return res.sendStatus(403);

        req.user = user;
        console.log(user);
        console.log(`user role is ${user.role}`);
        if(user.role == "hr"){
            next();
        }
        else{
            return res.sendStatus(401);
        }
    });
}

async function isInValidToken(token){
    const tokenFromDb = await tokenRepository.getTokenStatus(token);
    
    return tokenFromDb[0].status == 0;
}
module.exports = { verifyEmployee, verifyHr };