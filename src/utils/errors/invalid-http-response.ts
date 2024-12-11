export default class InvalidHttpResponse extends Error {
    constructor(message: string) {
        super(message)
        this.name = "InvalidHttpResponse"
    }
}