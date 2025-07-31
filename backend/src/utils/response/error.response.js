const { StatusCodes, ReasonPhrases } = require("..");


class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}


class NotFoundError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.NOT_FOUND,
        statuscode = StatusCodes.NOT_FOUND
    ) {
        super(message, statuscode);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.CONFLICT,
        statuscode = StatusCodes.CONFLICT
    ) {
        super(message, statuscode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.BAD_REQUEST,
        statuscode = StatusCodes.BAD_REQUEST
    ) {
        super(message, statuscode);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.UNAUTHORIZED,
        statuscode = StatusCodes.UNAUTHORIZED
    ) {
        super(message, statuscode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.FORBIDDEN,
        statuscode = StatusCodes.FORBIDDEN
    ) {
        super(message, statuscode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
};
