"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class SampleService {
    getPublicIp() {
        return axios_1.default.get('https://api.ipify.org?format=json');
    }
}
exports.default = SampleService;
