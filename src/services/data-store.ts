import { Db, FindCursor, MongoClient, MongoDBNamespace } from 'mongodb';

import { logger } from '@utils/logger';
import axios from 'axios';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const COMPONENT = 'datastore'

class DataStore {
    private client!: MongoClient;
    private dbo!: Db;
    private basicHeaders: any;
    private authObject: any;

    constructor() {

        MongoClient.connect(MONGO_URI)
        .then((client) => {
            logger.info(`${COMPONENT} db connected`);
            this.client = client;
            this.dbo = client.db("betalabs");

            return this.dbUpdateOne("log", { "component": "server" }, { "$set": {"startup": new Date().toISOString()} }
            )
        })
        .then((result: any) => {
            logger.debug(`${COMPONENT} startup registered.`);
            return this.fetchBasicHeaders()
        })
        .then((response: any) => {
            this.basicHeaders = response.value
            return this.getPublicIp()
        })
        .then((response: any) => {
            this.basicHeaders['X-ClientPublicIP'] = response.data.ip;
            logger.debug(`${COMPONENT} headers populated`);
            return this.authorize("S90725")
        })
        .then((authObject: any) => {
            logger.debug(`${COMPONENT} S90725 fetched`);
        })
        .catch((err) => {logger.debug(`${COMPONENT} bootstrap failed`, err)})
    }

    private dbFindOne(collectionName: string, query: Object) {
        return new Promise((resolve, reject) => {
            this.dbo.collection(collectionName).findOne(query)
            .then((document) => resolve(document))
            .catch(err => reject(err))
        })
    }

    private dbUpdateOne(collectionName: string, query: Object, updateValue: Object) {
        return new Promise((resolve, reject) => {
            this.dbo.collection(collectionName).updateOne(query, updateValue, { upsert: true })
            .then((document) => resolve(document))
            .catch(err => reject(err))
        })
    }

    private dbFindMany(collectionName: string, query: Object) {
        let records: FindCursor
        return new Promise((resolve, reject) => {
            records = this.dbo.collection(collectionName).find(query)

            records.toArray()
            .then(items => resolve(items))
            .catch(err => reject(err))
        })
    }

    private dbInsertOne(collectionName: string, document: Object) {
        return new Promise((resolve, reject) => {
            this.dbo.collection(collectionName).insertOne(document)
            .then((result) => resolve(result))
            .catch(err => reject(err))
        })
    }

    fetchBasicHeaders() {
     return new Promise((resolve, reject) => {
        this.dbFindOne('app-config', { key: "basic-headers" })
        .then(item => resolve(item))
        .catch(err => reject(err))
     })
    }

    setBasicHeaders(headers: Object) {
        return new Promise((resolve, reject) => {
            this.dbUpdateOne("app-config", { key: "basic-headers" }, { "$set": { "value": headers } })
            .then(result => resolve(result))
            .catch(err => reject(err))
        })
    }

    fetchUserAuth(code: string) {
        let authObject = {
            'X-PrivateKey': '',
            'Authorization': ''
        }
        return new Promise((resolve, reject) => {
            this.dbFindOne('profiles', {clientcode: code})
            .then((result:any) => {
                resolve(result)
            })
            .catch(err => reject(err))
        })
    }

    getSymbolToken(query: any) {
        return this.dbFindOne('scripMaster', query)
    }

    setUserJwt(code: string, auth: any) {
        return this.dbUpdateOne('profiles', {clientcode: code}, {$set: {auth: { ...auth }, jwt: auth.jwtToken}})
    }

    setUserPrivateKey(code: string, privateKey: Object) {
        return this.dbUpdateOne('profiles', {clientcode: code}, {$set: {privateKey: privateKey}})
    }

    getBasicHeaders() {
        return this.basicHeaders;
    }

    getUserAuth(code: string) {
        return this.authObject[code]
    }

    authorize(code: string) {
        return new Promise((resolve, reject) => {
            this.fetchUserAuth(code)
            .then((data: any) => {
                this.authObject = {}
                this.authObject[code] = {
                    code: data.clientcode,
                    jwtToken: data.auth.jwtToken,
                    refreshToken: data.auth.refreshToken,
                    feedToken: data.auth.feedToken,
                    privateKey: data.privateKey
                }
                resolve(this.authObject)
            })
            .catch(err => reject(err))
        })
    }

    getFinalHeaders(code: string, auth: boolean) {
        let finalHeaders: any;

        if(auth) finalHeaders = { ...this.basicHeaders, 'Authorization': `Bearer ${this.authObject[code].jwtToken}`, 'X-PrivateKey': this.authObject[code].privateKey }
        else finalHeaders = { ...this.basicHeaders, 'X-PrivateKey': this.authObject[code].privateKey }
        return finalHeaders
    }

    getPublicIp() {
        return axios.get(
            'https://api.ipify.org?format=json',
            {
                validateStatus: (status) => {
                    return status >= 200 && status < 300; 
                }
            }
        )
    }

    saveIncomingRecord(record: any) {
        return this.dbInsertOne("incoming", record)
    }
}

export default new DataStore()