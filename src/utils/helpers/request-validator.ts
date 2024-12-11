import { Request } from "express";

const validateRequestBody = (req: Request, validRoutes: any) => {
    let path:any = req.path.split('/')[1];
    let method: any = req.method;
    let params = {...req.query, ...req.body, ...req.params};

    if (!validRoutes[path]) return false;
    if (!validRoutes[path][req.method]) return false;

    if (!params || 
        typeof params !== 'object' || 
        !validRoutes[path][method] || 
        !Array.isArray(validRoutes[path][method])) {
        return false;
    }
    
    // Iterate through the list of keys
    for (const key of validRoutes[path][method]) {
        if (!params.hasOwnProperty(key)) {
            return false;
        }
  }
  // If all keys are present, return true
  return true;
}

export default validateRequestBody