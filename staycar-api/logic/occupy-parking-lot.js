const { validate } = require('staycar-utils')
const { models: { Parking } } = require('staycar-data')
const { NotFoundError } = require('staycar-errors')

module.exports = (parkingName, lotNumber) => {
    validate.string(parkingName, 'parkingName')
    validate.type(lotNumber, 'lot number', Number)

    return (async() => {

        const parking = await Parking.findOne({parkingName})
        if(!parking) throw new NotFoundError(`parking ${parkingName} does not exist`)

        let { lots, totalLots, occupiedLots  } = parking
  
        let freeLots = totalLots - occupiedLots
  
        if (freeLots === 0) throw new NotAllowedError("parking full. Entry not allowed")

        parking.occupiedLots ++

        lots.forEach(lot => {
            if(lot.number === lotNumber){
                lot.status = true
            }
        })
        
        await parking.save()

    })()

}