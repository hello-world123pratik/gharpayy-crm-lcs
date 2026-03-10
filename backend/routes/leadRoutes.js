const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// Automated Capture (Webhook) [cite: 43-44]
router.post('/capture', leadController.captureLead);

// Dashboard Analytics 
router.get('/stats', leadController.getStats);

// Lead Management [cite: 60-70]
router.get('/', leadController.getLeads);
router.put('/:id', leadController.updateLead);

module.exports = router;