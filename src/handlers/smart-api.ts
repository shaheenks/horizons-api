import { Request, response, Response } from "express";

import SmartApiService from "@services/smart-api"
import dataStore from "@services/data-store";
import InvalidInputParameters from "@utils/errors/invalid-input-parameters";
import ApiResponseBuilder from "@utils/model/api-response";
const smartApiService = new SmartApiService();

export class SmartApiHandler {

    login(req: Request, res: Response) {
        let params = {...req.query, ...req.body}
        let finalHeaders = dataStore.getFinalHeaders(params.clientcode.toUpperCase(), true);

        let finalResponse: any
        smartApiService.loginByPassword(finalHeaders, params)
        .then((response: any) => {
            finalResponse = response
            return dataStore.setUserJwt(params.clientcode, response.data)
        })
        .then((response: any) => { return dataStore.authorize(params.clientcode) })
        .then((response: any) => res.json(new ApiResponseBuilder(true, finalResponse.data)))
        .catch(err => res.status(500).json({ message : 'Action failed - GET', err: err }))
    }

    profile(req: Request, res: Response) {
        let params = {...req.query, ...req.body}
        let finalHeaders = dataStore.getFinalHeaders(params.clientcode.toUpperCase(), true);
        
        smartApiService.getProfile(finalHeaders)
        .then((response: any) => res.json(new ApiResponseBuilder(true, response.data)))
        .catch(err => res.status(500).json({ message : 'Action failed - GET', err: err }))
    }

    logout(req: Request, res: Response) {
        let params = {...req.query, ...req.body}
        let finalHeaders = dataStore.getFinalHeaders(params.clientcode.toUpperCase(), true);

        let finalResponse: any
        smartApiService.logout(finalHeaders, params)
        .then((response: any) => {
            finalResponse = response
            return dataStore.setUserJwt(params.clientcode, {jwtToken: '', refreshToken: '', feedToken: ''})
        })
        .then((response: any) => { return dataStore.authorize(params.clientcode) })
        .then((response: any) => res.json(new ApiResponseBuilder(true, finalResponse.data)))
        .catch(err => res.status(500).json({ message : 'Action failed - GET', err: err }))
    }

    data(req: Request, res: Response) {
        let params = {...req.query, ...req.body}
        let finalHeaders = dataStore.getFinalHeaders(params.clientcode.toUpperCase(), true);
        
        smartApiService.getCandleData(finalHeaders, req.body)
        .then((response: any) => res.json(new ApiResponseBuilder(true, response.data)))
        .catch(err => res.status(500).json({ message : 'Action failed - GET', err: err }))
    }

    quote(req: Request, res: Response) {
        let params = {...req.query, ...req.body}
        let finalHeaders = dataStore.getFinalHeaders(params.clientcode.toUpperCase(), true);
        
        smartApiService.quote(finalHeaders, req.body)
        .then((response: any) => res.json(new ApiResponseBuilder(true, response.data)))
        .catch(err => res.status(500).json({ message : 'Action failed - GET', err: err }))
    }

    fetchData(req: Request, res: Response) {
        let params = {...req.query, ...req.body}
        let finalHeaders = dataStore.getFinalHeaders(params.clientcode.toUpperCase(), true);
        let symbolData: any;
        let finalResponse: any;

        dataStore.getSymbolToken({token: params.symboltoken})
        .then((symbol: any) => {
            symbolData = {token: symbol.token, symbol: symbol.symbol, name: symbol.name, instrumenttype: symbol.instrumenttype, exch_seg: symbol.exch_seg, expiry: symbol.expiry}
            return smartApiService.getCandleData(finalHeaders, req.body)
            .then((response: any) => {
                finalResponse = {data: response.data, ...symbolData, interval: req.body.interval}
                return dataStore.saveIncomingRecord(finalResponse)
                // return true
            })
            .then((result: any) => res.json(new ApiResponseBuilder(true, finalResponse)))
            .catch((err: any) => res.json(new ApiResponseBuilder(false, {}, err)))
        })
    }

    symbol(req: Request, res: Response) {
        dataStore.getSymbolToken(req.body)
        .then((data: any) => res.json(new ApiResponseBuilder(true, {token: data.token, symbol: data.symbol, name: data.name, instrumenttype: data.instrumenttype, exch_seg: data.exch_seg})))
        .catch(err => res.status(500).json(new ApiResponseBuilder(false, {}, 'Data based fetch failed - SmartApi handler')))
    }
}