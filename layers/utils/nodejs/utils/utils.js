const validateBody = (body, requiredParams) => {
    if (Object.keys(body).length != requiredParams.length) {
        return false;
    };
    return requiredParams
        .map(param => body[param] != null)
        .reduce((acc, val) => acc && val);
};

module.exports = {
    validateBody,
};