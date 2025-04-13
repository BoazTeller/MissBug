import fs from 'fs'
import { utilService } from './util.service.js'

const BUGS_FILE = './data/bugs.json'
const bugs = utilService.readJsonFile(BUGS_FILE)

export const bugService = {
    query,
    getById,
    save,
    remove
}

function query(filterBy = {}) {
    return new Promise((resolve, _) => {
        let filteredBugs = [...bugs]

        // Search by title & description
        if (filterBy.txt) {
            const regex = new RegExp(filterBy.txt, 'i')
            filteredBugs = filteredBugs.filter(bug => 
                regex.test(bug.title) || regex.test(bug.description)
            )
        }

        // Filter by mininum severity 
        if (filterBy.minSeverity) {
            filteredBugs = filteredBugs.filter(bug => bug.severity >= +filterBy.minSeverity)
        }

        // Filter by labels
        if (filterBy.labels && filterBy.labels.length > 0) {
            filteredBugs = filteredBugs.filter(bug => {
                if (!bug.labels) return false

                const isLabelIncludedInFilter = bug.labels.some(label => 
                    filterBy.labels.includes(label)
                )

                return isLabelIncludedInFilter
            })
        }

        resolve(filteredBugs)
    })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) {
        return Promise.reject('Bug not found')
    }

    return Promise.resolve(bug)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        if (bugIdx === -1) {
            return Promise.reject(`Bug with ID ${bugToSave._id} not found`)
        }

        bugs[bugIdx] = {
            ...bugs[bugIdx], 
            ...bugToSave, 
            lastUpdated: Date.now()
        }
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile()
        .then(() => bugToSave)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) {
        return Promise.reject(`Bug with ID ${bugId} not found`)
    }

    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(BUGS_FILE, data, (err) => {
            if (err) {
                return reject(err)
            } else {
                resolve()
            }
        })
    })
}