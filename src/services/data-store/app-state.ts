import DbAccess from '@services/data-store/db-access';
import { logger } from '@utils/logger';
import axios, { AxiosResponse } from 'axios';

const COMPONENT = 'app-state'

class AppState {
    private _basicHeaders: any
    private _profiles: any = {};

    constructor() {}

    bootstrap() {
        return new Promise((resolve, reject) => {
            DbAccess.findOne('app-config', { key: "basic-headers" })
            .then((item: any) => {
                logger.debug(`${COMPONENT} basicHeader fetched`)
                this._basicHeaders={ ...item.value };
            })
            .then((flag: any) => {
                return axios.get(
                    'https://api.ipify.org?format=json',
                    { validateStatus: (status) => { return status >= 200 && status < 300; }}
                )
            })
            .then((response: AxiosResponse) => {
                logger.debug(`${COMPONENT} public IP fetched`)
                this._basicHeaders['X-ClientPublicIP'] = response.data.ip;
                return DbAccess.findMany('profiles', {})
            })
            .then((profiles: any) => {
                profiles.forEach((profile: any) => {
                    this._profiles[profile.clientcode] = profile
                })
                logger.debug(`${COMPONENT} profiles fetched`)
                resolve(true)
            })
            .catch((err: any) => {
                logger.debug(`${COMPONENT} bootstrap failed`, err)
                reject(err)
            })
        })
    }

    getProfile(code?: string) {
        if (code) return this._profiles[code]
        else return this._profiles
    }

    get headers() {
        return this._basicHeaders
    }

    getHeaders(code: string, auth: boolean) {
        let finalHeaders: any;

        if(auth) finalHeaders = { ...this._basicHeaders, 'Authorization': `Bearer ${this.getProfile(code).auth.jwtToken}`, 'X-PrivateKey': this.getProfile(code).privateKey }
        else finalHeaders = { ...this._basicHeaders, 'X-PrivateKey': this.getProfile(code).privateKey }
        return finalHeaders
    }

}

export default new AppState();