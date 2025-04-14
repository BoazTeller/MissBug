import { userService } from './user.service.js'
import Cryptr from 'cryptr'
import { utilService } from './util.service.js'

const cryptr = new Cryptr('secret123')

export const authService = {
    login,
    signup
}

function login({ username, password }) {
    return userService.getByUsername(user)
        .then(user => {
            if (!user) return Promise.reject('Invalid username')
            
            const decryptedPass = cryptr.decrypt(user.password)

            if (decryptedPass !== password) {
                return Promise.reject('Invalid password')
            }

            const userToReturn = {
                _id: user._id,
                fullName: user.fullname,
                isAdmin: user.isAdmin
            }

            return userToReturn
        })
}

function signup({ username, password, fullname }) {
    return userService.getByUsername(username)
        .then(user => {
            if (user) return Promise.reject('Username is already taken')
        
            const encryptedPass = cryptr.encrypt(password)
            const newUser = {
                _id: utilService.makeId(),
                username,
                fullname,
                password: encryptedPass,
                isAdmin: false
            }

            return userService.save(newUser)
        })
}
