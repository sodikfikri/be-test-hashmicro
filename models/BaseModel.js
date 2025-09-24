// BaseModel.js
const fs = require("fs").promises;
const path = require("path");
class BaseModel {
    constructor(filePath) {
        // this.filePath = filePath;
        this.filePath = path.join("/tmp", path.basename(filePath));
    }

    async read() {
        try {
            const fileData = (await fs.readFile(this.filePath, "utf8")).trim();
            return fileData ? JSON.parse(fileData) : [];
        } catch {
            return [];
        }
    }

    async write(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async findById(id) {
        const data = await this.read();
        return data.find((item) => item.id === id) || null;
    }

    async updateById(id, newData) {
        const data = await this.read();
        const index = data.findIndex((item) => item.id === id);
        if (index === -1) return null;

        data[index] = {
            ...data[index],
            ...newData
        };
        await this.write(data);
        return data[index];
    }

    async deleteById(id) {
        let data = await this.read();
        const initialLength = data.length;

        data = data.filter((item) => item.id !== id);
        if (data.length === initialLength) {
            return false; // tidak ada yang dihapus
        }

        await this.write(data);
        return true;
    }

    async deleteReportABS(employeeId) {
        let data = await this.read();
        const initialLength = data.length;

        data = data.filter((item) => item.employeeId !== employeeId);
        if (data.length === initialLength) {
            return false; // tidak ada yang dihapus
        }

        await this.write(data);
        return true;
    }

    async findReport(employeeId, date) {
        const data = await this.read()
        return data.find(
            (item) => item.employeeId === employeeId && item.date === date
        ) || null;
    }

    async addObject(employeeId, date, hour, status) {
        const data = await this.read();
        
        // cari data berdasarkan employeeId & date
        let item = data.find(
            (row) => row.employeeId === employeeId && row.date === date
        );
        if (item) {
            if (status !== 'checkout') {
                // tambahkan/overwrite checkout
                item.checkin = hour;
            } else {
                item.checkout = hour;
            }
            // simpan data kembali
            await this.write(data);
            return true
        }

        return false
    }

}

module.exports = BaseModel;