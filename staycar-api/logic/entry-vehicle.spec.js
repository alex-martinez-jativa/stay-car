require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { Ticket, Parking, User } } = require('staycar-data')
const bcrypt = require('bcryptjs')

const entryVehicle = require('./entry-vehicle')


const { env: { TEST_MONGODB_URL } } = process

describe('entryVehicle', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([Ticket.deleteMany(), Parking.deleteMany(), User.deleteMany()]))
    )

    let name, surname, username, password, pkName, rate, carPlate, totalLots, lots, ticketId

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        parkingName = `parking-${random()}`
        rate = random()
        carPlate = `plate-${random()}`
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

    describe('when user already create parking', () => {

        beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(password =>
                    User.create({ name, surname, username, password })
                )
                .then(user => _id = user.id)  
                .then(() => {
                    
                    return Parking.create({parkingName, rate, totalLots, lots})
                        
                })
        )

        it('should succed on correct car plate and parking name', () =>{
            
            entryVehicle(carPlate, ticketId, parkingName)
                .then(() => {
                    return Ticket.findOne({ticketId})
                })
                .then((ticket) => {
                    expect(ticket.carPlate).to.be.equal(carPlate)
                    expect(ticket.parkingName).to.be.equal(parkingName)
                })
                
        })
    })

    it('should fail on non string car plate', () => {
        let carPlate = 1234
        expect(() => entryVehicle(carPlate, 'ticketId', 'parkingName')).to.throw(TypeError, `car plate ${carPlate} is not a string`)
    })
    it('should fail on non string parking name', () => {
        let pkName = true
        expect(() => entryVehicle('1234JJJ', 'ticketId', pkName)).to.throw(TypeError, `parking name ${pkName} is not a string`)
    })

    it('should fail on non string ticket id', () => {
        let ticketid = 1212
        expect(() => entryVehicle('1234JJJ', ticketid, 'pkName')).to.throw(TypeError, `ticket id ${ticketid} is not a string`)
    })

    //after(() => Promise.all([User.deleteMany(), Parking.deleteMany()], Ticket.deleteMany()).then(() => mongoose.disconnect()))
    after(() => User.deleteMany().then(() => mongoose.disconnect()))
})