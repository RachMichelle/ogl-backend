// extends JS error, add status & feedback message

class ExError extends Error {
    constructor(msg, status) {
        super();
        this.msg = msg;
        this.status = status;
    }
}

// 404 not found
class NotFoundError extends ExError {
    constructor(message = 'Not found') {
        super(message, 404);
    }
}

// 401 unauthorized
class UnauthorizedError extends ExError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

// 400 bad request
class BadRequestError extends ExError {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}

module.exports = {
    ExError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError
};