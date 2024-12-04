import { expect, test } from "@jest/globals";
import SampleService from "@services/sample";
const sampleService = new SampleService();

test('Get Public IP - Action', () => {
    return sampleService.getPublicIp().then(data => {
        expect(data.status).toBe(200)
    })
})
