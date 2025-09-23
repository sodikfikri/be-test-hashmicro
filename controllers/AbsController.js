const validator = require("validatorjs");
const AbsModel = require("../models/AbsModel");
const moment = require("moment");
const EmployeeModel = require("../models/EmployeeModel");

const AbsController = {

    Submit: async function (req, res) {
        let apiResult = {};
        try {
            const {
                employeeId,
                date,
                hour,
                status
            } = req.body;
            const input = {
                employeeId,
                date,
                hour,
                status
            };
            const rules = {
                employeeId: "required",
                date: "required",
                hour: "required",
                status: "required",
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

            let params = {
                employeeId,
                date
            }
            if (status == 'checkin') {
                params.checkin = hour
            } else if (status == 'checkout') {
                params.checkout = hour
            }
            let inst = await AbsModel.insert(params, hour, status);
            apiResult = {
                code: 200,
                status: "success",
                message: "Absence recorded successfully",
                data: params
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
    toDate: function (str) {
        return new Date(str + "T00:00:00");
    },
    getWorkingDays: function (start, end) {
        const startDate = moment(start, "YYYY-MM-DD");
        const endDate = moment(end, "YYYY-MM-DD");

        const days = [];

        for (let cur = moment(startDate); cur.isSameOrBefore(endDate); cur.add(1, "days")) {
            days.push(cur.format("YYYY-MM-DD"));
        }

        return days;
    },
    getAllReport: async function (req, res) {
        let apiResult = {};
        try {
            let reports = await AbsModel.all();
            for (let r of reports) {
                let emp = await EmployeeModel.find(r.employeeId);
                r.employeeName = emp.name;
            }
            apiResult = {
                code: 200,
                status: "success",
                message: "Reports retrieved successfully",
                data: reports
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
    SummaryReport: async function (req, res) {
        let apiResult = {};
        try {
            const {
                startDate,
                endDate
            } = req.query;
            const input = {
                startDate,
                endDate
            }
            const rules = {
                startDate: "required",
                endDate: "required"
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

            const start = AbsController.toDate(startDate);

            const end = AbsController.toDate(endDate);

            const workingDays = AbsController.getWorkingDays(start, end); // semua hari kerja
            const totalDays = workingDays.length;

            let attendances = await AbsModel.all();
            // Group by employee
            const grouped = {};
            for (let att of attendances) {
                if (!grouped[att.employeeId]) grouped[att.employeeId] = [];
                grouped[att.employeeId].push(att);
            }
            // return res.json(grouped);
            let finalReport = [];
            for (let empId in grouped) {
                let hadir = 0;

                for (let day of workingDays) {
                    const found = grouped[empId].find(a => a.date === day);

                    if (found && found.checkin && found.checkout) {
                        hadir++;
                    }
                }

                const percentage = totalDays > 0 ? (hadir / totalDays) * 100 : 0;
                let empData = await EmployeeModel.find(empId);

                let empReport = {
                    employeeId: empData.name,
                    totalDays,
                    present: hadir,
                    attendancePercentage: percentage.toFixed(2) + "%"
                }
                if (hadir > 0) { // hanya masukkan karyawan yang punya kehadiran
                    finalReport.push(empReport);
                }
            }

            apiResult = {
                code: 200,
                status: "success",
                message: "Report generated successfully",
                data: finalReport
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

}

module.exports = AbsController;