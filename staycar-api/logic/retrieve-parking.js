const { validate } = require('staycar-utils')
const { models: { User, Parking } } = require('staycar-data')
const { NotFoundError } = require('staycar-errors')

/**
 * Retrieve parking
 * 
 * @throws {NotFoundError} if there are not parking
 * @return {object} parking object
 */

module.exports = () => {
    
    return Parking.find()
        .lean()
        .then(parkings => {
            debugger
        
            if (!parkings) throw new NotFoundError(`There are no parkings yet`)
        
            parkings.forEach(pk => {
                
                pk.id = pk._id.toString()

                delete pk._id
                delete pk.__v
                
            })  
            return parkings
            
        })  
}