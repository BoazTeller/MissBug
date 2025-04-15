import { userService } from './user.service.js'
import { utilService } from './util.service.js'
import Cryptr from 'cryptr'

const cryptr = new Cryptr('secret123')

export const authService = {
    checkLogin,
    signup,
    getLoginToken,
    validateToken
}

function checkLogin({ username, password }) {
    return userService.getByUsername(username)
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

function getLoginToken(user) {
    const userStr = JSON.stringify(user)
    return cryptr.encrypt(userStr)
}

function validateToken(token) {
    if (!token) return null

    const decryptedStr = cryptr.decrypt(token)
    const user = JSON.parse(decryptedStr)

    return userStr
}