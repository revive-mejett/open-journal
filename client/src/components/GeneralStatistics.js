import { useEffect, useState } from "react"
import "./GeneralStatistics.scss"
import Loading from "./visuals/Loading"

const GeneralStatistics = () => {

    const [data, setData] = useState(undefined)

    const determineColorClass = (percentage, isNeutral, type) => {
        if (isNeutral) {
            return "neutral"
        }
        let colourClass = ""
        console.log(typeof percentage, "akshan!")
        switch (true) {
            case (percentage > 70):
                colourClass = type >= 1 ? "positive-5" : "negative-5"
                break;
            case (percentage > 60):
                colourClass = type >= 1 ? "positive-4" : "negative-4"
                break;
            case (percentage > 40):
                colourClass = type >= 1 ? "positive-3" : "negative-3"
                break;
            case (percentage > 30):
                colourClass = type >= 1 ? "positive-2" : "negative-2"
                break;
            case (percentage > 0):
                colourClass = type >= 1 ? "positive" : "negative"
                break;
            default:
                colourClass = "neutral"
                break;
        }
        return colourClass
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch("/api/stats/general")
                if (!response.ok) {
                    console.log("response not ok")
                } else {
                    let data = await response.json()
                    console.log(data)
                    setData(data)
                }
            } catch (error) {
                console.error("Error fetching match data --> ", error)
            }
        }
        if (data === undefined) {
            fetchData()
        }
    })

    return (
        <>
            {
                data ?
            <div className="general-stats-container">
                <div className="stat-item">
                    <h3>
                        Number of positive self-rated
                    </h3>
                    <p>{data.positiveSelfRatedCount}</p>
                </div>
                <div className="stat-item">
                    <h3>
                        Number of Neutral entries
                    </h3>
                    <p>{data.neutralSelfRatedCount}</p>
                </div>
                <div className="stat-item">
                    <h3>
                        Number of negative self-rated
                    </h3>
                    <p>{data.negativeSelfRatedCount}</p>
                </div>
                <div className={"stat-item " + determineColorClass(data.percentagePositive, false, 1)}>
                    <h3>
                        Percentage of positive self-rated
                    </h3>
                    <p>{data.percentagePositive}%</p>
                </div>
                <div className={"stat-item " + determineColorClass(data.percentageNeutral, true)}>
                    <h3>
                        Percentage of neutral self-rated
                    </h3>
                    <p>{data.percentageNeutral}%</p>
                </div>
                <div className={"stat-item " + determineColorClass(data.percentageNegative, false, -1)}>
                    <h3>
                        Percentage of negative self-rated
                    </h3>
                    <p>{data.percentageNegative}%</p>
                </div>
            </div>
            :
            <Loading/>
            }
        </>
    )

}

export default GeneralStatistics