require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User, Parking } } = require('staycar-data')

const createParking = require('./create-parking')

const bcrypt = require('bcryptjs')

const { env: { TEST_MONGODB_URL } } = process

describe('crateParking', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Parking.deleteMany()]))
    )

    let name, surname, username, password, parkingName, price, totalLots, lots

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        parkingName = `parkingName-${random()}`
        price = random()
        totalLots = 20
        lots = []
        ticketId = `id-${random()}`

        for (let i = 1; i <= totalLots; i++) {
            let lot = {}
            lot.number = i
            lot.status = false
      
            lots.push(lot)
          }
    })

    describe('when user already exists', () => {
        let _id

        beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(password =>
                    User.create({ name, surname, username, password })
                )
                .then(user => _id = user.id)
        )

        it('should succed on create new parking', () =>
            createParking(_id, parkingName, price, totalLots )
                .then((pk) => {
                    expect(pk).to.be.an('object')
                    expect(pk.parkingName).to.be.equal(parkingName)
                    expect(pk.rate).to.be.equal(price)
                    expect(pk.totalLots).to.be.equal(totalLots)
                    expect(pk.lots.length).to.be.equal(totalLots)
                })
        )
    })

    it('should fail on non string id', () => {
        let id = 2
        expect(() => createParking(id, 'parkingName', 1, 20 )).to.throw(TypeError, `id ${id} is not a string`)
    })
    it('should fail on non string parking name', () => {
        let parkingName = true
        expect(() => createParking('123', parkingName, 1, 20 )).to.throw(TypeError, `parkingName ${parkingName} is not a string`)
    })
    it('should fail on non rate number', () => {
        let rate = '1'
        expect(() => createParking('123', 'parkingName', rate, 20 )).to.throw(TypeError, `price ${rate} is not a number`)
    })
    it('should fail on non total lots number', () => {
        let totalLots = '15'
        expect(() => createParking('123', 'parkingName', 1, totalLots )).to.throw(TypeError, `totalLots ${totalLots} is not a number`)
    })

    // TODO more happies and unhappies

    after(() => Promise.all([User.deleteMany(), Parking.deleteMany()]).then(() => mongoose.disconnect()))
    
})