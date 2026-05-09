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
     */

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     */
    this.start = function (configurationTool) {
        /** @type {{params: string, check: string, error: string, format: string, disableAutoConvert: boolean, needCheckExist: boolean, skipECExec: boolean}[]} */
        let cfgs = SmcUtils.convertFromObjectArray(SmcUtils.getObjectArray(configurationTool.getSetting("configuration")), true);
        /** @type {{call: ElementCaller, check: ElementCheck, error: string, format: ElementFormat, disableAutoConvert: boolean, needCheckExist: boolean, skipECExec: boolean}[]} */
        this.configuration = [];
        const that = this;
        cfgs.forEach(o => {
            let p = o.params ? o.params.trim() : null;
            let c = o.check ? o.check.trim() : null;
            let e = o.error ? o.error.trim() : null;
            let f = o.format ? o.format.trim() : null;
            let skipECExec = o.skipECExec ? o.skipECExec : false;

            let obj = {
                call: !skipECExec ?
                    eval("(configurationTool, executionContextTool, inputs, id, lst)=>{\n" +
                        "return SmcUtils.executeAndGetMessages(executionContextTool, id, " +
                        (p ? "that.convertToParams([" + p.trim() + "])" : "[]") +
                        ");" + "\n}") :
                    null,
                check: c ?
                    eval("(inputs, id, lst)=>{\n" +
                        "return " + c.trim() + ";" +
                        "\n}") :
                    null,
                error: e ? e : "ec result check error",
                format: f ?
                    eval("(out)=>{\n" +
                        f +
                        "\n}") :
                    null,
                disableAutoConvert: o.disableAutoConvert ? o.disableAutoConvert : false,
                needCheckExist: o.needCheckExist ? o.needCheckExist : false,
                skipECExec: skipECExec
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
            let inputs = that.convertFromMessages(messages[0], true);
            /** @type {Object[][]} */
            const lst = [];
            // lst.push(inputs);

            // configurationTool.loggerInfo(that.configuration ? that.configuration.length : 0);

            if (that.inputFormat)
                that.inputFormat(inputs);
            if (that.inputCheck && !that.inputCheck(inputs)) {
                executionContextTool.addError(that.inputCheckError);
                return;
            }

            let ecId = -1;
            for (let i = 0; i < that.configuration.length; i++) {
                const o = that.configuration[i];
                if (!o.skipECExec) {
                    ecId++;
                    let result = o.call(configurationTool, executionContextTool, inputs, ecId, lst);
                    result = o.disableAutoConvert ? result : that.convertFromMessages(result, false);
                    if (o.needCheckExist && (!result || result.length === 0)) {
                        executionContextTool.addError(o.error);
                        executionContextTool.addError(i + 1);
                        return;
                    }
                    if (o.format)
                        o.format(result);
                    lst.push(result);
                }
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
        new SMCApi.ObjectArray(SMCApi.ObjectType.OBJECT_ELEMENT, [new SMCApi.ObjectElement([
            new SMCApi.ObjectField("", "")
        ])]);
        if (params) {
            if (!Array.isArray(params))
                params = [params];
            params.forEach(v => {
                const t = SmcUtils.getValueTypeObject(v);
                if (v && t === null) {
                    let newV = new SMCApi.ObjectArray(SMCApi.ObjectType.OBJECT_ELEMENT, [SmcUtils.convertToObjectElement(v)]);
                    if (newV)
                        v = newV;
                } else if (t === SMCApi.ValueType.BYTES && v.length > 0) {
                    const t2 = SmcUtils.getValueTypeObject(v[0]);
                    if (t2 === null || t2 !== SMCApi.ValueType.BYTE) {
                        let newV = SmcUtils.convertToObjectArray(v);
                        if (newV)
                            v = newV;
                    }
                }
                result.push(v);
            });
        }
        return result;
    };

    /**
     * @param params    {SMCApi.IMessage[]}
     * @param convertSingleObjectArrauToObject    {boolean}
     * @return {Object[]}
     */
    this.convertFromMessages = function (params, convertSingleObjectArrauToObject) {
        const result = [];
        if (params) {
            if (!Array.isArray(params))
                params = [params];
            params.forEach(m => {
                let v;
                if (SmcUtils.isObjectArray(m)) {
                    v = SmcUtils.convertFromObjectArray(m, true);
                    if (convertSingleObjectArrauToObject && v.length === 1 && SmcUtils.isArrayContainObjectElements(m))
                        v = v[0];
                } else {
                    v = m.getValue();
                }
                result.push(v);
            });
        }
        return result;
    };

};

JsFactory.prototype = SMCApi.Module;

