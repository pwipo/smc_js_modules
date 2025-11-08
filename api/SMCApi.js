/**
 * created by Nikolay V. Ulyanov (ulianownv@mail.ru)
 * http://www.smcsystem.ru
 */

SMCApi = {};

/**
 * main exception
 */
SMCApi.ModuleException = function (message) {
    // const error = new Error(message);
    // this.description = description;
    // return error;
    Error.call(this, message);
};
SMCApi.ModuleException.prototype = Object.create(Error.prototype);

SMCApi.ActionType = {
    START: 0,
    EXECUTE: 1,
    UPDATE: 2,
    STOP: 3
};

SMCApi.CommandType = {
    START: 0,
    EXECUTE: 1,
    UPDATE: 2,
    STOP: 3
};

SMCApi.MessageType = {
    PROCESS_STATE_CHANGE: 1,

    ACTION_START: 4,
    ACTION_STOP: 6,
    ACTION_ERROR: 7,

    CONFIGURATION_CONTROL_CONFIGURATION_SETTING_UPDATE: 108,
    CONFIGURATION_CONTROL_CONFIGURATION_VARIABLE_UPDATE: 109,
    CONFIGURATION_CONTROL_CONFIGURATION_VARIABLE_REMOVE: 110,
    CONFIGURATION_CONTROL_CONFIGURATION_CREATE: 111,
    CONFIGURATION_CONTROL_CONFIGURATION_UPDATE: 112,
    CONFIGURATION_CONTROL_CONFIGURATION_REMOVE: 113,
    CONFIGURATION_CONTROL_EXECUTION_CONTEXT_CREATE: 114,
    CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE: 115,
    CONFIGURATION_CONTROL_EXECUTION_CONTEXT_REMOVE: 116,
    CONFIGURATION_CONTROL_SOURCE_CONTEXT_CREATE: 117,
    CONFIGURATION_CONTROL_SOURCE_CONTEXT_UPDATE: 118,
    CONFIGURATION_CONTROL_SOURCE_CONTEXT_REMOVE: 119,
    CONFIGURATION_CONTROL_CONTAINER_CREATE: 120,
    CONFIGURATION_CONTROL_CONTAINER_REMOVE: 121,

    FLOW_CONTROL_EXECUTE_NOW_START: 220,
    FLOW_CONTROL_EXECUTE_NOW_EXECUTE: 221,
    FLOW_CONTROL_EXECUTE_NOW_UPDATE: 222,
    FLOW_CONTROL_EXECUTE_NOW_STOP: 223,
    FLOW_CONTROL_EXECUTE_PARALLEL_START: 224,
    FLOW_CONTROL_EXECUTE_PARALLEL_EXECUTE: 225,
    FLOW_CONTROL_EXECUTE_PARALLEL_UPDATE: 226,
    FLOW_CONTROL_EXECUTE_PARALLEL_STOP: 227,
    FLOW_CONTROL_EXECUTE_PARALLEL_WAITING_TACTS: 228,

    ERROR: 1000,
    DATA: 1001,
    LOG: 1002
};

SMCApi.ValueType = {
    STRING: 0,
    BYTE: 1,
    SHORT: 2,
    INTEGER: 3,
    LONG: 4,
    BIG_INTEGER: 5,
    FLOAT: 6,
    DOUBLE: 7,
    BIG_DECIMAL: 8,
    BYTES: 9,
    OBJECT_ARRAY: 10,
    BOOLEAN: 11
};

SMCApi.SourceType = {
    MODULE_CONFIGURATION: 0,
    EXECUTION_CONTEXT: 1,
    STATIC_VALUE: 2,
    MULTIPART: 3,
    CALLER: 4,
    CALLER_RELATIVE_NAME: 5,
    OBJECT_ARRAY: 6
};

SMCApi.SourceGetType = {
    ALL: 0,
    NEW: 1,
    NEW_ALL: 2,
    LAST: 3,
    LAST_ALL: 4
};

SMCApi.SourceFilterType = {
    POSITION: 0,
    NUMBER: 1,
    STRING_EQUAL: 2,
    STRING_CONTAIN: 3,
    OBJECT_PATHS: 4
};

/**
 * Interface for value objects
 */
SMCApi.IValue = function () {

    /**
     * value type
     *
     * @return SMCApi.ValueType
     */
    this.getType = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * value as object
     *
     * @return {number|string|Array|boolean|SMCApi.ObjectArray}
     */
    this.getValue = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

};

/**
 * Interface for Message
 * @parent SMCApi.IValue
 */
SMCApi.IMessage = function () {

    SMCApi.IValue.call(this);

    /**
     * get date of creation
     *
     *  @return Date
     */
    this.getDate = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get message type for process messages - DATA
     *
     *  @return SMCApi.MessageType
     */
    this.getMessageType = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

};
SMCApi.IMessage.prototype = Object.create(SMCApi.IValue);

/**
 * Interface for Action
 */
SMCApi.IAction = function () {

    /**
     * get messages
     *
     *  @return SMCApi.IMessage[]
     */
    this.getMessages = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get type
     *
     *  @return SMCApi.ActionType
     */
    this.getType = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

};

/**
 * Interface for Command
 */
SMCApi.ICommand = function () {

    /**
     * get actions
     *
     *  @return SMCApi.IAction[]
     */
    this.getActions = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get type
     *
     *  @return SMCApi.CommandType
     */
    this.getType = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

};

SMCApi.ObjectType = {
    OBJECT_ARRAY: 0,
    OBJECT_ELEMENT: 1,
    VALUE_ANY: 2,
    STRING: 3,
    BYTE: 4,
    SHORT: 5,
    INTEGER: 6,
    LONG: 7,
    FLOAT: 8,
    DOUBLE: 9,
    BIG_INTEGER: 10,
    BIG_DECIMAL: 11,
    BYTES: 12,
    BOOLEAN: 13
};

/**
 * ObjectField
 * @param name {string}                                   name
 * @param {object} [value]                                  value
 * @param {SMCApi.ObjectType}  [type]                       type
 * @constructor
 */
SMCApi.ObjectField = function (name, value, type) {
    const callSetValue = typeof value !== undefined && value != null && (typeof type === undefined || type == null);
    this.namev = name;
    this.value = typeof value !== undefined ? value : null;
    /** @type {SMCApi.ObjectType} */
    this.type = type;
    const that = this;

    /**
     *
     * @param {object} [value]
     * @param {SMCApi.ObjectType}  [type]
     */
    this.setValue = function (value, type) {
        this.value = value

        if (typeof type === undefined || type == null) {
            let valueType = undefined;
            if (typeof value !== undefined && value != null) {
                if (value instanceof SMCApi.ObjectArray) {
                    valueType = SMCApi.ObjectType.OBJECT_ARRAY;
                } else if (value instanceof SMCApi.ObjectElement) {
                    valueType = SMCApi.ObjectType.OBJECT_ELEMENT;
                } else if (value instanceof SMCApi.ObjectField) {
                    this.type = value.getType()
                    this.value = value.getValue()
                } else if (value instanceof SMCApi.IValue) {
                    this.type = SMCApi.ObjectType[value.getType()]
                    this.value = value.getValue()
                } else if (Object.prototype.toString.call(value) === "[object String]") {
                    valueType = SMCApi.ObjectType.STRING;
                } else if (Array.isArray(value)) {
                    valueType = SMCApi.ObjectType.BYTES;
                } else if (value === false || value === true) {
                    valueType = SMCApi.ObjectType.BOOLEAN;
                    // } else if (!Number.isInteger(value) && Number.isFinite(value)) {
                    //     valueType = SMCApi.ObjectType.DOUBLE;
                    // } else if (Number.isInteger(value)) {
                    //     valueType = SMCApi.ObjectType.LONG;
                } else if (value instanceof Number || typeof (value) === "number") {
                    const intValue = Math.round(value);
                    valueType = value === intValue ? SMCApi.ValueType.LONG : SMCApi.ValueType.DOUBLE;
                } else {
                    valueType = SMCApi.ObjectType.DOUBLE;
                    this.value = value.doubleValue ? value.doubleValue() : 0
                }
            }
            if (valueType == null)
                valueType = SMCApi.ObjectType.STRING;
            this.type = valueType;
        } else {
            this.type = type;
            if (typeof value !== undefined && value != null) {
                if (value instanceof SMCApi.ObjectField) {
                    this.type = value.getType()
                    this.value = value.getValue()
                } else if (value instanceof SMCApi.IValue) {
                    this.type = SMCApi.ObjectType[value.getType()]
                    this.value = value.getValue()
                }
            }
        }
    };

    if (callSetValue)
        this.setValue(value);

    /**
     * getName
     * @return {string}
     */
    this.getName = function () {
        return this.namev;
    };

    /**
     * getType
     * @return {SMCApi.ObjectType}
     */
    this.getType = function () {
        return this.type;
    };

    /**
     *
     * @return {number|string|Array|boolean|SMCApi.ObjectArray|SMCApi.ObjectElement}
     */
    this.getValue = function () {
        return this.value;
    };

    /**
     * isSimple
     * @return {boolean}
     */
    this.isSimple = function () {
        return SMCApi.ObjectType.OBJECT_ARRAY !== this.type && SMCApi.ObjectType.OBJECT_ELEMENT !== this.type;
    };

    SMCApi.ObjectField.prototype.toString = function () {
        return `${this.type} ${this.namev}=${this.value}`;
    };
}

/**
 * ObjectElement
 * @param {SMCApi.ObjectField[]} [fields]                          fields
 * @constructor
 */
SMCApi.ObjectElement = function (fields) {
    /** @type {SMCApi.ObjectField[]}*/
    this.fields = typeof fields !== undefined && Array.isArray(fields) ? fields.slice() /*Array.copyOf(fields, fields.length)*/ /*fields.clone()*/ : [];
    const that = this;
    /**
     * getFields
     * @return {SMCApi.ObjectField[]}
     */
    this.getFields = function () {
        return this.fields;
    }
    /**
     * findField
     * @param name {string}
     * @return {SMCApi.ObjectField}
     */
    this.findField = function (name) {
        for (let field of this.fields) {
            if (field.namev === name)
                return field;
        }
        // return this.fields.find(v => v.namev === name);
        return null;
    }
    /**
     * findFieldIgnoreCase
     * @param name {string}
     * @return {SMCApi.ObjectField}
     */
    this.findFieldIgnoreCase = function (name) {
        for (let field of this.fields) {
            if (field.namev.toUpperCase() === name.toUpperCase())
                return field;
        }
        // return this.fields.find(v => v.namev.toUpperCase() === name.toUpperCase());
        return null;
    }
    /**
     * isSimple
     * @return {boolean}
     */
    this.isSimple = function () {
        return !this.fields.some(v => !v.isSimple());
    }
    SMCApi.ObjectElement.prototype.toString = function () {
        return `{count=${this.fields.length}, fields=[${this.fields}]}`;
    }
}

/**
 * ObjectArray
 * @param {SMCApi.ObjectType} [typev]                        type
 * @param {object[]}  [objects]                       objects
 * @constructor
 */
SMCApi.ObjectArray = function (typev, objects) {
    typev = typev || SMCApi.ObjectType.OBJECT_ELEMENT;
    this.type = typev
    this.objects = []
    const that = this;

    /**
     *
     * @param value
     * @param {SMCApi.ObjectType} [valueType]
     */
    this.check = function (value, valueType) {
        if (typeof this.objects === undefined)
            throw new SMCApi.ModuleException('obj is None');
        if (typeof valueType === undefined)
            throw new SMCApi.ModuleException('obj is None');
        if (this.type === SMCApi.ObjectType.OBJECT_ARRAY) {
            if (!(value instanceof SMCApi.ObjectArray))
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.OBJECT_ELEMENT) {
            if (!(value instanceof SMCApi.ObjectElement))
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.VALUE_ANY) {
            if (Object.prototype.toString.call(value) !== "[object String]" && !Array.isArray(value) && !(value instanceof Number) && typeof (value) !== "number" && (value !== false && value !== true))
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.STRING) {
            if (Object.prototype.toString.call(value) !== "[object String]")
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.BYTES) {
            if (!Array.isArray(value))
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.BYTE || this.type === SMCApi.ObjectType.SHORT || this.type === SMCApi.ObjectType.INTEGER || this.type === SMCApi.ObjectType.LONG) {
            const intValue = Math.round(value);
            if (value !== intValue)
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.FLOAT || this.type === SMCApi.ObjectType.DOUBLE) {
            const intValue = Math.round(value);
            if (value === intValue)
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.BOOLEAN) {
            if (value !== false && value !== true)
                throw new SMCApi.ModuleException('wrong obj type');
        }
    }
    /**
     * size
     * @return {number}
     */
    this.size = function () {
        return this.objects.length;
    }
    this.get = function (id) {
        return this.objects[id];
    }
    this.add = function (obj) {
        if (obj instanceof SMCApi.ObjectField) {
            obj = obj.getValue();
        } else if (obj instanceof SMCApi.IValue) {
            obj = obj.getValue();
        }
        this.check(obj);
        this.objects.push(obj);
    }
    this.set = function (id, obj) {
        if (obj instanceof SMCApi.ObjectField) {
            obj = obj.getValue();
        } else if (obj instanceof SMCApi.IValue) {
            obj = obj.getValue();
        }
        this.check(obj);
        this.objects[id] = obj;
    }
    this.remove = function (id) {
        delete this.objects.splice(id, 1);
    }
    /**
     * getType
     * @return {SMCApi.ObjectType}
     */
    this.getType = function () {
        return this.type;
    }
    /**
     * isSimple
     * @return {boolean}
     */
    this.isSimple = function () {
        return SMCApi.ObjectType.OBJECT_ARRAY !== this.type && SMCApi.ObjectType.OBJECT_ELEMENT !== this.type;
    }
    SMCApi.ObjectArray.prototype.toString = function () {
        return `[size=${this.objects.length}, objects=[${this.objects}], type=${this.type}]`;
    }

    if (typeof objects !== undefined && Array.isArray(objects)) {
        for (let obj of objects)
            this.add(obj);
    }
}


/**
 * for cfgs
 * @type {{}}
 */
SMCApi.CFG = {};

/**
 * Interface for Module
 */
SMCApi.CFG.IModule = function () {

    /**
     * get name
     *
     *  @return string
     */
    this.getName = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get count types
     *
     *  @return number
     */
    this.countTypes = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get type name
     *  @param typeId number                    serial number in the list of types
     *  @return string
     */
    this.getTypeName = function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get minimum count sources
     *
     * @param typeId number                    serial number in the list of types
     *  @return number
     */
    this.getMinCountSources = function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get maximum count sources
     *
     * @param typeId {number}                    serial number in the list of types
     *  @return number
     */
    this.getMaxCountSources = function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get minimum count execution contexts
     *
     * @param typeId {number}                    serial number in the list of types
     *  @return number
     */
    this.getMinCountExecutionContexts = function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get maximum count execution contexts
     *
     * @param typeId {number}                    serial number in the list of types
     *  @return number
     */
    this.getMaxCountExecutionContexts = function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get minimum count managed configurations
     *
     * @param typeId {number}                    serial number in the list of types
     *  @return number
     */
    this.getMinCountManagedConfigurations = function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get maximum count managed configurations
     *
     * @param typeId {number}                    serial number in the list of types
     *  @return number
     */
    this.getMaxCountManagedConfigurations = function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

};

/**
 * Interface for Container
 */
SMCApi.CFG.IContainer = function () {

    /**
     * get name
     *
     *  @return string
     */
    this.getName = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * is configuration work
     *
     *  @return boolean
     */
    this.isEnable = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

};

/**
 * Interface for Managed Container
 *
 * @parent SMCApi.CFG.IContainer
 */
SMCApi.CFG.IContainerManaged = function () {

    SMCApi.CFG.IContainer.call(this);

    /**
     * count child configurations
     *
     *  @return number
     */
    this.countConfigurations = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get child configuration
     *
     *  @param id   number                              serial number in the list of child configurations
     *  @return {SMCApi.CFG.IConfiguration} or null
     */
    this.getConfiguration = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * count child managed configurations
     *
     *  @return number
     */
    this.countManagedConfigurations = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get child managed configuration
     *
     *  @param id   {number}                              serial number in the list of child managed configurations
     *  @return {SMCApi.CFG.IConfigurationManaged} or null
     */
    this.getManagedConfiguration = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * count child containers
     *
     *  @return number
     */
    this.countContainers = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get child container
     *
     *  @param id   {number}                              serial number in the list of child containers
     *  @return {SMCApi.CFG.IConfiguration} or null
     */
    this.getContainer = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * create child container
     *
     *  @param name {string}                              unique name for container
     *  @return SMCApi.CFG.IContainerManaged
     */
    this.createContainer = function (name) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * delete empty child container
     *
     *  @param id   {number}                              serial number in the list of child containers
     *  @return void
     */
    this.removeContainer = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

    /**
     * get child configuration as managed
     * similar getConfiguration
     *
     *  @param id   number                              serial number in the list of child configurations
     *  @return {SMCApi.CFG.IConfigurationManaged} or null
     */
    this.getConfigurationManaged = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get child container as managed
     * similar getContainer
     *
     *  @param id   {number}                              serial number in the list of child containers
     *  @return {SMCApi.CFG.IConfigurationManaged} or null
     */
    this.getContainerManaged = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

};
SMCApi.CFG.IContainerManaged.prototype = Object.create(SMCApi.CFG.IContainer);


/**
 * Interface for Module Configuration
 */
SMCApi.CFG.IConfiguration = function () {

    /**
     * get module
     *  @return SMCApi.CFG.IModule
     */
    this.getModule = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get name
     *
     *  @return string
     */
    this.getName = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get description
     *
     *  @return string
     */
    this.getDescription = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get buffer size
     *
     *  @return number
     */
    this.getBufferSize = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get thread buffer size
     *
     * @return int
     */
    this.getThreadBufferSize = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * is configuration work
     *
     *  @return boolean
     */
    this.isEnable = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * check is configuration work now (process execute any commands)
     *
     * @return boolean
     */
    this.isActive = function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Interface for Managed Module Configuration
 *
 * @parent SMCApi.CFG.IConfiguration
 */
SMCApi.CFG.IConfigurationManaged = function () {

    SMCApi.CFG.IConfiguration.call(this);

    /**
     * change name
     *
     *  @param name {string}                              unique name for container
     *  @return void
     */
    this.setName = function (name) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get all settings
     *
     *  @return {Map<string, SMCApi.IValue>}
     */
    this.getAllSettings = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get setting value
     *
     *  @param key  {string}                              setting name
     *  @return {SMCApi.IValue} or null
     */
    this.getSetting = function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get all variables
     *
     *  @return Map[string, SMCApi.IValue]
     */
    this.getAllVariables = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get variable value
     *
     *  @param key  {string}                              variable name
     *  @return {SMCApi.IValue} or null
     */
    this.getVariable = function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * change setting
     *
     *  @param key  {string}                              variable name
     *  @param value    {Object}                          value object (string, number, bytes)
     *  @return void
     */
    this.setSetting = function (key, value) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * change variable
     *
     *  @param key  {string}                             variable name
     *  @param value  {Object}                           value object (string, number, bytes)
     *  @return void
     */
    this.setVariable = function (key, value) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * remove variable
     *
     *  @param key  {string}                             variable name
     *  @return void
     */
    this.removeVariable = function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * change buffer size
     *
     *  @param bufferSize   {number}                      1 is minimum
     *  @return void
     */
    this.setBufferSize = function (bufferSize) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * change thread buffer size
     *
     * @param threadBufferSize {number} 1 is minimum
     * @return void
     */
    this.setThreadBufferSize = function (threadBufferSize) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * enable or disable configuration
     *
     *  @param enable   {boolean}                         true for enable
     *  @return void
     */
    this.setEnable = function (enable) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * count execution contexts
     *
     *  @return number
     */
    this.countExecutionContexts = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get execution context
     *
     *  @param id   {number}                              serial number in the list of Execution Contexts
     *  @return {SMCApi.CFG.IExecutionContextManaged} or null
     */
    this.getExecutionContext = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * create execution context and bind it to this configuration
     *
     *  @param name {string}                              unique name for configuration
     *  @param type {string}                              type
     *  @param {number} [maxWorkInterval]                 max work interval. if -1, no time limit. in milliseconds. default is -1
     *  @return {SMCApi.CFG.IExecutionContextManaged}
     */
    this.createExecutionContext = function (name, type, maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * update execution context in list
     *
     * @param id    {number}                serial number in the list of execution contexts
     * @param name  {string}                unique name for configuration
     * @param type  {string}                type
     * @param maxWorkInterval {number}      max work interval. if -1, no time limit. in milliseconds
     * @return SMCApi.CFG.IExecutionContextManaged
     */
    this.updateExecutionContext = function (id, name, type, maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * delete execution context
     *
     *  @param id   {number}                              serial number in the list of Execution Contexts
     *  @return void
     */
    this.removeExecutionContext = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get container
     *
     *  @return {SMCApi.CFG.IContainerManaged} or null
     */
    this.getContainer = function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.IConfigurationManaged.prototype = Object.create(SMCApi.CFG.IConfiguration);

SMCApi.CFG.ISourceList = function () {

    /**
     * count sources
     *
     * @return int
     */
    this.countSource = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get source
     *
     * @param id    {number}                              serial number in the list of sources
     * @return {SMCApi.CFG.ISource} or null
     */
    this.getSource = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Interface for Execution Context
 */
SMCApi.CFG.IExecutionContext = function () {

    SMCApi.CFG.ISourceList.call(this);

    /**
     * get configuration
     *
     * @return SMCApi.CFG.IConfiguration
     */
    this.getConfiguration = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get name
     *
     *  @return {string}
     */
    this.getName = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get max work interval in milliseconds
     * if -1, no time limit
     *
     *  @return number
     */
    this.getMaxWorkInterval = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * is work
     *
     *  @return {boolean}     true if work
     */
    this.isEnable = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * check is context work now (execute any command)
     *
     * @return boolean
     */
    this.isActive = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get type
     * unique for configuration
     *
     * @return {string}     type or empty for default/any type
     */
    this.getType = function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.IExecutionContext.prototype = Object.create(SMCApi.CFG.ISourceList);

/**
 * Interface for Managed Execution Context
 *
 * @parent SMCApi.CFG.IExecutionContext
 */
SMCApi.CFG.IExecutionContextManaged = function () {

    SMCApi.CFG.IExecutionContext.call(this);
    SMCApi.CFG.ISourceListManaged.call(this);

    /**
     * change name
     *
     *  @param name {string}                              unique name for configuration
     *  @return void
     */
    this.setName = function (name) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * change max work interval
     *
     *  @param maxWorkInterval  {number}                  if -1, no time limit. in milliseconds
     *  @return void
     */
    this.setMaxWorkInterval = function (maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * enable or disable
     *
     *  @param enable   {boolean}                         true for enable
     *  @return void
     */
    this.setEnable = function (enable) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * count execution contexts
     *
     *  @return number
     */
    this.countExecutionContexts = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get execution context
     *
     *  @param id  {number}                               serial number in the list of Execution Contexts
     *  @return {SMCApi.CFG.IExecutionContext} or null
     */
    this.getExecutionContext = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * insert execution context in list
     * Shifts the element currently at that position (if any) and any subsequent elements to the right (adds one to their indices).
     *
     *  @param id   {number}                                      serial number in the list of Execution Contexts
     *  @param executionContext {SMCApi.CFG.IExecutionContext}    execution context
     *  @return void
     */
    this.insertExecutionContext = function (id, executionContext) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * update execution context in list
     *
     * @param id    {number}                                    serial number in the list of Execution Contexts
     * @param executionContext {SMCApi.CFG.IExecutionContext}
     * @return void
     */
    this.updateExecutionContext = function (id, executionContext) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * remove execution context from list
     *
     *  @param id   {number}                              serial number in the list of Execution Contexts
     *  @return void
     */
    this.removeExecutionContext = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * count managed configurations
     *
     *  @return number
     */
    this.countManagedConfigurations = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get managed configuration
     *
     *  @param id   {number}                              serial number in the list of Managed configurations
     *  @return {SMCApi.CFG.IConfiguration} or null
     */
    this.getManagedConfiguration = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * insert configuration in list
     * Shifts the element currently at that position (if any) and any subsequent elements to the right (adds one to their indices).
     *
     *  @param id   {number}                                    serial number in the list of Managed configurations
     *  @param configuration    {SMCApi.CFG.IConfiguration}     configuration
     *  @return void
     */
    this.insertManagedConfiguration = function (id, configuration) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * update configuration in list
     *
     * @param id    {number}            serial number in the list of Managed configurations
     * @param configuration {SMCApi.CFG.IConfiguration}
     * @return void
     */
    this.updateManagedConfiguration = function (id, configuration) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * remove configuration from list
     *
     *  @param id   {number}                              serial number in the list of Managed configurations
     *  @return void
     */
    this.removeManagedConfiguration = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * change type
     *
     * @param {string}      type type name or empty for default/any type (if exist)
     * @return void
     */
    this.setType = function (type) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.IExecutionContextManaged.prototype = Object.create(SMCApi.CFG.IExecutionContext);


/**
 * Interface for Source filter
 */
SMCApi.CFG.ISourceFilter = function () {
    /**
     * get type.
     *
     * @return SMCApi.SourceFilterType
     */
    this.getType = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * count params
     *
     * @return number
     */
    this.countParams = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get param
     * params may have any types, depends on the SMCApi.SourceFilterType and id
     *
     * @param id    {number}      serial number in the list of filter params
     * @return Object depend on type:
     *          POSITION: {number[]} (n*2 elements: from - inclusive and to - exclusive for range or position and null), number (period length, if greater than zero, then defines the set within which the previous list values apply), number (count periods, determines the number of periods), number (start offset, before the first period)
     *          NUMBER: {number} (min, inclusive), number (max, inclusive)
     *          STRING_EQUAL: {boolean} (type, if true then need equals, also, not equal), string (value for compare)
     *          STRING_CONTAIN: {boolean} (type, if true then need contain, also, not contain), string (value)
     */
    this.getParam = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }
};

/**
 * Interface for Source
 */
SMCApi.CFG.ISource = function () {

    /**
     * get type of source.
     *
     * @return SMCApi.SourceType
     */
    this.getType = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * count params
     *
     * @return int
     */
    this.countParams = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get param
     * params may have any types, depends on the SMCApi.SourceType and id
     *
     * @param id    {number}     serial number in the list of source params
     * @return Object depend on type:
     * MODULE_CONFIGURATION: SMCApi.CFG.IConfiguration configuration (source), SMCApi.SourceGetType getType (type of get commands from source), int countLast (only for SMCApi.ContextSourceGetType.LAST. minimum 1), boolean eventDriven (is event driven)
     * EXECUTION_CONTEXT: SMCApi.CFG.IExecutionContext executionContext (source), SMCApi.SourceGetType getType (type of get commands from source), int countLast (only for SMCApi.ContextSourceGetType.LAST. minimum 1), boolean eventDriven (is event driven)
     * STATIC_VALUE: IValue (String, Number or byte array)
     * MULTIPART: null
     * CALLER_RELATIVE_NAME: string (caller level cfg name)
     * @return any
     */
    this.getParam = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * count filters
     *
     * @return number
     */
    this.countFilters = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get filter
     *
     * @param id {number}             serial number in the list of Filters
     * @return SMCApi.CFG.ISourceFilter
     */
    this.getFilter = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Interface for Managed Source
 */
SMCApi.CFG.ISourceManaged = function () {

    SMCApi.CFG.ISource.call(this);

    /**
     * Create position filter and bind it to this source
     * add filter to end of current list (order = max_order + 1)
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param range        {number[]}        n*2 elements: from - inclusive and to - exclusive for range or position and null
     * @param period       {number}          period length, if greater than zero, then defines the set within which the previous list values apply
     * @param countPeriods {number}          determines the number of periods
     * @param startOffset  {number}          before the first period
     * @param {boolean} [forObject]          if true - used for ObjectArrays, overwise for all values
     * @return SMCApi.CFG.ISourceFilter
     */
    this.createFilterPosition = function (range, period, countPeriods, startOffset, forObject) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Create number filter and bind it to this source
     * add filter to end of current list (order = max_order + 1)
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param min   {number}              inclusive
     * @param max   {number}              inclusive
     * @param fieldName   {string}        field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    this.createFilterNumber = function (min, max, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Create string equal filter and bind it to this source
     * add filter to end of current list (order = max_order + 1)
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param needEquals    {boolean}     if true then need equals, also, not equal
     * @param value         {string}      value for compare
     * @param fieldName   {string}        field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    this.createFilterStrEq = function (needEquals, value, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Create string contain filter and bind it to this source
     * add filter to end of current list (order = max_order + 1)
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param needContain    {boolean}     if true then need equals, also, not equal
     * @param value          {string}      value for compare
     * @param fieldName   {string}         field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    this.createFilterStrContain = function (needContain, value, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Create string contain filter and bind it to this source
     * add filter to end of current list (order = max_order + 1)
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param paths          {string}      object array paths. path - dot separated names.
     * @return SMCApi.CFG.ISourceFilter
     */
    this.createFilterObjectPaths = function (paths) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Update Position filter in list
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param id           {number}          serial number in the list
     * @param range        {number[]}        n*2 elements: from - inclusive and to - exclusive for range or position and null
     * @param period       {number}          period length, if greater than zero, then defines the set within which the previous list values apply
     * @param countPeriods {number}          determines the number of periods
     * @param startOffset  {number}          before the first period
     * @param {boolean} [forObject]          if true - used for ObjectArrays, overwise for all values
     * @return SMCApi.CFG.ISourceFilter
     */
    this.updateFilterPosition = function (id, range, period, countPeriods, startOffset, forObject) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Update Number filter in list
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param id            {number}           serial number in the list
     * @param min           {number}           inclusive
     * @param max           {number}           inclusive
     * @param fieldName     {string}           field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    this.updateFilterNumber = function (id, min, max, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Update Str Eq filter in list
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param id            {number}          serial number in the list
     * @param needEquals    {boolean}         if true then need equals, also, not equal
     * @param value         {string}          value for compare
     * @param fieldName     {string}          field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    this.updateFilterStrEq = function (id, needEquals, value, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Update Str Contain filter in list
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param id                {number}          serial number in the list
     * @param needContain       {boolean}         if true then need equals, also, not equal
     * @param value             {string}          value for compare
     * @param fieldName         {string}          field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    this.updateFilterStrContain = function (id, needContain, value, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Update Object Paths filter in list
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param id                {number}          serial number in the list
     * @param paths             {string}          object array paths. path - dot separated names.
     * @return SMCApi.CFG.ISourceFilter
     */
    this.updateFilterObjectPaths = function (id, paths) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * remove filter from list
     *
     * @param id    {number}      serial number in the list of filters
     * @return void
     */
    this.removeFilter = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.ISourceManaged.prototype = Object.create(SMCApi.CFG.ISource);


SMCApi.CFG.ISourceListManaged = function () {

    SMCApi.CFG.ISourceList.call(this);

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is MODULE_CONFIGURATION
     *
     * @param configuration {SMCApi.CFG.IConfiguration}   configuration source.
     * @param {SMCApi.SourceGetType} [getType]           type of get commands from source.  default NEW.
     * @param {number}  [countLast]                        only for ContextSourceGetType.LAST. minimum 1. default 1.
     * @param {boolean} [eventDriven]                    if true, then source is event driven. default is false.
     * @return SMCApi.CFG.ISourceManaged
     */
    this.createSourceConfiguration = function (configuration, getType, countLast, eventDriven) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is EXECUTION_CONTEXT
     *
     * @param executionContext {SMCApi.CFG.IExecutionContext}   execution context source.
     * @param  {SMCApi.SourceGetType}  [getType]                 type of get commands from source. default NEW.
     * @param  {number}  [countLast]                              only for ContextSourceGetType.LAST. minimum 1. default 1.
     * @param  {boolean} [eventDriven]                          if true, then source is event driven. default is false.
     * @return SMCApi.CFG.ISourceManaged
     */
    this.createSourceExecutionContext = function (executionContext, getType, countLast, eventDriven) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is STATIC_VALUE
     *
     * @param value {SMCApi.IValue}                       value (String, Number or byte array)
     * @return SMCApi.CFG.ISourceManaged
     */
    this.createSourceValue = function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * create source and bind it to this execution context
     * add source to end of list (order = max_order + 1)
     * created ContextSourceType is MULTIPART
     *
     *  @return SMCApi.CFG.ISourceManaged
     */
    this.createSource = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is OBJECT_ARRAY
     *
     * @param value {SMCApi.ObjectArray}              value
     * @param fields {string[]}                  list of field (comma separated list of paths).
     *  @return SMCApi.CFG.ISourceManaged
     */
    this.createSourceObjectArray = function (value, fields) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Update source in list
     * ContextSourceType is MODULE_CONFIGURATION
     *
     * @param id {number}                               serial number in the list of sources
     * @param configuration {SMCApi.CFG.IConfiguration} configuration source.
     * @param {SMCApi.SourceGetType} [getType]          type of get commands from source.  default NEW.
     * @param {number}  [countLast]                      only for ContextSourceGetType.LAST. minimum 1. default 1.
     * @param {boolean} [eventDriven]                  if true, then source is event driven. default is false.
     * @return SMCApi.CFG.ISourceManaged
     */
    this.updateSourceConfiguration = function (id, configuration, getType, countLast, eventDriven) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Update source in list
     * created ContextSourceType is EXECUTION_CONTEXT
     *
     * @param id {number}                                       serial number in the list of sources
     * @param executionContext {SMCApi.CFG.IExecutionContext}   execution context source.
     * @param {SMCApi.SourceGetType}  [getType]                type of get commands from source.
     * @param {number}     [countLast]                           only for ContextSourceGetType.LAST. minimum 1. default 1.
     * @param {boolean}    [eventDriven]                       if true, then source is event driven. default is false.
     * @return SMCApi.CFG.ISourceManaged
     */
    this.updateSourceExecutionContext = function (id, executionContext, getType, countLast, eventDriven) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Update source in list
     * created ContextSourceType is STATIC_VALUE
     *
     * @param id {number}                              serial number in the list of sources
     * @param value {SMCApi.IValue}                    value (String, Number or byte array)
     * @return SMCApi.CFG.ISourceManaged
     */
    this.updateSourceValue = function (id, value) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * Update source in list
     * created ContextSourceType is OBJECT_ARRAY
     *
     * @param id {number}                               serial number in the list of sources
     * @param value {SMCApi.ObjectArray}                value
     * @param fields {string[]}                         list of field (comma separated list of paths).
     * @return SMCApi.CFG.ISourceManaged
     */
    this.updateSourceObjectArray = function (id, value, fields) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * remove source from list
     *
     * @param id    {number}                              serial number in the list of sources
     * @return void
     */
    this.removeSource = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get managed source list
     *
     * @param id {number}             serial number in the list of sources
     * @return {SMCApi.CFG.ISourceListManaged} or null
     */
    this.getSourceListManaged = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get managed source
     *
     * @param id {number}               serial number in the list of sources
     * @return {SMCApi.CFG.ISourceManaged} or null
     */
    this.getSourceManaged = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

};
SMCApi.CFG.ISourceListManaged.prototype = Object.create(SMCApi.CFG.ISourceList);

/**
 * tool for work with unmodifiable files
 */
SMCApi.FileTool = function () {

    /**
     * get name
     *
     *  @return string
     */
    this.getName = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * is file exist
     *
     *  @return boolean
     */
    this.isExists = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * is directory
     *
     *  @return boolean
     */
    this.isDirectory = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get files in folder
     *
     *  @return SMCApi.FileTool[]
     */
    this.getChildrens = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * reed all file
     *
     *  @return number[]
     */
    this.getBytes = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * file size
     *
     *  @return number
     */
    this.length = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

};

/**
 * Main module interface
 */
SMCApi.Module = function () {

    /**
     * call once per process on start
     *
     *  @param configurationTool    {SMCApi.ConfigurationTool}
     *  @return void
     */
    this.start = function (configurationTool) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * main method. call every time when need execute
     *
     *  @param configurationTool    {SMCApi.ConfigurationTool}
     *  @param executionContextTool {SMCApi.ExecutionContextTool}
     *  @return void
     */
    this.process = function (configurationTool, executionContextTool) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * call then need update
     *
     *  @param configurationTool    {SMCApi.ConfigurationTool}
     *  @return void
     */
    this.update = function (configurationTool) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * call once per process on stop
     *
     *  @param configurationTool    {SMCApi.ConfigurationTool}
     *  @return void
     */
    this.stop = function (configurationTool) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * main configuration tool
 *
 * @parent {SMCApi.CFG.IConfiguration}
 */
SMCApi.ConfigurationTool = function () {

    SMCApi.CFG.IConfiguration.call(this);

    /**
     * get all settings
     *
     *  @return {Map<string, SMCApi.IValue>}
     */
    this.getAllSettings = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get setting value
     *
     *  @param key  {string}                              setting name
     *  @return {SMCApi.IValue} or null
     */
    this.getSetting = function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get all variables
     *
     *  @return Map[string, SMCApi.IValue]
     */
    this.getAllVariables = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get variable value
     *
     *  @param key  {string}                              variable name
     *  @return {SMCApi.IValue} or null
     */
    this.getVariable = function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * change variable
     *
     *  @param key  {string}                             variable name
     *  @param value    {object}                           value object (string, number, bytes)
     *  @return void
     */
    this.setVariable = function (key, value) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * check is variable has changed from last execution or last check
     * usfull for check changes from external (processes or user)
     *
     *  @param key  {string}                             variable name
     *  @return boolean
     */
    this.isVariableChanged = function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * remove variable
     *
     *  @param key  {string}                             variable name
     *  @return void
     */
    this.removeVariable = function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get module folder
     * contains all files, what was in smcm file
     *
     *  @return SMCApi.FileTool
     */
    this.getHomeFolder = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get full path to work directory
     * only if module allow this
     *
     *  @return string
     */
    this.getWorkDirectory = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * count configuration execution contexts
     *
     * @return int
     */
    this.countExecutionContexts = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get execution context
     *
     * @param id    {number}                              serial number in the list of Execution Contexts
     * @return {SMCApi.CFG.IExecutionContext} or null
     */
    this.getExecutionContext = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get container
     *
     *  @return {SMCApi.CFG.IContainerManaged} or null
     */
    this.getContainer = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * logger trace
     *
     * @param text {string}           text
     * @return void
     */
    this.loggerTrace = function (text) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * logger debug
     *
     * @param text {string}           text
     * @return void
     */
    this.loggerDebug = function (text) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * logger info
     *
     * @param text {string}           text
     * @return void
     */
    this.loggerInfo = function (text) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * logger warn
     *
     * @param text {string}           text
     * @return void
     */
    this.loggerWarn = function (text) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * logger error
     *
     * @param text {string}           text
     * @return void
     */
    this.loggerError = function (text) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get info by key
     *
     * @param key {string}           key name
     * @return {SMCApi.IValue} or null
     */
    this.getInfo = function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    };

};
SMCApi.ConfigurationTool.prototype = Object.create(SMCApi.CFG.IConfiguration.prototype);

/**
 * main execution context tool
 */
SMCApi.ExecutionContextTool = function () {

    SMCApi.CFG.IExecutionContext.call(this);

    /**
     * emit message
     *
     *  @param value    {Object}                          object (string, number, bytes)
     *  @return void
     */
    this.addMessage = function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * emit error message
     *
     *  @param value    {Object}                          object (string, number, bytes)
     *  @return void
     */
    this.addError = function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * emit log message
     *
     *  @param value    {string}
     *  @return void
     */
    this.addLog = function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get count commands in source
     *
     *  @param sourceId {number}                          serial number in the list of Sources
     *  @return number
     */
    this.countCommands = function (sourceId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get count commands (all) for managed execution context
     *
     * @param executionContext  {SMCApi.CFG.IExecutionContextManaged}     managed execution context
     * @return number
     */
    this.countCommandsFromExecutionContext = function (executionContext) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get Actions from source (only DATA messages)
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     *
     *  @param {number} sourceId                      serial number in the list of Sources
     *  @param {number} [fromIndex]                      start serial number in the list of commands in source (exclusive). if -1 then get all. default is -1.
     *  @param {number} [toIndex]                     end serial number in the list of commands in source (inclusive). if -1 then get all. default is -1.
     *  @return SMCApi.IAction[]
     */
    this.getMessages = function (sourceId, fromIndex, toIndex) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get Commands from source
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     *
     *  @param {number}     sourceId                 serial number in the list of Sources
     *  @param {number}     [fromIndex]                 start serial number in the list of commands in source (exclusive). if -1 then get all. default is -1.
     *  @param {number}     [toIndex]                 end serial number in the list of commands in source (inclusive). if -1 then get all. default is -1.
     *  @return SMCApi.ICommand[]
     */
    this.getCommands = function (sourceId, fromIndex, toIndex) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get Commands from managed execution context
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     *
     * @param executionContext {SMCApi.CFG.IExecutionContextManaged}  managed execution context
     * @param fromIndex {number}                          start serial number in the list of commands
     * @param toIndex   {number}                          end serial number in the list of commands
     * @return {SMCApi.ICommand[]}
     */
    this.getCommandsFromExecutionContext = function (executionContext, fromIndex, toIndex) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * is Process Actions has errors
     *
     *  @param action   {SMCApi.IAction}
     *  @return boolean
     */
    this.isError = function (action) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get tool for work with managed configurations
     *
     *  @return SMCApi.ConfigurationControlTool
     */
    this.getConfigurationControlTool = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get tool for throw new command to managed execution contexts and get result
     *
     *  @return SMCApi.FlowControlTool
     */
    this.getFlowControlTool = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * check is need stop process work immediately
     * usefull for long work (example - web server)
     *
     *  @return boolean
     */
    this.isNeedStop = function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.ExecutionContextTool.prototype = Object.create(SMCApi.CFG.IExecutionContext.prototype);

/**
 * Tool for work with managed configurations
 */
SMCApi.ConfigurationControlTool = function () {

    /**
     * list of all installed modules
     *
     * @return SMCApi.CFG.IModule[]
     */
    this.getModules = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * count managed configurations
     *
     *  @return number
     */
    this.countManagedConfigurations = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get managed configuration
     *
     * @param id    {number}                              serial number in the list of Managed configurations
     * @return {SMCApi.CFG.IConfigurationManaged} or null
     */
    this.getManagedConfiguration = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * create configuration and add it in list of managed configurations
     *
     * @param id    {number}                              index at which the specified element is to be inserted
     * @param container    {SMCApi.CFG.IContainer}        container
     * @param module    {SMCApi.CFG.IModule}              module
     * @param name  {string}                              unique name for configuration
     * @return SMCApi.CFG.IConfigurationManaged
     */
    this.createConfiguration = function (id, container, module, name) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * remove managed configuration
     *
     * @param id    {number}                              serial number in the list of Managed configurations
     * @return void
     */
    this.removeManagedConfiguration = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Tool for throw new command to managed execution contexts and get result
 */
SMCApi.FlowControlTool = function () {

    /**
     * count managed execution contexts
     *
     *  @return number
     */
    this.countManagedExecutionContexts = function () {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * throw new command to managed execution context
     * command execute in this thread
     * function will wait for the command to execute
     *
     *  @param type       {SMCApi.CommandType}              type of command
     *  @param managedId  {number}                          serial number in the list of Managed execution contexts
     *  @param values     {Object[]}                        list of values for create dummy messages from this process, or null
     *  @return void
     */
    this.executeNow = function (type, managedId, values) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * throw new command to managed execution context
     * command execute in new thread
     * function return control immediately
     *
     *  @param type          {SMCApi.CommandType}       type of command
     *  @param managedIds    {number[]}                 list of serial numbers in the list of Managed execution contexts
     *  @param values        {Object[]}            list of values for create dummy messages from this process, or null
     *  @param {number}  [waitingTacts]                 if it is necessary that the new thread first wait for the specified time (in tacts). if 0 then using data from current thread. default is 0.
     *  @param {number}  [maxWorkInterval]               define max work interval of new thread (in tacts). if -1 then no limit. default is -1.
     *  @return {number}  id of thread
     */
    this.executeParallel = function (type, managedIds, values, waitingTacts, maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * check is thread alive
     *
     *  @param threadId  {number}                       id thread
     *  @return boolean
     */
    this.isThreadActive = function (threadId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get data from managed execution context
     * who receive commands from this process
     *
     *  @param {number} [threadId]                      id thread. if 0 then using data from current thread. default is 0.
     *  @param {number} [managedId]                      serial number in the list of Managed execution contexts. default is 0.
     *  @return {SMCApi.IAction[]} only DATA messages
     */
    this.getMessagesFromExecuted = function (threadId, managedId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get data from managed execution context
     * who receive commands from this process
     *
     *  @param {number}   [threadId]                     id thread. if 0 then using data from current thread. default is 0.
     *  @param {number}   [managedId]                    serial number in the list of Managed execution contexts. default is 0.
     *  @return SMCApi.ICommand[]
     */
    this.getCommandsFromExecuted = function (threadId, managedId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * after executeParallel and work with him, need to release thread
     *
     *  @param threadId   {number}                      id thread
     *  @return void
     */
    this.releaseThread = function (threadId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * after executeParallel and work with him, need to release thread
     * if thread work - not stop it
     *
     * @param threadId  {number}          id thread
     */
    this.releaseThreadCache = function (threadId) {
        throw new SMCApi.ModuleException('function not implemented');
    };

    /**
     * get managed execution context
     *
     * @param id    {number}                                        serial number in the list of Managed execution contexts
     * @return {SMCApi.CFG.IExecutionContext} or null
     */
    this.getManagedExecutionContext = function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
