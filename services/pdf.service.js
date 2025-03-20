import fs from 'fs'
import PDFDocument from 'pdfkit-table'

export const pdfService = {
    generateBugReport
}

function generateBugReport(bugs, filename = 'bugs_report.pdf') {
    const doc = new PDFDocument({ margin: 30, size: 'A4' })
    doc.pipe(fs.createWriteStream(filename))

    const table = {
        title: 'Bug Report',
        subtitle: 'List of Reported Bugs',
        headers: ['Bug ID', 'Title', 'Description', 'Severity'],
        rows: bugs.map(bug => [
            bug._id, 
            bug.title, 
            bug.description, 
            bug.severity
        ])
    }

    doc.table(table, { columnsSize: [100, 150, 250, 80] })
        .then(() => doc.end())
}