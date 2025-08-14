const { StatusCodes, ReasonPhrases } = require("..");

const BASE_HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

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

    send(res, obj) {
        const {
            headers = {},
            cookie = null,
            contentType = null,
            dataSend = null
        } = obj || {};
        
        res.set({ ...BASE_HEADERS, ...headers });

        if (cookie) {
            res.cookie(cookie.key, cookie.value, cookie.options);
        }


        if (dataSend !== undefined && dataSend !== null) {
            // Nếu có contentType thì set Content-Type theo contentType (e.g. 'image/jpeg')
            if (contentType) res.type(contentType);
            return res.status(this.statusCode || 200).send(dataSend);
        }

        if (this.statusCode === 204) {
            return res.status(this.statusCode).send();
        }

        // Mặc định: JSON
        return res.status(this.statusCode || 200).json(this);
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
