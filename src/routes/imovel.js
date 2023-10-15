const log = require('./middlewares/log')
const imoveisController = require('../controllers/imovel')

const express = require('express')
const router = express.Router()

router.get('/imoveis', log, (req, res) => {
  imoveisController.getAll(req, res)
})

router.get('/imoveis/:id', log, (req, res) => {
  imoveisController.getById(req, res)
})

router.post('/imoveis', log, (req, res) => {
  imoveisController.insert(req, res)
})

router.put('/imoveis/:id', log, (req, res) => {
  imoveisController.update(req, res)
})

router.delete('/imoveis/:id', log, (req, res) => {
  imoveisController.remove(req, res)
})

module.exports = router