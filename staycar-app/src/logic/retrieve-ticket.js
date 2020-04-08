import { NotAllowedError } from 'staycar-errors'
import retrieveParking from './retrieve-parking'
import { validate } from 'staycar-utils'

const API_URL = process.env.REACT_APP_API_URL

/**
 * Retrieve ticket
 * 
 * @param {string} ticketId ticket id
 * 
 * @throws {NotFoundError} if ticket is not inside the parking
 * @throws {NotFoundError} if parking is not exist
 * 
 */

export default (ticketId) => {
    validate.string(ticketId, 'ticket id')
    return (async () => {

        const retrievePk = await retrieveParking()
        const pkName = retrievePk[0].parkingName
        if(!retrievePk) throw new Error('not found parking')
        
        const response = await fetch(`${API_URL}/ticket/${ticketId}/${pkName}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const { status } = response

        if (status === 200) {
            const result = await response.json()
            return result
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
}