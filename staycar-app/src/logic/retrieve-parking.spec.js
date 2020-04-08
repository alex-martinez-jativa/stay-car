const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL
const { mongoose, models: { Parking, Ticket, User } } = require('staycar-data')
const { random } = Math
import retrieveParking from './retrieve-parking'


describe('retrieveParking', () => {
    
    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve([User.deleteMany(), Ticket.deleteMany(), Parking.deleteMany()])
    })

    let parkingName, rate, totalLots, carPlate

    beforeEach(() => {
        
        parkingName = `parkingName-${random()}`
        rate = random()
        totalLots = 10
        carPlate = '1234KKK'
    })

    describe('when parking already exists', () => {
        
        beforeEach(async() => {
            
            await Parking.create({parkingName, rate, totalLots})
        })

        it('should succeed on right data', async () => {

            const parking = await retrieveParking()
           
            expect(parking[0].parkingName).toBe(parkingName)
        })

    })


    afterAll(async () => {
        await Promise.all([User.deleteMany(), Ticket.deleteMany(), Parking.deleteMany()])
        return await mongoose.disconnect()
    })
})