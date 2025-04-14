import { userService } from './user.service.js'
import Cryptr from 'cryptr'

const cryptr = new Cryptr('secret123')

export const authService = {
    login
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