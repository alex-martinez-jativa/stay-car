const { random } = Math
const { mongoose, models: { User } } = require('staycar-data')
const { login } = require('.')
const bcrypt = require('bcryptjs')
//const context = require('./context').default
import context from './context'

const { env: { REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL } } = process

describe('login', () => {
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
        let _id

        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)

            await User.create({ name, surname, username, password: _password })
                .then(user => _id = user.id)
        })

        it('should succeed on right credentials', () =>
            login(username, password)
                .then(() => {
                    const { token } = context

                    expect(typeof token).toBe('string')
                    expect(token.length).toBeGreaterThan(0)

                    const { sub } = JSON.parse(atob(token.split('.')[1]))

                    expect(sub).toBe(_id)
                })
        )
    })

    it('should fail on wrong username', async() => {
        try{
            await login(`wrong-${username}`, password)
            throw new Error('should not reach this point')
        }catch(error){
            expect(error).toBeInstanceOf(Error)
            expect(error.message).toBe('wrong credentials')
        }
    })
    it('should fail on wrong password', async() => {
        try{
            await login( username, `wrong-${password}`)
            throw new Error('should not reach this point')
        }catch(error){
            expect(error).toBeInstanceOf(Error)
            expect(error.message).toBe('wrong credentials')
        }
    })
    it('should fail on non string password', async() => {
        try{
            const res = await login( username, 1234)
            expect(res).toBeInstanceOf(Error)
            expect(res).toBe('1234 is not a string')
        }catch(error){
        }
    })

    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})