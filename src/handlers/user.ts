import { Request, Response } from "express";

import dataStore from "@services/data-store";

import SmartApiService from "@services/smart-api"
import { resolve } from "path";
const smartApiService = new SmartApiService();

export class UserHandler {

    authorize(req: Request, res: Response) {
        dataStore.fetchUserAuth(req.params.userid)
        .then((data: any) => {
            res.json(data)
        })
        .catch(err => res.status(500).json(err))
    }

    setApiKey(req: Request, res: Response) {
        dataStore.setUserPrivateKey(req.params.userid, req.body.apiKey)
        .then((data: any) => {
            res.json(data)
        })
        .catch(err => res.status(500).json(err))
    }
}