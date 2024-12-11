import { logger } from "@utils/logger";
import { FindCursor, MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const COMPONENT = 'db-access'

class DbAccess {
    private dbo!: Db;
    constructor() {}

    bootstrap() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGO_URI)
            .then((client: MongoClient) => {
                logger.info(`${COMPONENT} db connected`);
                this.dbo = client.db("betalabs")
                return this.updateOne("log", { "component": "server" }, {"startup": new Date().toISOString()})
            })
            .then((_result: any) => {
                logger.debug(`${COMPONENT} startup registered.`);
                resolve(true)
            })
            .catch((err) => {
                logger.debug(`${COMPONENT} connection failed.`, err);
                reject(err)
            })
        })
    }

    findOne(collectionName: string, query: Object) {
        return this.dbo.collection(collectionName).findOne(query)
    }

    updateOne(collectionName: string, query: Object, updateValue: Object) {
        return this.dbo.collection(collectionName).updateOne(query, {$set: updateValue}, { upsert: true })
    }

    findMany(collectionName: string, query: Object) {
        let records: FindCursor
        return new Promise((resolve, reject) => {
            records = this.dbo.collection(collectionName).find(query)

            records.toArray()
            .then(items => resolve(items))
            .catch(err => reject(err))
        })
    }

    insertOne(collectionName: string, document: Object) {
        return this.dbo.collection(collectionName).insertOne(document)
    }

    insertMany(collectionName: string, docs: Object[]) {
        return this.dbo.collection(collectionName).insertMany(docs)
    }

    deleteMany(collectionName: string, query: Object) {
        return this.dbo.collection(collectionName).deleteMany(query)
    }
}

export default new DbAccess()