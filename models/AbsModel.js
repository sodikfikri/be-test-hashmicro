// EmployeeModel.js
const path = require("path");
const BaseModel = require("./BaseModel");

class AbsModel extends BaseModel {
    constructor() {
        super(path.join(__dirname, "../data/report.json"));
    }

    async insert(data, hour, status) {
        const ckData = await this.findReport(data.employeeId, data.date)
        if (ckData) {
            const add = await this.addObject(data.employeeId, data.date, hour, status);
            return add
        } else {
            const report = await this.read();
            report.push(data);
            await this.write(report);
            return "success";
        }
    }

    async all() {
        return await this.read();
    }
    async delete(empID) {
        return await this.deleteReportABS(empID);
    }
}

module.exports = new AbsModel();