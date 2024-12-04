"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
require('dotenv').config();
const log = require("loglevel");
log.setLevel("trace");
class Logger {
    constructor() {
        this.APP = process.env.APP || 'MAIN';
        this.logSpool = [];
    }
    error(msg) {
        let logMessage = `${new Date().toISOString()} [ERROR] ${this.APP} ${msg}`;
        this.logSpool.push(logMessage);
        log.error(logMessage);
    }
    warn(msg, obj) {
        let logMessage = `${new Date().toISOString()} [WARNI] ${this.APP} ${msg}`;
        this.logSpool.push(logMessage);
        log.warn(logMessage);
        if (obj != null)
            log.warn(obj);
    }
    info(msg) {
        let logMessage = `${new Date().toISOString()} [INFOR] ${this.APP} ${msg}`;
        this.logSpool.push(logMessage);
        log.info(logMessage);
    }
    debug(msg, obj) {
        let logMessage = `${new Date().toISOString()} [DEBUG] ${this.APP} ${msg}`;
        this.logSpool.push(logMessage);
        log.debug(logMessage);
        if (obj != null)
            log.debug(obj);
    }
    trace(msg) {
        let logMessage = `${new Date().toISOString()} [TRACE] ${this.APP} ${msg}`;
        this.logSpool.push(logMessage);
        log.trace(logMessage);
    }
    get logs() {
        return this.logSpool;
    }
}
;
exports.logger = new Logger();
