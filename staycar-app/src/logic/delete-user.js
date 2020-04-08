import { validate } from 'staycar-utils'
import { NotAllowedError } from 'staycar-errors'
import context from './context'

const API_URL = process.env.REACT_APP_API_URL

/**
 * Delete user
 * 
 * @param {string} username username 
 * @param {string} password user's password 
 * 
 * @throws {NotAllowedError} if status >= 400 && status < 500
 * @throws {Error} server error
 */

export default (function (username, password) {
    
    validate.string(username, 'user name')
    validate.string(password, 'password')
    
    return( async () => {
        
        const response = await fetch(`${API_URL}/users`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`},
            body: JSON.stringify({ username, password })
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
