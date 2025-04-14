import fs from 'fs'
import { utilService } from './util.service.js'

const BUGS_FILE = './data/bugs.json'
const gBugs = utilService.readJsonFile(BUGS_FILE)

export const bugService = {
    query,
    getById,
    save,
    remove
}

// Parse and organize raw query params into filter/sort/paging objects
function query(queryOptions = {}) {
    const { filterBy = {}, sortBy = {}, pagination = {} } = queryOptions

    let bugsToReturn = [...gBugs]

    bugsToReturn = _filterBugs(bugsToReturn, filterBy)
    bugsToReturn = _sortBugs(bugsToReturn, sortBy)
    bugsToReturn = _paginateBugs(bugsToReturn, pagination)

    return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    if (!bug) {
        return Promise.reject('Bug not found')
    }

    return Promise.resolve(bug)
}

function save(bugToSave) {
    const isExistingBug = bugToSave._id

    if (isExistingBug) {
        const bugIdx = gBugs.findIndex(bug => bug._id === bugToSave._id)
        if (bugIdx === -1) {
            return Promise.reject(`Bug with ID ${bugToSave._id} not found`)
        }

        gBugs[bugIdx] = {
            ...gBugs[bugIdx], 
            ...bugToSave, 
            updatedAt: Date.now()
        }
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugToSave.updatedAt = Date.now()
        gBugs.unshift(bugToSave)
    }

    return _saveBugsToFile()
        .then(() => bugToSave)
}

function remove(bugId) {
    const bugIdx = gBugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) {
        return Promise.reject(`Bug with ID ${bugId} not found`)
    }

    gBugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const bugsStr = JSON.stringify(gBugs, null, 4)
        fs.writeFile(BUGS_FILE, bugsStr, (err) => {
            if (err) {
                return reject(err)
            } else {
                resolve()
            }
        })
    })
}

function _filterBugs(bugs, filterBy) {
    let filteredBugs = [...bugs]

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug =>
            regex.test(bug.title) || regex.test(bug.description)
        )
    }

    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= +filterBy.minSeverity)
    }

    if (filterBy.labels?.length > 0) {
        filteredBugs = filteredBugs.filter(bug =>
            filterBy.labels.some(label => bug.labels?.includes(label))
        )
    }

    return filteredBugs
}

function _sortBugs(bugs, sortBy) {
    const sortedBugs = [...bugs]

    if (sortBy.sortField === 'title') {
        sortedBugs.sort((bug1, bug2) =>
            bug1.title.localeCompare(bug2.title) * sortBy.sortDir
        )
    } else if (['severity', 'createdAt'].includes(sortBy.sortField)) {
        sortedBugs.sort((bug1, bug2) =>
            (bug1[sortBy.sortField] - bug2[sortBy.sortField]) * sortBy.sortDir
        )
    }

    return sortedBugs
}

function _paginateBugs(bugs, pagination) {
    const startIdx = pagination.pageIdx * pagination.pageSize
    return bugs.slice(startIdx, startIdx + pagination.pageSize)
}
