const fs = require('fs')
const request = require('supertest')
const app = require('../../../app')
const { createProprietario } = require('../../factories/proprietarios')
const proprietarioModel = require('../../../src/models/proprietarios')
const proprietarios = require('../../../src/models/schemas/proprietarios')

const path = './data/proprietariosControllerTest.json'

jest.mock('../../../src/models/paths', () => {
  return {
    PROPRIETARIOS: path
  }
})

describe('testes para controllers/proprietario', () => {

  beforeEach(() => {
    const data = { proprietarios: [] }
    fs.writeFileSync(path, JSON.stringify(data))
  })

  afterEach(() => {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path)
    }
  })

  describe('GET /proprietarios', () => {

    test('obter todos os proprietarios', async () => {
      proprietarioModel.insert(createProprietario({ nome: 'nome 01' }))
      proprietarioModel.insert(createProprietario({ nome: 'nome 02' }))

      const response = await request(app).get('/proprietarios')

      expect(response.statusCode).toEqual(200)

      expect(response.body).toEqual([
        expect.objectContaining({ nome: 'nome 01' }),
        expect.objectContaining({ nome: 'nome 02' })
      ])
    })

    test('obter uma lista vazia de proprietarios', async () => {
      fs.unlinkSync(path)

      const response = await request(app).get('/proprietarios')

      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual([])
    })

  })

  describe('GET /proprietarios/:id', () => {

    test('retorna um proprietario existente', async () => {
      proprietarioModel.insert(createProprietario({ nome: 'nome 01' }))
      proprietarioModel.insert(createProprietario({ nome: 'nome 02' }))

      const response = await request(app).get('/proprietarios/2')

      expect(response.statusCode).toEqual(200)

      expect(response.body).toEqual(
        expect.objectContaining({ id: 2, nome: 'nome 02' }))
    })

    test('não retorna um proprietario inexistente', async () => {
      fs.unlinkSync(path)

      const response = await request(app).get('/proprietarios/2')

      expect(response.statusCode).toEqual(404)
      expect(response.body).toEqual({})
    })

  })

  describe('DELETE /proprietarios/:id', () => {

    test('remove um proprietario existente', async () => {
      proprietarioModel.insert(createProprietario({ nome: 'nome 01' }))
      proprietarioModel.insert(createProprietario({ nome: 'nome 02' }))

      const response = await request(app).delete('/proprietarios/2')
      expect(response.statusCode).toEqual(200)

      const proprietario = proprietarioModel.getById(2)
      expect(proprietario).toBeUndefined()
    })

    test('não remove um proprietario inexistente', async () => {
      const response = await request(app).delete('/proprietarios/2')

      expect(response.statusCode).toEqual(404)

      expect(response.body).toEqual({
        errors: ['Registro não encontrado']
      })
    })

  })

  describe('POST /proprietarios', () => {

    test('insere um novo proprietario', async () => {
      const proprietario = {
        nome: 'nome 01',
        cpf: 'numero de cpf'
      }

      const response = await request(app)
        .post('/proprietarios')
        .send(proprietario)

      expect(response.statusCode).toEqual(200)

      expect(response.body).toEqual({
        id: 1,
        nome: 'nome 01',
        cpf: 'numero de cpf'
      })

      const proprietarios = proprietarioModel.getAll()

      expect(proprietarios).toEqual([
        {
          id: 1,
          nome: 'nome 01',
          cpf: 'numero de cpf'
        }
      ])
    })

    test('não insere um proprietario porque a entrada de dados é inválida', async () => {
      const proprietario = {
        cpf: 'numero de cpf'
      }

      const response = await request(app)
        .post('/proprietarios')
        .send(proprietario)

      expect(response.statusCode).toEqual(500)

      expect(response.body).toEqual({
        errors: [
          {
            instancePath: '',
            keyword: 'required',
            message: 'must have required property \'nome\'',
            params: {
              missingProperty: 'nome',
            },
            schemaPath: '#/required',
          },
        ]
      })
    })

  })

  describe('PUT /proprietarios', () => {

    test('altera um registro existente', async () => {
      proprietarioModel.insert(createProprietario({
        nome: 'nome 01',
        cpf: 'numero de cpf'
      }))

      const proprietario = {
        nome: 'nome 222',
        cpf: 'numero de cpf'
      }

      const response = await request(app)
        .put('/proprietarios/1')
        .send(proprietarios)

      expect(response.statusCode).toEqual(200)

      expect(response.body).toEqual({
        id: 1,
        nome: 'nome 222',
        cpf: 'numero de cpf'
      })

      const proprietarioGravado = proprietarioModel.getById(1)

      expect(proprietarioGravado).toEqual({
        id: 1,
        nome: 'nome 222',
        cpf: 'numero de cpf'
      })
    })

    test('não altera um registro inexistente', async () => {
      const proprietario = {
        nome: 'rua 222',
        cpf: 'numero de cpf'
      }

      const response = await request(app)
        .put('/proprietarios/1')
        .send(proprietario)

      expect(response.statusCode).toEqual(404)

      expect(response.body).toEqual({
        errors: ['Registro não encontrado']
      })
    })

    test('não altera um proprietario porque a entrada de dados é inválida', async () => {
      const proprietario = {
        cpf: 'numero do cpf'
      }

      const response = await request(app)
        .put('/proprietarios/1')
        .send(proprietario)

      expect(response.statusCode).toEqual(500)

      expect(response.body).toEqual({
        errors: [
          {
            instancePath: '',
            keyword: 'required',
            message: 'must have required property \'nome\'',
            params: {
              missingProperty: 'nome',
            },
            schemaPath: '#/required',
          },
        ]
      })
    })

  })

})