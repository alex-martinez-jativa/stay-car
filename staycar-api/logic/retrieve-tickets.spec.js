require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveTickets = require('./retrieve-tickets')
const bcrypt = require('bcryptjs')
const { mongoose, models: { User, Parking, Ticket} } = require('staycar-data')

describe('retrieveTickets', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            
            .then(() => Promise.all([User.deleteMany(), Parking.deleteMany(), Ticket.deleteMany()]))
    )

    let name, surname, username, password, parkingName, rate, totalLots, carPlate

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
                        
                        return Ticket.create({carPlate, entryHour: new Date(), ticketId, parkingName})
                    })
                )
        )

        it('should succeed on exist tickets', () =>
            retrieveTickets()
                .then((tickets) => {
                   
                    expect(tickets).to.be.exist

                    tickets.forEach(ticket => {
                        expect(ticket.id).to.be.a('string')
                        expect(ticket._id).to.be.undefined
                        expect(ticket.ticketId).to.be.equal(ticketId)
                        expect(ticket.carPlate).to.be.a('string')
                        expect(ticket.parkingName).to.equal(parkingName)
                    })
                    
                })
        )
    })
    

    //after(() => User.deleteMany().then(() => mongoose.disconnect()))
    after(() => Promise.all([User.deleteMany(), Parking.deleteMany(),Ticket.deleteMany()]).then(() => mongoose.disconnect()))
})