/**
 * created by Nikolay V. Ulyanov (ulianownv@mail.ru)
 * http://www.smcsystem.ru
 */

JsFactory = function () {
    SMCApi.Module.call(this);

    /**
     * This callback type is called `ElementCheck` and is displayed as a global symbol.
     *
     * @callback JsFactory.ElementCheck
     * @param {Object[]} inputs
     * @param {number} id
     * @param {Object[][]} lst
     * @return {boolean}
     */
    /**
     * This callback type is called `ElementCaller` and is displayed as a global symbol.
     *
     * @callback JsFactory.ElementCaller
     * @param {SMCApi.ConfigurationTool} configurationTool
     * @param {SMCApi.ExecutionContextTool} executionContextTool
     * @param {Object[]} inputs
     * @param {number} id
     * @param {Object[][]} lst
     * @return {SMCApi.IMessage[]}
     */
    /**
     * This callback type is called `ResultParamsFunc` and is displayed as a global symbol.
     *
     * @callback JsFactory.ResultParamsFunc
     * @param {Object[]} inputs
     * @param {Object[][]} lst
     * @param {JsFactory} that
     * @return {Object[]}
     */
    /**
     * This callback type is called `ElementFormat` and is displayed as a global symbol.
     *
     * @callback JsFactory.ElementFormat
     * @param {Object[]} data
     * @return {Object[]}
     */

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     */
    this.start = function (configurationTool) {
        /** @type {{params: string, check: string, error: string, format: string}[]} */
        let cfgs = SmcUtils.convertFromObjectArray(SmcUtils.getObjectArray(configurationTool.getSetting("configuration")), true);
        /** @type {{call: ElementCaller, check: ElementCheck, error: string, format: ElementFormat}[]} */
        this.configuration = [];
        const that = this;
        cfgs.forEach(o => {
            let f = o.format.trim();
            let obj = {
                call: eval("(configurationTool, executionContextTool, inputs, id, lst)=>{\n" +
                    "return SmcUtils.executeAndGetMessages(executionContextTool, id, that.convertToParams([" + o.params.trim() + "]));" +
                    "\n}"),
                check: eval("(inputs, id, lst)=>{\n" +
                    "return " + o.check.trim() + ";" +
                    "\n}"),
                error: o.error.trim() ? o.error.trim() : "ec result check error",
                format: f && f.length > 0 ?
                    eval("(out)=>{\n" +
                        f +
                        "\n}") :
                    null
            };
            that.configuration.push(obj);
        });

        let resultParamsS = SmcUtils.toString(configurationTool.getSetting("resultParams")).trim();
        /** @type {ResultParamsFunc} */
        this.resultParams = resultParamsS ?
            eval("(inputs, lst, that)=>{\n" +
                "return that.convertToParams([" + resultParamsS + "]);" +
                "\n}") :
            null;
        let inputFormatS = SmcUtils.toString(configurationTool.getSetting("inputFormat")).trim();
        this.inputFormat = inputFormatS ?
            eval("(inputs)=>{\n" +
                inputFormatS +
                "\n}") :
            null;
        let inputCheckS = SmcUtils.toString(configurationTool.getSetting("inputCheck")).trim();
        this.inputCheck = inputCheckS ?
            eval("(inputs)=>{\n" +
                "return " + inputCheckS + ";" +
                "\n}") :
            null;
        this.inputCheckError = SmcUtils.toString(configurationTool.getSetting("inputCheckError")).trim();
        if (!this.inputCheckError)
            this.inputCheckError = "input check error"
    };

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     */
    this.update = function (configurationTool) {
        this.stop(configurationTool);
        this.start(configurationTool);
    };

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     */
    this.process = function (configurationTool, executionContextTool) {
        const that = this;
        SmcUtils.processMessagesAll(configurationTool, executionContextTool, (id, messages) => {
            let inputs = that.convertFromMessages(messages[0]);
            /** @type {Object[][]} */
            const lst = [];
            // lst.push(inputs);

            // configurationTool.loggerInfo(that.configuration ? that.configuration.length : 0);

            if (that.inputFormat)
                inputs = that.inputFormat(inputs);
            if (that.inputCheck && !that.inputCheck(inputs)) {
                executionContextTool.addError(that.inputCheckError);
                return;
            }

            for (let i = 0; i < that.configuration.length; i++) {
                const o = that.configuration[i];
                let result = o.call(configurationTool, executionContextTool, inputs, i, lst);
                result = that.convertFromMessages(result);
                if (o.format)
                    result = o.format(result);
                lst.push(result);
                if (!o.check(inputs, i, lst)) {
                    executionContextTool.addError(o.error);
                    executionContextTool.addError(i + 1);
                    return;
                }
            }

            if (that.resultParams) {
                const result = that.resultParams(inputs, lst, that);
                const resultConverted = that.convertToParams(result);
                //configurationTool.loggerTrace("resultParams data size " + (resultConverted ? resultConverted.length : 0) + " " + resultConverted);
                executionContextTool.addMessage(resultConverted);
            }
        });
    };

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     */
    this.stop = function (configurationTool) {
        this.configuration = null;
        this.resultParams = null;
        this.inputFormat = null;
        this.inputCheck = null;
        this.inputCheckError = null;
    };

    /**
     * @param params    {Object[]}
     * @return {Object[]}
     */
    this.convertToParams = function (params) {
        const result = [];
        if (params) {
            if (!Array.isArray(params))
                params = [params];
            params.forEach(v => {
                const t = SmcUtils.getValueTypeObject(v);
                if (v && t === null) {
                    let newV = new SMCApi.ObjectArray(SMCApi.ObjectType.OBJECT_ELEMENT, [SmcUtils.convertToObjectElement(v)]);
                    if (newV)
                        v = newV;
                } else if (t === SMCApi.ValueType.BYTES) {
                    let newV = SmcUtils.convertToObjectArray(v);
                    if (newV)
                        v = newV;
                }
                result.push(v);
            });
        }
        return result;
    };

    /**
     * @param params    {SMCApi.IMessage[]}
     * @return {Object[]}
     */
    this.convertFromMessages = function (params) {
        const result = [];
        if (params) {
            if (!Array.isArray(params))
                params = [params];
            params.forEach(m => {
                let v = m.getValue();
                if (SmcUtils.isObjectArray(m))
                    v = SmcUtils.convertFromObjectArray(m, true);
                result.push(v);
            });
        }
        return result;
    };

};

JsFactory.prototype = SMCApi.Module;

