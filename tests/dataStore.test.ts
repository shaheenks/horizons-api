import { expect, test } from "@jest/globals";
import dataStore from "@services/data-store";

import SmartApiService from "@services/smart-api";
const smartApiService = new SmartApiService();

// test('DataStore - get user auth', () => {
//     return dataStore.getUserAuth("S90725")
//     .then(data => console.log())
// })

setTimeout(() => {
    // let basicHeaders = {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     'X-UserType': 'USER',
    //     'X-SourceID': 'WEB',
    //     'X-ClientLocalIP': '192.168.29.65',
    //     'X-ClientPublicIP': '49.47.192.111',
    //     'X-MACAddress': 'a2:34:e9:9e:3d:14',
    // };
    // dataStore.setBasicHeaders(basicHeaders)
    // dataStore.setUserJwt("S90725", {jwtToken: "xxxxxx"})
    // .then(result => dataStore.setUserKey("S90725", "xxxxxxxx"))
    // .then(result => dataStore.getUserAuth("S90725"))
    // smartApiService.buildHeader("S90725")
    dataStore.getBasicHeaders()
    .then((data: any) => console.log(data))
    .catch((err: any) => console.log(err))
}, 1500)
