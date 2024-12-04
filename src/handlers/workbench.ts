import SampleService from "@services/sample"
const sampleService = new SampleService();

sampleService.getPublicIp()
.then(data => console.log(data))
.catch(err => console.log({ message : 'Action failed - GET', err: err }))