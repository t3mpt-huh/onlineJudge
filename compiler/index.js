const express = require('express');
const app = express();
const { generateFile } = require('./compilerBackend/generateFilePath');
const { generateInputFile } = require('./compilerBackend/generateInputPath');
const { executeCpp } = require('./compilerBackend/executeCpp');
const cors = require('cors');

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/compile", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/compile", async (req, res) => {
    // const language = req.body.language;
    // const code = req.body.code;

    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);
        const output = await executeCpp(filePath, inputPath);
        res.json({ filePath, inputPath, output });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080!");
});