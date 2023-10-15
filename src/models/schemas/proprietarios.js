module.exports = {
    type: 'object',
    properties: {
      nome: { type: 'string' },
      cpf: { type: 'string' },
      id: { type: 'integer' },
      imoveis: {
        type: 'array',
        items: { type: 'integer' }
      }
    },
    required: ['nome', 'cpf'],
    additionalProperties: false
  }