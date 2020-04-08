const { validate } = require('staycar-utils')
const { models: { Ticket, Parking } } = require('staycar-data')
const { NotFoundError } = require('staycar-errors')

/**
 * Retrieve ticket
 * 
 * @param {string} ticketId ticket id
 * @param {string} parkingName parking name
 * 
 * @throws {NotFoundError} if ticket is not inside the parking
 * @throws {NotFoundError} if parking is not exist
 * 
 * @return {object} ticket object
 */

module.exports = (ticketId, parkingName) => {
    validate.string(ticketId, 'ticket id')
    validate.string(parkingName, 'parking name')


   return (async () => {
        const ticket = await Ticket.findOne({ticketId}).lean()
        if(!ticket) throw new NotFoundError('this ticket is not inside the parking')
        //if(ticket.validated) throw new NotFoundError('this ticket is not valid')
        const parking = await Parking.findOne({parkingName})
        if(!parking) throw new NotFoundError(`parking ${parkingName} is not exist`)
        
        ticket.exitHour = new Date()
        let exit, entry, diff, minutes
        
        if(ticket.validatedTime){
          entry = ticket.validatedTime
        }else{
          entry = ticket.entryHour
        }

        exit = ticket.exitHour
     
        diff = exit.getTime() - entry.getTime()
        minutes = Math.floor(diff / 60000);

        const rate = parking.rate
        const totalPrice = parseFloat(minutes * rate)
        ticket.amount = totalPrice

        ticket.id = ticket._id.toString()
        delete ticket._id
        delete ticket.__v

        return ticket
   })()
}