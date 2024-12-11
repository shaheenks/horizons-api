import express, {Request} from "express";
const SmartApiRoute = express.Router();

import InvalidInputParameters from "@utils/errors/invalid-input-params";
import validateRequestBody from "@utils/helpers/request-validator";
import ApiResponse from "@utils/model/api-response";

const APP = process.env.APP || 'TEMPLATE';

const validRoutes = {
    'profile': {
        'POST': ["clientcode"],
        'GET': ["clientcode"],
    },
    'login': {
        'POST': ["clientcode", "password", "totp"]
    },
    'logout': {
        'POST': ["clientcode"]
    },
    'quote': {
        'POST': ["clientcode", 'mode', 'exchangeTokens']
    },
    'data': {
        'POST': ["clientcode", 'exchange', 'symboltoken', 'interval', 'fromdate', 'todate']
    },
    'symbol': {
        'POST': ["name","exch_seg"],
        'GET': ["token"]
    },
    'fetch': {
        'POST': ["clientcode", 'exchange', 'symboltoken', 'interval', 'fromdate', 'todate']
    },
    'load-master': {
        'GET': []
    }
}

SmartApiRoute.use((req, res, next) => {
// Valid req.body attributes before proceeding.
    if (validateRequestBody(req, validRoutes)) next()
    else res.json(new ApiResponse(false, {}, new InvalidInputParameters('request validation failed')))
});

import { SmartApiHandler } from "@handlers/smart-api";
const smartApiHandler = new SmartApiHandler();
// LOGIN
// SmartApiRoute.get('/login', smartApiHandler.login)
// SmartApiRoute.post('/login', smartApiHandler.login)
// LOGOUT
// SmartApiRoute.get('/logout', smartApiHandler.logout)
// SmartApiRoute.post('/logout', smartApiHandler.logout)
// PROFILE
// SmartApiRoute.get('/profile', smartApiHandler.profile)
// SmartApiRoute.post('/profile', smartApiHandler.profile)
// GET CANDLE DATA
// SmartApiRoute.post('/data', smartApiHandler.data)
// GET QUOTE
// SmartApiRoute.post('/quote', smartApiHandler.quote)
// GET SYMBOL TOKEN
// SmartApiRoute.post('/symbol', smartApiHandler.symbol)
// FETCH SYMBOL TOKEN - SAVE
// SmartApiRoute.post('/fetch', smartApiHandler.fetchData)
// LOAD MASTER
// SmartApiRoute.get('/load-master', smartApiHandler.loadMaster)
// GET SYMBOL TOKEN
// SmartApiRoute.get('/symbol', smartApiHandler.symbol)
// All Routes
SmartApiRoute.all('*', smartApiHandler.all)

export default SmartApiRoute