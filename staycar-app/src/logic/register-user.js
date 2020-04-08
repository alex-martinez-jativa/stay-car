import { validate } from 'staycar-utils'
import { NotAllowedError } from 'staycar-errors'


const API_URL = process.env.REACT_APP_API_URL

/**
 * Register user
 * 
 * @param {string} name user's name
 * @param {string} surname user's surname
 * @param {string} username user's username
 * @param {string} password user's password
 * 
 * @throws {NotAllowedError} if status >= 400 && status < 500
 * @throws {Error} server error
 */

export default (name, surname, username, password) => {

    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(username, 'username')
    validate.string(password, 'password')
    
    return( async () => {
        
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, surname, username, password})
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

}
