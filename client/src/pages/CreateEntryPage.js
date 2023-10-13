import { Field, Formik } from "formik"
import EventKeywordPicker from "../components/forms/EventKeywordPicker"

const CreateEntryPage = () => {

    //Note: temporary list - it will later be stored in a mongodb collection (maybe)
    //initial good events 
    const possibleGoodEventsInitial = ["Had a nice dinner", "Had a nice outing", "did well on a test", "got a partner"]

    //initial okay/neutral events
    const possibleNeutralEvents = ["nothing too special", "normal day at work", "normal day at school"]

    //initial not so good events
    const possibleWorseEvents = ["failed a test in school", "thundering", "lost a team sports game", "had a breakup"]

    const selfRatingValues = [1,2,3,4,5,6,7,8,9,10]

    const handleSubmit = async (values) => {
        alert("test form submit")
        console.log(values)
        let data = {
            title: values.title,
            entryContent: values.entryContent,
            greatEvents: values.goodEventsList,
            neutralEvents: values.neutralEventsList,
            badEvents: values.worseEventsList,
            selfRating: values.selfRating,
        }
        await fetch("/api/journalentries/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        //todo display on screen this one.
        console.log("akshan has submitted")

    }

    return (
        <>
            <div>
                <h2>Create an Anonymous Journal Entry</h2>
                <Formik
                    initialValues={{ title: "Untitled", entryContent: "", goodEventsList: [], goodEventsBank: possibleGoodEventsInitial, selfRating: 0}}
                    onSubmit={handleSubmit}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <label htmlFor="title" placeholder="Another day to say...">Title of your entry:</label>
                            <Field name="title"></Field>

                            <label htmlFor="entryContent">Your entry...</label>
                            <Field name="entryContent" as="textarea" placeholder="// Write away..."></Field>

                            <EventKeywordPicker
                                eventBank={possibleGoodEventsInitial}
                                formikEventBankName="goodEventsBank"
                                formikSelectedListName="goodEventsList"
                                setFieldValue={props.setFieldValue}
                                helperText="What went well today?"
                                helperListHeading="Good events">
                            </EventKeywordPicker>

                            <EventKeywordPicker
                                eventBank={possibleNeutralEvents}
                                formikEventBankName="neutralEventsBank"
                                formikSelectedListName="neutralEventsList"
                                setFieldValue={props.setFieldValue}
                                helperText="What went okay? Things that were just neutral... ?"
                                helperListHeading="Okay events">
                            </EventKeywordPicker>

                            <EventKeywordPicker
                                eventBank={possibleWorseEvents}
                                formikEventBankName="worseEventsBank"
                                formikSelectedListName="worseEventsList"
                                setFieldValue={props.setFieldValue}
                                helperText="What did not go so well today?"
                                helperListHeading="Not so great list...">
                            </EventKeywordPicker>

                            <label htmlFor="selfRating">Out of 10, rate your day:</label>
                            <Field as="select" name="selfRating">
                                <option value={0} hidden>--select--</option>
                                {selfRatingValues.map(ratingValue => <option value={ratingValue} key={ratingValue}>{ratingValue}</option>)}
                            </Field>

                            <button type="submit">test submit</button>
                        </form>
                    )}
                </Formik>
            </div>
        </>
    )

}


export default CreateEntryPage