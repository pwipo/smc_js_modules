/**
 * created by Nikolay V. Ulyanov (ulianownv@mail.ru)
 * https://www.shelfmc.ru
 */

/**
 * This callback type is called `Processor` and is displayed as a global symbol.
 *
 * @callback JsFactory.Processor
 * @param {SMCApi.ConfigurationTool} configurationTool
 * @param {SMCApi.ExecutionContextTool} executionContextTool
 * @param {(SMCApi.IMessage[])[]} messagesList
 */
CMyUtils = function (configurationTool, executionContextTool, messagesList) {
    this.configurationTool = configurationTool;
    this.executionContextTool = executionContextTool;
    this.messagesList = messagesList;

    /**
     * execute ec and get converted result
     * @param ecId {number} - ec id
     * @param params {Object[]} - input params, optional
     */
    this.execute = function (ecId, params) {
        if (params)
            params = this.convertToParams(params);
        let result = SmcUtils.executeAndGetMessages(this.executionContextTool, ecId, params);
        return this.convertFromMessages(result, false);
    };

    /**
     * get input messages from source and convert it
     * @param srcId {number} - source id
     */
    this.getInputs = function (srcId) {
        if (this.messagesList.length <= srcId)
            return [];
        return this.convertFromMessages(this.messagesList[srcId], false);
    };

    /**
     * convert from messages
     * @param messages {Object[]} - messages
     * @param convertSingleObjectArrayToObject {boolean} - if true - expand first object element, optional
     * @returns {[]}
     */
    this.convertFromMessages = function (messages, convertSingleObjectArrayToObject) {
        const result = [];
        if (typeof convertSingleObjectArrayToObject === undefined)
            convertSingleObjectArrayToObject = false;
        if (messages) {
            // if (!Array.isArray(messages))
            //     messages = [messages];
            messages.forEach(m => {
                let v = m.getValue();
                // that.configurationTool.loggerTrace("convertFromMessages " + String(v) + " " + typeof (v) + " " + m.getType());
                if (SmcUtils.isObjectArray(m)) {
                    const objectArray = SmcUtils.getObjectArray(m);
                    v = SmcUtils.convertFromObjectArray(objectArray, false);
                    if (convertSingleObjectArrayToObject && v.length === 1 && SmcUtils.isArrayContainObjectElements(objectArray))
                        v = v[0];
                    // that.configurationTool.loggerTrace("convertFromMessages " + String(v) + " " + typeof (v) + " " + SmcUtils.getValueTypeObject(v));
                }
                result.push(v);
            });
        }
        return result;
    };

    /**
     * convert to params
     * @param params    {Object[]} - params
     * @return {Object[]}
     */
    this.convertToParams = function (params) {
        const result = [];
        // let that = this;
        if (params) {
            if (!Array.isArray(params))
                params = [params];
            params.forEach(v => {
                let resultV = v;
                const t = SmcUtils.getValueTypeObject(resultV);
                // that.configurationTool.loggerTrace("convertToParams " + String(t) + " " + typeof (resultV) + " " + resultV);
                if (t != null && t !== SMCApi.ValueType.BYTES) {
                    // that.configurationTool.loggerTrace("convertToParams skip " + String(t) + " " + resultV);
                } else if (resultV) {
                    if (t === null) {
                        // that.configurationTool.loggerTrace("convertToParams 1 " + typeof (resultV) + " " + String(resultV));
                        let newV = SmcUtils.convertToObjectElement(resultV, true);
                        if (newV)
                            resultV = new SMCApi.ObjectArray(SMCApi.ObjectType.OBJECT_ELEMENT, [newV]);
                    } else {
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

};

JsFactory = function () {
    SMCApi.Module.call(this);

    /**
     * This callback type is called `Processor` and is displayed as a global symbol.
     *
     * @callback JsFactory.Processor
     * @param {SMCApi.ConfigurationTool} configurationTool
     * @param {SMCApi.ExecutionContextTool} executionContextTool
     * @param {(SMCApi.IMessage[])[]} messagesList
     * @param {Map<string, Object>} cache
     * @param {CMyUtils} myUtils
     */

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     */
    this.start = function (configurationTool) {
        /** @type Map[string, Object]*/
        this.cache = new Map();
        /** @type {{func: JsFactory.Processor}} */
        this.configuration = eval("({func: (configurationTool, executionContextTool, messagesList, cache, myUtils) => {" + SmcUtils.getString(configurationTool.getSetting("configuration")) + "}})");
        if (!this.configuration.func)
            throw new SMCApi.ModuleException("need configuration object with property func");
        let initStr = SmcUtils.getString(configurationTool.getSetting("init"));
        if (initStr && initStr.trim()) {
            const initFunc = eval("({func: (configurationTool, cache) => {" + initStr.trim() + "}})");
            if (initFunc.func)
                initFunc.func(configurationTool, this.cache);
        }
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
        SmcUtils.processMessagesAll(configurationTool, executionContextTool, (id, messagesList) => {
            try {
                let myUtils = new CMyUtils(configurationTool, executionContextTool, messagesList);
                that.configuration.func(configurationTool, executionContextTool, messagesList, that.cache, myUtils);
            } catch (ex) {
                if (ex.code) {
                    executionContextTool.addError(ex.message);
                    executionContextTool.addError(ex.code);
                    // executionContextTool.addError(new SMCApi.ObjectArray(SMCApi.ObjectType.OBJECT_ELEMENT, [new SMCApi.ObjectElement(
                    //     [new SMCApi.SMCApi.ObjectField(this.exceptionObjTextField, ex.message), new SMCApi.SMCApi.ObjectField(this.exceptionObjErrorCodeField, ex.code)])]));
                } else {
                    throw ex;
                }
            }
        });
    };

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     */
    this.stop = function (configurationTool) {
        /** @type {{func: JsFactory.Processor}} */
        this.configuration = null;
        this.cache = null;
    };

};

JsFactory.prototype = SMCApi.Module;

