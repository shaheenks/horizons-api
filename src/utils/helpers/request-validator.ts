import InvalidInputParameters from "@utils/errors/invalid-input-params";
import { Request } from "express";

const validateRequestBody = (req: Request, validRoutes: any) => {

    return new Promise((resolve, reject) => {
        let path:any = req.path.split('/')[1];
        let method: any = req.method;
        let params = {...req.query, ...req.body, ...req.params};
        let errObject = new InvalidInputParameters('ROUTE')

        if (!validRoutes[path]) reject(false);
        if (!validRoutes[path][req.method]) reject(errObject);

        if (!params || 
            typeof params !== 'object' || 
            !validRoutes[path][method] || 
            !Array.isArray(validRoutes[path][method])) {
            reject(errObject);
        }
        
        // Iterate through the list of keys
        for (const key of validRoutes[path][method]) {
            if (!params.hasOwnProperty(key)) {
                reject(errObject);
            }
        }
        // If all keys are present, return true
        resolve(true)
    })
    
}

export default validateRequestBody