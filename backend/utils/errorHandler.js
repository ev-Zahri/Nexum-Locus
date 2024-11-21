const createError = (status, code, message, detailErr) => {
    return {
        status: status,
        code: code,
        message: message,
        detail_error: detailErr,
    };
};

module.exports = createError;
