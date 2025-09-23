const JWTHelper = require("../helpers/JWTHelper")

const AuthMiddleware = async function (req, res, next) {

    let apiResult = {}
    try {
        const payload = await JWTHelper.verify(req.headers['x-api-key'])
        req.auth = {
            ...payload
        };
    } catch (error) {
        apiResult = {
            code: 500,
            status: "error",
            message: error.message,
        };
        return res.status(500).json(apiResult);
    }
    next()
}
module.exports = AuthMiddleware