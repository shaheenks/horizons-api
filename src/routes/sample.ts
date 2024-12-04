import express from "express";
const SampleRoute = express.Router();

import { logger } from '@utils/logger'
import { SampleHandler } from "@handlers/sample";
const sampleHandler = new SampleHandler();


const APP = process.env.APP || 'TEMPLATE';

SampleRoute.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    
    logger.debug(`ROUTER SMARTR ${req.method} ${req.path}`, {});
    next();
});

SampleRoute.get('/live', (req, res) => res.send( `LIVE`));
SampleRoute.get('/logs', (req, res) => res.send(logger.logs));

SampleRoute.get('/action', sampleHandler.getSample)

export default SampleRoute