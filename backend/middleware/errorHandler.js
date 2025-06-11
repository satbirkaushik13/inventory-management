const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    let errorTitle = "Bad Request";
    switch (statusCode) {
        case constants.HTTP_STATUS.BAD_REQUEST:
            errorTitle = "Bad Request";
            break;
        case constants.HTTP_STATUS.UNAUTHORIZED:
            errorTitle = "Unauthorized";
            break;
        case constants.HTTP_STATUS.FORBIDDEN:
            errorTitle = "Forbidden";
            break;
        case constants.HTTP_STATUS.NOT_FOUND:
            errorTitle = "Not Found";
            break;
        case constants.HTTP_STATUS.INTERNAL_SERVER_ERROR:
            errorTitle = "Internal Server Error";
            break;
        case constants.HTTP_STATUS.UNPROCESSABLE_ENTITY:
            errorTitle = "Unprocessable Entity";
            break;
        case constants.HTTP_STATUS.TOO_MANY_REQUESTS:
            errorTitle = "Too Many Requests";
            break;
        case constants.HTTP_STATUS.SERVICE_UNAVAILABLE:
            errorTitle = "Service Unavailable";
            break;
        case constants.HTTP_STATUS.GATEWAY_TIMEOUT:
            errorTitle = "Gateway Timeout";
            break;
        case constants.HTTP_STATUS.REQUEST_TIMEOUT:
            errorTitle = "Request Timeout";
            break;
        case constants.HTTP_STATUS.NOT_IMPLEMENTED:
            errorTitle = "Not Implemented";
            break;
        case constants.HTTP_STATUS.HTTP_VERSION_NOT_SUPPORTED:
            errorTitle = "HTTP Version Not Supported";
            break;
        case constants.HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED:
            errorTitle = "Network Authentication Required";
            break;
    }
    res.json({
        statusCode: statusCode,
        status: constants.FALSE,
        title: errorTitle,
        message: err.message,
        timestamp: new Date().toISOString(),
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = errorHandler;
