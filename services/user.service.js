import fs from 'fs'
import { utilService } from './util.service.js'

const USERS_FILE = './data/users.json'
const gUsers = utilService.readJsonFile(USERS_FILE)

export const userService = {
    query,
    signup,
    getById,
    getByUsername,
    remove
}

function query() {
    const usersToReturn = gUsers.map(user =>
        ({ _id: user._id, fullname: user.fullname })
    )
    
    return Promise.resolve(usersToReturn)
}

function signup(user) {
    return getByUsername(user.username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('Username already taken')

            user._id = utilService.makeId()
            gUsers.push(user)

            return _saveUsersToFile()
                .then(() => {
                    const { password, ...userToReturn } = user
                    return userToReturn
                })
        })
}

function getById(userId) {
    const user = gUsers.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')

    // Use destructuring to exclude password from the returned object
    const { password, ...userToReturn } = user

    return Promise.resolve(userToReturn)
}

function getByUsername(username) {
    const user = gUsers.find(user => user.username === username)
    
    return Promise.resolve(user)
}

function remove(userId) {
    const userIdx = gUsers.findIndex(user => user._id === userId)
    if (userIdx === -1) return Promise.reject('User not found')
    
    gUsers.splice(userIdx, 1)

    return _saveUsersToFile()
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const usersStr = JSON.stringify(gUsers, null, 4)
        fs.writeFile(USERS_FILE, usersStr, (err) => {
            if (err) return reject(err)

            resolve()
        })
    })
}








