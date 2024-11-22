const createError = (success, code, message, detailErr) => {
    return {
        success: success,
        code: code,
        message: message,
        detail_error: detailErr,
    };
};

module.exports = createError;
