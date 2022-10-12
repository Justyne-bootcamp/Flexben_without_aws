const reimbursementRepo = require('../repository/reimbursementRepository.js');
const reimbursementDetailRepo = require('../repository/reimbursementDetailRepository.js');
const flexCycleRepo = require('../repository/flexCycleRepository.js');
const companyRepo = require('../repository/companyRepository.js');

const addReimbursementItem = async (req, res) => {

    try{
        const currentCutoff = await flexCycleRepo.getCurrentCutoff();
        let reimbursement = await reimbursementRepo.getFlexReimbursementByEmployeeId(req.body.employeeId);

        if(reimbursement.length > 0){
            await reimbursementDetailRepo.addReimbursementDetail(req.body, reimbursement[0].flex_reimbursement_id);
            
            const result = await updateTotalAmount(reimbursement[0].flex_reimbursement_id, req.body.amount);
            res.json({
                totalAmount: result.totalAmount,
                status: result.status
                }   
            );
        }
        else{
            const companyCode = await companyRepo.getCompanyCode(req.body.employeeId);
            await reimbursementRepo.addReimbursementItem(req.body, currentCutoff[0].flex_cutoff_id, companyCode[0].code);
            
            reimbursement = await reimbursementRepo.getFlexReimbursementByEmployeeId(req.body.employeeId);
            await reimbursementDetailRepo.addReimbursementDetail(req.body, reimbursement[0].flex_reimbursement_id);
            
            const result = await updateTotalAmount(reimbursement[0].flex_reimbursement_id, req.body.amount);
            res.json({
                totalAmount: result.totalAmount,
                status: result.status
                }   
            );
        }
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}

const submitReimburementDetail = async (req, res) => {

    try{
        const reimbursementDetailId = req.body.reimbursementDetailId;
        const reimburseAmount = await reimbursementDetailRepo.getReimbursementAmount(reimbursementDetailId);

        const reimbursementId = await reimbursementDetailRepo.getReimbursementId(reimbursementDetailId);
        let submittedAmount = await reimbursementDetailRepo.getTotalSubmittedAmount(reimbursementId[0].flex_reimbursement_id);

        const capAmount = await flexCycleRepo.getCapAmount();

        const submitable = (submittedAmount[0].submitted_amount + reimburseAmount[0].amount) < capAmount[0].cut_off_cap_amount;

        if(submitable){
            await reimbursementDetailRepo.submitReimbursementDetail(reimbursementDetailId);
            submittedAmount = await reimbursementDetailRepo.getTotalSubmittedAmount(reimbursementId[0].flex_reimbursement_id);
            res.json({
                submittedAmount: submittedAmount[0].submitted_amount,
                message: "succesfully submitted",
                statusCode: "200"
            });
        }
        else{
            res.json({
                submittedAmount: submittedAmount[0].submitted_amount,
                amountToSubmit: reimburseAmount[0].amount,
                capAmount: capAmount[0].cut_off_cap_amount,
                message: "exceed the cap amount for this cut off. Failed to submit",
                statusCode: "400"
            });
        }
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}


async function enoughQuota(reimbursementId, reimburseAmount){
    const totalAmount = await reimbursementRepo.getTotalAmount(reimbursementId);
    const capAmount = await flexCycleRepo.getCapAmount();

    const newTotal = parseInt(reimburseAmount) + totalAmount[0].total_reimbursement_amount;
    return {
        newTotal: newTotal,
        result: newTotal < capAmount[0].cut_off_cap_amount
    }
}

const submitReimburementList = async (req, res) => {

    try{
        let reimbursement = await reimbursementRepo.getReimbursementById(req.body.reimbursementId);
        let totalAmount = await reimbursementRepo.getTotalAmount(req.body.reimbursementId);
        let submittedAmount = await reimbursementDetailRepo.getTotalSubmittedAmount(req.body.reimbursementId);
        const capAmount = await flexCycleRepo.getCapAmount();

        console.log(`${submittedAmount[0].submitted_amount} ${totalAmount[0].total_reimbursement_amount}`);

        if(submittedAmount[0].submitted_amount != totalAmount[0].total_reimbursement_amount){
            await reimbursementRepo.updateTotalAmountToSubmittedAmount(req.body.reimbursementId, submittedAmount[0].submitted_amount);
            totalAmount = await reimbursementRepo.getTotalAmount(req.body.reimbursementId);
        }

        const submitable = totalAmount[0].total_reimbursement_amount < capAmount[0].cut_off_cap_amount;

        if(submitable){
            await reimbursementRepo.submitReimburement(req.body.reimbursementId, reimbursement[0]);

            res.json({
                submittedAmount: totalAmount[0].total_reimbursement_amount,
                message: "succesfully submitted",
                statusCode: "200"
            });
        }
        else{
            res.json({
                submittedAmount: totalAmount[0].total_reimbursement_amount,
                capAmount: capAmount[0].cut_off_cap_amount,
                message: "exceed the cap amount for this cut off. Failed to submit",
                statusCode: "400"
            });
        }

    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}

const deleteItemOnList = async (req, res) => {
    try{
        const reimbursementDetailId = req.body.reimbursementDetailId;
        const reimburseAmount = await reimbursementDetailRepo.getReimbursementAmount(reimbursementDetailId);
        const reimbursementItem = await reimbursementDetailRepo.getReimbursementDetailById(reimbursementDetailId);

        if(reimbursementItem.length > 0){
            await reimbursementDetailRepo.deleteItemOnList(reimbursementDetailId);
            await reimbursementRepo.updateTotalAmountDeductAmount(reimbursementItem[0].flex_reimbursement_id, reimburseAmount[0].amount);

            const totalAmount = await reimbursementRepo.getTotalAmount(reimbursementItem[0].flex_reimbursement_id);
            res.json({
                totalAmount: totalAmount[0].total_reimbursement_amount,
                deductedAmount: reimburseAmount[0].amount,
                message: "succesful delete",
                statusCode: "200"
            });
        }
        else{
            res.json({
                message: "Item do not exist",
                statusCode: "200"
            });
        }

        
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}

async function updateTotalAmount(reimbursementId, amount){
    await reimbursementRepo.updateTotalAmount(reimbursementId, amount);
            
    return doesNotExceedCap(reimbursementId);
}

async function doesNotExceedCap(reimbursementId){
    const totalAmount = await reimbursementRepo.getTotalAmount(reimbursementId);
    const capAmount = await flexCycleRepo.getCapAmount();

    const result = totalAmount[0].total_reimbursement_amount < capAmount[0].cut_off_cap_amount;
    return {
        totalAmount: totalAmount[0].total_reimbursement_amount,
        status: result? "good" : "exceeded"
    }
}

const getReimbursementListSubmitted = async (req, res) => {
    try{
        const reimbursementItem = await reimbursementRepo.getReimbursementListSubmitted(req.body.flexCutoffId)
        res.json(reimbursementItem);
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}

const getReimbursementDetailSummary = async (req, res) => {
    try{
        const reimbursementDetailItem = await reimbursementDetailRepo.getReimbursementDetailSummary(req.body.reimbursementDetailId)
        res.json(reimbursementDetailItem);
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}

const approveReimbursement = async(req, res) => {
    try{
        await reimbursementRepo.resolveReimbursement(req.body.reimbursementId, "Approved");
        res.send("Successfully approved");
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}

const rejectReimbursement = async(req, res) => {
    try{
        await reimbursementRepo.resolveReimbursement(req.body.reimbursementId, "Rejected");
        res.send("Successfully rejected");
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}

const searchReimbursement = async (req, res) => {
    try{
        const data = await reimbursementRepo.searchReimbursement(req.query);
        console.log(data);
        console.log(data.flex_reimbursement_id);
        res.json(data);
    }
    catch(error){
        res.sendStatus(500).send(error);
    }
}
module.exports = { addReimbursementItem,
    submitReimburementDetail,
    submitReimburementList,
    deleteItemOnList,
    getReimbursementListSubmitted,
    getReimbursementDetailSummary,
    approveReimbursement,
    rejectReimbursement,
    searchReimbursement }; 