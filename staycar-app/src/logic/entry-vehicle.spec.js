const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL
const { mongoose, models: { Parking, Ticket, User } } = require('staycar-data')
const { ContentError } = require('staycar-errors')
const { random } = Math
import entryVehicle from './entry-vehicle'


describe('entryVehicle', () => {
    
    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve([Ticket.deleteMany(), Parking.deleteMany()])
    })

    let parkingName, rate, totalLots, carPlate, lots, ticketId

    beforeEach(() => {
        
        parkingName = `parkingName-${random()}`
        rate = random()
        totalLots = 10
        carPlate = '1234KKK'
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
        
        beforeEach(async () => {
            
            await Parking.create({parkingName, rate, totalLots, lots})
        
        })

        it('should succeed on right data', async () => {
            
            await entryVehicle(carPlate, ticketId)

            const ticket = await Ticket.findOne({ ticketId })

            expect(ticket).toBeDefined()
            
        })

    })

    it('should fail on non string carPlate', () => {
        let carPlate = 1234
        expect(() => entryVehicle(carPlate, ticketId)).toThrow(TypeError, `car plate ${carPlate} is not a valid format`)
    })

    it('should fail on non string ticketId', () => {
        let ticketId = 1234
        expect(() => entryVehicle('1234', ticketId)).toThrow(TypeError, `ticket id ${ticketId} is not a string`)
    })

    afterAll(async () => {
        await Promise.all([User.deleteMany(), Ticket.deleteMany(), Parking.deleteMany()])
        return await mongoose.disconnect()
    })
})