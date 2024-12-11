require('dotenv').config();

const log = require("loglevel");
log.setLevel("trace");

class Logger {
    APP: string;
    logSpool: Object[];

    constructor() {
        this.APP = process.env.APP || 'MAIN';
        this.logSpool = [];
    }

    error(msg: string) {
        let logMessage = `${new Date().toISOString()} [ERROR] ${this.APP} ${msg}`
        this.logSpool.push(logMessage)
        
        log.error(logMessage);
    }

    warn(msg: string, obj?: Object) {
        let logMessage = `${new Date().toISOString()} [WARN-] ${this.APP} ${msg}`
        this.logSpool.push(logMessage)
        
        log.warn(logMessage);
        if (obj != null) log.warn(obj)
    }

    info(msg: string) {
        let logMessage = `${new Date().toISOString()} [INFO-] ${this.APP} ${msg}`
        this.logSpool.push(logMessage)
        
        log.info(logMessage);
    }

    debug(msg: string, obj?: Object) {
        let logMessage = `${new Date().toISOString()} [DEBUG] ${this.APP} ${msg}`
        this.logSpool.push(logMessage)
        
        log.debug(logMessage);
        if (obj != null) log.debug(obj)
    }

    trace(msg: string) {
        let logMessage = `${new Date().toISOString()} [TRACE] ${this.APP} ${msg}`
        this.logSpool.push(logMessage)
        
        log.trace(logMessage);
    }

    get logs() {
        return this.logSpool;
    }
};

export let logger = new Logger()