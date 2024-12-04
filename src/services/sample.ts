import axios from "axios";

export default class SampleService {
    getPublicIp() {
        return axios.get('https://api.ipify.org?format=json')
    }
}