import express, { Request, Response} from "express";
const UserRoute = express.Router();

import { UserHandler } from "@handlers/user";
const userHandler = new UserHandler();
import { SmartApiHandler } from "@handlers/smart-api";
const smartApiHandler = new SmartApiHandler();
import ApiResponse from "@utils/model/api-response";
import validateRequestBody from "@utils/helpers/request-validator";

const APP = process.env.APP || 'TEMPLATE';

const validRoutes = {
    'key': {
        'POST': ["clientcode", "apiKey"],
    },
    'authorize': {
        'GET': ["clientcode"]
    },
    'headers': {
        'GET': [],
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
UserRoute.post('/key/:clientcode', (req: Request, res: Response) => {
  validateRequestBody(req, validRoutes)
    .then(flag => userHandler.setApiKey(req.params, req.query, req.body))
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
})
// Get user headers
UserRoute.get('/headers/:clientcode', (req: Request, res: Response) => {
    validateRequestBody(req, validRoutes)
    .then(flag => userHandler.getFinalHeaders(req.params, req.query, req.body))
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
})
UserRoute.get('/headers', (req: Request, res: Response) => {
    validateRequestBody(req, validRoutes)
    .then(flag => userHandler.getHeaders())
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
})
// Set basic headers.
UserRoute.post('/headers', (req: Request, res: Response) => {
    validateRequestBody(req, validRoutes)
    .then(flag => userHandler.setHeaders(req.params, req.query, req.body))
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
})
// LOGIN
const handleLogin = (req: Request, res: Response) => {
    validateRequestBody(req, validRoutes)
    .then(flag => smartApiHandler.login(req.params, req.query, req.body))
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
};
// UserRoute.get('/login', handleLogin)
UserRoute.post('/login', handleLogin)
// LOGOUT
const handleLogout = (req: Request, res: Response) => {
    validateRequestBody(req, validRoutes)
    .then(flag => smartApiHandler.logout(req.params, req.query, req.body))
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
}
UserRoute.get('/logout/:clientcode', handleLogout)
UserRoute.post('/logout/:clientcode', handleLogout)
// PROFILE
// GET
const handleProfile = (req: Request, res: Response) => {
    validateRequestBody(req, validRoutes)
    .then(flag => smartApiHandler.profile(req.params, req.query, req.body))
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
}
UserRoute.get('/profile/:clientcode', handleProfile)
UserRoute.post('/profile/:clientcode', handleProfile)
// GET CANDLE DATA
UserRoute.post('/data/:clientcode', (req: Request, res: Response) => {
    validateRequestBody(req, validRoutes)
    .then(flag => smartApiHandler.data(req.params, req.query, req.body))
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
})
// GET QUOTE
UserRoute.post('/quote/:clientcode', (req: Request, res: Response) => {
    validateRequestBody(req, validRoutes)
    .then(flag => smartApiHandler.quote(req.params, req.query, req.body))
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
})

// All Routes
UserRoute.all('*', (req: Request, res: Response) => {
    userHandler.all()
    .then(data => res.json(new ApiResponse(true, data)))
    .catch((err) => res.status(404).json(new ApiResponse(false, {}, err)))
})

export default UserRoute