import { Request, Response } from "express";

import SampleService from "@services/smart-api"
const sampleService = new SampleService();

export class SmartApiHandler {
    getSample(req: Request, res: Response): void {
        sampleService.getPublicIp()
        .then(response => res.json(response.data))
        .catch(err => res.status(500).json({ message : 'Action failed - GET', err: err }))
    }
}