"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SampleRoute = express_1.default.Router();
const logger_1 = require("@utils/logger");
const sample_1 = require("@handlers/sample");
const sampleHandler = new sample_1.SampleHandler();
const APP = process.env.APP || 'TEMPLATE';
SampleRoute.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    logger_1.logger.debug(`ROUTER SMARTR ${req.method} ${req.path}`, {});
    next();
});
SampleRoute.get('/live', (req, res) => res.send(`LIVE`));
SampleRoute.get('/logs', (req, res) => res.send(logger_1.logger.logs));
SampleRoute.get('/action', sampleHandler.getSample);
exports.default = SampleRoute;
