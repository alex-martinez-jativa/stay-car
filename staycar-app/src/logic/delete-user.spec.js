const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL
const TEST_JWT_SECRET = process.env.REACT_APP_TEST_JWT_SECRET
const { mongoose, models: { User } } = require('staycar-data')
const { random } = Math
import deleteUser from './delete-user'

const bcrypt = require('bcryptjs')

describe('deleteUser', () => {
    beforeAll(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, username, password
    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        password = `password-${random()}`
    })

    describe('when user already exists', () => {
        let _user
        beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(password =>
                    User.create({ name, surname, username, password })
                )
                .then((user) => {
                    return _user = user
                })
        )

        it('should succed on delete an existed user', () =>{
            let _id = _user.id
            let pass = _user.password
            let username = _user.username
            
            deleteUser(_id, username, pass)
                .then((res) => {
                    expect(res).toBeUndefined()
                    expect(_user.username).toBe(username)
                    expect(_user.password).toBe(password)
                    expect(typeof _user.id).toBe('string')
                    expect(typeof _user.username).toBe('string')
                    expect(typeof _user.password).toBe('string')
                })
        })
    })


    it('should fail on non string username', () => {
        let username = true
        expect(() => deleteUser(username, 'password')).toThrow(TypeError, `user name ${username} is not a string`)
    })
    it('should fail on non string pasword', () => {
        let password = true
        expect(() => deleteUser('username', password)).toThrow(TypeError, `password ${password} is not a string`)
    })

    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
    
})