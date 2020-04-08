const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL
const { mongoose, models: { Parking, Ticket, User } } = require('staycar-data')
const { random } = Math
import retrieveLots from './retrieve-lots'


fdescribe('retrieveLots', () => {
    
    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve([User.deleteMany(), Ticket.deleteMany(), Parking.deleteMany()])
    })

    let parkingName, rate, totalLots, carPlate, lots

    beforeEach(() => {
        
        parkingName = `parkingName-${random()}`
        rate = random()
        totalLots = 10
        carPlate = '1234KKK'
        lots = []

        for (let i = 1; i <= totalLots; i++) {
            let lot = {}
            lot.number = i
            lot.status = false
      
            lots.push(lot)
          }
    })

    describe('when parking already exists', () => {
        
        beforeEach(async() => {
            
            await Parking.create({parkingName, rate, totalLots, lots})
        })

        it('should succeed on right data', async () => {

            const lots = await retrieveLots()
           
            expect(lots.length).toBe(totalLots)
        })

    })


    afterAll(async () => {
        await Promise.all([User.deleteMany(), Ticket.deleteMany(), Parking.deleteMany()])
        return await mongoose.disconnect()
    })
})