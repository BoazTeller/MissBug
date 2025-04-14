import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilterBy, 300))

    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onClearFilter() {
        setFilterByToEdit({ txt: '', minSeverity: '', sortField: '', sortDir: 1 })
    }

    function onChangePage(diff) {
        setFilterByToEdit(prev => ({ ...prev, pageIdx: prev.pageIdx + diff }))
    }

    // Currently unused: kept for clarity if we switch from debounce to manual submit
    // function onSubmitFilter(ev) {
    //     ev.preventDefault()
    //     onSetFilterBy(filterByToEdit)
    // }

    const { txt, minSeverity, sortField, sortDir, pageIdx } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                <label htmlFor="sortField">Sort by:</label>
                <select name="sortField" id="sortField" value={sortField} onChange={handleChange}>
                    <option value="">None</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>

                <label htmlFor="sortDir">Direction:</label>
                <select name="sortDir" id="sortDir" value={sortDir} onChange={handleChange}>
                    <option value="1">Ascending</option>
                    <option value="-1">Descending</option>
                </select>

                <div className="pagination-controls">
                    <button type="button" onClick={() => onChangePage(-1)} disabled={pageIdx <= 0}>Prev</button>
                    <span>Page {pageIdx + 1}</span>
                    <button type="button" onClick={() => onChangePage(1)}>Next</button>
                </div>

                <button type="button" onClick={onClearFilter}>Clear Filter</button>
            </form>
        </section>
    )

    
}