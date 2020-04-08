const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL
const TEST_JWT_SECRET = process.env.REACT_APP_TEST_JWT_SECRET
const { mongoose, models: { User, Parking } } = require('staycar-data')
const { random } = Math
import createParking from './create-parking'
import context from './context'
import jwt from 'jsonwebtoken'


describe('createParking', () => {
    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve([User.deleteMany(), Parking.deleteMany()])
    })

    let name, surname, username, password, parkingName, rate, totalLots

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        parkingName = `parkingName-${random()}`
        rate = random()
        totalLots = 10
    })

    describe('when user already exists', () => {

        beforeEach(async () => {
            const user = await User.create(({ name, surname, username, password }))
        
            context.token = jwt.sign({ sub: user.id }, TEST_JWT_SECRET)
        })

        it('should succeed on right data', async () => {

            await createParking(parkingName, rate, totalLots)
            
            const parking = await Parking.findOne({ parkingName })

            expect(parking).toBeDefined()
            expect(parking.parkingName).toBe(parkingName)
            expect(parking.rate).toBe(rate)
            expect(parking.totalLots).toEqual(totalLots)
        })
    })


    it('should fail on non-string or empty parkingName', () => {
        let parkingName = 1
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(TypeError, `parkingkName ${parkingName} is not a string`)

        parkingName = true
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(TypeError, `parkingName ${parkingName} is not a string`)

        parkingName = {}
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(TypeError, `parkingName ${parkingName} is not a string`)

        parkingName = ''
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(Error, `parkingName is empty`)
    })

    it('should fail on non-number or empty rate', () => {
        let rate = '1'
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(TypeError, `rate ${rate} is not a number`)

        rate = true
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(TypeError, `rate ${rate} is not a number`)

        rate = {}
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(TypeError, `rate ${rate} is not a number`)

        rate = ''
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(Error, `rate is empty`)
    })

    it('should fail on non-number or empty totalLots', () => {
        let totalLots = '1'
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(TypeError, `totalLots ${totalLots} is not a number`)

        totalLots = true
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(TypeError, `totalLots ${totalLots} is not a number`)

        totalLots = {}
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(TypeError, `totalLots ${totalLots} is not a number`)

        totalLots = ''
        expect(() => createParking(parkingName, rate, totalLots)).toThrow(Error, `totalLots is empty`)
    })


    afterAll(async () => {
        await Promise.all([Parking.deleteMany()])
        return await mongoose.disconnect()
    })
})