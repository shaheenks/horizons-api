export default class ApiResponseBuilder {
    status: boolean = false;
    message: string = '';
    errorCode: string | undefined = '';
    data: any = {};

    constructor(status: boolean, data: any, errorCode?: string) {
        if (status) {
            this.status = true;
            this.message = 'SUCCESS'
            this.errorCode = ''
            this.data = data
        } else {
            this.status = false;
            this.message = 'FAILED'
            this.errorCode = errorCode
            this.data = data
        }
    }

    toJson() {
        return {
            status: this.status,
            message: this.message,
            errorCode: this.errorCode,
            data: this.data
        }
    }
}