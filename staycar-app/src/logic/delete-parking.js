import { validate } from 'staycar-utils'
import { NotAllowedError } from 'staycar-errors'
import context from './context'

const API_URL = process.env.REACT_APP_API_URL

/**
 * Delete parking
 * 
 * @param {string} parkingName parking name
 * 
 * @throws {NotAllowedError} if status >= 400 && status < 500
 * @throws {Error} server error
 */

export default (function (parkingName) {
    
    validate.string(parkingName, 'parking name')
    
    return( async () => {
        
        const response = await fetch(`${API_URL}/parking/${parkingName}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`}
        })
       
        const { status } = response
        
        if(status === 201) {
            
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
