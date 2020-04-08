import { NotAllowedError } from 'staycar-errors'

const API_URL = process.env.REACT_APP_API_URL

/**
 * Retrieve parking
 * @return {object} parking object
 */

export default () => {
    
    return (async () => {
        const response = await fetch(`${API_URL}/parking`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const { status } = response

        if (status === 200) {
            const _parking = await response.json()

            //return this.parking = _parking[0].parkingName
            return _parking
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