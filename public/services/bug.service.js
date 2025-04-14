import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:3030/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getDefaultSort
}

function query(queryOptions = {}) {
    return axios.get(BASE_URL, { params: queryOptions })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(`${BASE_URL}/${bugId}`)
        .then(res => res.data)
}

function save(bug) {
    const method = bug._id ? 'put' : 'post'
    const url = bug._id ? `${BASE_URL}/${bug._id}` : BASE_URL

    return axios[method](url, bug)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(`${BASE_URL}/${bugId}`)
        .then(res => res.data)
}

function getDefaultFilter() {
    return {
        txt: '',
        minSeverity: '',
        ...getDefaultSort(),
        pageIdx: 0,
        pageSize: 3
    }
}

function getDefaultSort() {
    return {
        sortField: '',
        sortDir: 1
    }
}