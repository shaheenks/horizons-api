import axios, { AxiosResponse } from "axios";
import InvalidInputParameters from "@utils/errors/invalid-input-params"
import InvalidHttpResponse from "@utils/errors/invalid-http-response";

export default class SmartApiService {

    private inputValidator(requiredKeys: string[], payload: Object) {
        return new Promise ((resolve, reject) => {
            if (!payload || typeof payload !== 'object' || !requiredKeys || !Array.isArray(requiredKeys)) {
                reject(new InvalidInputParameters('failed input validation - SmartAPI service'))
            }
            // Iterate through the list of keys
            for (const key of requiredKeys) {
                if (!payload.hasOwnProperty(key)) {
                    reject(new InvalidInputParameters('failed input validation - SmartAPI service'))
                }
            }
            // If all keys are present, return true
            resolve(payload)
        }) 
    }

    private responseHandler = (response: AxiosResponse) => {
        // console.log(response)
        return new Promise((resolve, reject) => {
            if (response.status == 200) resolve(response.data)
            else reject(new InvalidHttpResponse('invalid HTTP response - SmartApi Service'))
        })
    }

    loginByPassword(finalHeaders: any, payload: any) {
        return new Promise((resolve, reject) => {
            this.inputValidator(['clientcode', 'password', 'totp'], payload)
            .then((_result) => {
                return axios.post(
                    'https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword', 
                    JSON.stringify(payload),
                    {
                        headers: { ...finalHeaders },
                        validateStatus: (status) => {
                            return status >= 200 && status < 300; 
                        }
                    }
                )
            })
            .then(this.responseHandler)
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    };

    logout(finalHeaders: any, payload: Object) {
        return new Promise((resolve, reject) => {
            this.inputValidator(['clientcode'], payload)
            .then((_result) => {
                return axios.post(
                    'https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/logout',
                    JSON.stringify(payload),
                    {
                        headers: { ...finalHeaders },
                        validateStatus: (status) => {
                            return status >= 200 && status < 300; 
                        }
                    }
                )
            })
            .then(this.responseHandler)
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    };

    getProfile(finalHeaders: any) {
        return new Promise((resolve, reject) => {
            axios.get(
                'https://apiconnect.angelone.in/rest/secure/angelbroking/user/v1/getProfile',
                {
                    headers: { ...finalHeaders },
                    validateStatus: (status) => {
                        return status >= 200 && status < 300; 
                    }
                }
            )
            .then(this.responseHandler)
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    };

    quote(finalHeaders: any, payload: Object) {
        return new Promise((resolve, reject) => {
            this.inputValidator(['mode', 'exchangeTokens'], payload)
            .then((_result) => {
                return axios.post(
                    'https://apiconnect.angelone.in/rest/secure/angelbroking/market/v1/quote/',
                    JSON.stringify(payload),
                    {
                        headers: { ...finalHeaders },
                        validateStatus: (status) => {
                            return status >= 200 && status < 300; 
                        }
                    }
                )
            })
            .then(this.responseHandler)
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    };

    getCandleData(finalHeaders: any, payload: Object) {
        return new Promise((resolve, reject) => {
            this.inputValidator(['exchange', 'symboltoken', 'interval', 'fromdate', 'todate'], payload)
            .then((_result) => {
                return axios.post(
                    'https://apiconnect.angelone.in/rest/secure/angelbroking/historical/v1/getCandleData',
                    JSON.stringify(payload),
                    {
                        headers: { ...finalHeaders },
                        validateStatus: (status) => {
                            return status >= 200 && status < 300; 
                        }
                    }
                )
            })
            .then(this.responseHandler)
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    };

    getScripMaster() {
        return axios.get(
            'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json', 
            {
                validateStatus: (status) => {
                    return status >= 200 && status < 300; 
                }
            }
        )
    }
}