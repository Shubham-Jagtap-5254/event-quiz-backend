const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

router.post('/', leadController.createLead);
router.patch('/:id', leadController.updateLead);
router.post('/reset-tiers', leadController.resetAllTiers);
router.get('/', leadController.getAllLeads);
router.get('/by-phone', leadController.getLeadByPhoneInterest);


module.exports = router;
