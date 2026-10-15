require("../api/SmcApi.js");
require("../api/SmcUtils.js");
require("../api/SmcEmulator.js");
require("./main.js");
// import JsFactory from "main.js"
// console.log(SmcEmulator.value);

/**
 * @param configurationTool    {SMCApi.ConfigurationTool}
 * @param executionContextTool {SMCApi.ExecutionContextTool}
 * @param messagesList {(SMCApi.IMessage[])[]}
 * @param {Map<string, Object>} cache
 * @param {CMyUtils} myUtils
 */
const func = function (configurationTool, executionContextTool, messagesList, cache, myUtils) {
    if (messagesList.length === 0)
        return;
    let inputs = myUtils.getInputs(0);
    if (inputs.length === 0)
        return;
    let v1 = inputs.shift();
    let v2 = inputs.shift();
    let v3 = cache.get("v1");
    if (v1 && v2) {
        executionContextTool.addMessage(`${v1} ${v2} ${v3}`)
    } else {
        let e = new Error("Need params");
        e.code = 4;
        throw e;
    }
};

const process = new SmcEmulator.Process(
    new SmcEmulator.ConfigurationTool(
        null,
        null,
        null,
        "test",
        null,
        new Map([
            ["configuration", new SmcEmulator.Value("    if (messagesList.length === 0)\n" +
                "        return;\n" +
                "    let inputs = myUtils.getInputs(0);\n" +
                "    if (inputs.length === 0)\n" +
                "        return;\n" +
                "    let v1 = inputs.shift();\n" +
                "    let v2 = inputs.shift();\n" +
                "    let v3 = cache.get(\"v1\");\n" +
                "    if (v1 && v2) {\n" +
                "        executionContextTool.addMessage(`${v1} ${v2} ${v3}`)\n" +
                "    } else {\n" +
                "        let e = new Error(\"Need params\");\n" +
                "        e.code = 4;\n" +
                "        throw e;\n" +
                "    }\n")],
            ["init", new SmcEmulator.Value("cache.set(\"v1\", 123);")],
        ])
    ), new JsFactory());

process.start();

let executionContextTool = new SmcEmulator.ExecutionContextTool(
    [
        [
            new SmcEmulator.Action([
                new SmcEmulator.Message(new SmcEmulator.Value("str")),
                new SmcEmulator.Message(new SmcEmulator.Value(3))
            ])
        ]
    ]
);
let output = process.execute(executionContextTool);
output.forEach(m => console.log(`${m.getMessageType()}: ${m.getType()} - ${m.getValue()}`));
executionContextTool.output = [];

executionContextTool = new SmcEmulator.ExecutionContextTool(
    [
        [
            new SmcEmulator.Action([
                new SmcEmulator.Message(new SmcEmulator.Value(100))
            ])
        ]
    ]
);
output = process.execute(executionContextTool);
output.forEach(m => console.log(`${m.getMessageType()}: ${m.getType()} - ${m.getValue()}`));
executionContextTool.output = [];

process.stop();