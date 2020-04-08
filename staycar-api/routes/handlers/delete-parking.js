const { deleteParking } = require('../../logic')
const { NotAllowedError, ContentError } = require('staycar-errors')

module.exports = (req, res) => {
    const { payload: { sub: id } } = req
    const { params: { parking }} = req
    
    try{
        deleteParking(id, parking)
        .then(() => res.status(201).json({"message": `parking ${parking} was successfully removed`}))
        .catch(error => {
            let status = 400

            if (error instanceof NotAllowedError)
                status = 409 // conflict

            const { message } = error

            res
                .status(status)
                .json({
                    error: message
                })
        })
    
    }catch(error){
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