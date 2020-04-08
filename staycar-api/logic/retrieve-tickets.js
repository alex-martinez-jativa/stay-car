const { models: { Ticket } } = require('staycar-data')
const { NotFoundError, NotAllowedError } = require('staycar-errors')

/**
 * Retrieve tickets
 * 
 * @throws {NotFoundError} if there are not tickets
 * 
 * @return {object} tickets objects
 */

module.exports = () => {
    
   return (async () => {
        const tickets = await Ticket.find({}).lean()
        if(!tickets) throw new NotFoundError('there are no tickets')

        tickets.forEach(ticket =>{
            ticket.id = ticket._id.toString()
            delete ticket._id

            delete ticket.__v
        })
        
        return tickets
   })()
}