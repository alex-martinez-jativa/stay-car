import { validate } from 'staycar-utils'
import { NotAllowedError, NotFoundError } from 'staycar-errors'
import context from './context'
import { retrieveParking } from '.'

const API_URL = process.env.REACT_APP_API_URL


export default (function (carPlate){
 
    validate.string(carPlate, 'car plate')


   return (async () => {
       
        const retrievePk = await retrieveParking()
        debugger
        if(retrievePk.length === 0) throw new NotFoundError('There are not parkings')
        const parking = retrievePk[0].parkingName
        
        const response = await fetch(`${API_URL}/ticket/${parking}/recover`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`},
            body: JSON.stringify({ carPlate })
        })

        const { status } = response

        if(status === 200) {

            const ticket = await response.json()
            return ticket
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