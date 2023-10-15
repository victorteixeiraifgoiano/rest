const proprietarioModel = require('../models/proprietarios')
const proprietarioSchema = require('../models/schemas/proprietarios')
const Ajv = require("ajv")
const ajv = new Ajv()

module.exports = {
  getAll,
  getById,
  remove,
  insert,
  update
}

function getAll(_req, res) {
  const proprietarios = proprietarioModel.getAll()
  res.json(proprietarios)
}

function getById(req, res) {
  const id = req.params.id

  const proprietario = proprietarioModel.getById(id)

  if (proprietario) {
    res.json(proprietario)
  } else {
    res.sendStatus(404)
  }
}

function remove(req, res) {
  const id = req.params.id

  if (proprietarioModel.remove(id)) {
    res.sendStatus(200)
  } else {
    res
      .status(404)
      .json({ errors: ['Registro não encontrado'] })
  }
}

function insert(req, res) {
  let proprietario = req.body

  if (ajv.validate(proprietarioSchema, proprietario)) {
    proprietario = proprietarioModel.insert(proprietario)
    res.json(proprietario)
  } else {
    res
      .status(500)
      .json({ errors: ajv.errors })
  }
}

function update(req, res) {
  let proprietario = req.body

  const id = Number.parseInt(req.params.id)
  proprietario.id = id

  if (ajv.validate(proprietarioSchema, proprietario)) {
    if (proprietarioModel.update(proprietario)) {
      res.json(proprietario)
    } else {
      res
        .status(404)
        .json({ errors: ['Registro não encontrado'] })
    }
  } else {
    res
      .status(500)
      .json({ errors: ajv.errors })
  }
}