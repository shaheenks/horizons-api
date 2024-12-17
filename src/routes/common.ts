import express, { Request, Response } from "express";
const CommonRoute = express.Router();

import { SmartApiHandler } from "@handlers/smart-api";
const smartApiHandler = new SmartApiHandler();
import ApiResponse from "@utils/model/api-response";
import validateRequestBody from "@utils/helpers/request-validator";

const APP = process.env.APP || 'TEMPLATE';

const validRoutes = {
    'symbol': {
        'POST': ["name","exch_seg"],
        'GET': ["token"]
    },
    'load-master': {
        'GET': []
    }
}

CommonRoute.use((req, res, next) => {
    next();
});

const handleSymbol = (req: Request, res: Response) => {
    validateRequestBody(req, validRoutes)
    .then(flag => smartApiHandler.symbol(req.params, req.query, req.body))
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
};
CommonRoute.get('/symbol/:token', handleSymbol)
CommonRoute.post('/symbol', handleSymbol)

CommonRoute.get('/load-master', (req: Request, res: Response) => {
    validateRequestBody(req, validRoutes)
    .then(flag => smartApiHandler.loadMaster())
    .then(data => res.json(new ApiResponse(true, data)))
    .catch(err => res.status(404).json(new ApiResponse(false, {}, err)));
})

CommonRoute.all('*', (req: Request, res: Response) => res.status(404).json(new ApiResponse(false, {}, null, 'ROUTE NOT FOUND')))

export default CommonRoute