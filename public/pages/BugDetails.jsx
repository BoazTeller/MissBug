const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => setBug(bug))
            .catch(err => showErrorMsg(`Cannot load bug`, err))
    }, [bugId]) 

    return (
        <div className="bug-details">
            <h3>Bug Details</h3>
            {!bug && <p className="loading">Loading....</p>}
            {bug && (
                <div>
                    <h4>{bug.title}</h4>
                    <h5>Severity: <span>{bug.severity}</span></h5>
                    <p>{bug.description}</p>
                </div>
            )}
            <hr />
            <Link to="/bug">Back to List</Link>
        </div>
    )
}
