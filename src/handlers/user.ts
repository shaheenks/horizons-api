import { Request, Response } from "express";
import ApiResponseBuilder from "@utils/model/api-response";
import UndefinedError from "@utils/errors/undefined-error";
import appState from "@services/data-store/app-state";
import dbAccess from "@services/data-store/db-access";

export class UserHandler {

    setApiKey(params: any, query: any, body: any, callback: Function) {
        let allParams = {...params, ...query, ...body}
        dbAccess.updateOne("profiles", { clientcode: allParams.clientcode }, { privateKey: allParams.apiKey })
        .then((data: any) => callback(null, {...data} ))
        .catch(err => callback(err, {}))
    }

    setHeaders(params: any, query: any, body: any, callback: Function) {
        let allParams = {...params, ...query, ...body}
        dbAccess.updateOne("app-config", { key: "basic-headers" }, body)
        .then((data: any) => callback(null, {...data} ))
        .catch(err => callback(err, {}))
    }

    getFinalHeaders(params: any, query: any, body: any, callback: Function) {
        let allParams = {...params, ...query, ...body}
        let response = appState.getHeaders(allParams.clientcode, true);
        callback(null, response)
    }

    all(req: Request, res: Response) {
        res.json(new ApiResponseBuilder(false, {}, new UndefinedError('ROUTE NOT FOUND')))
    }
}