const createRes = (status, code, message, data) => {
    return {
        status: status,
        code: code,
        message: message,
        data: data,
    };
};

module.exports = createRes;
