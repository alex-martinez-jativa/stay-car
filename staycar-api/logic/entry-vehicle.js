const { validate } = require("staycar-utils")
const { models: { Ticket, Parking } } = require("staycar-data")
const { NotAllowedError, NotFoundError } = require("../../staycar-errors")

/**
 * Entry vehicle
 * 
 * @param {string} carPlate car plate
 * @param {string} ticketId ticket id
 * @param {string} parkingName parking name
 * 
 * @throws {NotAllowedError} if car plate is inside the parking 
 * @throws {NotFoundError} if parking name is not exist
 * @throws {NotAllowedError} if parking is full
 */

module.exports =  (carPlate, ticketId, parkingName) => {
  validate.string(carPlate, "car plate")
  validate.string(parkingName, 'parking name')
  validate.string(ticketId, 'ticket id')
  
  return (async () => {

    const car = await Ticket.findOne({ carPlate, exit: false })
    if (car) throw new NotAllowedError(`this plate ${carPlate} is inside`)
  
    const parking = await Parking.findOne({ parkingName })
    if(!parking) throw new NotFoundError(`this parking ${parkingName} is not exist`)
    
    let { totalLots, occupiedLots } = parking
  
    let freeLots = totalLots - occupiedLots
  
    if (freeLots === 0)
      throw new NotAllowedError("parking full. Entry not allowed")
  
    /* parking.occupiedLots++
  
    let condition = true
  
    do {
      let random = Math.floor(Math.random() * lots.length)
  
      if (lots[random].status === false) {
        lots[random].status = true
        
        condition = false
      }
      
    } while (condition);
  
    parking.lots = lots */
  
    await Ticket.create({ carPlate, entryHour: new Date(), ticketId, parkingName })
    
    //parking.save()
  })()
}
