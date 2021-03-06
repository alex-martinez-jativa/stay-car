const { ContentError } = require('events-errors')

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PLATE_REGEX = /(\d{4})([A-Z]{3})/

module.exports = {
    string(target, name, empty = true) {
        //if (typeof target !== 'string') throw new TypeError(`${name} ${target} is not a string`)
        this.type(target, name, String)

        if (empty && !target.trim()) throw new ContentError(`${name} is empty`)
    },

    email(target) {
        if (!EMAIL_REGEX.test(target)) throw new ContentError(`${target} is not an e-mail`) // TODO custom error?
    },

    type(target, name, type) {
        if (type === String || type === Number || type === Boolean) {
            type = type.name.toLowerCase()

            if (typeof target !== type) throw new TypeError(`${name} ${target} is not a ${type}`)
        } else if (!(target instanceof type)) throw new TypeError(`${name} ${target} is not a ${type.name}`)
    },

    jwt(token) {
        this.type(token, 'token', String)

        const parts = token.split('.')

        if (parts.length !== 3) throw new ContentError('invalid token')

        const [header, payload, signature] = parts

        if (!header.trim().length || !payload.trim().length || !signature.trim().length) throw new ContentError('invalid token')
    },
    
    carplate(target) {

        if(!PLATE_REGEX.exec(target)) throw new TypeError(`car plate ${target} is not valid format`)
    }
}