const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL
const TEST_JWT_SECRET = process.env.REACT_APP_TEST_JWT_SECRET
const { mongoose, models: { Parking, User } } = require('staycar-data')
const { random } = Math
import deleteParking from './delete-parking'
import context from './context'
import jwt from 'jsonwebtoken'



describe('deleteParking', () => {
    
    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve([User.deleteMany(), Parking.deleteMany()])
    })

    let name, surname, username, password, parkingName, rate, totalLots, carPlate, lots, entryHour, ticketId

    beforeEach(() => {

        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
        parkingName = `parkingName-${random()}`
        rate = random()
        totalLots = 10
        carPlate = '1234KKK'
        lots = []
        entryHour = new Date()
        ticketId = `id-${random()}`

        for (let i = 1; i <= totalLots; i++) {
            let lot = {}
            lot.number = i
            lot.status = false
      
            lots.push(lot)
          }
    })

    describe('when parking already exists', () => {
        
        beforeEach(async() => {
            const user = await User.create(({ name, surname, username, password }))
            context.token = jwt.sign({ sub: user.id }, TEST_JWT_SECRET)

            await Parking.create({parkingName, rate, totalLots, lots})
          
        })

        it('should succeed on right data', async () => {
            
            const result = await deleteParking(parkingName)
           
            expect(result).toBeUndefined()
        })

    })

    it('should fail on non-string parking name',() => {
        
        let parkingName = true
        expect(() => deleteParking(parkingName)).toThrow(TypeError, `parking name ${parkingName} is not a string`)
    })


    afterAll(async () => {
        await Promise.all([User.deleteMany(), Parking.deleteMany()])
        return await mongoose.disconnect()
    })
})