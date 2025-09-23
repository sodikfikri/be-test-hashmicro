const validator = require("validatorjs");

const InputCheckController = {

    checkSensitiveCase: async function (req, res) {
        let apiResult = {};
        try {
            const {
                input1,
                input2,
                type
            } = req.body;
            const input = {
                input1,
                input2,
                type
            };
            const rules = {
                input1: "required",
                input2: "required",
                type: "required|string|in:sensitive,non-sensitive",
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

            let count = 0;
            const len = input1.length;

            // Tentukan apakah case sensitive atau tidak
            const str1 = type === 'non-sensitive' ? input1.toLowerCase() : input1;
            const str2 = type === 'non-sensitive' ? input2.toLowerCase() : input2;

            // Simpan karakter yang muncul
            const matchedCharactersList = [];

            // Hitung karakter dari input1 yang muncul di input2
            for (let i = 0; i < str1.length; i++) {
                if (str2.includes(str1[i])) {
                    count++;
                    matchedCharactersList.push(input1[i]); // gunakan karakter original
                }
            }

            const percent = (count / len) * 100;

            // Buat response
            const response = {
                input1,
                input2,
                type,
                matchedCharacters: count,
                matchedCharactersList: matchedCharactersList.join(', '),
                totalCharacters: len,
                percentage: percent.toFixed(2) + "%",
                explanation: `Karena karakter ${matchedCharactersList.join(', ')} ada muncul di ${input2}, berarti ${count} / ${len} karakter (${input1} = ${len} karakter) itu muncul di input kedua, maka hasil = ${percent.toFixed(2)}%`
            }

            const apiResult = {
                code: 200,
                status: "success",
                message: "Successfully checked",
                data: response
            }

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

module.exports = InputCheckController;