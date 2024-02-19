const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario_foto');
const multer = require ('multer')
const multerConfig = require('../config/multer')

router.post('/', multer(multerConfig).single('file'), controller.create)
// router.post('/', controller.create)
router.get('/', controller.retrieve)
router.get('/:id', controller.retrieveOne)
router.put('/:id',  multer(multerConfig).single('file'), controller.update)
router.delete('/:id', controller.delete)

module.exports = router;