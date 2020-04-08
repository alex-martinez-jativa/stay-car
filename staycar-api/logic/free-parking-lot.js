const { validate } = require('staycar-utils')
const { models: { Parking } } = require('staycar-data')
const { NotFoundError } = require('staycar-errors')

module.exports = (parkingName, lotNumber) => {
    validate.string(parkingName, 'parkingName')
    validate.type(lotNumber, 'lot number', Number)

    return (async() => {

        const parking = await Parking.findOne({parkingName})
        if(!parking) throw new NotFoundError(`parking ${parkingName} does not exist`)

        parking.occupiedLots --

        parking.lots.forEach((lot) => {
            if(lot.number === lotNumber){
                lot.status = false
            }
        })
        
        await parking.save()

    })()

}