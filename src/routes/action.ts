import express from "express";
const ActionRoute = express.Router();

import InvalidInputParameters from "@utils/errors/invalid-input-params";
import validateRequestBody from "@utils/helpers/request-validator";
import ApiResponse from "@utils/model/api-response";

const APP = process.env.APP || 'TEMPLATE';

const validRoutes = {}

ActionRoute.use((req, res, next) => {
// Valid req.body attributes before proceeding.
    validateRequestBody(req, validRoutes)
    .then(flag => next())
    .catch(err => res.status(404).json(new ApiResponse(false, {}, new InvalidInputParameters('ACTION ROUTER'))))

});


// ActionRoute.all('*', smartApiHandler.all)

export default ActionRoute