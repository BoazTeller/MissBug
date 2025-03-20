import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { pdfService } from './services/pdf.service.js'

const app = express()

//* Middleware - Functions that process requests before reaching the route handlers
// Serve static files (e.g., HTML, CSS, images, JS) from the "public" folder
app.use(express.static('public'))
// Parse cookies from incoming requests and make them accessible via req.cookies
app.use(cookieParser())

//* API Routes
// Get all bugs
app.get('/api/bug', (req, res) => {
    // txt -> searches for title/description
    const { txt, minSeverity } = req.query

    const filterBy = {
        txt: txt?.trim() || '',
        minSeverity: isNaN(minSeverity) ? null : +minSeverity
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})

// Create bugs PDF report
app.get('/api/bug/pdf', (req, res) => {
    bugService.query()
        .then(bugs => {
            pdfService.generateBugReport(bugs) 
            res.send('PDF generated successfully')
        })
        .catch(err => {
            loggerService.error('Cannot generate bug PDF', err)
            res.status(500).send('Cannot generate bug PDF')
        })
})

// Create or update bug
app.get('/api/bug/save', (req, res) => {
    const { _id, title, description, severity } = req.query
    
    if (!title || !description || severity === undefined) {
        return res.status(400).send('Missing required fields')
    }

    const bugToSave = {
        _id: _id || '', // If no _id, send empty str
        title,
        description,
        severity: +severity
    }
    
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

// Get bug by ID
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    if (!canViewBug(req, res, bugId)) {
        return res.status(401).send('Wait for a bit')
    }

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

// Remove bug
app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params

    bugService.remove(bugId)
        .then(() => res.send(`${bugId} removed successfully`))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

function canViewBug(req, res, bugId) {
    let visitedBugs = req.cookies.visitedBugs || '[]' 
    visitedBugs = JSON.parse(visitedBugs) // Convert str to array

    if (visitedBugs.length >= 3) {
        loggerService.info(`User hit bug view limit: ${visitedBugs}`)
        return false 
    }

    // User can revisit the same bug without restrictions
    // But can only view up to 3 unique bugs within the time limit
    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
        res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7000, httpOnly: true })
    }

    return true 
}

//* Start Server
const PORT = 3030
app.listen(PORT, (err) => {
    if (err) {
        loggerService.error('Failed to start server:', err)
    } else {
        loggerService.info(`Server is running at: http://127.0.0.1:${PORT}/`)
    }
})