const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const scriptPath = path.join(outputPath, `${jobId}.py`);

  return new Promise((resolve, reject) => {
    // Measure start time for copying the script (approximate compilation time)
    const compileStart = process.hrtime();

    // Copy the script to the outputPath
    fs.copyFile(filepath, scriptPath, (copyError) => {
      if (copyError) {
        return reject({ type: 'compilation', message: copyError.message });
      }

      // Measure end time for copying and calculate duration
      const [compileSeconds, compileNanoseconds] = process.hrtime(compileStart);
      const compileTime = compileSeconds * 1000 + compileNanoseconds / 1e6; // Convert to milliseconds

      // Measure start time for execution
      const executeStart = process.hrtime();

      exec(`python ${scriptPath} < ${inputPath}`, (runtimeError, runtimeStdout, runtimeStderr) => {
        // Measure end time for execution and calculate duration
        const [executeSeconds, executeNanoseconds] = process.hrtime(executeStart);
        const executeTime = executeSeconds * 1000 + executeNanoseconds / 1e6; // Convert to milliseconds

        if (runtimeError) {
          return reject({ type: 'runtime', message: runtimeStderr });
        }

        // Return output along with timing information
        resolve({
          output: runtimeStdout.toString().trim(), // Ensure output is a string and trim whitespace
          compileTime,   // Approximate compilation time
          executeTime    // Execution time
        });
      });
    });
  });
};

module.exports = {
  executePython,
};
