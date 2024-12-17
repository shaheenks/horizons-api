import SmartApiService from "@services/smart-api"
import appState from "@services/data-store/app-state";
import UndefinedError from "@utils/errors/undefined-error";
import dbAccess from "@services/data-store/db-access";
const smartApiService = new SmartApiService();

export class SmartApiHandler {

    login(params: any, query: any, body: any) {
        let allParams = {...params, ...query, ...body}
        let finalHeaders = appState.getHeaders(allParams.clientcode.toUpperCase(), true);

        return new Promise((resolve, reject) => {
            let finalResponse: any
            smartApiService.loginByPassword(finalHeaders, body)
            .then((response: any) => {
                finalResponse = response.data
                return dbAccess.updateOne("profiles", {clientcode: allParams.clientcode.toUpperCase()}, { auth: finalResponse, ts: new Date().toISOString() })
            })
            .then((response: any) => { appState.bootstrap() })
            .then((response: any) => resolve(finalResponse))
            .catch(err => reject(err))
        });
    }

    profile(params: any, query: any, body: any) {
        let allParams = {...params, ...query, ...body}
        let finalHeaders = appState.getHeaders(allParams.clientcode.toUpperCase(), true);

        return new Promise((resolve, reject) => {
            smartApiService.getProfile(finalHeaders)
            .then((response: any) => resolve(response.data))
            .catch(err => reject(err))
        })
    }

    logout(params: any, query: any, body: any) {
        let allParams = {...params, ...query, ...body}
        let finalHeaders = appState.getHeaders(allParams.clientcode.toUpperCase(), true);

        return new Promise((resolve, reject) => {
            let finalResponse: any
            smartApiService.logout(finalHeaders, allParams)
            .then((response: any) => {
                finalResponse = response
                return dbAccess.updateOne("profiles", {clientcode: allParams.clientcode.toUpperCase()}, { auth: {jwtToken: '', refreshToken: '', feedToken: ''}})
            })
            .then((response: any) => resolve(finalResponse.data ))
            .catch(err => reject(err))
        });
    }

    data(params: any, query: any, body: any) {
        let allParams = {...params, ...query, ...body}
        let finalHeaders = appState.getHeaders(allParams.clientcode.toUpperCase(), true);

        return new Promise((resolve, reject) => {
            smartApiService.getCandleData(finalHeaders, body)
            .then((response: any) => resolve(response.data ))
            .catch(err => reject(err))
        });
    }

    quote(params: any, query: any, body: any) {
        let allParams = {...params, ...query, ...body}
        let finalHeaders = appState.getHeaders(allParams.clientcode.toUpperCase(), true);

        return new Promise((resolve, reject) => {
            smartApiService.quote(finalHeaders, body)
            .then((response: any) => resolve(response.data ))
            .catch(err => reject(err))  
        })
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

    symbol(params: any, query: any, body: any) {
        let allParams = {...params, ...query, ...body};

        return new Promise((resolve, reject) => {
            dbAccess.findMany("scrip-master", allParams)
            .then((response: any) => resolve(response))
            .catch(err => reject(err))
        })
    }

    loadMaster() {

        return new Promise((resolve, reject) => {
            dbAccess.deleteMany("scrip-master", {})
            .then((response: any) => {
                return smartApiService.getScripMaster()
            })
            .then((response: any) => {
                return dbAccess.insertMany("scrip-master", response.data)
            })
            .then((response: any) => resolve({ insertedCount: response.insertedCount } ))
            .catch(err => reject(err))
            })
    }

    all() {
        return new Promise((resolve, reject) => {
            reject(new UndefinedError('ROUTE NOT FOUND'))
        })
    }
}