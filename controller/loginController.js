const employeeRepo = require('../repository/employeeRepository.js');
const token = require('../middleware/createToken.js');
const tokenRepository = require('../repository/tokenRepository.js');

const login = async (req, res) => {
    try{
        const data = await employeeRepo.getEmployeeByEmail(req.body);
        
        const employee = {
            name: data[0].name,
            email: data[0].email,
            role: data[0].role,

        }
        console.log(employee);
        const jwToken = await token.createToken(employee);
        const employeeToken = await tokenRepository.getTokenByEmployeeId(data[0].employee_id);

        console.log(employeeToken);
        if(employeeToken.length > 0){
            await tokenRepository.updateTokenValue(data[0].employee_id, jwToken);
        }
        else{
            await tokenRepository.setEmployeeToken(data[0].employee_id, jwToken);
        }
        res.json({
            token: jwToken});
    }
    catch(error){
        res.sendStatus(500).end(error);
    }
}

module.exports = { login };