const fs = require('fs/promises');
const reimbursementRepo = require('../repository/reimbursementRepository.js');
const reimbursementDetailRepo = require('../repository/reimbursementDetailRepository.js');
const employeeDetailRepo = require('../repository/employeeRepository.js');

const getPrintable = async (req, res) => {
    try{
        const employee = await employeeDetailRepo.getEmployeeById(req.query.employeeId);
        if(employee.length > 0){
            const reimbursementSummary = await reimbursementRepo.getReimbursementSummary(req.query.employeeId);
            const reimbursementDetailSummary = await reimbursementDetailRepo.getReimbursementSummary(req.query.employeeId);
            
            const content = createContent(reimbursementSummary[0], reimbursementDetailSummary);
            
            const filepath = `./file_repository/`;
            const filename = `reimbursement_${employee[0].lastname}_${employee[0].firstname}_${reimbursementSummary[0].transaction_number}.txt`;
            console.log(filepath);
            await fs.writeFile(filepath+filename, content);

            res.download(`file_repository/${filename}`, filename);
        }
        else{
            res.send("Employee do not exist");
        }
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}

function createContent(reimbursementSummary, reimbursementDetailSummary){

    let content = `
Employee Name:	${reimbursementSummary.name}
Employee Number:	${reimbursementSummary.employee_number}
Date Submitted:		${formatDate(reimbursementSummary.date_submitted.toString())}
Transaction Number: ${reimbursementSummary.transaction_number}
Amount:	Php ${reimbursementSummary.total_reimbursement_amount}
Status:	${reimbursementSummary.status}

=== DETAILS ===
`;


    for( let i = 0; i < reimbursementDetailSummary.length; i++ ){
        if(i > 0){
            if(reimbursementDetailSummary[i-1].name.localeCompare(reimbursementDetailSummary[i].name) != 0){
content  = content.concat(`CATEGORY:  ${reimbursementDetailSummary[i].name}`);
            }
        }
        else{
content  = content.concat(`CATEGORY:  ${reimbursementDetailSummary[i].name}\n`);
        }

content  = content.concat(`
Item # ${i+1}
Date: ${formatDate(reimbursementDetailSummary[i].date_submitted.toString())}
OR Number: ${reimbursementDetailSummary[i].or_number}
Name of Establishment: ${reimbursementDetailSummary[i].name_of_establishment}
TIN of Establishment: ${reimbursementDetailSummary[i].tin_of_establishment}
Amount: Php ${reimbursementDetailSummary[i].amount}
Status: ${reimbursementDetailSummary[i].status}
\n`);
    }

    return content;
}

function formatDate(date){
    if(date == '0000-00-00'){
        return "";
    }
    let dateArray = date.split(" ");
    return  `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}`;
}

module.exports = { getPrintable }