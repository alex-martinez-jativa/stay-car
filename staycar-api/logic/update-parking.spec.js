require('dotenv').config()

const { expect } = require('chai')
const { random, round } = Math
const { mongoose, models: { User, Parking } } = require('staycar-data')

const updateParking = require('./update-parking')

const bcrypt = require('bcryptjs')

const { env: { TEST_MONGODB_URL } } = process

describe('updateParking', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Parking.deleteMany()]))
    )

    let name, surname, username, password, totalLots, parkingName, rate, lots

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        totalLots = round(random()*(20-1)+parseInt(1))
        parkingName = `pkname-${random()}`
        rate = random()
        lots = []
        ticketId = `id-${random()}`

        for (let i = 1; i <= totalLots; i++) {
            let lot = {}
            lot.number = i
            lot.status = false
      
            lots.push(lot)
          }
    })

    describe('when user and parking already exists', () => {
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

        it('should succed on correct data', () =>
            updateParking(_id, parkingName, rate, totalLots)
                .then(() => {
                    const pk = Parking.findOne({parkingName})
                    return pk
                })
                .then((pk) => {
                    expect(pk.parkingName).to.be.equal(parkingName)
                    expect(pk.totalLots).to.be.equal(totalLots)
                    expect(pk.rate).to.be.equal(rate)
                    expect(pk.lots.length).to.be.equal(totalLots)
                })
        )
    })
    
    it('should fail on non string id', () => {
        const id = 1
        const parkingName = 'name'
        const rate = 1
        const totalLots = 10
        
        expect(() => updateParking(id, parkingName, rate, totalLots)).to.throw(TypeError, `id ${id} is not a string`)
    })
    
    it('should fail on non number total lots', () => {
        const id = '1'
        const parkingName = 'name'
        const rate = 1
        const totalLots = '20'
        
        expect(() => updateParking(id, parkingName, rate, totalLots)).to.throw(TypeError, `total lots ${totalLots} is not a number`)
    })
    it('should fail on non string parking name', () => {
        const id = '1'
        const parkingName = true
        const rate = 1
        const totalLots = 10
        
        expect(() => updateParking(id, parkingName, rate, totalLots)).to.throw(TypeError, `parking name ${parkingName} is not a string`)
    })

    it('should fail on non number rate', () => {
        const id = '1'
        const parkingName = 'name'
        const rate = '0.5'
        const totalLots = 10
        
        expect(() => updateParking(id, parkingName, rate, totalLots)).to.throw(TypeError, `rate ${rate} is not a number`)
    })
    

    after(() => Promise.all([User.deleteMany(), Parking.deleteMany()]).then(() => mongoose.disconnect()))
    //after(() => User.deleteMany().then(() => mongoose.disconnect()))
})