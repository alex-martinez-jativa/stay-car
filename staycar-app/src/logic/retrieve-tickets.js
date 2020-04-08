import { NotAllowedError } from 'staycar-errors'

const API_URL = process.env.REACT_APP_API_URL

export default function () {
    
    return (async () => {
        
        const response = await fetch(`${API_URL}/tickets`, {
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