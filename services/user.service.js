import fs from 'fs/promises'
import { utilService } from './util.service.js'

const USERS_FILE = './data/users.json'

export const userService = {
    query,
    getById,
    getByUsername
}

function query() {
    return utilService.readJsonFile(USERS_FILE)
        .then(users => users)
        .catch(err => {
            throw new Error('Cannot load users:', err)
        })
}

function getById(userId) {
    return query()
        .then(users => users.find(user => user._id === userId))
}

function getByUsername(username) {
    return query()
        .then(users => users.find(user => user.username === username))
}