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
     * This callback type is called `ElementParams` and is displayed as a global symbol.
     *
     * @callback JsFactory.ElementParams
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
     * @param {Object[]} out
     */
    /**
     * This callback type is called `FunFull` and is displayed as a global symbol.
     *
     * @callback JsFactory.FunFull
     * @param configurationTool    {SMCApi.ConfigurationTool}
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param {Object[]} inputs
     * @param {Object[][]} lst
     */

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     */
    this.start = function (configurationTool) {
        /** @type {{params: string, check: string, error: string, format: string, disableAutoConvert: boolean, needCheckExist: boolean, skipECExec: boolean, name: string|null}[]} */
        let cfgs = SmcUtils.convertFromObjectArray(SmcUtils.getObjectArray(configurationTool.getSetting("configuration")), true);
        /** @type {{params: ElementParams, check: ElementCheck, error: string, format: ElementFormat, disableAutoConvert: boolean, needCheckExist: boolean, skipECExec: boolean, name: string|null}[]} */
        this.configuration = [];
        const that = this;

        const regexLst = /^lst\[\d+]$/;
        let cfgId=0;
        cfgs.forEach(o => {
            cfgId++;
            let n = o.name ? o.name.trim() : `configuration ${cfgId}`;
            let p = o.params ? o.params.trim() : null;
            let c = o.check ? o.check.trim() : null;
            let e = o.error ? o.error.trim() : null;
            let f = o.format ? o.format.trim() : null;
            let skipECExec = o.skipECExec ? o.skipECExec : false;

            let obj = {
                name: n,
                params: !skipECExec ?
                    eval("(inputs, id, lst)=>{\n" +
                        "return " + (p ? (p === "inputs" || regexLst.test(p) ? p : "[" + p + "]") : "[]") + "; \n" +
                        "\n}") :
                    null,
                check: c ?
                    eval("(inputs, id, lst)=>{\n" +
                        "return " + c + ";" +
                        "\n}") :
                    null,
                error: e ? e : (n + " error"),
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
                "return " + (resultParamsS === "inputs" || regexLst.test(resultParamsS) ? resultParamsS : "[" + resultParamsS + "]") + ";" +
                "\n}") :
            null;
        let inputFormatS = SmcUtils.toString(configurationTool.getSetting("inputFormat")).trim();
        /** @type {ElementFormat} */
        this.inputFormat = inputFormatS ?
            eval("(inputs)=>{\n" +
                inputFormatS +
                "\n}") :
            null;
        let inputCheckS = SmcUtils.toString(configurationTool.getSetting("inputCheck")).trim();
        /** @type {ElementCheck} */
        this.inputCheck = inputCheckS ?
            eval("(inputs)=>{\n" +
                "return " + inputCheckS + ";" +
                "\n}") :
            null;
        this.inputCheckError = SmcUtils.toString(configurationTool.getSetting("inputCheckError")).trim();
        if (!this.inputCheckError)
            this.inputCheckError = "input check error";
        let finalSuccessProcessorS = SmcUtils.toString(configurationTool.getSetting("finalSuccessProcessor")).trim();
        /** @type {FunFull} */
        this.finalSuccessProcessor = finalSuccessProcessorS ?
            eval("(configurationTool,executionContextTool, inputs, lst)=>{\n" +
                finalSuccessProcessorS +
                "\n}") :
            null;
        let finalFailProcessorS = SmcUtils.toString(configurationTool.getSetting("finalFailProcessor")).trim();
        /** @type {FunFull} */
        this.finalFailProcessor = finalFailProcessorS ?
            eval("(configurationTool,executionContextTool, inputs, lst)=>{\n" +
                finalFailProcessorS +
                "\n}") :
            null;
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
            let inputs = that.convertFromMessages(configurationTool, messages[0], true, false);
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
            let isError = false;
            try {
                for (let i = 0; i < that.configuration.length; i++) {
                    const o = that.configuration[i];
                    if (!o.skipECExec && o.params) {
                        ecId++;
                        let resultParams = o.params(inputs, ecId, lst);
                        if (resultParams)
                            resultParams = that.convertToParams(configurationTool, resultParams);
                        // configurationTool.loggerTrace("ec params: " + resultParams);
                        let result = SmcUtils.executeAndGetMessages(executionContextTool, ecId, resultParams);
                        result = that.convertFromMessages(configurationTool, result, false, o.disableAutoConvert);
                        if (o.needCheckExist && (!result || result.length === 0)) {
                            executionContextTool.addError(o.error);
                            executionContextTool.addError(i + 1);
                            isError = true;
                            break;
                        }
                        if (o.format)
                            o.format(result);
                        lst.push(result);
                    }
                    if (o.check && !o.check(inputs, i, lst)) {
                        executionContextTool.addError(o.error);
                        executionContextTool.addError(i + 1);
                        isError = true;
                        break;
                    }
                }
            } catch (e) {
                isError = true;
                throw e;
            } finally {
                if (isError && that.finalFailProcessor) {
                    that.finalFailProcessor(configurationTool, executionContextTool, inputs, lst);
                } else if (!isError && that.finalSuccessProcessor) {
                    that.finalSuccessProcessor(configurationTool, executionContextTool, inputs, lst);
                }
            }

            if (!isError && that.resultParams) {
                let resultConverted = that.resultParams(inputs, lst, that);
                if (resultConverted)
                    resultConverted = that.convertToParams(configurationTool, resultConverted);
                // const resultConverted = that.convertToParams(configurationTool, resultConverted);
                // configurationTool.loggerTrace("resultParams data size " + (resultConverted ? resultConverted.length : 0) + " " + resultConverted);
                resultConverted.forEach(v => executionContextTool.addMessage(v));
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
        this.finalSuccessProcessor = null;
        this.finalFailProcessor = null;
    };

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     * @param params    {Object[]}
     * @return {Object[]}
     */
    this.convertToParams = function (configurationTool, params) {
        const result = [];
        if (params) {
            if (!Array.isArray(params))
                params = [params];
            let that = this;
            params.forEach(v => {
                let resultV = v;
                const t = SmcUtils.getValueTypeObject(resultV);
                // configurationTool.loggerTrace("convertToParams " + String(t) + " " + typeof (resultV) + " " + resultV);
                if (t != null && t !== SMCApi.ValueType.BYTES) {
                    // configurationTool.loggerTrace("convertToParams skip " + String(t) + " " + resultV);
                } else if (resultV) {
                    if (t === null) {
                        // configurationTool.loggerTrace("convertToParams 1 " + typeof (resultV) + " " + String(resultV));
                        let newV = SmcUtils.convertToObjectElement(resultV, true);
                        if (newV)
                            resultV = new SMCApi.ObjectArray(SMCApi.ObjectType.OBJECT_ELEMENT, [newV]);
                        // } else if (t === SMCApi.ValueType.OBJECT_ARRAY) {
                        //     configurationTool.loggerTrace("convertToParams 2 " + typeof (resultV) + " " + String(resultV));
                        //     resultV = SmcUtils.convertToObjectArray(resultV, true);
                    } else {
                        // const t2 = SmcUtils.getValueTypeObject(resultV[0]);
                        // const t2O = typeof (resultV[0]);
                        // configurationTool.loggerTrace("convertToParams 3 1 " + t2 + " " + t2O + " " + resultV.length + " " + resultV[0]);
                        // let newV = SmcUtils.convertToObjectArray(resultV, true);
                        // if (newV.size() <= 1 /*|| !newV.getType()|| newV.getType() === undefined || newV.getType() === null || newV.getType() !== SMCApi.ObjectType.OBJECT_ELEMENT*/)
                        // let newV = SmcUtils.convertToObjectArray(resultV[0], true);
                        /*
                                                configurationTool.loggerTrace("convertToParams 3 2 " + t2 + " " + t2O + " " + resultV.length + " " + resultV[0] + " " +
                                                    // resultV instanceof SMCApi.ObjectArray + " " + resultV[0] instanceof SMCApi.ObjectArray +
                                                    " " + newV + " " + SmcUtils.getValueTypeObject(newV) + (newV instanceof SMCApi.ObjectArray ? " d" : " f"));
                        */
                        /*
                                                let newV = SmcUtils.convertToObjectArray(resultV, true);
                                                configurationTool.loggerTrace("convertToParams 3 1 " + newV);
                        */
                        // if (newV.size && newV.size() > 0 /*&& newV.getType()&& newV.getType() !== undefined && newV.getType() !== null && newV.getType() == SMCApi.ObjectType.OBJECT_ELEMENT*/)
                        // if (newV.size() > 0)
                        let newV = SmcUtils.convertToObjectArray(resultV, true);
                        if (newV.size() === resultV.length)
                            resultV = newV;
                    }
                }
                result.push(resultV);
            });
        }
        return result;
    };

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     * @param params    {SMCApi.IMessage[]}
     * @param convertSingleObjectArrauToObject    {boolean}
     * @param disableAutoConvert    {boolean}
     * @return {Object[]}
     */
    this.convertFromMessages = function (configurationTool, params, convertSingleObjectArrauToObject, disableAutoConvert) {
        const result = [];
        if (params) {
            // if (!Array.isArray(params))
            //     params = [params];
            params.forEach(m => {
                let v = m.getValue();
                // configurationTool.loggerTrace("convertFromMessages " + String(v) + " " + typeof (v) + " " + m.getType());
                if (!disableAutoConvert && SmcUtils.isObjectArray(m)) {
                    const objectArray = SmcUtils.getObjectArray(m);
                    v = SmcUtils.convertFromObjectArray(objectArray, false);
                    if (convertSingleObjectArrauToObject && v.length === 1 && SmcUtils.isArrayContainObjectElements(objectArray))
                        v = v[0];
                    // configurationTool.loggerTrace("convertFromMessages " + String(v) + " " + typeof (v) + " " + SmcUtils.getValueTypeObject(v));
                }
                result.push(v);
            });
        }
        return result;
    };

};

JsFactory.prototype = SMCApi.Module;

