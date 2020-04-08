const { validate } = require('staycar-utils')
const { models: { User } } = require('staycar-data')
const { NotAllowedError } = require('staycar-errors')
const bcrypt = require('bcryptjs')

/**
 * Register user
 * 
 * @param {string} name user's name
 * @param {string} surname user's surname
 * @param {string} username user's username
 * @param {string} password user's password
 * 
 * @throws {NotAllowedError} if username already exist
 */

module.exports = (name, surname, username, password) => {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(username, 'username')
    validate.string(password, 'password')

    return User.findOne({ username })
        .then(user => {
            if (user) throw new NotAllowedError(`user with username ${username} already exists`)

            return bcrypt.hash(password, 10)
        })
        .then(password => {
            user = new User({ name, surname, username, password, created: new Date })

            return user.save()
        })
        .then(() => { })
}