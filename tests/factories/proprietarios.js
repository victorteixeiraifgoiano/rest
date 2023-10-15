const { pt_BR, Faker } = require('@faker-js/faker');

module.exports = {
  createProprietario
}

const faker = new Faker({ locale: [pt_BR] })

function createProprietario(proprietario) {
  return {
    id: faker.number.int(),
    nome: faker.location.street(),
    cpf: faker.location.city(),
    ...proprietario
  }

}