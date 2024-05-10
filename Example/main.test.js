require("SmcApi.js");
require("SmcUtils.js");
require("SmcEmulator.js");
// import JsTest from "main.js"
require("main.js");
// require("SmcEmulator.js")
// console.log(SmcEmulator.value);

const fs = require('fs');
const fileName = "text.txt";
const fileData = fs.readFileSync(fileName, "utf8");
const process = new SmcEmulator.Process(
    new SmcEmulator.ConfigurationTool(
        null,
        new SmcEmulator.FileTool("tmpdir", false, null, [new SmcEmulator.FileTool("text.txt", true, Array.from(fileData).map(c=>c.charCodeAt(c)), [])]),
        null,
        "test",
        null,
        new Map([
            ["value", new SmcEmulator.Value("Hello world")],
            ["param", new SmcEmulator.Value("test value")],
        ])
    ), new JsTest());

process.start();

let executionContextTool = new SmcEmulator.ExecutionContextTool();

process.execute(executionContextTool);
let output = process.execute(executionContextTool);
output.forEach(m => console.log(`${m.getMessageType()}: ${m.getType()} - ${m.getValue()}`));
console.log(executionContextTool.getOutput()[0].getValue() === "Hello world");
executionContextTool.output = [];

process.stop();