const { retrieveTicket } = require('../../logic')
const { NotAllowedError } = require('staycar-errors')

module.exports = (req, res) => {
    const { id, parkingname } = req.params
    try {
        retrieveTicket(id, parkingname)
            .then(ticket =>
                res.status(200).json(ticket)
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