import express from "express";
const SmartApiRoute = express.Router();

import { logger } from '@utils/logger'

const APP = process.env.APP || 'TEMPLATE';

SmartApiRoute.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    
    logger.debug(`ROUTER smarta ${req.method} ${req.path}`, {});
    next();
});

import { SmartApiHandler } from "@handlers/smart-api";
const smartApiHandler = new SmartApiHandler();

SmartApiRoute.get('/action', smartApiHandler.getSample)

export default SmartApiRoute