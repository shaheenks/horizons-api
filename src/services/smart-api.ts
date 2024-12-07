import axios, { AxiosResponse } from "axios";
import InvalidInputParameters from "@utils/errors/invalid-input-parameters"
import SmartApiError from "@utils/errors/smart-api-error";
import ApiResponseBuilder from "@utils/model/api-response";
import dataStore from "./data-store";

export default class SmartApiService {
    private basicHeaders: any;

    private inputValidator(requiredKeys: string[], payload: Object) {
        return new Promise ((resolve, reject) => {
            if (!payload || typeof payload !== 'object' || !requiredKeys || !Array.isArray(requiredKeys)) {
                reject(new ApiResponseBuilder(false, {}, 'Invalid input parameters at SMARTAPI'))
            }
            // Iterate through the list of keys
            for (const key of requiredKeys) {
                if (!payload.hasOwnProperty(key)) {
                    reject(new ApiResponseBuilder(false, {}, 'Invalid input parameters at SMARTAPI'))
                }
            }
            // If all keys are present, return true
            resolve(payload)
        }) 
    }

    private responseHandler = (response: AxiosResponse) => {
        // console.log(response)
        return new Promise((resolve, reject) => {
            if (response.data.status) resolve(response.data)
            else reject(new SmartApiError('Smart API returned error response', JSON.stringify(response.data)))
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

    loadScripMaster() {
        return axios.get(
            'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json', 
            {
                validateStatus: (status) => {
                    return status >= 200 && status < 300; 
                }
            }
        )
    }

    getPublicIp() {
        return axios.get(
            'https://api.ipify.org?format=json',
            {
                validateStatus: (status) => {
                    return status >= 200 && status < 300; 
                }
            }
        )
    }
}