import express, { Request, Response} from "express";
const UserRoute = express.Router();

import { UserHandler } from "@handlers/user";
const userHandler = new UserHandler();
import { SmartApiHandler } from "@handlers/smart-api";
const smartApiHandler = new SmartApiHandler();
import ApiResponse from "@utils/model/api-response";
import InvalidInputParameters from "@utils/errors/invalid-input-params";
import validateRequestBody from "@utils/helpers/request-validator";
import { logger } from "@utils/logger";

const APP = process.env.APP || 'TEMPLATE';

const validRoutes = {
    'key': {
        'POST': ["clientcode", "apiKey"],
    },
    'authorize': {
        'GET': ["clientcode"]
    },
    'headers': {
        'GET': ["clientcode"],
        'POST':["Content-Type", "Accept", "X-UserType", "X-SourceID", "X-ClientLocalIP", "X-MACAddress"]
    },
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
    }
}

UserRoute.use((req, res, next) => {
    // Valid req.body attributes before proceeding.
    // if (validateRequestBody(req, validRoutes)) next()
    // else res.json(new ApiResponse(false, {}, new InvalidInputParameters('requested route/action - Not found')))
    next()
});

// Set API Key
UserRoute.post('/key', (req: Request, res: Response) => {
    if(validateRequestBody(req, validRoutes)) {
        userHandler.setApiKey(req.params, req.query, req.body, (err: Error, data: Object) => {
            if(!err) res.json(new ApiResponse(true, data))
            else res.json(new ApiResponse(false, {}, err))
        })       
    } else res.json(new ApiResponse(false, {}, new InvalidInputParameters('USER ROUTER')))
})
// Get user headers
UserRoute.get('/headers/:clientcode', (req: Request, res: Response) => {
    if(validateRequestBody(req, validRoutes)) {
        userHandler.getFinalHeaders(req.params, req.query, req.body, (err: Error, data: Object) => {
            if(!err) res.json(new ApiResponse(true, data))
            else res.json(new ApiResponse(false, {}, err))
        })       
    } else res.json(new ApiResponse(false, {}, new InvalidInputParameters('USER ROUTER')))
})
// Set basic headers.
UserRoute.post('/headers', (req: Request, res: Response) => {
    if(validateRequestBody(req, validRoutes)) {
        userHandler.setHeaders(req.params, req.query, req.body, (err: Error, data: Object) => {
            if(!err) res.json(new ApiResponse(true, data))
            else res.json(new ApiResponse(false, {}, err))
        })       
    } else res.json(new ApiResponse(false, {}, new InvalidInputParameters('USER ROUTER')))
})
// LOGIN
const handleLogin = (req: Request, res: Response) => {
    if(validateRequestBody(req, validRoutes)) {
        smartApiHandler.login(req.params, req.query, req.body, (err: Error, data: Object) => {
            if(!err) res.json(new ApiResponse(true, data))
            else res.json(new ApiResponse(false, {}, err))
        })       
    } else res.json(new ApiResponse(false, {}, new InvalidInputParameters('USER ROUTER')))
};
// UserRoute.get('/login', handleLogin)
UserRoute.post('/login', handleLogin)
// LOGOUT
const handleLogout = (req: Request, res: Response) => {
    if(validateRequestBody(req, validRoutes)) {
        smartApiHandler.logout(req.params, req.query, req.body, (err: Error, data: Object) => {
            if(!err) res.json(new ApiResponse(true, data))
            else res.json(new ApiResponse(false, {}, err))
        })       
    } else res.json(new ApiResponse(false, {}, new InvalidInputParameters('USER ROUTER')))
}
UserRoute.get('/logout/:clientcode', handleLogout)
UserRoute.post('/logout/:clientcode', handleLogout)
// PROFILE
// GET
const handleProfile = (req: Request, res: Response) => {
    if(validateRequestBody(req, validRoutes)) {
        smartApiHandler.profile(req.params, req.query, req.body, (err: Error, data: Object) => {
            if(!err) res.json(new ApiResponse(true, data))
            else res.json(new ApiResponse(false, {}, err))
        })       
    } else res.json(new ApiResponse(false, {}, new InvalidInputParameters('USER ROUTER')))
}
UserRoute.get('/profile/:clientcode', handleProfile)
UserRoute.post('/profile/:clientcode', handleProfile)
// GET CANDLE DATA
UserRoute.post('/data/:clientcode', (req: Request, res: Response) => {
    if(validateRequestBody(req, validRoutes)) {
        smartApiHandler.data(req.params, req.query, req.body, (err: Error, data: Object) => {
            if(!err) res.json(new ApiResponse(true, data))
            else res.json(new ApiResponse(false, {}, err))
        })       
    } else res.json(new ApiResponse(false, {}, new InvalidInputParameters('USER ROUTER')))
})
// GET QUOTE
UserRoute.post('/quote/:clientcode', (req: Request, res: Response) => {
    if(validateRequestBody(req, validRoutes)) {
        smartApiHandler.quote(req.params, req.query, req.body, (err: Error, data: Object) => {
            if(!err) res.json(new ApiResponse(true, data))
            else res.json(new ApiResponse(false, {}, err))
        })       
    } else res.json(new ApiResponse(false, {}, new InvalidInputParameters('USER ROUTER')))
})

// All Routes
UserRoute.all('*', userHandler.all)

export default UserRoute