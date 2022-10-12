const tokenRepository = require('../repository/tokenRepository.js');

const logout = async (req, res) => {
    try{
        await tokenRepository.updateTokenStatus(0, req.body.employeeId);
        res.send("succesfully logged out");
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}

module.exports = { logout };