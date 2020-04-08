import { validate } from 'staycar-utils'
import { NotAllowedError } from 'staycar-errors'

const API_URL = process.env.REACT_APP_API_URL

/**
 * Validate ticket
 * 
 * @param {string} ticketId ticket id
 * @throws {NotFoundError} if ticket is not exist
 */

export default (ticketId, amount) => {
    validate.string(ticketId, 'ticket id')

    return (async () => {
        
        const response = await fetch(`${API_URL}/ticket/${ticketId}/validated`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
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