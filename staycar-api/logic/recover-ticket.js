const { validate } = require('staycar-utils')
const { models: { Ticket, User, Parking } } = require('staycar-data')
const { NotFoundError, NotAllowedError } = require('staycar-errors')


module.exports = ( id, parkingName, carPlate,) => {
    validate.string(id, 'id')
    validate.string(parkingName, 'parking name')
    validate.string(carPlate, 'car plate')


   return (async () => {
        const user = await User.find({id})
        if (!user) throw new NotAllowedError(`user with id ${id} does not exist`)   

        const parking = await Parking.findOne({parkingName})
        if(!parking) throw new NotFoundError(`parking ${parkingName} is not exist`)
        
        const ticket = await Ticket.findOne({carPlate, exit: false})
        if(!ticket) throw new NotFoundError('this ticket is not found')
        

        return ticket.ticketId
   })()
}