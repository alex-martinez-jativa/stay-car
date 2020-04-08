require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User, Parking } } = require('staycar-data')

const deleteParking = require('./delete-parking')

const bcrypt = require('bcryptjs')

const { env: { TEST_MONGODB_URL } } = process

describe('deleteParking', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Parking.deleteMany()]))
    )

    let name, surname, username, password, parkingName, rate
    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        parkingName = 'parking-test'
        rate = random()
    })

    describe('when user already exists', () => {
        let _id

        beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(password =>
                    User.create({ name, surname, username, password })
                )
                .then(user => _id = user.id)
                .then(() => 
                    Parking.create({parkingName, rate})
                )
        )

        it('should succed on delete exist parking', () =>
            deleteParking(_id, parkingName )
                .then((res) => {
                    expect(res).to.be.undefined
                })
        )
    })

    it('should fail on non string id', () => {
        let id = 2
        expect(() => deleteParking(id, 'parkingName' )).to.throw(TypeError, `id ${id} is not a string`)
    })
    it('should fail on non string parking name', () => {
        let parkingName = false
        expect(() => deleteParking('1234', parkingName)).to.throw(TypeError, `parkingName ${parkingName} is not a string`)
    })

    after(() => Promise.all([User.deleteMany(), Parking.deleteMany()]).then(() => mongoose.disconnect()))
    
})