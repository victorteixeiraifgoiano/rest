const fs = require('fs')
const paths = require('./paths')

module.exports = {
  getAll,
  getById,
  insert,
  update,
  remove
}

function loadFile() {
  if (fs.existsSync(paths.PROPRIETARIOS)) {
    const { proprietarios = [] } = JSON.parse(fs.readFileSync(paths.PROPRIETARIOS, 'utf-8'))
    return proprietarios
  } else {
    return []
  }
}

function saveFile(proprietarios) {
  const data = JSON.stringify({ proprietarios: proprietarios })
  fs.writeFileSync(paths.PROPRIETARIOS, data)
}

function getAll() {
  return loadFile()
}

function getById(id) {
  const proprietarios = getAll()
  return proprietarios.find((proprietarios) => proprietarios.id == id)
}

function insert(proprietario) {
  const proprietarios = getAll()

  proprietario.id = getNextId()
  proprietarios.push(proprietario)

  saveFile(proprietarios)

  return proprietario
}

function update(proprietario) {
  const proprietarios = getAll()

  const idx = proprietarios.findIndex((item) => item.id == proprietario.id)

  if (idx < 0) {
    return undefined
  }

  proprietarioAtualizado = {
    ...proprietarios[idx],
    ...proprietario
  }

  proprietarios[idx] = proprietarioAtualizado
  saveFile(proprietarios)

  return proprietarioAtualizado
}

function getNextId() {
  const proprietarios = getAll()

  let nextId = proprietarios
    .reduce((maior, proprietario) => {
      if (proprietario.id > maior) {
        return proprietario.id
      } else {
        return maior
      }
    }, 0)

  nextId++

  return nextId
}

function remove(id) {
  let proprietarios = getAll()
  const tamanhoAnterior = proprietarios.length

  proprietarios = proprietarios.filter((proprietario) => proprietario.id != id)
  saveFile(proprietarios)

  return tamanhoAnterior != proprietarios.length
}