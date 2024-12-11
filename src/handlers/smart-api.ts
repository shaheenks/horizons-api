import { Request, Response } from "express";

import SmartApiService from "@services/smart-api"
import appState from "@services/data-store/app-state";
import ApiResponseBuilder from "@utils/model/api-response";
import UndefinedError from "@utils/errors/undefined-error";
import dbAccess from "@services/data-store/db-access";
const smartApiService = new SmartApiService();

export class SmartApiHandler {

    login(params: any, query: any, body: any, callback: Function) {
        let allParams = {...params, ...query, ...body}
        let finalHeaders = appState.getHeaders(allParams.clientcode.toUpperCase(), true);

        let finalResponse: any
        smartApiService.loginByPassword(finalHeaders, body)
        .then((response: any) => {
            finalResponse = response.data
            return dbAccess.updateOne("profiles", {clientcode: allParams.clientcode.toUpperCase()}, { auth: finalResponse })
        })
        .then((response: any) => { appState.bootstrap() })
        .then((response: any) => callback(null, finalResponse))
        .catch(err => callback(err, {}))
    }

    profile(params: any, query: any, body: any, callback: Function) {
        let allParams = {...params, ...query, ...body}
        let finalHeaders = appState.getHeaders(allParams.clientcode.toUpperCase(), true);
        
        smartApiService.getProfile(finalHeaders)
        .then((response: any) => callback(null, response.data))
        .catch(err => callback(err, {}))
    }

    logout(params: any, query: any, body: any, callback: Function) {
        let allParams = {...params, ...query, ...body}
        let finalHeaders = appState.getHeaders(allParams.clientcode.toUpperCase(), true);

        let finalResponse: any
        smartApiService.logout(finalHeaders, allParams)
        .then((response: any) => {
            finalResponse = response
            return dbAccess.updateOne("profiles", {clientcode: allParams.clientcode.toUpperCase()}, { auth: {jwtToken: '', refreshToken: '', feedToken: ''}})
        })
        .then((response: any) => callback(null, finalResponse.data ))
        .catch(err => callback(err, {}))
    }

    data(params: any, query: any, body: any, callback: Function) {
        let allParams = {...params, ...query, ...body}
        let finalHeaders = appState.getHeaders(allParams.clientcode.toUpperCase(), true);
        
        smartApiService.getCandleData(finalHeaders, body)
        .then((response: any) => callback(null, response.data ))
        .catch(err => callback(err, {}))
    }

    quote(params: any, query: any, body: any, callback: Function) {
        let allParams = {...params, ...query, ...body}
        let finalHeaders = appState.getHeaders(allParams.clientcode.toUpperCase(), true);
        
        smartApiService.quote(finalHeaders, body)
        .then((response: any) => callback(null, response.data ))
        .catch(err => callback(err, {}))
    }

    // fetchData(req: Request, res: Response) {
    //     let params = {...req.query, ...req.body}
    //     let finalHeaders = appState.getHeaders(params.clientcode.toUpperCase(), true);
    //     let symbolData: any;
    //     let finalResponse: any;

    //     dbAccess.findOne("scrip-master", { token: params.symboltoken })
    //     .then((symbol: any) => {
    //         symbolData = {token: symbol.token, symbol: symbol.symbol, name: symbol.name, instrumenttype: symbol.instrumenttype, exch_seg: symbol.exch_seg, expiry: symbol.expiry}
    //         return smartApiService.getCandleData(finalHeaders, req.body)
    //         .then((response: any) => {
    //             finalResponse = {data: response.data, ...symbolData, interval: req.body.interval}
    //             return dbAccess.insertOne("incoming", finalResponse)
    //             // return true
    //         })
    //         .then((result: any) => res.json(new ApiResponseBuilder(true, finalResponse)))
    //         .catch((err: any) => res.json(new ApiResponseBuilder(false, {}, err)))
    //     })
    // }

    symbol(params: any, query: any, body: any, callback: Function) {
        let allParams = {...params, ...query, ...body}

        dbAccess.findMany("scrip-master", allParams)
        .then((response: any) => callback(null, response))
        .catch(err => callback(err, {}))
    }

    loadMaster(callback: Function) {
        dbAccess.deleteMany("scrip-master", {})
        .then((response: any) => {
            return smartApiService.getScripMaster()
        })
        .then((response: any) => {
            return dbAccess.insertMany("scrip-master", response.data)
        })
        .then((response: any) => callback(null, { insertedCount: response.insertedCount } ))
        .catch(err => callback(err, {}))
    }

    all(req: Request, res: Response) {
        res.json(new ApiResponseBuilder(false, {}, new UndefinedError('ROUTE NOT FOUND')))
    }
}