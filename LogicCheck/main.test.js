require("../api/SmcApi.js");
require("../api/SmcUtils.js");
require("../api/SmcEmulator.js");
require("./main.js");
// import JsFactory from "main.js"
// console.log(SmcEmulator.value);

const process = new SmcEmulator.Process(
    new SmcEmulator.ConfigurationTool(
        null,
        null,
        null,
        "test",
        null,
        new Map([
            ["configuration", new SmcEmulator.Value(new SMCApi.ObjectArray(SMCApi.ObjectType.OBJECT_ELEMENT, [new SMCApi.ObjectElement([
                new SMCApi.ObjectField("params", "inputs ? inputs[0] : 1, inputs && inputs.length>1 ? inputs[1] : 2"),
                // new SMCApi.ObjectField("params", "inputs[1]"),
                new SMCApi.ObjectField("check", "lst[0] && lst[0][0]===3"),
                new SMCApi.ObjectField("error", "error one"),
                new SMCApi.ObjectField("format", "return [out[0], out[0]+1, \"formated\"];")
            ])]))],
            ["resultParams", new SmcEmulator.Value("inputs ? inputs[0] : 1, lst && lst.length > 0 && lst[0] ? lst[0][0] : 2")],
            ["inputFormat", new SmcEmulator.Value("return [...inputs, 3];")],
            ["inputCheck", new SmcEmulator.Value("inputs[0]===\"path\"")],
            ["inputCheckError", new SmcEmulator.Value("main check error")]
        ])
    ), new JsFactory());

process.start();

let executionContextTool = new SmcEmulator.ExecutionContextTool(
    [
        [
            new SmcEmulator.Action([
                new SmcEmulator.Message(new SmcEmulator.Value("path"))
            ])
        ],
    ], null, null,
    [
        (lst) => {
            console.log("lst size " + lst.length + " " + lst + " " + lst[0]);
            return new SmcEmulator.Action([new SmcEmulator.Message(new SmcEmulator.Value(3))]);
        }
    ]
);
let output = process.execute(executionContextTool);
output.forEach(m => console.log(`${m.getMessageType()}: ${m.getType()} - ${m.getValue()}`));
executionContextTool.output = [];

executionContextTool = new SmcEmulator.ExecutionContextTool(
    [
        [
            new SmcEmulator.Action([
                new SmcEmulator.Message(new SmcEmulator.Value("path2"))
            ])
        ],
    ], null, null,
    [
        (lst) => {
            console.log("lst size " + lst.length + " " + lst);
            return new SmcEmulator.Action([new SmcEmulator.Message(new SmcEmulator.Value(3))]);
        }
    ]
);
output = process.execute(executionContextTool);
output.forEach(m => console.log(`${m.getMessageType()}: ${m.getType()} - ${m.getValue()}`));
executionContextTool.output = [];

executionContextTool = new SmcEmulator.ExecutionContextTool(
    [
        [
            new SmcEmulator.Action([
                new SmcEmulator.Message(new SmcEmulator.Value("path")),
                new SmcEmulator.Message(new SmcEmulator.Value(
                    new SMCApi.ObjectArray(SMCApi.ObjectType.OBJECT_ELEMENT, [new SMCApi.ObjectElement([
                        new SMCApi.ObjectField("_default", true)
                    ])])))
            ])
        ],
    ], null, null,
    [
        (lst) => {
            console.log("lst size " + lst.length + " " + lst);
            return new SmcEmulator.Action([new SmcEmulator.Message(new SmcEmulator.Value(3))]);
        }
    ]
);
output = process.execute(executionContextTool);
output.forEach(m => console.log(`${m.getMessageType()}: ${m.getType()} - ${m.getValue()}`));
executionContextTool.output = [];

process.stop();