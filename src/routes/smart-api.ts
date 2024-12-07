import express from "express";
const SmartApiRoute = express.Router();

import { logger } from '@utils/logger';
import validateRequestBody from "@utils/request-body-validator";
import ApiResponseBuilder from "@utils/model/api-response";

const APP = process.env.APP || 'TEMPLATE';

const validRoutes = {
    '/profile': {
        'POST': ["clientcode"],
        'GET': ["clientcode"],
    },
    '/login': {
        'POST': ["clientcode", "password", "totp"]
    },
    '/logout': {
        'POST': ["clientcode"]
    },
    '/quote': {
        'POST': ["clientcode", 'mode', 'exchangeTokens']
    },
    '/data': {
        'POST': ["clientcode", 'exchange', 'symboltoken', 'interval', 'fromdate', 'todate']
    },
    '/symbol': {
        'POST': ["symbol","exch_seg"]
    },
    '/fetch': {
        'POST': ["clientcode", 'exchange', 'symboltoken', 'interval', 'fromdate', 'todate']
    }
}

SmartApiRoute.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    
    logger.debug(`ROUTER smarta ${req.method} ${req.path}`);
    
    // Valid req.body attributes before proceeding.
    if (validateRequestBody(req, validRoutes)) next()
    else res.status(200).json(new ApiResponseBuilder(false, {}, 'Faile input validation at ROUTER'))
});

import { SmartApiHandler } from "@handlers/smart-api";
const smartApiHandler = new SmartApiHandler();
// LOGIN
SmartApiRoute.get('/login', smartApiHandler.login)
SmartApiRoute.post('/login', smartApiHandler.login)
// LOGOUT
SmartApiRoute.get('/logout', smartApiHandler.logout)
SmartApiRoute.post('/logout', smartApiHandler.logout)
// PROFILE
SmartApiRoute.get('/profile', smartApiHandler.profile)
SmartApiRoute.post('/profile', smartApiHandler.profile)
// GET CANDLE DATA
SmartApiRoute.post('/data', smartApiHandler.data)
// GET QUOTE
SmartApiRoute.post('/quote', smartApiHandler.quote)
// GET SYMBOL TOKEN
SmartApiRoute.post('/symbol', smartApiHandler.symbol)
// FETCH SYMBOL TOKEN - SAVE
SmartApiRoute.post('/fetch', smartApiHandler.fetchData)

export default SmartApiRoute