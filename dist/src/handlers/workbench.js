"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sample_1 = __importDefault(require("@services/sample"));
const sampleService = new sample_1.default();
sampleService.getPublicIp()
    .then(data => console.log(data))
    .catch(err => console.log({ message: 'Action failed - GET', err: err }));
