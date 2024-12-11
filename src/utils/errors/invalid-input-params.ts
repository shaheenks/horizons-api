export default class InvalidInputParameters extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidInputParams"
    }
}