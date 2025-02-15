class ApiError {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }

    static badRequest(msg) {
        return new ApiError(400, msg);
    }

    static internal(msg) {
        return new ApiError(500, msg);
    }

    static notFound(msg) {
        return new ApiError(404, msg);
    }

    static forbidden(msg) {
        return new ApiError(403, msg);
    }
}

module.exports = ApiError;
