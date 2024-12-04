"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleHandler = void 0;
const sample_1 = __importDefault(require("@services/sample"));
const sampleService = new sample_1.default();
class SampleHandler {
    getSample(req, res) {
        sampleService.getPublicIp()
            .then(response => res.json(response.data))
            .catch(err => res.status(500).json({ message: 'Action failed - GET', err: err }));
    }
}
exports.SampleHandler = SampleHandler;
