import express from "express";
const UserRoute = express.Router();

import { logger } from '@utils/logger'

const APP = process.env.APP || 'TEMPLATE';

UserRoute.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    
    logger.debug(`ROUTER smarta ${req.method} ${req.path}`, {});
    next();
});

import { UserHandler } from "@handlers/user";
const userHandler = new UserHandler();

// UserRoute.get('/action', userHandler.getSample)
UserRoute.get('/authorize/:userid', userHandler.authorize)
UserRoute.post('/key/:userid', userHandler.setApiKey)

export default UserRoute