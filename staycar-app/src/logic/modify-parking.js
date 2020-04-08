import { validate } from 'staycar-utils'
import { NotAllowedError } from 'staycar-errors'
import context from './context'

const API_URL = process.env.REACT_APP_API_URL

/**
 * Update parking
 * 
 * @param {string} parkingName parking name
 * @param {number} rate parking rate price
 * @param {number} totalLots parking total lots
 * 
 * @throws {NotAllowedError} if status >= 400 && status < 500
 * @throws {Error} server error
 */

export default (function (parkingName, rate, totalLots) {
    
    validate.string(parkingName, 'parking name')
    if(!rate) throw new Error('rate is empty')
    validate.type(rate, "rate", Number)
    if(!totalLots) throw new Error('total lots is empty')
    validate.type(totalLots, 'total lots', Number)


    return( async () => {
        
        const response = await fetch(`${API_URL}/parking/${parkingName}/update`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`},
            body: JSON.stringify({ rate, totalLots })
        })
       
        const { status } = response
        
        if(status === 201) {
            
            //this.parking = parkingName
            return
        }

        if (status >= 400 && status < 500) {
            const { error } = await response.json()

            if (status === 401) {
                throw new NotAllowedError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')

    })()

}).bind(context)
