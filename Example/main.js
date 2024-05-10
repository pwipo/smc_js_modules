JsTest = function () {
    SMCApi.Module.call(this);

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     */
    this.start = function (configurationTool) {
        // print('call start');
        // get settings
        this.value = configurationTool.getSetting("value").getValue();
        this.param = configurationTool.getSetting("param").getValue();

        this.counter = 1;

        this._ = require('underscore');

        // reed file from home folder
        this.fileTextValue = null;
        const fileToolRoot = configurationTool.getHomeFolder();
        const arrChildren = fileToolRoot.getChildrens();
        for (let i = 0; i < arrChildren.length; i++) {
            const fileToolElement = arrChildren[i];
            if (fileToolElement.getName() === "text.txt") {
                const bytes = fileToolElement.getBytes();
                // this.fileTextAsBytes = bytes;
                let content = "";
                for (let j = 0; j < bytes.length; j++)
                    content += String.fromCharCode(bytes[j]);
                this.fileTextValue = content;
                break;
            }
        }
        if (this.fileTextValue === null)
            throw new SMCApi.ModuleException("file text.txt not exist")
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
        let i;
        // send messages
        executionContextTool.addMessage(this.counter++);
        executionContextTool.addMessage(this.value);
        // executionContextTool.addMessage(typeof this.fileTextAsBytes);
        // executionContextTool.addMessage(this.fileTextAsBytes.toString());
        executionContextTool.addMessage(this.fileTextValue);

        // read input messages
        for (i = 0; i < executionContextTool.countSource(); i++) {
            const actions = executionContextTool.getMessages(i);
            for (let j = 0; j < actions.length; j++) {
                this._.each(actions[j].getMessages(), function (m) {
                    executionContextTool.addMessage(m.getValue());
                });
            }
        }

        // execute all execution contexts and result messages send as own message
        const that = this;
        for (i = 0; i < executionContextTool.getFlowControlTool().countManagedExecutionContexts(); i++) {
            executionContextTool.getFlowControlTool().executeNow(SMCApi.CommandType.EXECUTE, i, [this.param]);
            that._.each(executionContextTool.getFlowControlTool().getMessagesFromExecuted(0, i), function (action) {
                that._.each(action.getMessages(), function (m) {
                    executionContextTool.addMessage(m.getValue());
                });
            });
        }

        // read managed configurations
        for (i = 0; i < executionContextTool.getConfigurationControlTool().countManagedConfigurations(); i++) {
            executionContextTool.addMessage(executionContextTool.getConfigurationControlTool().getManagedConfiguration(i).getName())
        }

        // create new random configuration
        const modules = executionContextTool.getConfigurationControlTool().getModules();
        const module = modules[Math.floor(Math.random() * modules.length)];
        const configuration = executionContextTool.getConfigurationControlTool().createConfiguration(
            executionContextTool.getConfigurationControlTool().countManagedConfigurations()
            , configurationTool.getContainer()
            , module
            , "cfg-" + Math.floor(Math.random() * 1000000)
        );
        executionContextTool.addMessage("created cfg " + configuration.getName());
        if (executionContextTool.getConfigurationControlTool().countManagedConfigurations() > 1) {
            const configurationManaged = executionContextTool.getConfigurationControlTool().getManagedConfiguration(0);
            if (configurationManaged.countExecutionContexts() > 0) {
                const ec = configurationManaged.getExecutionContext(0);
                if (ec) {
                    const moduleMain = configurationManaged.getModule();
                    configurationTool.loggerInfo(`${ec.getName()} ${ec.getType()}`);
                    // add first execution context of created configuration to execution context list of first execution context first managed configuration
                    if ((moduleMain.getMinCountExecutionContexts(0) <= ec.countExecutionContexts() + 1) && (moduleMain.getMaxCountExecutionContexts(0) === -1 || moduleMain.getMaxCountExecutionContexts(0) > ec.countExecutionContexts())) {
                        const iExecutionContextManaged1 = configuration.getExecutionContext(0);
                        ec.insertExecutionContext(ec.countExecutionContexts(), iExecutionContextManaged1);
                        executionContextTool.addMessage("add " + configuration.getName() + "." + iExecutionContextManaged1.getName() + " to " + configurationManaged.getName() + "." + ec.getName());
                    }
                    // add created configuration to managed configuration list of first execution context first managed configuration
                    if ((moduleMain.getMinCountManagedConfigurations(0) <= ec.countManagedConfigurations() + 1) && (moduleMain.getMaxCountManagedConfigurations(0) === -1 || moduleMain.getMaxCountManagedConfigurations(0) > ec.countManagedConfigurations())) {
                        ec.insertManagedConfiguration(ec.countManagedConfigurations(), configuration);
                        executionContextTool.addMessage("add " + configuration.getName() + " to " + configurationManaged.getName() + "." + ec.getName());
                    }
                    // add first execution context of created configuration as source to first execution context first managed configuration
                    if ((moduleMain.getMinCountSources(0) <= ec.countSource() + 1) && (moduleMain.getMaxCountSources(0) === -1 || moduleMain.getMaxCountSources(0) > ec.countSource())) {
                        const iExecutionContextManaged2 = configuration.getExecutionContext(0);
                        const sourceManaged = ec.createSourceExecutionContext(iExecutionContextManaged2, SMCApi.SourceGetType.NEW, 0);
                        sourceManaged.createFilterPosition([0, -1], 0, 0, 0);
                        executionContextTool.addMessage("add " + configuration.getName() + "." + iExecutionContextManaged2.getName() + " to " + configurationManaged.getName() + "." + ec.getName() + " as source");
                    }
                }
            }
        }

    };

    /**
     * @param configurationTool    {SMCApi.ConfigurationTool}
     */
    this.stop = function (configurationTool) {
        this.value = null;
        this.param = null;
        this.counter = null;
        this._ = null;
        this.fileTextValue = null;
    };

}

JsTest.prototype = SMCApi.Module;

