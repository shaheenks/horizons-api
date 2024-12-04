"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sample_1 = __importDefault(require("@services/sample"));
const sampleService = new sample_1.default();
(0, globals_1.test)('Get Public IP - Action', () => {
    return sampleService.getPublicIp().then(data => {
        (0, globals_1.expect)(data.status).toBe(200);
    });
});
