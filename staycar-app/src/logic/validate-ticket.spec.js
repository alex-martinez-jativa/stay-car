const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL
const { mongoose, models: { Parking, Ticket, User } } = require('staycar-data')
const { random } = Math
import validateTicket from './validate-ticket'


describe('validateTicket', () => {
    
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
        
        beforeEach(() => {
            return Parking.create({parkingName, rate, totalLots, lots})
            .then(() => {
                return Ticket.create({carPlate, entryHour, ticketId, parkingName})
            })
        })

        it('should succeed on valid ticket id', async() => {
            
            let retrieveTicket = await Ticket.findOne({ticketId})
            
            await validateTicket(retrieveTicket.ticketId)

            let res = await Ticket.findOne({ticketId})

            expect(res.validated).toBe(true)
            expect(res.carPlate).toBe(carPlate)
            
            
        })

    })

    afterAll(async () => {
        await Promise.all([User.deleteMany(), Ticket.deleteMany(), Parking.deleteMany()])
        return await mongoose.disconnect()
    })
})