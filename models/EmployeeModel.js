// EmployeeModel.js
const path = require("path");
const BaseModel = require("./BaseModel");

class EmployeeModel extends BaseModel {
    constructor() {
        super(path.join(__dirname, "../data/employee.json"));
    }

    async insert(data) {
        const employees = await this.read();
        employees.push(data);
        await this.write(employees);
        return "success";
    }

    async all() {
        return await this.read();
    }

    async find(id) {
        return await this.findById(id);
    }

    async update(id, newData) {
        return await this.updateById(id, newData);
    }

    async delete(id) {
        return await this.deleteById(id);
    }
}

module.exports = new EmployeeModel();