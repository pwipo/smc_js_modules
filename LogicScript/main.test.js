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
 */
const func = function (configurationTool, executionContextTool, messagesList) {
    if (messagesList.length === 0)
        return;
    let messages = messagesList[0];
    if (messages.length === 0)
        return;
    let v1 = SmcUtils.getString(messages.shift());
    let v2 = SmcUtils.toNumber(messages.shift());
    if (v1 && v2) {
        executionContextTool.addMessage(`${v1} ${v2}`)
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
                "    let messages = messagesList[0];\n" +
                "    if (messages.length === 0)\n" +
                "        return;\n" +
                "    let v1 = SmcUtils.getString(messages.shift());\n" +
                "    let v2 = SmcUtils.toNumber(messages.shift());\n" +
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