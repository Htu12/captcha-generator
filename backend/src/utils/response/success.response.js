const { StatusCodes, ReasonPhrases } = require("..");

class SuccessResponse {
    constructor({
        message,
        statusCode = StatusCodes.OK,
        reasonStatusCode = ReasonPhrases.OK,
        data = {},
    }) {
        this.message = !message ? reasonStatusCode : message;
        this.statusCode = statusCode;
        this.data = data;
    }

    send(res, headers = {}, cookie, dataSend) {
        if (headers) {
            res.set(headers);
        }

        if (cookie) {
            res.cookie(cookie.key, cookie.value, cookie.options);
        }

        dataSend ? res.send(dataSend) : res.status(this.statusCode).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, data }) {
        super({ message, data });
    }
}

class CREATED extends SuccessResponse {
    constructor({
        message,
        statusCode = StatusCodes.CREATED,
        reasonStatusCode = ReasonPhrases.CREATED,
        data = {},
    }) {
        super({
            message,
            statusCode,
            reasonStatusCode,
            data,
        });
    }
}

class NO_CONTENT extends SuccessResponse {
    constructor() {
        super({
            message: ReasonPhrases.NO_CONTENT,
            statusCode: StatusCodes.NO_CONTENT,
        });
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessResponse,
    NO_CONTENT
};
