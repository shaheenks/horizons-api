import UndefinedError from "@utils/errors/undefined-error";
import appState from "@services/data-store/app-state";
import dbAccess from "@services/data-store/db-access";

export class UserHandler {

    setApiKey(params: any, query: any, body: any) {
        let allParams = {...params, ...query, ...body};

        return new Promise((resolve, reject) => {
            dbAccess.updateOne("profiles", { clientcode: allParams.clientcode }, { privateKey: allParams.apiKey })
            .then((data: any) => resolve({...data} ))
            .catch(err => reject(err))
        });
    }

    setHeaders(params: any, query: any, body: any) {
        let allParams = {...params, ...query, ...body}
        let response: any;

        return new Promise((resolve, reject) => {
            dbAccess.updateOne("app-config", { key: "basic-headers" }, body)
            .then((data: any) => {
                response = data
                return appState.bootstrap()
            })
            .then((flag: any) => {
                resolve({...response} )
            })
            .catch(err => reject(err))
        });
    }

    getHeaders() {
        return(appState.headers)
    }

    getFinalHeaders(params: any, query: any, body: any) {
        let allParams = {...params, ...query, ...body}
        let response = appState.getHeaders(allParams.clientcode, true);
        return(response)
    }

    all() {
        return new Promise((resolve, reject) => {
            reject(new UndefinedError('ROUTE NOT FOUND'))
        })
    }
}