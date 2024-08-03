const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    // Measure start time for compilation
    const compileStart = process.hrtime();

    exec(`g++ ${filepath} -o ${outPath}`, (compileError, stdout, stderr) => {
      if (compileError) {
        return reject({ type: 'compilation', message: stderr });
      }

      // Measure end time for compilation and calculate duration
      const [compileSeconds, compileNanoseconds] = process.hrtime(compileStart);
      const compileTime = compileSeconds * 1000 + compileNanoseconds / 1e6; // Convert to milliseconds

      // Measure start time for execution
      const executeStart = process.hrtime();

      exec(`cd ${outputPath} && .\\${jobId}.exe < ${inputPath}`, (runtimeError, runtimeStdout, runtimeStderr) => {
        // Measure end time for execution and calculate duration
        const [executeSeconds, executeNanoseconds] = process.hrtime(executeStart);
        const executeTime = executeSeconds * 1000 + executeNanoseconds / 1e6; // Convert to milliseconds

        if (runtimeError) {
          return reject({ type: 'runtime', message: runtimeStderr });
        }

        // Return output along with timing information
        resolve({
          output: runtimeStdout.toString(), // Ensure output is a string
          compileTime,   // Compilation time
          executeTime    // Execution time
        });
      });
    });
  });
};

module.exports = {
  executeCpp,
};
