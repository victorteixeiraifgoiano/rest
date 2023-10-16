const fs = require('fs')
const proprietarioModel = require('../../../src/models/proprietarios')
const { createProprietario } = require('../../factories/proprietarios')

const path = './data/proprietariosModelTest.json'

jest.mock('../../../src/models/paths', () => {
  return {
    PROPRIETARIOS: path
  }
})

describe('testes para models/proprietarios', () => {

  beforeEach(() => {
    const data = { proprietarios: [] }
    fs.writeFileSync(path, JSON.stringify(data))
  })

  afterEach(() => {
    fs.unlinkSync(path)
  })

  describe('getAll', () => {

    test('retorna nenhum registro', () => {
      const proprietarios = proprietarioModel.getAll()

      expect(proprietarios.length).toEqual(0)

      expect(proprietarios).toEqual([])
    })

    test('retorna todos os registros', () => {
      proprietarioModel.insert(createProprietario({ nome: 'nome 001' }))
      proprietarioModel.insert(createProprietario({ nome: 'nome 002' }))

      const proprietarios = proprietarioModel.getAll()

      expect(proprietarios.length).toEqual(2)

      expect(proprietarios).toEqual(
        [
          expect.objectContaining({ id: 1, nome: 'nome 001' }),
          expect.objectContaining({ id: 2, nome: 'nome 002' })
        ]
      )
    })

  })

  describe('getById', () => {

    test('retorna um elemento existente', () => {
      proprietarioModel.insert(createProprietario({ id: 1, nome: 'nome 001' }))

      const proprietario = proprietarioModel.getById(1)

      expect(proprietario).toEqual(
        expect.objectContaining({ id: 1, nome: 'nome 001' })
      )
    })

    test('retorna undefined para um elemento inexistente', () => {
      proprietarioModel.insert(createProprietario({ id: 1, nome: 'nome 001' }))

      const proprietario = proprietarioModel.getById(10)

      expect(proprietario).toBeUndefined()
    })

  })

  describe('remove', () => {

    test('remove um elemento existente', () => {
      proprietarioModel.insert(createProprietario({ id: 1, nome: 'nome 001' }))

      const isRemovido = proprietarioModel.remove(1)
      expect(isRemovido).toEqual(true)

      const proprietario = proprietarioModel.getById(1)
      expect(proprietario).toBeUndefined()

    })

    test('não remove um elemento inexistente', () => {
      proprietarioModel.insert(createProprietario({ id: 1, nome: ' 001' }))

      const isRemovido = proprietarioModel.remove(10)
      expect(isRemovido).toEqual(false)

      const proprietarios = proprietarioModel.getAll()
      expect(proprietarios.length).toEqual(1)
    })

  })

  describe('insert', () => {

    test('insere um novo registro', () => {
      let proprietario = {
        nome: 'nome 01',
        cpf: 'numero de cpf'
      }

      proprietario = proprietarioModel.insert(proprietario)
      const proprietarios = proprietarioModel.getById(proprietario.id)

      expect(proprietario).toEqual({
        id: proprietario.id,
        nome: 'nome 01',
        cpf: 'numero de cpf'
        
      })
    })

  })

  describe('update', () => {

    test('atualiza um único campo de um registro existente', () => {
      proprietarioModel.insert(createProprietario({
        nome: 'nome 01',
        cpf: 'numero de cpf'
      }))

      let proprietario = {
        id: 1,
        nome: 'nome 222'
      }

      proprietario = proprietarioModel.update(proprietario)

      expect(proprietario).toEqual({
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

    test('atualiza um registro existente', () => {
      proprietarioModel.insert(createProprietario({
        nome: 'nome 01',
        cpf: 'numero de cpf'
      }))

      let proprietario = {
        id: 1,
        nome: 'nome 222',
        cpf: 'numero de cpf'
      }

      proprietario = proprietarioModel.update(proprietario)

      expect(proprietario).toEqual({
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

    test('não atualiza um registro inexistente', () => {
      proprietarioModel.insert(createProprietario({
        nome: 'nome 01',
        cpf: 'numero de cpf'
      }))

      let proprietario = {
        id: 1000,
        nome: 'nome 222'
      }

      proprietario = proprietarioModel.update(proprietario)

      expect(proprietario).toBeUndefined()

      const proprietarios = proprietarioModel.getAll()

      expect(proprietarios).toEqual([
        {
          id: 1,
          nome: 'nome 01',
          cpf: 'numero de cpf'
        }])
    })

  })

})