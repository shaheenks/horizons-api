"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("@utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get("/", (_req, res) => {
    res.send("Express + TypeScript Server");
});
app.use(express_1.default.json({ limit: '5mb' })); // for parsing application/json
app.get('/live', (_req, res) => res.send(`LIVE`));
app.get('/logs', (_req, res) => res.send(logger_1.logger.logs));
const sample_1 = __importDefault(require("@routes/sample"));
app.use('/sample', sample_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
