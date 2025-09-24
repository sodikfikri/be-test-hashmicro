const validator = require("validatorjs");
const EmployeeModel = require("../models/EmployeeModel");
const AbsModel = require("../models/AbsModel");

const EmployeeController = {
    getUniqID: function (prefix = "EMP") {
        const number = Math.floor(1000000 + Math.random() * 9000000); // 7 digit
        return `${prefix}${number}`;
    },

    Insert: async function (req, res) {
        let apiResult = {};
        try {
            const {
                name,
                position
            } = req.body;
            const input = {
                name,
                position
            };
            const rules = {
                name: "required|string",
                position: "required|string",
            };

            const inputValidation = new validator(input, rules);
            if (inputValidation.fails()) {
                apiResult = {
                    code: 400,
                    status: "error",
                    message: Object.values(inputValidation.errors.all())[0][0], // pesan validasi pertama
                };
                return res.status(400).json(apiResult);
            }

            const newEmployee = {
                id: EmployeeController.getUniqID(),
                ...input, // <- pakai input, bukan data
            };

            await EmployeeModel.insert(newEmployee);

            apiResult = {
                code: 200,
                status: "success",
                message: "Employee inserted successfully",
                data: newEmployee,
            };
            return res.status(200).json(apiResult);
        } catch (error) {
            apiResult = {
                code: 500,
                status: "error",
                message: error.message,
            };
            return res.status(500).json(apiResult);
        }
    },
    GetAllData: async function (req, res) {
        let apiResult = {};
        try {
            const data = await EmployeeModel.all();
            apiResult = {
                code: 200,
                status: "success",
                message: "Employee data retrieved successfully",
                data: data,
            };
            return res.status(200).json(apiResult);
        } catch (error) {
            apiResult = {
                code: 500,
                status: "error",
                message: error.message,
            };
            return res.status(500).json(apiResult);
        }
    },
    Find: async function (req, res) {
        let apiResult = {};
        try {
            const { id } = req.query;
            if (!id) {
                apiResult = {
                    code: 400,
                    status: "error",
                    message: "ID parameter is required",
                };
                return res.status(400).json(apiResult);
            }
            const employee = await EmployeeModel.find(id);
            if (!employee) {
                apiResult = {
                    code: 404,
                    status: "error",
                    message: "Employee not found",
                };
                return res.status(404).json(apiResult);
            }
            apiResult = {
                code: 200,
                status: "success",
                message: "Employee found",
                data: employee,
            };
            return res.status(200).json(apiResult);
        } catch (error) {
            apiResult = {
                code: 500,
                status: "error",
                message: error.message,
            };
            return res.status(500).json(apiResult);
        }
    },
    Update: async function (req, res) {
        let apiResult = {};
        try {
            const {
                id,
                name,
                position
            } = req.body;
            const input = {
                id,
                name,
                position
            };
            const rules = {
                id: "required",
                name: "required|string",
                position: "required|string",
            };

            const inputValidation = new validator(input, rules);
            if (inputValidation.fails()) {
                apiResult = {
                    code: 400,
                    status: "error",
                    message: Object.values(inputValidation.errors.all())[0][0], // pesan validasi pertama
                };
                return res.status(400).json(apiResult);
            }

            await EmployeeModel.update(id, { name, position });
            apiResult = {
                code: 200,
                status: "success",
                message: "Employee updated successfully",
                data: { id, name, position },
            };
            return res.status(200).json(apiResult);
        } catch (error) {
            apiResult = {
                code: 500,
                status: "error",
                message: error.message,
            };
            return res.status(500).json(apiResult);
        }
    },
    DeleteData: async function (req, res) {
        let apiResult = {};
        try {
            const { id } = req.body;
            if (!id) {
                apiResult = {
                    code: 400,
                    status: "error",
                    message: "ID parameter is required",
                };
                return res.status(400).json(apiResult);
            }
            const deleted = await EmployeeModel.delete(id);
            if (!deleted) {
                apiResult = {
                    code: 404,
                    status: "error",
                    message: "Employee not found or already deleted",
                };
                return res.status(404).json(apiResult);
            }
            await AbsModel.delete(id); // Hapus data di report.json berdasarkan employeeId
            apiResult = {
                code: 200,
                status: "success",
                message: "Employee deleted successfully",
                data: { id },
            };
            return res.status(200).json(apiResult);
        } catch (error) {
            apiResult = {
                code: 500,
                status: "error",
                message: error.message,
            };
            return res.status(500).json(apiResult);
        }
    }
};

module.exports = EmployeeController;