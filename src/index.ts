// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { logger } from '@utils/logger'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(express.json({limit: '5mb'})); // for parsing application/json

app.get('/live', (_req: Request, res: Response) => res.send( `LIVE`));
app.get('/logs', (_req: Request, res: Response) => res.send(logger.logs));

import SampleRoute from "@routes/sample";
app.use('/sample', SampleRoute)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});