import UndefinedError from "@utils/errors/undefined-error";
import { logger } from "@utils/logger";

export default class ApiResponse {
    success: boolean = false;
    data: any = {};
    error: any = {};

    constructor(success: boolean, data: any, error?: Error | null, message?: string) {
        let response: any = {}; 
        if (success) {
            this.success = success
            this.data = data
        } else {
            this.success = false;
            this.data = data;
        }

        if(error) {
            this.error = {
                name: error.name,
                message: error.message
            }
            logger.debug(`ApiReponseBuilder`, error.stack);
        } else if (data.message == null && success == false) {
            let err = new UndefinedError(message)
            this.error = {
                name: err.name,
                message: err.message
            }
        }
    }
}