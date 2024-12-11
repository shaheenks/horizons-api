// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { logger } from '@utils/logger';
import UserRoute from "@routes/user";
import SmartApiRoute from "@routes/smart-api";
import CommonRoute from "@routes/common";
import dbAccess from "@services/data-store/db-access";
import appState from "@services/data-store/app-state";
import ApiResponse from "@utils/model/api-response";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const COMPONENT = 'index----'

app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // CORS
  logger.debug(`index ${req.method} ${req.path}`); // Request Logging
  next()
});

app.use(express.json({limit: '5mb'})); // for parsing application/json

app.get("/", (_req: Request, res: Response) => {res.send("Horizons API - Express.js")});
app.get('/live', (_req: Request, res: Response) => res.send( `LIVE`));
app.get('/logs', (_req: Request, res: Response) => res.send(logger.logs));

app.use('/smartapi', SmartApiRoute);
app.use('/user', UserRoute);
app.use('/common', CommonRoute)

app.use('*', (req: Request, res: Response) => res.status(404).json(new ApiResponse(false, {}, null, 'ROUTE NOT FOUND')))

// Bootstrap --> Server startup.
dbAccess.bootstrap()
.then(_flag => appState.bootstrap())
.then(() => {
  app.listen(port, () => {
    logger.info(`${COMPONENT} Server running at port:${port}`)
  });
})
.catch((err) => {logger.debug(`${COMPONENT} bootstrap failed`, err)})