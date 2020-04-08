const { validate } = require("staycar-utils")
const { models: { Ticket, Parking } } = require("staycar-data")
const { NotAllowedError } = require("../../staycar-errors")

/**
 * Exit vehicle
 * 
 * @param {string} ticketId ticket id
 * @param {string} parkingName parking name
 * 
 * @throws {NotAllowedError} if ticket id is not valid
 * @throws {NotAllowedError} if ticket was not validated
 * @throws {NotAllowedError} if ticket outside the parking yet 
 */

module.exports =  (ticketId, parkingName) => {
  validate.string(ticketId, "ticket id")
  validate.string(parkingName, 'parking name')
  
  return (async () => {

    const ticket = await Ticket.findOne({ ticketId })
    if (!ticket) throw new NotAllowedError(`this ticket ${ticketId} is not valid`)
    if(!ticket.validated) throw new NotAllowedError('this ticket was not validated')
    if(ticket.exit) throw new NotAllowedError('this ticket is not allowed')

    let { validatedTime: valid } = ticket
    let minutes = Math.floor(((new Date().getTime()) - valid.getTime()) / 60000);
    
    if(minutes > 1){
      ticket.validated = false
      await ticket.save()
      throw new NotAllowedError('validation expired, please go to ATM')
    } 
  
    const parking = await Parking.findOne({ parkingName })

    ticket.exit = true
    
    await ticket.save()
    
    await parking.save()
  })()
}
