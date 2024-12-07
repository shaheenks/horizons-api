import { Request } from "express";

const validateRequestBody = (req: Request, validRoutes: any) => {
    let path:any = req.path;
    let params = {...req.query, ...req.body}
    if (!params || typeof params !== 'object' || !validRoutes[path][req.method] || !Array.isArray(validRoutes[path][req.method])) {
        return false;
    }
    // Iterate through the list of keys
    for (const key of validRoutes[path][req.method]) {
        if (!params.hasOwnProperty(key)) {
            return false;
        }
  }
  // If all keys are present, return true
  return true;
}

export default validateRequestBody