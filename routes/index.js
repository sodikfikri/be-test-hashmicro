const AbsController = require("../controllers/AbsController")
const AuthController = require("../controllers/AuthController")
const EmployeeController = require("../controllers/EmployeeController")
const InputCheckController = require("../controllers/InputCheckController")
const AuthMiddleware = require("../middleware/AuthMiddleware")
const PREFIX = '/api'


exports.routesConfig = function (app) {
    app.post(`${PREFIX}/login`, AuthController.Login)

    app.get(`${PREFIX}/employee/all`, AuthMiddleware, EmployeeController.GetAllData)
    app.post(`${PREFIX}/employee/ins`, AuthMiddleware, EmployeeController.Insert)
    app.get(`${PREFIX}/employee/find`, AuthMiddleware, EmployeeController.Find)
    app.put(`${PREFIX}/employee/update`, AuthMiddleware, EmployeeController.Update)
    app.delete(`${PREFIX}/employee/delete`, AuthMiddleware, EmployeeController.DeleteData)

    app.post(`${PREFIX}/abs/submit`, AuthMiddleware, AbsController.Submit)
    app.get(`${PREFIX}/abs/report`, AuthMiddleware, AbsController.getAllReport)
    app.get(`${PREFIX}/abs/summary_report`, AuthMiddleware, AbsController.SummaryReport)
    
    app.post(`${PREFIX}/input/check`, AuthMiddleware, InputCheckController.checkSensitiveCase)
}