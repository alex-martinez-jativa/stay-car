import { validate } from 'staycar-utils'
import { NotAllowedError } from 'staycar-errors'
import retrieveParking from './retrieve-parking'


const API_URL = process.env.REACT_APP_API_URL

/**
 * Entry vehicle
 * 
 * @param {string} carPlate car plate
 * @param {string} ticketId ticket id
 * 
 * @throws {NotAllowedError} if status >= 400 && < 500
 * @throws {Error} server error
 */

export default (carPlate, ticketId) => {

    validate.string(carPlate, 'car plate')
    validate.carplate(carPlate)
    validate.string(ticketId, 'ticketid')

    return(async () => {

        const retrievePk = await retrieveParking()
        if(retrievePk.length === 0) throw new Error('not found parking')
    
        const pkName = retrievePk[0].parkingName
        
        const response = await fetch(`${API_URL}/${pkName}/ticket`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({carPlate, ticketId})
        }) 

        if(response.status === 201){
            return 
        }

        if (response.status >= 400 && response.status < 500) {
            const { error } = await response.json()

            if (response.status === 401) {
                throw new NotAllowedError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')
    })()

}