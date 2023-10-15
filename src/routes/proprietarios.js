const log = require('./middlewares/log')
const proprietariosController = require('../controllers/proprietario')

const express = require('express')
const router = express.Router()

router.get('/proprietarios', log, (req, res) => {
  proprietariosController.getAll(req, res)
})

router.get('/proprietarios/:id', log, (req, res) => {
  proprietariosController.getById(req, res)
})

router.post('/proprietarios', log, (req, res) => {
  proprietariosController.insert(req, res)
})

router.put('/proprietarios/:id', log, (req, res) => {
  proprietariosController.update(req, res)
})

router.delete('/proprietarios/:id', log, (req, res) => {
  proprietariosController.remove(req, res)
})

module.exports = router