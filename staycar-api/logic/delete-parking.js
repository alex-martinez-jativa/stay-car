const { validate } = require('staycar-utils')
const { models: { Parking }} = require('staycar-data')
const { NotFoundError } = require('staycar-errors')

/**
 * Delete parking
 * 
 * @param {string} id user's id
 * @param {string} parkingName parking name
 * 
 * @throws {NotFoundError} if parking does not exist
 */

module.exports = (id, parkingName) => {
    validate.string(id, 'id')
    validate.string(parkingName, 'parkingName')

    return (async() => {
        const findParking = await Parking.findOneAndDelete({parkingName})
        if(!findParking) throw new NotFoundError(`parking ${parkingName} is not found`)

    })()
}