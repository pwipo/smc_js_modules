/**
 * created by Nikolay V. Ulyanov (ulianownv@mail.ru)
 * https://www.shelfmc.ru
 */

JsFactory = function () {
    SMCApi.Module.call(this);

    /**
     * This callback type is called `Processor` and is displayed as a global symbol.
     *
     * @callback JsFactory.Processor
     * @param {SMCApi.ConfigurationTool} configurationTool
     * @param {SMCApi.ExecutionContextTool} executionContextTool
     * @param {(SMCApi.IMessage[])[]} messagesList
     */

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     */
    this.start = function (configurationTool) {
        /** @type Map[string, Object]*/
        this.cache = new Map();
        /** @type {{func: JsFactory.Processor}} */
        this.configuration = eval("({func: (configurationTool, executionContextTool, messagesList, cache) => {" + SmcUtils.getString(configurationTool.getSetting("configuration")) + "}})");
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
                that.configuration.func(configurationTool, executionContextTool, messagesList, that.cache);
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

}

JsFactory.prototype = SMCApi.Module;

