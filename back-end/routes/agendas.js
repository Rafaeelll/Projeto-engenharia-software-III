const express = require('express');
const router = express.Router();
const controller = require('../controllers/agenda')
const auth = require('../lib/auth') 


router.post('/', auth, controller.create)
router.get('/', auth, controller.retrieve)
router.get('/:id',  auth, controller.retrieveOne)
router.put('/:id', auth, controller.update)
router.delete('/:id', auth, controller.delete)


module.exports = router;