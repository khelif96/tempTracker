// Dependencies
const express = require('express');
const router = express.Router();

const update = require('../controller/update')

router.post('/update', update.request);

module.exports = router;
