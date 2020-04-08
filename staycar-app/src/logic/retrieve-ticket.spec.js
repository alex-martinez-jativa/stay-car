const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL
const { mongoose, models: { Parking, Ticket, User } } = require('staycar-data')
const { random } = Math
import retrieveTicket from './retrieve-ticket'


describe('retrieveTicket', () => {
    
    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve([User.deleteMany(), Ticket.deleteMany(), Parking.deleteMany()])
    })

    let parkingName, rate, totalLots, carPlate, lots, entryHour, ticketId

    beforeEach(() => {
        
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
            await Parking.create({parkingName, rate, totalLots})
            await Ticket.create({carPlate, parkingName, ticketId, entryHour})
          
        })

        it('should succeed on right data', async () => {
            
            const ticket = await retrieveTicket(ticketId)
           
            expect(ticket.carPlate).toBe(carPlate)
        })

    })


    afterAll(async () => {
        await Promise.all([User.deleteMany(), Ticket.deleteMany(), Parking.deleteMany()])
        return await mongoose.disconnect()
    })
})