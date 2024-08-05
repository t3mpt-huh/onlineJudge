const express = require('express');
const app = express();
const { generateFile } = require('./compilerBackend/generateFilePath');
const { generateInputFile } = require('./compilerBackend/generateInputPath');
const { executeCpp } = require('./compilerBackend/executeCpp');
const { executePython } = require('./compilerBackend/executePython'); // Import the executePython function
const cors = require('cors');

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/compile", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/compile", async (req, res) => {
    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
        return res.status(400).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);

        let output;

        // Conditionally execute based on the language
        if (language === 'cpp') {
            output = await executeCpp(filePath, inputPath);
        } else if (language === 'python') {
            output = await executePython(filePath, inputPath);
        } else {
            return res.status(400).json({ success: false, error: "Unsupported language!" });
        }

        res.json({ output }); // Send only the output directly
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080!");
});
