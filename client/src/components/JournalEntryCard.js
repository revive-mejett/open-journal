import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./MatchEntryCard.scss"

const JournalEntryCard = ({ entry }) => {

    const [teaserDescription, setTeaserDescription] = useState(entry.entryContent)
    let date

    useEffect(() => {
        if (entry.entryContent !== undefined) {
            setTeaserDescription(entry.entryContent.slice(0, 200) + "...")
        } else {
            setTeaserDescription("(No entry description)")
        }
    }, [entry.entryContent])
    
    date = new Date(entry.dateCreated)
    return (
        <div className="journal-entry-card">
            <Link to={{ pathname: "/entries/viewing", search: "?id=" + entry._id }} className="journal-entry-card-link">
                {date &&
                <h2>{date.toLocaleString("default", {month: "long", day: "numeric", year: "numeric"})}</h2>
                }
                <h3>{entry.title}</h3>
                <p className="description-teaser">{teaserDescription}</p>
                <h3 className="rating-header">Their rating: {entry.selfRating}</h3>
            </Link>
        </div>

    )
}


export default JournalEntryCard