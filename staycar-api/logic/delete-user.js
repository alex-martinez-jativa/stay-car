const { validate } = require('staycar-utils')
const { models: { User }} = require('staycar-data')
const { NotAllowedError } = require('staycar-errors')
const bcrypt = require('bcryptjs')

/**
 * Delete user
 * 
 * @param {string} id user's id
 * @param {string} username username 
 * @param {string} password user's password 
 * 
 * @throws {NotAllowedError} if user does not exist
 * @throws {NotAllowedError} if incorrect password 
 */

module.exports = (id, username, password) => {
    validate.string(id, 'id')
    validate.string(username, 'user name')
    validate.string(password, 'password')

    return (async() => {
        
        const user = await User.findOne({username})
        if(!user) throw new NotAllowedError(`username ${username} is not exist`)

        const pass = await bcrypt.compare(password, user.password)
        if(!pass) throw new NotAllowedError('wrong credentials')
        debugger
        return await User.deleteOne({username})

    })()
}