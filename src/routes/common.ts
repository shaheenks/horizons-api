import express, { Request, Response } from "express";
const CommonRoute = express.Router();

import { SmartApiHandler } from "@handlers/smart-api";
const smartApiHandler = new SmartApiHandler();
import ApiResponse from "@utils/model/api-response";
import InvalidInputParameters from "@utils/errors/invalid-input-params";
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
    if(validateRequestBody(req, validRoutes)) {
        smartApiHandler.symbol(req.params, req.query, req.body, (err: Error, data: Object) => {
            if(!err) res.json(new ApiResponse(true, data))
            else res.json(new ApiResponse(false, {}, err))
        })       
    } else res.json(new ApiResponse(false, {}, new InvalidInputParameters('input validation failed')))
};
CommonRoute.get('/symbol/:token', handleSymbol)
CommonRoute.post('/symbol', handleSymbol)

CommonRoute.get('/load-master', (req: Request, res: Response) => {
    smartApiHandler.loadMaster((err: Error, data: Object) => {
        if(!err) res.json(new ApiResponse(true, data))
        else res.json(new ApiResponse(false, {}, err))
    })
})

CommonRoute.all('*', (req: Request, res: Response) => res.status(404).json(new ApiResponse(false, {}, null, 'ROUTE NOT FOUND')))

export default CommonRoute