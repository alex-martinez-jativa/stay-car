const { retrieveParking } = require('../../logic')
const { NotAllowedError } = require('staycar-errors')

module.exports = (req, res) => {
    const { payload: { sub: id } } = req

    try {
        retrieveParking(id)
            .then(pk =>
                res.status(200).json(pk)
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