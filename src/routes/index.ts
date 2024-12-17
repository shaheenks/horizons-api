import UndefinedError from "@utils/errors/undefined-error";
import { logger } from "@utils/logger";
import ApiResponse from "@utils/model/api-response";
import express, {Request, Response} from "express";
const IndexRoute = express.Router();

const validRoutes = {}

IndexRoute.use((req, res, next) => {
// Valid req.body attributes before proceeding.
    // validateRequestBody(req, validRoutes)
    // .then(flag => next())
    // .catch(err => res.status(404).json(new ApiResponse(false, {}, new InvalidInputParameters('ACTION ROUTER'))))
    next();
});

IndexRoute.get("/", (_req: Request, res: Response) => {res.send("Horizons API - Express.js")});
IndexRoute.get('/live', (_req: Request, res: Response) => res.send( `LIVE`));
IndexRoute.get('/logs', (_req: Request, res: Response) => res.send(logger.logs));

IndexRoute.all('*', (req: Request, res: Response) => {
    res.status(404).json(new ApiResponse(false, {}, new UndefinedError('INDEX ROUTER')))
})

export default IndexRoute