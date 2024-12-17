// src/index.ts
import express, { Express } from "express";
import dotenv from "dotenv";
import { logger } from '@utils/logger';
import UserRoute from "@routes/user";
import CommonRoute from "@routes/common";
import dbAccess from "@services/data-store/db-access";
import appState from "@services/data-store/app-state";
import IndexRoute from "@routes/index";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const COMPONENT = 'index----'

// Middleware
app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // CORS
  logger.debug(`${COMPONENT} ${req.method} ${req.path}`); // Request Logging
  next()
});

app.use(express.json({limit: '5mb'})); // for parsing application/json

// Request Routing
app.use('/api/user', UserRoute);
app.use('/api/common', CommonRoute);
app.use('*', IndexRoute);

// Bootstrap --> Server startup.
dbAccess.bootstrap()
.then(_flag => appState.bootstrap())
.then(() => {
  app.listen(port, () => {
    logger.info(`${COMPONENT} Server running at port:${port}`)
  });
})
.catch((err) => {logger.debug(`${COMPONENT} bootstrap failed`, err)})