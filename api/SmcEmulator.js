/**
 * created by Nikolay V. Ulyanov (ulianownv@mail.ru)
 * http://www.smcsystem.ru
 */

SmcEmulator = {}

/**
 * Value
 * @param value
 * @param {SMCApi.ValueType} [type]
 * @constructor
 */
SmcEmulator.Value = function (value, type) {
    SMCApi.IValue.call(this);
    this.value = value;
    this.type = type;

    if (this.type == null) {
        if (value instanceof SMCApi.ObjectArray) {
            this.type = SMCApi.ValueType.OBJECT_ARRAY;
        } else if (value instanceof SMCApi.ObjectElement) {
            this.type = SMCApi.ValueType.OBJECT_ELEMENT;
        } else if (value instanceof SMCApi.ObjectField) {
            this.type = SMCApi.ValueType[value.getType()];
            this.value = value.getValue();
        } else if (value instanceof SMCApi.IValue) {
            this.type = SMCApi.ValueType[value.getType()];
            this.value = value.getValue();
        } else if (Object.prototype.toString.call(value) === "[object String]") {
            this.type = SMCApi.ValueType.STRING;
        } else if (Array.isArray(value)) {
            this.type = SMCApi.ValueType.BYTES;
        } else if (value === false || value === true) {
            this.type = SMCApi.ValueType.BOOLEAN;
            // } else if (!Number.isInteger(value) && Number.isFinite(value)) {
            //     this.type = SMCApi.ValueType.DOUBLE;
            // } else if (Number.isInteger(value)) {
            //     this.type = SMCApi.ValueType.LONG;
        } else if (value instanceof Number || typeof (value) === "number") {
            const intValue = Math.round(value);
            this.type = value === intValue ? SMCApi.ValueType.LONG : SMCApi.ValueType.DOUBLE;
        } else {
            this.type = SMCApi.ValueType.DOUBLE;
            this.value = value.doubleValue ? value.doubleValue() : 0
        }
    }

    this.getType = function () {
        return this.type;
    };

    this.getValue = function () {
        return this.value;
    };

};
SmcEmulator.Value.prototype = Object.create(SMCApi.IValue);

/**
 * Message
 * @param value {SMCApi.IValue}
 * @param type {SMCApi.MessageType}
 * @param [date] {Date}
 * @constructor
 */
SmcEmulator.Message = function (value, type, date) {
    SMCApi.IMessage.call(this);

    this.type = type || SMCApi.MessageType.DATA;
    this.value = value;
    this.date = date || new Date();

    this.getDate = function () {
        return this.date;
    };

    this.getMessageType = function () {
        return this.type;
    };

    this.getType = function () {
        return this.value.getType();
    };

    this.getValue = function () {
        return this.value.getValue();
    };

};
SmcEmulator.Message.prototype = Object.create(SMCApi.IMessage);

/**
 * Action
 * @param messages {SMCApi.IMessage[]}
 * @param type {SMCApi.ActionType}
 * @constructor
 */
SmcEmulator.Action = function (messages, type) {
    SMCApi.IAction.call(this);

    this.messages = messages;
    this.type = type || SMCApi.ActionType.EXECUTE;

    this.getMessages = function () {
        return this.messages;
    };

    this.getType = function () {
        return this.type;
    };

};
SmcEmulator.Action.prototype = Object.create(SMCApi.IAction);

/**
 * Command
 * @param actions {SMCApi.IAction[]}
 * @param type {SMCApi.CommandType}
 * @constructor
 */
SmcEmulator.Command = function (actions, type) {
    SMCApi.ICommand.call(this);

    this.actions = actions;
    this.type = type || SMCApi.CommandType.EXECUTE;

    this.getActions = function () {
        return this.actions;
    };

    this.getType = function () {
        return this.type;
    };

};
SmcEmulator.Command.prototype = Object.create(SMCApi.ICommand);

/**
 * ModuleType
 * @param name {string}
 * @param [minCountSources] {number}
 * @param [maxCountSources] {number}
 * @param [minCountExecutionContexts] {number}
 * @param [maxCountExecutionContexts] {number}
 * @param [minCountManagedConfigurations] {number}
 * @param [maxCountManagedConfigurations] {number}
 * @constructor
 */
SmcEmulator.ModuleType = function (name, minCountSources, maxCountSources, minCountExecutionContexts, maxCountExecutionContexts, minCountManagedConfigurations, maxCountManagedConfigurations) {
    this.namev = name;
    this.minCountSources = minCountSources || 0;
    this.maxCountSources = maxCountSources || -1;
    this.minCountExecutionContexts = minCountExecutionContexts || 0;
    this.maxCountExecutionContexts = maxCountExecutionContexts || -1;
    this.minCountManagedConfigurations = minCountManagedConfigurations || 0;
    this.maxCountManagedConfigurations = maxCountManagedConfigurations || -1;
};

/**
 * Module
 * @param name {string}
 * @param {SmcEmulator.ModuleType[]} [types]
 * @constructor
 */
SmcEmulator.Module = function (name, types) {
    SMCApi.CFG.IModule.call(this);
    this.namev = name;
    this.types = types || [new SmcEmulator.ModuleType("default")];

    this.getName = function () {
        return this.namev;
    };

    this.countTypes = function () {
        return this.types.length;
    };

    this.getTypeName = function (typeId) {
        return this.types[typeId].namev;
    };

    this.getMinCountSources = function (typeId) {
        return this.types[typeId].minCountSources;
    };

    this.getMaxCountSources = function (typeId) {
        return this.types[typeId].maxCountSources;
    };

    this.getMinCountExecutionContexts = function (typeId) {
        return this.types[typeId].minCountExecutionContexts;
    };

    this.getMaxCountExecutionContexts = function (typeId) {
        return this.types[typeId].maxCountExecutionContexts;
    };

    this.getMinCountManagedConfigurations = function (typeId) {
        return this.types[typeId].minCountManagedConfigurations;
    };

    this.getMaxCountManagedConfigurations = function (typeId) {
        return this.types[typeId].maxCountManagedConfigurations;
    };
};
SmcEmulator.Module.prototype = Object.create(SMCApi.CFG.IModule);

/**
 * Container
 * @param executionContextTool {SmcEmulator.ExecutionContextTool}
 * @param name {string}
 * @param {SMCApi.CFG.IContainer[]} [containers]
 * @param {SMCApi.CFG.IConfiguration[]} [configurations]
 * @constructor
 */
SmcEmulator.Container = function (executionContextTool, name, containers, configurations) {
    SMCApi.CFG.IContainerManaged.call(this);
    this.executionContextTool = executionContextTool;
    this.namev = name;
    this.enable = true;
    this.containers = containers || [];
    this.configurations = configurations || [];

    /**
     * @param executionContextTool {SmcEmulator.ExecutionContextTool}
     */
    this.setExecutionContextTool = function (executionContextTool) {
        this.executionContextTool = executionContextTool;
    }

    this.getName = function () {
        return this.namev;
    };

    this.isEnable = function () {
        return this.enable;
    };

    this.countConfigurations = function () {
        return this.configurations.length;
    };

    this.getConfiguration = function (id) {
        return this.configurations.length > id ? this.configurations[id] : null;
    };

    /**
     *
     * @return {SMCApi.CFG.IConfigurationManaged[]}
     */
    this.getManagedConfigurations = function () {
        return this.executionContextTool.getManagedConfigurations().filter(c => this.configurations.includes(c));
    }

    this.countManagedConfigurations = function () {
        return this.getManagedConfigurations().length;
    };

    this.getManagedConfiguration = function (id) {
        const managedConfigurations = this.getManagedConfigurations();
        return managedConfigurations.length > id ? managedConfigurations[id] : null;
    };

    this.countContainers = function () {
        return this.containers.length
    };

    this.getContainer = function (id) {
        return this.containers.length > id ? this.containers[id] : null;
    };

    this.createContainer = function (name) {
        const container = new SmcEmulator.Container(this.executionContextTool, name, null, null);
        this.containers.push(container);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_CONTAINER_CREATE, container.getName());
        return container;
    };

    this.removeContainer = function (id) {
        if (id < 0 || id >= this.containers.length)
            throw new SMCApi.ModuleException("id");
        let container = this.containers[id];
        if (container.countConfigurations() > 0)
            throw new SMCApi.ModuleException("container has child configurations");
        if (container.countContainers() > 0)
            throw new SMCApi.ModuleException("container has child containers");
        this.containers.splice(id, 1);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_CONTAINER_REMOVE, container.getName());
    };

};
SmcEmulator.Container.prototype = Object.create(SMCApi.CFG.IContainerManaged);

/**
 * Configuration
 * @param executionContextTool {SmcEmulator.ExecutionContextTool}
 * @param container {SmcEmulator.Container}
 * @param module {SMCApi.CFG.IModule}
 * @param name {string}
 * @param {string} [description]
 * @param {Map.<string, SMCApi.IValue>} [settings]
 * @param {Map.<string, SMCApi.IValue>} [variables]
 * @param {SMCApi.CFG.IExecutionContextManaged[]} [executionContexts]
 * @param {number} [bufferSize]
 * @param {number} [threadBufferSize]
 * @constructor
 */
SmcEmulator.Configuration = function (executionContextTool, container, module, name, description, settings, variables, executionContexts, bufferSize, threadBufferSize) {
    SMCApi.CFG.IConfigurationManaged.call(this);

    this.executionContextTool = executionContextTool;
    /** @type {SmcEmulator.Container} */
    this.container = container;
    /** @type {SMCApi.CFG.IModule} */
    this.module = module;
    /** @type {string} */
    this.namev = name;
    /** @type {string} */
    this.description = description;
    /** @type {Map.<string, SMCApi.IValue>} */
    this.settings = settings || new Map();
    /** @type {Map.<string, SMCApi.IValue>} */
    this.variables = variables || new Map();
    /** @type {SmcEmulator.ExecutionContext[]} */
    this.executionContexts = executionContexts || [];
    this.executionContexts.forEach(ec => ec.setConfiguration(this));
    /** @type {number} */
    this.bufferSize = bufferSize || 0;
    /** @type {number} */
    this.threadBufferSize = typeof threadBufferSize !== undefined ? threadBufferSize : 1;
    /** @type {boolean} */
    this.enable = true;

    /**
     *
     * @param executionContextTool {SmcEmulator.ExecutionContextTool}
     */
    this.setExecutionContextTool = function (executionContextTool) {
        this.executionContextTool = executionContextTool;
        this.executionContexts.forEach(ec => ec.setExecutionContextTool(executionContextTool));
        if (this.container != null)
            this.container.setExecutionContextTool(executionContextTool);
    };

    /**
     *
     * @param container {SmcEmulator.Container}
     */
    this.setContainer = function (container) {
        if (this.container != null)
            this.container.configurations.remove(this);
        this.container = container;
        if (this.container != null)
            this.container.configurations.add(this);
    }

    this.setName = function (name) {
        this.namev = name;
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_CONFIGURATION_UPDATE, this.getName());
    };

    /**
     *
     * @param messageType {SMCApi.MessageType}
     * @param value
     */
    this.addMessage = function (messageType, value) {
        if (this.executionContextTool == null)
            return;
        this.executionContextTool.add(messageType, value);
    };

    this.setSetting = function (key, value) {
        if (value == null)
            throw new SMCApi.ModuleException("value");
        let setting = this.getSetting(key);
        let valueObj = new SmcEmulator.Value(value);
        if (setting && setting.type !== valueObj.type)
            throw new SMCApi.ModuleException("wrong type");
        this.settings.set(key, valueObj);
        this.addMessage(SMCApi.MessageType.CONFIGURATION_CONTROL_CONFIGURATION_SETTING_UPDATE, `${this.getName()} ${key}`);
    };

    this.setVariable = function (key, value) {
        if (value == null)
            throw new SMCApi.ModuleException("value");
        let variable = this.getVariable(key);
        let valueObj = new SmcEmulator.Value(value);
        if (variable && variable.type !== valueObj.type)
            throw new SMCApi.ModuleException("wrong type");
        this.variables.set(key, valueObj);
        this.addMessage(SMCApi.MessageType.CONFIGURATION_CONTROL_CONFIGURATION_VARIABLE_UPDATE, `${this.getName()} ${key}`);
    };

    this.removeVariable = function (key) {
        this.variables.delete(key);
        this.addMessage(SMCApi.MessageType.CONFIGURATION_CONTROL_CONFIGURATION_VARIABLE_REMOVE, `${this.getName()} ${key}`);
    };

    this.setBufferSize = function (bufferSize) {
        this.bufferSize = bufferSize;
        this.addMessage(SMCApi.MessageType.CONFIGURATION_CONTROL_CONFIGURATION_UPDATE, this.getName());
    };

    this.setThreadBufferSize = function (threadBufferSize) {
        this.threadBufferSize = threadBufferSize;
        this.addMessage(SMCApi.MessageType.CONFIGURATION_CONTROL_CONFIGURATION_UPDATE, this.getName());
    };

    this.setEnable = function (enable) {
        this.enable = enable;
        this.addMessage(SMCApi.MessageType.CONFIGURATION_CONTROL_CONFIGURATION_UPDATE, this.getName());
    };

    this.countExecutionContexts = function () {
        return this.executionContexts.length;
    };

    this.getExecutionContexts = function () {
        return this.executionContexts;
    }

    this.getExecutionContext = function (id) {
        if (id < 0 || this.countExecutionContexts() <= id)
            throw new SMCApi.ModuleException("id");
        return this.executionContexts[id];
    };

    this.createExecutionContext = function (name, type, maxWorkInterval) {
        maxWorkInterval = maxWorkInterval || -1;
        const executionContext = new SmcEmulator.ExecutionContext(this.executionContextTool, this, name, null, null, null, maxWorkInterval, type);
        this.executionContexts.push(executionContext);
        this.addMessage(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_CREATE, `${this.getName()}.${executionContext.getName()}`);
        return executionContext;
    };

    this.updateExecutionContext = function (id, name, type, maxWorkInterval) {
        maxWorkInterval = maxWorkInterval || -1;
        const executionContext = this.executionContexts[id];
        executionContext.setName(name);
        executionContext.setType(type);
        executionContext.setMaxWorkInterval(maxWorkInterval);
        this.addMessage(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE, `${this.getName()}.${executionContext.getName()}`);
        return executionContext;
    };

    this.removeExecutionContext = function (id) {
        if (id < 0 || this.countExecutionContexts() <= id)
            throw new SMCApi.ModuleException("id");
        const executionContext = this.executionContexts[id];
        this.executionContexts.splice(id, 1);
        this.addMessage(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_REMOVE, `${this.getName()}.${executionContext.getName()}`);
    };

    this.getContainer = function () {
        return this.container;
    };

    this.getModule = function () {
        return this.module;
    };

    this.getName = function () {
        return this.namev;
    };

    this.getDescription = function () {
        return this.description;
    };

    this.getAllSettings = function () {
        return this.settings;
    };

    this.getSetting = function (key) {
        if (key == null || key.length === 0)
            throw new SMCApi.ModuleException("key");
        return this.settings.get(key);
    };

    this.getAllVariables = function () {
        return this.variables;
    };

    this.getVariable = function (key) {
        if (key == null || key.length === 0)
            throw new SMCApi.ModuleException("key");
        return this.variables.get(key);
    };

    this.getBufferSize = function () {
        return this.bufferSize
    };

    this.getThreadBufferSize = function () {
        return this.threadBufferSize;
    };

    this.isEnable = function () {
        return this.enable;
    };

    this.isActive = function () {
        return false;
    };

};
SmcEmulator.Configuration.prototype = Object.create(SMCApi.CFG.IConfigurationManaged);

/**
 * SourceList
 * @param executionContextTool {SmcEmulator.ExecutionContextTool}
 * @param configurationName {string}
 * @param executionContextName {string}
 * @param {SMCApi.CFG.ISourceManaged[]} [sources]
 * @constructor
 */
SmcEmulator.SourceList = function (executionContextTool, configurationName, executionContextName, sources) {
    SMCApi.CFG.ISourceListManaged.call(this);

    this.executionContextTool = executionContextTool;
    this.configurationName = configurationName;
    this.executionContextName = executionContextName;
    /** @type {SMCApi.CFG.ISourceManaged[]} */
    this.sources = sources || [];

    this.setConfigurationName = function (configurationName) {
        this.configurationName = configurationName;
    }

    this.countSource = function () {
        return sources.length;
    };

    this.getSource = function (id) {
        return sources[id];
    };

    this.createSourceConfiguration = function (configuration, getType, countLast, eventDriven) {
        getType = getType || SMCApi.SourceGetType.NEW;
        countLast = countLast || 1;
        eventDriven = eventDriven || false;
        const source = new SmcEmulator.Source(this.executionContextTool, this.configurationName, this.executionContextName, null, configuration, null, eventDriven, null, SMCApi.SourceType.MODULE_CONFIGURATION, this.countSource());
        this.sources.push(source);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_SOURCE_CONTEXT_CREATE, `${this.configurationName}.${this.executionContextName}.${source.getOrder()}`);
        return source;
    };

    this.createSourceExecutionContext = function (executionContext, getType, countLast, eventDriven) {
        getType = getType || SMCApi.SourceGetType.NEW;
        countLast = countLast || 1;
        eventDriven = eventDriven || false;
        const source = new SmcEmulator.Source(this.executionContextTool, this.configurationName, this.executionContextName, executionContext, null, null, eventDriven, null, SMCApi.SourceType.EXECUTION_CONTEXT, this.countSource());
        this.sources.push(source);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_SOURCE_CONTEXT_CREATE, `${this.configurationName}.${this.executionContextName}.${source.getOrder()}`);
        return source;
    };

    this.createSourceValue = function (value) {
        const source = new SmcEmulator.Source(this.executionContextTool, this.configurationName, this.executionContextName, null, null, new SmcEmulator.Value(value), null, null, SMCApi.SourceType.STATIC_VALUE, this.countSource());
        this.sources.push(source);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_SOURCE_CONTEXT_CREATE, `${this.configurationName}.${this.executionContextName}.${source.getOrder()}`);
        return source;
    };

    this.createSource = function () {
        const source = new SmcEmulator.Source(this.executionContextTool, this.configurationName, this.executionContextName, null, null, null, null, null, SMCApi.SourceType.MULTIPART, this.countSource());
        this.sources.push(source);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_SOURCE_CONTEXT_CREATE, `${this.configurationName}.${this.executionContextName}.${source.getOrder()}`);
        return source;
    };

    this.createSourceObjectArray = function (value, fields) {
        const source = new SmcEmulator.Source(this.executionContextTool, this.configurationName, this.executionContextName, null, null, new SmcEmulator.Value(value), null, null, SMCApi.SourceType.OBJECT_ARRAY, this.countSource());
        this.sources.push(source);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_SOURCE_CONTEXT_CREATE, `${this.configurationName}.${this.executionContextName}.${source.getOrder()}`);
        return source;
    };

    this.updateSourceConfiguration = function (id, configuration, getType, countLast, eventDriven) {
        getType = getType || SMCApi.SourceGetType.NEW;
        countLast = countLast || 1;
        eventDriven = eventDriven || false;
        const source = new SmcEmulator.Source(this.executionContextTool, this.configurationName, this.executionContextName, null, configuration, null, eventDriven, null, SMCApi.SourceType.MODULE_CONFIGURATION, this.countSource());
        this.sources[id] = source;
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_SOURCE_CONTEXT_UPDATE, `${this.configurationName}.${this.executionContextName}.${source.getOrder()}`);
        return source;
    };

    this.updateSourceExecutionContext = function (id, executionContext, getType, countLast, eventDriven) {
        getType = getType || SMCApi.SourceGetType.NEW;
        countLast = countLast || 1;
        eventDriven = eventDriven || false;
        const source = new SmcEmulator.Source(this.executionContextTool, this.configurationName, this.executionContextName, executionContext, null, null, eventDriven, null, SMCApi.SourceType.EXECUTION_CONTEXT, this.countSource());
        this.sources[id] = source;
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_SOURCE_CONTEXT_UPDATE, `${this.configurationName}.${this.executionContextName}.${source.getOrder()}`);
        return source;
    };

    this.updateSourceValue = function (id, value) {
        const source = new SmcEmulator.Source(this.executionContextTool, this.configurationName, this.executionContextName, null, null, new SmcEmulator.Value(value), null, null, SMCApi.SourceType.STATIC_VALUE, this.countSource());
        this.sources[id] = source;
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_SOURCE_CONTEXT_UPDATE, `${this.configurationName}.${this.executionContextName}.${source.getOrder()}`);
        return source;
    };

    this.updateSourceObjectArray = function (id, value, fields) {
        const source = new SmcEmulator.Source(this.executionContextTool, this.configurationName, this.executionContextName, null, null, new SmcEmulator.Value(value), null, null, SMCApi.SourceType.OBJECT_ARRAY, this.countSource());
        this.sources[id] = source;
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_SOURCE_CONTEXT_UPDATE, `${this.configurationName}.${this.executionContextName}.${source.getOrder()}`);
        return source;
    };

    this.removeSource = function (id) {
        if (id <= 0 || this.countSource() <= id)
            throw new SMCApi.ModuleException("id");
        // noinspection JSValidateTypes
        /** @type {SmcEmulator.Source} */
        const source = this.sources[id];
        this.sources.splice(id, 1);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_SOURCE_CONTEXT_REMOVE, `${this.configurationName}.${this.executionContextName}.${source.getOrder()}`);
    };

    /**
     *
     * @param id {number}
     * @return {SMCApi.CFG.ISourceListManaged}
     */
    this.getSourceListManaged = function (id) {
        // noinspection JSValidateTypes
        /** @type {SmcEmulator.Source} */
        const source = this.sources[id];
        if (source == null || source.getType() !== SMCApi.SourceType.MULTIPART)
            return null;
        return new SmcEmulator.SourceList(this.executionContextTool, this.configurationName, this.executionContextName, [source]);
    };

    /**
     *
     * @param id
     * @return {SMCApi.CFG.ISourceManaged}
     */
    this.getSourceManaged = function (id) {
        return this.sources.length > id ? this.sources[id] : null;
    };

};
SmcEmulator.SourceList.prototype = Object.create(SMCApi.CFG.ISourceListManaged);

/**
 * ExecutionContext
 * @param executionContextTool {SmcEmulator.ExecutionContextTool}
 * @param [configuration] {SmcEmulator.Configuration}
 * @param name {string}
 * @param {SMCApi.CFG.IExecutionContext[]} [executionContexts]
 * @param {SMCApi.CFG.IConfiguration[]} [managedConfigurations]
 * @param {SMCApi.CFG.ISourceManaged[]} [sources]
 * @param {number} [maxWorkInterval]
 * @param {string} [type]
 * @constructor
 */
SmcEmulator.ExecutionContext = function (executionContextTool, configuration, name, executionContexts, managedConfigurations, sources, maxWorkInterval, type) {
    SMCApi.CFG.IExecutionContextManaged.call(this);
    SmcEmulator.SourceList.call(this, executionContextTool, configuration != null ? configuration.getName() : "default", name, sources || []);

    this.executionContextTool = executionContextTool;
    this.configuration = configuration;
    this.namev = name;
    this.executionContexts = executionContexts || [];
    this.managedConfigurations = managedConfigurations || [];
    // this.sourceList = new SmcEmulator.SourceList(executionContextTool, configuration.getName(), name, sources || []);
    this.maxWorkInterval = maxWorkInterval || -1;
    this.type = type || "default";
    this.enable = true;

    this.setExecutionContextTool = function (executionContextTool) {
        this.executionContextTool = executionContextTool;
    }

    this.setConfiguration = function (configuration) {
        this.configuration = configuration;
        this.setConfigurationName(configuration.getName());
    }

    this.setName = function (name) {
        this.namev = name;
    };

    this.setMaxWorkInterval = function (maxWorkInterval) {
        this.maxWorkInterval = maxWorkInterval;
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE, `${this.configuration.getName()}.${this.getName()}`);
    };

    this.setEnable = function (enable) {
        this.enable = enable;
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE, `${this.configuration.getName()}.${this.getName()}`);
    };

    this.countExecutionContexts = function () {
        return this.executionContexts.length;
    };

    this.getExecutionContext = function (id) {
        if (id <= 0 || this.countExecutionContexts() <= id)
            throw new SMCApi.ModuleException("id");
        return this.executionContexts[id];
    };

    this.insertExecutionContext = function (id, executionContext) {
        if (id <= 0 || this.countExecutionContexts() <= id)
            throw new SMCApi.ModuleException("id");
        this.executionContexts.splice(id, 0, executionContext);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE, `${this.configuration.getName()}.${this.getName()}`);
    };

    this.updateExecutionContext = function (id, executionContext) {
        if (id <= 0 || this.countExecutionContexts() <= id)
            throw new SMCApi.ModuleException("id");
        this.executionContexts[id] = executionContext;
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE, `${this.configuration.getName()}.${this.getName()}`);
    };

    this.removeExecutionContext = function (id) {
        if (id <= 0 || this.countExecutionContexts() <= id)
            throw new SMCApi.ModuleException("id");
        this.executionContexts.splice(id, 1);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE, `${this.configuration.getName()}.${this.getName()}`);
    };

    this.countManagedConfigurations = function () {
        return this.managedConfigurations.length;
    };

    this.getManagedConfiguration = function (id) {
        if (id <= 0 || this.countManagedConfigurations() <= id)
            throw new SMCApi.ModuleException("id");
        return this.managedConfigurations[id];
    };

    this.insertManagedConfiguration = function (id, configuration) {
        if (id <= 0 || this.countManagedConfigurations() <= id)
            throw new SMCApi.ModuleException("id");
        this.managedConfigurations.splice(id, 0, configuration);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE, `${this.configuration.getName()}.${this.getName()}`);
    };

    this.updateManagedConfiguration = function (id, configuration) {
        if (id <= 0 || this.countManagedConfigurations() <= id)
            throw new SMCApi.ModuleException("id");
        this.managedConfigurations[id] = configuration;
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE, `${this.configuration.getName()}.${this.getName()}`);
    };

    this.removeManagedConfiguration = function (id) {
        if (id <= 0 || this.countManagedConfigurations() <= id)
            throw new SMCApi.ModuleException("id");
        this.managedConfigurations.splice(id, 1);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE, `${this.configuration.getName()}.${this.getName()}`);
    };

    this.setType = function (type) {
        this.type = type;
    };

    this.getConfiguration = function () {
        return this.configuration;
    };

    this.getName = function () {
        return this.namev;
    };

    this.getMaxWorkInterval = function () {
        return this.maxWorkInterval;
    };

    this.isEnable = function () {
        return this.enable
    };

    this.isActive = function () {
        return false;
    };

    this.getType = function () {
        return this.type;
    };

};
SmcEmulator.ExecutionContext.prototype = Object.create(SMCApi.CFG.IExecutionContextManaged);

/**
 *
 * @param type {SMCApi.SourceFilterType}
 * @param {object[]} [params]
 * @constructor
 */
SmcEmulator.SourceFilter = function (type, params) {
    SMCApi.CFG.ISourceFilter.call(this);

    this.type = type;
    this.params = params || [];

    this.getType = function () {
        return this.type;
    };

    this.getParams = function () {
        return this.params;
    }

    this.countParams = function () {
        switch (this.getType()) {
            case SMCApi.SourceFilterType.POSITION:
                return 4;
            case SMCApi.SourceFilterType.NUMBER:
                return 2;
            case SMCApi.SourceFilterType.STRING_EQUAL:
                return 2;
            case SMCApi.SourceFilterType.STRING_CONTAIN:
                return 2;
            case SMCApi.SourceFilterType.OBJECT_PATHS:
                return 1;
            default:
                throw new Error();
        }
    };

    this.getParam = function (id) {
        return this.params[id];
    };
};
SmcEmulator.SourceFilter.prototype = Object.create(SMCApi.CFG.ISourceFilter);

/**
 *
 * @param executionContextTool {SmcEmulator.ExecutionContextTool}
 * @param configurationName {string}
 * @param executionContextName {string}
 * @param [executionContextSource] {SMCApi.CFG.IExecutionContext}
 * @param [configurationSource] {SMCApi.CFG.IConfiguration}
 * @param [valueSource] {SMCApi.IValue}
 * @param [eventDriven] {Boolean}
 * @param [sources] {SMCApi.CFG.ISourceManaged[]}
 * @param type {SMCApi.SourceType}
 * @param order {number}
 * @constructor
 */
SmcEmulator.Source = function (executionContextTool, configurationName, executionContextName, executionContextSource, configurationSource, valueSource, eventDriven, sources, type, order) {
    SMCApi.CFG.ISourceManaged.call(this);

    this.executionContextTool = executionContextTool;
    this.configurationName = configurationName;
    this.executionContextName = executionContextName;
    this.executionContextSource = executionContextSource;
    this.configurationSource = configurationSource;
    this.eventDriven = eventDriven || false;
    this.valueSource = valueSource;
    this.type = type;
    this.order = order;
    this.sourceList = SMCApi.SourceType.MULTIPART === type ? new SmcEmulator.SourceList(this.executionContextTool, this.configurationName, this.executionContextName, sources) : null;
    this.filters = [];

    this.getType = function () {
        return this.type;
    };

    this.countParams = function () {
        switch (this.type) {
            case SMCApi.SourceType.MODULE_CONFIGURATION:
                return 4;
            case SMCApi.SourceType.EXECUTION_CONTEXT:
                return 4;
            case SMCApi.SourceType.STATIC_VALUE:
                return 1;
            case SMCApi.SourceType.MULTIPART:
                return 0;
            case SMCApi.SourceType.CALLER:
                return 0;
            case SMCApi.SourceType.CALLER_RELATIVE_NAME:
                return 1;
            case SMCApi.SourceType.OBJECT_ARRAY:
                return 1;
            default:
                throw new Error();
        }
    };

    this.getParam = function (id) {
        return null;
    };

    this.countFilters = function () {
        return this.filters.length;
    };

    this.getFilter = function (id) {
        return this.filters[id];
    };

    this.createFilterPosition = function (range, period, countPeriods, startOffset, forObject) {
        return null;
    };

    this.createFilterNumber = function (min, max, fieldName) {
        return null;
    };

    this.createFilterStrEq = function (needEquals, value, fieldName) {
        return null;
    };

    this.createFilterStrContain = function (needContain, value, fieldName) {
        return null;
    };

    this.createFilterObjectPaths = function (paths) {
        return null;
    };

    this.updateFilterPosition = function (id, range, period, countPeriods, startOffset, forObject) {
        return null;
    };

    this.updateFilterNumber = function (id, min, max, fieldName) {
        return null;
    };

    this.updateFilterStrEq = function (id, needEquals, value, fieldName) {
        return null;
    };

    this.updateFilterStrContain = function (id, needContain, value, fieldName) {
        return null;
    };

    this.updateFilterObjectPaths = function (id, paths) {
        return null;
    };

    this.removeFilter = function (id) {
        this.filters.splice(id, 1);
    };

    this.getOrder = function () {
        return this.order;
    }

    this.setOrder = function (order) {
        this.order = order;
    }

};
SmcEmulator.Source.prototype = Object.create(SMCApi.CFG.ISourceManaged);

/**
 * FileTool
 * @param name {string}
 * @param exists {boolean}
 * @param {Array.<number>} [data]
 * @param {SmcEmulator.FileTool[]} [children]
 * @constructor
 */
SmcEmulator.FileTool = function (name, exists, data, children) {
    SMCApi.FileTool.call(this);

    this.namev = name;
    this.exists = exists;
    this.data = data;
    this.children = children;

    this.getName = function () {
        return this.namev;
    };

    this.isExists = function () {
        return this.exists;
    };

    this.isDirectory = function () {
        return this.children != null;
    };

    this.getChildrens = function () {
        return this.children;
    };

    this.getBytes = function () {
        return this.data;
    };

    this.length = function () {
        return this.data.length;
    };

};
SmcEmulator.FileTool.prototype = Object.create(SMCApi.FileTool);

/**
 * ConfigurationTool
 * @param [configuration] {SmcEmulator.Configuration}
 * @param [homeFolder] {SmcEmulator.FileTool}
 * @param [workDirectory] {string}
 * @param {string} [name]
 * @param {string} [description]
 * @param {Map.<string, SMCApi.IValue>} [settings]
 * @constructor
 */
SmcEmulator.ConfigurationTool = function (configuration, homeFolder, workDirectory, name, description, settings) {
    SMCApi.ConfigurationTool.call(this);
    SmcEmulator.Configuration.call(this,
        configuration != null ? configuration.executionContextTool : null,
        configuration != null ? configuration.container : null,
        configuration != null ? configuration.module : null,
        name || (configuration != null ? configuration.namev : "default"),
        description || (configuration != null ? configuration.description : null),
        settings || (configuration != null ? configuration.settings : null),
        configuration != null ? configuration.variables : null,
        configuration != null ? configuration.executionContexts : null,
        configuration != null ? configuration.bufferSize : null,
        configuration != null ? configuration.threadBufferSize : null,
    );

    this.homeFolder = homeFolder || new SmcEmulator.FileTool("tmpdir", false, null, []);
    this.workDirectory = workDirectory || "tmpdir";
    /** @type {Map.<string, boolean>} */
    this.variablesChangeFlag = new Map();
    const that = this;
    this.getAllVariables().forEach(v => that.variablesChangeFlag.set(v.namev, true));

    this.init = function (executionContextTool) {
        this.setExecutionContextTool(executionContextTool);
    }

    this.getVariablesChangeFlag = function () {
        return this.variablesChangeFlag;
    }

    this.setVariable = function (key, value) {
        this.__proto__.setVariable(key, value);
        this.variablesChangeFlag.set(key, false);
    };

    this.isVariableChanged = function (key) {
        return this.variablesChangeFlag.get(key);
    };
    this.removeVariable = function (key) {
        this.__proto__.removeVariable(key);
        this.variablesChangeFlag.remove(key);
    };
    this.getHomeFolder = function () {
        return this.homeFolder;
    };
    this.getWorkDirectory = function () {
        if (this.workDirectory == null)
            throw new SMCApi.ModuleException("storage not allowed");
        return this.workDirectory;
    };

    this.loggerTrace = function (text) {
        console.log(`${new Date()}: Log Cfg 0: ${text}`)
    };

    this.loggerDebug = function (text) {
        console.log(`${new Date()}: Log Cfg 0: ${text}`)
    };

    this.loggerInfo = function (text) {
        console.log(`${new Date()}: Log Cfg 0: ${text}`)
    };

    this.loggerWarn = function (text) {
        console.log(`${new Date()}: Log Cfg 0: ${text}`)
    };

    this.loggerError = function (text) {
        console.log(`${new Date()}: Log Cfg 0: ${text}`)
    };

    this.getInfo = function (key) {
        return null;
    };

};
SmcEmulator.ConfigurationTool.prototype = Object.create(SMCApi.ConfigurationTool);
/**
 * @callback SmcEmulator.ExecutionContextToolFunc
 * @param {object[]}
 * @return {SMCApi.IAction}
 */

/**
 * ExecutionContextTool
 * @param {(SMCApi.IAction[])[]} [input]
 * @param {SmcEmulator.Configuration[]} [managedConfigurations]
 * @param {SMCApi.IAction[]} [executionContextsOutput]
 * @param {SmcEmulator.ExecutionContextToolFunc[]} [executionContexts]
 * @param {string} [name]
 * @param {string} [type]
 * @constructor
 */
SmcEmulator.ExecutionContextTool = function (input, managedConfigurations, executionContextsOutput, executionContexts, name, type) {
    SMCApi.ExecutionContextTool.call(this);
    SmcEmulator.ExecutionContext.call(this, null, name, null, null, null);

    /** @type {(SMCApi.IAction[])[]} */
    this.input = input || [];
    /** @type {SMCApi.IMessage[]} */
    this.output = [];
    /** @type {SmcEmulator.Configuration[]} */
    this.managedConfigurations = managedConfigurations || [];
    this.managedConfigurations.forEach(c => c.setExecutionContextTool(this));
    /** @type {SMCApi.IAction[]} */
    this.executionContextsOutput = executionContextsOutput || [];
    this.executionContexts = executionContexts;
    if (this.executionContexts != null)
        this.executionContexts.forEach(ec => this.executionContextsOutput.push(null));
    this.namev = name;
    this.type = type;

    // currentTread = Thread.currentThread();
    /** @type {SMCApi.CFG.IModule[]} */
    this.modules = [new SmcEmulator.Module("Module")];
    /** @type {Map.<string, SMCApi.CFG.IModule>} */
    const moduleMap = new Map();
    this.managedConfigurations.forEach(c => moduleMap.put(c.getModule().getName(), c.getModule()));
    Array.from(moduleMap.values()).forEach(m => this.modules.push(m));

    this.configurationControlTool = new SmcEmulator.ConfigurationControlTool(this, this.modules, this.managedConfigurations);
    this.flowControlTool = new SmcEmulator.FlowControlTool(this, this.executionContextsOutput, this.executionContexts);
    // const that = this;

    /**
     *
     * @param configurationTool {SmcEmulator.ConfigurationTool}
     */
    this.init = function (configurationTool) {
        this.configuration = configurationTool;
        this.setConfiguration(this.configuration);
    };

    this.getOutput = function () {
        return this.output;
    };

    this.add = function (messageType, value) {
        this.output.push(new SmcEmulator.Message(new SmcEmulator.Value(value), messageType));
    };

    this.addMessage = function (value) {
        if (value == null)
            throw new SMCApi.ModuleException("value");
        if (Array.isArray(value)) {
            const date = new Date();
            value.forEach(v => this.output.push(new SmcEmulator.Message(
                new SmcEmulator.Value(v),
                SMCApi.MessageType.DATA,
                date
            )));
        } else {
            this.output.push(new SmcEmulator.Message(
                new SmcEmulator.Value(value),
                SMCApi.MessageType.DATA
            ));
        }
    };

    this.addError = function (value) {
        if (value == null)
            throw new SMCApi.ModuleException("value");
        if (Array.isArray(value)) {
            const date = new Date();
            value.forEach(v => this.output.push(new SmcEmulator.Message(
                new SmcEmulator.Value(v),
                SMCApi.MessageType.ERROR,
                date
            )));
        } else {
            this.output.push(new SmcEmulator.Message(
                new SmcEmulator.Value(value),
                SMCApi.MessageType.ERROR
            ));
        }
    };

    this.addLog = function (value) {
        if (value == null)
            throw new SMCApi.ModuleException("value");
        this.output.push(new SmcEmulator.Message(
            new SmcEmulator.Value(value),
            SMCApi.MessageType.LOG
        ));
    };

    this.countSource = function () {
        return this.input.length
    }

    this.getSource = function (id) {
        let sources = [];
        if (this.input !== null) {
            for (let i = 0; i < input.size(); i++)
                sources.add(new SmcEmulator.Source(this, this.configuration.getName(), this.getName(), new SmcEmulator.ExecutionContext(this, null, String.valueOf(i)), null, null, false, null, SMCApi.SourceType.EXECUTION_CONTEXT, i));
        }
        return new SmcEmulator.SourceList(this, configuration.getName(), getName(), sources).getSource(id);
    }

    /**
     *
     * @param sourceId {number}
     * @return {SMCApi.IAction[]}
     */
    this.getMessagesAll = function (sourceId) {
        if (sourceId < 0 || this.countSource() <= sourceId)
            throw new SMCApi.ModuleException("sourceId");
        return this.input[sourceId] || [];
    }

    this.countCommands = function (sourceId) {
        return this.getMessagesAll(sourceId).length;
    };

    this.countCommandsFromExecutionContext = function (executionContext) {
        return 0;
    };

    this.getMessages = function (sourceId, fromIndex, toIndex) {
        let list = this.filter(this.getMessagesAll(sourceId), SMCApi.ActionType.EXECUTE, SMCApi.MessageType.DATA);
        if (fromIndex != null && toIndex != null)
            list = list.slice(fromIndex, toIndex);
        return list;
    };

    /**
     *
     * @param actions {SMCApi.IAction[]}
     * @param {SMCApi.ActionType} [actionType]
     * @param {SMCApi.MessageType} [messageType]
     * @return {*}
     */
    this.filter = function (actions, actionType, messageType) {
        return actions
            .filter(a => actionType == null || actionType === a.getType())
            .map(a => {
                const collect = a.getMessages().filter(m => messageType == null || messageType === m.getMessageType());
                return new SmcEmulator.Action(collect, a.getType());
            });
    }

    this.getCommands = function (sourceId, fromIndex, toIndex) {
        let list = [new SmcEmulator.Command(this.getMessagesAll(sourceId), SMCApi.CommandType.EXECUTE)];
        if (fromIndex != null && toIndex != null)
            list = list.slice(fromIndex, toIndex);
        return list;
    };

    this.getCommandsFromExecutionContext = function (executionContext, fromIndex, toIndex) {
        return [];
    };

    this.isError = function (action) {
        let result = true;
        do {
            if (action == null)
                break;
            if (action.getMessages() == null || action.getMessages().length === 0)
                break;
            if (action.getMessages().some(m => SMCApi.MessageType.ACTION_ERROR === m.getMessageType() || SMCApi.MessageType.ERROR === m.getMessageType()))
                break;
            result = false;
        } while (false);
        return result;
    };

    this.getConfigurationControlTool = function () {
        return this.configurationControlTool;
    };

    this.getFlowControlTool = function () {
        return this.flowControlTool;
    };

    this.isNeedStop = function () {
        return false;
    };

};
SmcEmulator.ExecutionContextTool.prototype = Object.create(SMCApi.ExecutionContextTool);

/**
 *
 * @param executionContextTool {SmcEmulator.ExecutionContextTool}
 * @param modules {SMCApi.CFG.IModule[]}
 * @param managedConfigurations {SmcEmulator.Configuration[]}
 * @constructor
 */
SmcEmulator.ConfigurationControlTool = function (executionContextTool, modules, managedConfigurations) {
    SMCApi.ConfigurationControlTool.call(this);

    this.executionContextTool = executionContextTool;
    this.modules = modules;
    this.managedConfigurations = managedConfigurations;

    this.getModules = function () {
        return this.modules;
    };

    this.countManagedConfigurations = function () {
        return this.managedConfigurations.length;
    };

    this.getManagedConfiguration = function (id) {
        return this.managedConfigurations[id];
    };

    this.createConfiguration = function (id, container, module, name) {
        const configuration = new SmcEmulator.Configuration(this.executionContextTool, container, module, name, "");
        configuration.setContainer(container);
        this.managedConfigurations.splice(id, 0, configuration);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_CONFIGURATION_CREATE, configuration.getName());
        return configuration;
    };

    this.removeManagedConfiguration = function (id) {
        const configuration = this.managedConfigurations.splice(id, 1);
        configuration.setContainer(null);
        this.executionContextTool.add(SMCApi.MessageType.CONFIGURATION_CONTROL_CONFIGURATION_REMOVE, configuration.getName());
    };

};
SmcEmulator.ConfigurationControlTool.prototype = Object.create(SMCApi.ConfigurationControlTool);

/**
 *
 * @param executionContextTool {SmcEmulator.ExecutionContextTool}
 * @param {SMCApi.IAction[]} executionContextsOutput
 * @param {SmcEmulator.ExecutionContextToolFunc[]} [executionContexts]
 * @constructor
 */
SmcEmulator.FlowControlTool = function (executionContextTool, executionContextsOutput, executionContexts) {
    SMCApi.FlowControlTool.call(this);

    this.executionContextTool = executionContextTool;
    this.executionContextsOutput = executionContextsOutput;
    this.executionContexts = executionContexts;
    this.executeInParalel = [];

    this.countManagedExecutionContexts = function () {
        return executionContextsOutput.length;
    };
    this.executeNow = function (type, managedId, values) {
        if (type == null)
            throw new SMCApi.ModuleException("type");
        if (managedId < 0 || this.countManagedExecutionContexts() <= managedId)
            throw new SMCApi.ModuleException("managedId");
        // if (!Thread.currentThread().equals(currentTread))
        //     throw new SMCApi.ModuleException("this operation available only in main thread");
        /** @type {SMCApi.MessageType} */
        let messageType = null;
        switch (type) {
            case SMCApi.CommandType.START:
                messageType = SMCApi.MessageType.FLOW_CONTROL_EXECUTE_NOW_START;
                break;
            case SMCApi.CommandType.EXECUTE:
                messageType = SMCApi.MessageType.FLOW_CONTROL_EXECUTE_NOW_EXECUTE;
                break;
            case SMCApi.CommandType.UPDATE:
                messageType = SMCApi.MessageType.FLOW_CONTROL_EXECUTE_NOW_UPDATE;
                break;
            case SMCApi.CommandType.STOP:
                messageType = SMCApi.MessageType.FLOW_CONTROL_EXECUTE_NOW_STOP;
                break;
        }
        this.executionContextTool.add(messageType, managedId);
        if (this.executionContexts != null) {
            values = Array.isArray(values) ? values.map(v => new SmcEmulator.Value(v).getValue()) : null;
            this.executionContextsOutput[managedId] = this.executionContexts[managedId](values);
        }
    };

    this.executeParallel = function (type, managedIds, values, waitingTacts, maxWorkInterval) {
        waitingTacts = waitingTacts || 0;
        maxWorkInterval = maxWorkInterval || -1;

        if (type == null)
            throw new SMCApi.ModuleException("type");
        if (managedIds == null || managedIds.length === 0)
            throw new SMCApi.ModuleException("managedIds");
        if (waitingTacts == null)
            waitingTacts = 0;
        if (waitingTacts < 0)
            throw new SMCApi.ModuleException("waitingTacts");
        managedIds.forEach(managedId => {
            if (managedId < 0 || this.countManagedExecutionContexts() <= managedId)
                throw new SMCApi.ModuleException("managedId");
        });
        let messageType = null;
        switch (type) {
            case SMCApi.CommandType.START:
                messageType = SMCApi.MessageType.FLOW_CONTROL_EXECUTE_PARALLEL_START;
                break;
            case SMCApi.CommandType.EXECUTE:
                messageType = SMCApi.MessageType.FLOW_CONTROL_EXECUTE_PARALLEL_EXECUTE;
                break;
            case SMCApi.CommandType.UPDATE:
                messageType = SMCApi.MessageType.FLOW_CONTROL_EXECUTE_PARALLEL_UPDATE;
                break;
            case SMCApi.CommandType.STOP:
                messageType = SMCApi.MessageType.FLOW_CONTROL_EXECUTE_PARALLEL_STOP;
                break;
        }
        managedIds.forEach(managedId => this.executionContextTool.add(messageType, managedId));
        this.executionContextTool.add(SMCApi.MessageType.FLOW_CONTROL_EXECUTE_PARALLEL_WAITING_TACTS, waitingTacts);
        this.executeInParalel.push(managedIds);
        if (this.executionContexts != null) {
            values = values != null ? values.map(v => new SmcEmulator.Value(v).getValue()) : null;
            managedIds.forEach(managedId => this.executionContextsOutput[managedId] = this.executionContexts[managedId](values));
        }
        return this.executeInParalel.size() - 1;
    };

    this.isThreadActive = function (threadId) {
        return false;
    };

    this.getMessagesFromExecuted = function (threadId, managedId) {
        threadId = threadId || 0;
        managedId = managedId || 0;
        if (managedId < 0 || this.countManagedExecutionContexts() <= managedId)
            throw new SMCApi.ModuleException("managedId");
        return this.executionContextTool.filter([executionContextsOutput[managedId]], SMCApi.ActionType.EXECUTE, SMCApi.MessageType.DATA);
    };

    this.getCommandsFromExecuted = function (threadId, managedId) {
        threadId = threadId || 0;
        managedId = managedId || 0;
        if (managedId < 0 || this.countManagedExecutionContexts() <= managedId)
            throw new SMCApi.ModuleException("managedId");
        return [new SmcEmulator.Command(
            this.executionContextTool.filter([executionContextsOutput[managedId]], null, null),
            SMCApi.CommandType.EXECUTE)];
    };

    this.releaseThread = function (threadId) {
        return this.executeInParalel.splice(threadId, 1);
    };

    this.releaseThreadCache = function (threadId) {
        return this.executeInParalel.splice(threadId, 1);
    };

    this.getManagedExecutionContext = function (id) {
        return null;
    };

};
SmcEmulator.FlowControlTool.prototype = Object.create(SMCApi.FlowControlTool);

/**
 *
 * @param configurationTool {SmcEmulator.ConfigurationTool}
 * @param {SMCApi.Module} [module]
 * @constructor
 */
SmcEmulator.Process = function (configurationTool, module) {
    this.configurationTool = configurationTool;
    this.module = module;

    this.getConfigurationTool = function () {
        return this.configurationTool;
    };

    /**
     *
     * @param executionContextTool {SmcEmulator.ExecutionContextTool}
     * @return {SMCApi.IMessage[]}
     */
    this.fullLifeCycle = function (executionContextTool) {
        /** @type {SMCApi.IMessage[]} */
        const result = [];
        this.start().forEach(o => result.push(o));
        this.execute(executionContextTool).forEach(o => result.push(o));
        this.update().forEach(o => result.push(o));
        this.execute(executionContextTool).forEach(o => result.push(o));
        this.stop().forEach(o => result.push(o));
        return result;
    };

    /**
     *
     * @return {SMCApi.IMessage[]}
     */
    this.start = function () {
        /** @type {SMCApi.IMessage[]} */
        const result = [];
        if (this.module == null)
            return result;

        result.push(new SmcEmulator.Message(new SmcEmulator.Value(1, SMCApi.ValueType.INTEGER), SMCApi.MessageType.ACTION_START));

        try {
            this.module.start(this.configurationTool);
        } catch (e) {
            result.push(new SmcEmulator.Message(new SmcEmulator.Value("error " + e.message, SMCApi.ValueType.STRING), SMCApi.MessageType.ACTION_ERROR));
            console.log(e.stack);
        }

        result.push(new SmcEmulator.Message(new SmcEmulator.Value(1, SMCApi.ValueType.INTEGER), SMCApi.MessageType.ACTION_STOP));

        return result;
    };

    /**
     *
     * @param executionContextTool {SmcEmulator.ExecutionContextTool}
     * @return {SMCApi.IMessage[]}
     */
    this.execute = function (executionContextTool) {
        /** @type {SMCApi.IMessage[]} */
        const result = [];
        if (this.module == null)
            return result;

        this.configurationTool.init(executionContextTool);
        executionContextTool.init(this.configurationTool);
        result.push(new SmcEmulator.Message(new SmcEmulator.Value(1, SMCApi.ValueType.INTEGER), SMCApi.MessageType.ACTION_START));

        try {
            const output = [];
            executionContextTool.getOutput().forEach(o => output.push(o));
            executionContextTool.getOutput().length = 0;
            this.module.process(
                this.configurationTool,
                executionContextTool
            );
            executionContextTool.getOutput().forEach(o => result.push(o));
            let array = output.concat(executionContextTool.getOutput());
            executionContextTool.getOutput().length = 0;
            array.forEach(o => executionContextTool.getOutput().push(o));
        } catch (e) {
            result.push(new SmcEmulator.Message(new SmcEmulator.Value("error " + e.message, SMCApi.ValueType.STRING), SMCApi.MessageType.ACTION_ERROR));
            console.log(e.stack);
        }

        result.push(new SmcEmulator.Message(new SmcEmulator.Value(1, SMCApi.ValueType.INTEGER), SMCApi.MessageType.ACTION_STOP));

        return result;
    };

    this.update = function () {
        /** @type {SMCApi.IMessage[]} */
        const result = [];
        if (this.module == null)
            return result;

        result.push(new SmcEmulator.Message(new SmcEmulator.Value(1, SMCApi.ValueType.INTEGER), SMCApi.MessageType.ACTION_START));

        try {
            this.module.update(this.configurationTool);
        } catch (e) {
            result.push(new SmcEmulator.Message(new SmcEmulator.Value("error " + e.message, SMCApi.ValueType.STRING), SMCApi.MessageType.ACTION_ERROR));
            console.log(e.stack);
        }

        result.push(new SmcEmulator.Message(new SmcEmulator.Value(1, SMCApi.ValueType.INTEGER), SMCApi.MessageType.ACTION_STOP));

        return result;
    };

    this.stop = function () {
        /** @type {SMCApi.IMessage[]} */
        const result = [];
        if (this.module == null)
            return result;

        result.push(new SmcEmulator.Message(new SmcEmulator.Value(1, SMCApi.ValueType.INTEGER), SMCApi.MessageType.ACTION_START));

        try {
            this.module.stop(this.configurationTool);
        } catch (e) {
            result.push(new SmcEmulator.Message(new SmcEmulator.Value("error " + e.message, SMCApi.ValueType.STRING), SMCApi.MessageType.ACTION_ERROR));
            console.log(e.stack);
        }

        result.push(new SmcEmulator.Message(new SmcEmulator.Value(1, SMCApi.ValueType.INTEGER), SMCApi.MessageType.ACTION_STOP));

        return result;
    };

}