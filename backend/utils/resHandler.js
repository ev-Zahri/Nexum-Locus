const createRes = (success, code, message, data) => {
    return {
        success: success,
        code: code,
        message: message,
        data: data,
    };
};

module.exports = createRes;
