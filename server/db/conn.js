import mongoose from "mongoose";
import MatchEntry from "../models/MatchEntry.js";
import JournalEntry from "../models/JournalEntry.js";
import FrequentEventTag from "../models/EventTag.js";
//singleton instance
let instance = null

class Database {

    /**
     * get/create a singleton of the database instance
     */
    constructor() {
        if (!instance) {
            instance = this
        }
        return instance
    }

    /**
     * connect to MongoDB
     */
    async connectToDb() {
        console.log("Connecting to MongoDB")
        await mongoose.connect(process.env.ATLAS_URI)
        console.log("Connected to MongoDB")
    }

    /**
     * disconnect from MongoDB
     */
    async disconnectFromDb() {
        await mongoose.connection.close()
    }

    async createEntry(entry) {
        let flairs = []

        //for now the flairs for a journal entry will be the first keyword of each event type (great/ok/bad)
        if (entry.greatEvents.length > 0) {
            flairs.push(entry.greatEvents[0].keyword)
        }
        if (entry.neutralEvents.length > 0) {
            flairs.push(entry.neutralEvents[0].keyword)
        }
        if (entry.badEvents.length > 0) {
            flairs.push(entry.badEvents[0].keyword)
        }

        const newEntry = new JournalEntry({
            title: entry.title,
            entryContent: entry.entryContent,
            flairs: flairs,
            greatEvents: entry.greatEvents,
            neutralEvents: entry.neutralEvents,
            badEvents: entry.badEvents,
            selfRating: entry.selfRating,
        });

        // insert into mongodb
        let newEntryDocument = await newEntry.save();
        return newEntryDocument
    }


    async getAllEntries() {
        const entries = await MatchEntry.find({})
        return entries
    }

    //get all journal entries from the db
    async getAllJournalEntries() {
        const entries = JournalEntry.find({})
        return entries
    }


    async getFilteredJournalEntries(filterOptions, sortOption) {
        let sortOrder = { dateCreated: -1 }

        if (sortOption === "oldest") {
            sortOrder = { dateCreated: 1 }
        } else if (sortOption === "newest") {
            sortOrder = { dateCreated: -1 }
        } else if (sortOption === "lowSelfRating") {
            sortOrder = { selfRating: 1 }
        } else if (sortOption === "highSelfRating") {
            sortOrder = { selfRating: -1 }
        }

        const entries = await JournalEntry.find({
            title: { $regex: filterOptions.titleFilterMatch },
            entryContent: { $regex: filterOptions.entryContentMatch },
            selfRating: { $gte: filterOptions.minSelfRating, $lte: filterOptions.maxSelfRating },
        }).sort(sortOrder)
        return entries
    }

    //get a specific journal entry by its id
    async getJournalEntryById(id) {
        try {
            const entry = await JournalEntry.findById(id)
            return entry
        } catch (error) {
            return undefined
        }

    }

    async getRandomJournalEntry() {
        const randomEntryArray = await JournalEntry.aggregate([{
            $sample: { size: 1 }
        }])
        return randomEntryArray[0]
    }

    async getSampleJournalEntries(count) {
        const sampleEntries = await JournalEntry.aggregate([{
            $sample: { size: count }
        }])
        return sampleEntries
    }



    // operations for event tags
    async getEventTags(eventType) {

        let matchCondition = { magnitude: { $eq: 0 } }
        if (eventType === "positive") {
            matchCondition = { magnitude: { $gt: 0 } }
        } else if (eventType === "negative") {
            matchCondition = { magnitude: { $lt: 0 } }
        }
        try {
            let positiveEvents = await FrequentEventTag.aggregate([
                { $match: matchCondition },
                {
                    $sort: {
                        frequency: -1,
                        lastUsed: -1
                    }
                }
            ])
            return positiveEvents
        } catch (error) {
            return []
        }
    }


    // statistics operations===


    async getSelfRatingDistribution() {
        const collectedSelfRatings = await JournalEntry.aggregate([
            {
                $group : {
                    _id: "$selfRating",
                    numberEntries: { $sum: 1 }
                },
    
            },
            {
                $project : {
                    rating: "$_id",
                    numberEntries: "$numberEntries",
                    _id: 0,
                },
            },
            {
                $sort : {
                    rating: 1
                },
            }
        ])


        return collectedSelfRatings
    }

}


export default Database