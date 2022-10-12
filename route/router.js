const express = require('express');
const loginController = require('../controller/loginController.js');
const verifyToken = require('../middleware/verifyToken.js');
const reimbursementController = require('../controller/reimbursementController.js');
const categoryController = require('../controller/categoryController.js');
const fileController = require('../controller/fileController.js');
const flexController = require('../controller/flexController.js');
const logoutController = require('../controller/logoutController.js');

const router = express.Router();

router.post('/login', loginController.login);
router.get('/getMenu', verifyToken.verifyEmployee, categoryController.getMenu);
router.get('/computeFlexPoints', verifyToken.verifyEmployee, flexController.computeFlexPoints);
router.post('/logout', verifyToken.verifyEmployee, logoutController.logout);

//Employee
router.post('/addReimItem', verifyToken.verifyEmployee, reimbursementController.addReimbursementItem);
router.post('/submitReimItem', verifyToken.verifyEmployee, reimbursementController.submitReimburementDetail);
router.post('/submitReimList', verifyToken.verifyEmployee, reimbursementController.submitReimburementList);
router.post('/deleteItem', verifyToken.verifyEmployee, reimbursementController.deleteItemOnList);
router.get('/getPrintable', verifyToken.verifyEmployee, fileController.getPrintable);


//HR
router.get('/getSubmittedReim', verifyToken.verifyHr, reimbursementController.getReimbursementListSubmitted);
router.get('/getReimbursementDetails', verifyToken.verifyHr, reimbursementController.getReimbursementDetailSummary);
router.get('/searchReimbursement', verifyToken.verifyHr, reimbursementController.searchReimbursement);

router.post('/approveReimbursement', verifyToken.verifyHr, reimbursementController.approveReimbursement);
router.post('/rejectReimbursement', verifyToken.verifyHr, reimbursementController.rejectReimbursement);


module.exports = router;