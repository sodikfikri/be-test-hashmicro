const account = require("../data/account")
const JWTHelper = require("../helpers/JWTHelper")

const AuthController = {

    Login: async function(req, res) {
        let apiResult = {}
        try {
            const { username, password } = req.body
            if (username !== account.data.username || password !== account.data.password) {
                apiResult = {
                    code: 400,
                    status: "error",
                    message: "Invalid username or password"
                }
                return res.status(400).json(apiResult)
            }

            apiResult = {
                code: 200,
                status: "success",
                message: "Login successful",
                token: await JWTHelper.sign({username: username, password: password})
            }
            return res.status(200).json(apiResult)
        } catch (error) {
            apiResult = {
                code: 500,
                status: "error",
                message: error.message
            }
            return res.status(500).json(apiResult)
        }
    }

}

module.exports = AuthController