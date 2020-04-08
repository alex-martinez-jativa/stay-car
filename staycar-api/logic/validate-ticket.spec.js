require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const validateTicket = require('./validate-ticket')
const bcrypt = require('bcryptjs')
const { mongoose, models: { User, Parking, Ticket} } = require('staycar-data')

describe('validateTicket', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            
            .then(() => Promise.all([User.deleteMany(), Parking.deleteMany(), Ticket.deleteMany()]))
    )

    let name, surname, username, password, parkingName, rate, totalLots, carPlate, ticketId

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        parkingName = 'parkingTest'
        rate = random()
        totalLots = 20
        carPlate = '1234KKK'
        ticketId = `id-${random()}`
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
                    .then(() =>{
                        
                        return Ticket.create({carPlate, entryHour: new Date(), ticketId, parkingName, validated: false})
                    })
                )
        )

        it('should succeed on valid car plate and ticket id', () => {
            return Ticket.findOne({ticketId})
            .then((res) => {
    
                return validateTicket(res.ticketId)
                .then((ticket) => {
                    expect(ticket.validated).to.be.equal(true)
                })
            })
            
        })
    })

    it('should fail on non string id', () => {
        let id = 1234
        expect(() => validateTicket(id)).to.throw(TypeError, `ticket id ${id} is not a string`)
    })
    

    // TODO more happies and unhappies

    //after(() => User.deleteMany().then(() => mongoose.disconnect()))
    after(() => Promise.all([User.deleteMany(), Parking.deleteMany(),Ticket.deleteMany()]).then(() => mongoose.disconnect()))
})