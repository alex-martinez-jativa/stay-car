const { validateTicket } = require('../../logic')
const { NotAllowedError } = require('staycar-errors')

module.exports = (req, res) => {
    
    const idParking = req.params.id
    const amount = req.body.amount

    try {
        validateTicket(idParking, amount)
            .then(() =>
                res.status(200).json({"message": "your ticket was validated"})
                
            )
            .catch(error => {
                let status = 400

                if (error instanceof NotAllowedError)
                    status = 401 // not authorized

                const { message } = error

                res
                    .status(status)
                    .json({
                        error: message
                    })
            })
    } catch (error) {
        let status = 400

        if (error instanceof TypeError || error instanceof ContentError)
            status = 406 // not acceptable

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}