const categoryRepo = require('../repository/categoryRepository.js');

const getMenu = async (_req, res) => {
    try{

        res.json({
            option1: 'Reimburse Item',  
            option2: 'Remove Reimburse Item',
            option3: 'Submit Reimbursement',
            option4: 'Compute Flex Points',
            option5: 'Generate Printable Copy of Reimbursement'
        });
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}

module.exports = { getMenu };