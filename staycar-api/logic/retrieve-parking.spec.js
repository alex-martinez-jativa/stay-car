require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveParking = require('./retrieve-parking')
const bcrypt = require('bcryptjs')
const { mongoose, models: { User, Parking, Ticket } } = require('staycar-data')

describe('retrieveParking', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => Promise.all([Ticket.deleteMany(), Parking.deleteMany(), User.deleteMany()]))
    )

    let name, surname, username, password, parkingName, rate, totalLots

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        parkingName = `pkname-${random()}`
        rate = random()
        totalLots = 20
    })

    describe('when user already create a parking', () => {
        
        let _id

        beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(password =>
                    User.create({ name, surname, username, password })
                )
                .then(user => _id = user.id)  
                .then(() => 
                    
                    Parking.create({parkingName, rate, totalLots})
                )
        )

        it('should succeed on valid parking name', () =>
            retrieveParking(parkingName)
                .then(pk => {
                    expect(pk[0].parkingName).to.be.equal(parkingName)
                })
        )
    })
    

    after(() => Promise.all([User.deleteMany(), Parking.deleteMany()], Ticket.deleteMany()).then(() => mongoose.disconnect()))
})