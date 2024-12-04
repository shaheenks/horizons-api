import axios from "axios";

export default class SmartApiService {
    getPublicIp() {
        return axios.get('https://api.ipify.org?format=json')
    }
}