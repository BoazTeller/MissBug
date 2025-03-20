const BASE_URL = 'http://127.0.0.1:3030/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(bugId) {
    const url = `${BASE_URL}/${bugId}`

    return axios.get(url)
        .then(res => res.data)
}

function save(bug) {
    const url = `${BASE_URL}/save`

    return axios.get(url, { params: bug })
        .then(res => res.data)
        .catch(err=>{
            console.error('Failed to save bug:', err)
        })
}

function remove(bugId) {
    const url = `${BASE_URL}/${bugId}/remove`

    return axios.get(url)
        .then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}