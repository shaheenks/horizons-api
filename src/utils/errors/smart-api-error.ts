export default class SmartApiError extends Error {
    constructor(message: string, stack: string) {
        super(message);
        this.name = "SmartApiError"
        this.stack = stack
    }
}