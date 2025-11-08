/**
 * created by Nikolay V. Ulyanov (ulianownv@mail.ru)
 * http://www.smcsystem.ru
 */

SmcUtils = {

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {boolean}
     */
    isNumber: function (m) {
        return m != null && ((SMCApi.ValueType.BYTE === m.getType() || SMCApi.ValueType.SHORT === m.getType() || SMCApi.ValueType.INTEGER === m.getType() || SMCApi.ValueType.LONG === m.getType() || SMCApi.ValueType.FLOAT === m.getType() || SMCApi.ValueType.DOUBLE === m.getType() || SMCApi.ValueType.BIG_INTEGER === m.getType() || SMCApi.ValueType.BIG_DECIMAL === m.getType()));
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {boolean}
     */
    isNumberField: function (m) {
        return m != null && ((SMCApi.ObjectType.BYTE === m.getType() || SMCApi.ObjectType.SHORT === m.getType() || SMCApi.ObjectType.INTEGER === m.getType() || SMCApi.ObjectType.LONG === m.getType() || SMCApi.ObjectType.FLOAT === m.getType() || SMCApi.ObjectType.DOUBLE === m.getType() || SMCApi.ObjectType.BIG_INTEGER === m.getType() || SMCApi.ObjectType.BIG_DECIMAL === m.getType()));
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {boolean}
     */
    isString: function (m) {
        return m != null && SMCApi.ValueType.STRING === m.getType();
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {boolean}
     */
    isStringField: function (m) {
        return m != null && SMCApi.ObjectType.STRING === m.getType();
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {boolean}
     */
    isBytes: function (m) {
        return m != null && SMCApi.ValueType.BYTES === m.getType();
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {boolean}
     */
    isBytesField: function (m) {
        return m != null && SMCApi.ObjectType.BYTES === m.getType();
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {boolean}
     */
    isBoolean: function (m) {
        return m != null && SMCApi.ValueType.BOOLEAN === m.getType();
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {boolean}
     */
    isBooleanField: function (m) {
        return m != null && SMCApi.ObjectType.BOOLEAN === m.getType();
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {boolean}
     */
    isObjectArray: function (m) {
        return m != null && SMCApi.ValueType.OBJECT_ARRAY === m.getType();
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {boolean}
     */
    isObjectArrayField: function (m) {
        return m != null && SMCApi.ObjectType.OBJECT_ARRAY === m.getType();
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {boolean}
     */
    isObjectElement: function (m) {
        return m != null && SMCApi.ObjectType.OBJECT_ELEMENT === m.getType();
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {number} or null
     */
    getNumber: function (m) {
        return SmcUtils.isNumber(m) ? m.getValue() : null;
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {number} or null
     */
    getNumberField: function (m) {
        return SmcUtils.isNumberField(m) ? m.getValue() : null;
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {string} or null
     */
    getString: function (m) {
        return SmcUtils.isString(m) ? m.getValue() : null;
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {string} or null
     */
    getStringField: function (m) {
        return SmcUtils.isStringField(m) ? m.getValue() : null;
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {int[]} or null
     */
    getBytes: function (m) {
        return SmcUtils.isBytes(m) ? m.getValue() : null;
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {int[]} or null
     */
    getBytesField: function (m) {
        return SmcUtils.isBytesField(m) ? m.getValue() : null;
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {boolean} or null
     */
    getBoolean: function (m) {
        return SmcUtils.isBoolean(m) ? m.getValue() : null;
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {boolean} or null
     */
    getBooleanField: function (m) {
        return SmcUtils.isBooleanField(m) ? m.getValue() : null;
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {SMCApi.ObjectArray} or null
     */
    getObjectArray: function (m) {
        return SmcUtils.isObjectArray(m) ? m.getValue() : null;
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {SMCApi.ObjectArray} or null
     */
    getObjectArrayField: function (m) {
        return SmcUtils.isObjectArrayField(m) ? m.getValue() : null;
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {SMCApi.ObjectElement} or null
     */
    getObjectElement: function (m) {
        if (typeof m === undefined || m == null || m.getValue() == null)
            return null;
        if (m.getType() === SMCApi.ObjectType.OBJECT_ARRAY) {
            /** @type {SMCApi.ObjectArray} */
            const objectArray = m.getValue();
            if (objectArray.size() > 0 && objectArray.getType() === SMCApi.ObjectType.OBJECT_ELEMENT)
                return objectArray.get(0);
        } else if (m.getType() === SMCApi.ObjectType.OBJECT_ELEMENT) {
            return m.getValue();
        }
        return null;
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {SMCApi.ObjectElement[]} or null
     */
    getObjectElements: function (m) {
        if (typeof m === undefined || m == null || m.getValue() == null)
            return null;
        if (m.getType() === SMCApi.ObjectType.OBJECT_ARRAY) {
            /** @type {SMCApi.ObjectArray} */
            const objectArray = m.getValue();
            if (objectArray.getType() === SMCApi.ObjectType.OBJECT_ELEMENT) {
                const result = [];
                for (let i = 0; i < objectArray.size(); i++)
                    result.push(objectArray.get(i));
                return result;
            }
        } else if (m.getType() === SMCApi.ObjectType.OBJECT_ELEMENT) {
            return [m.getValue()];
        }
        return null;
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {string}
     */
    toString: function (m) {
        if (typeof m === undefined || m == null)
            return "";
        let result;
        if (m.getType() === SMCApi.ValueType.STRING) {
            result = m.getValue();
        } else if (m.getType() === SMCApi.ValueType.BYTES) {
            result = typeof Packages !== undefined ? Packages.java.util.Base64.encoder.encodeToString(m.getValue()) : "";
        } else {
            result = String(m.getValue());
        }
        return result;
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {string}
     */
    toStringField: function (m) {
        if (typeof m === undefined || m == null || m.getValue() == null)
            return "";
        let result;
        if (m.getType() === SMCApi.ObjectType.STRING) {
            result = m.getValue();
        } else if (m.getType() === SMCApi.ObjectType.BYTES) {
            result = typeof Packages !== undefined ? Packages.java.util.Base64.encoder.encodeToString(m.getValue()) : "";
        } else {
            result = String(m.getValue());
        }
        return result;
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {number}
     */
    toNumber: function (m) {
        if (typeof m === undefined || m == null)
            return 0;
        let result;
        if (m.getType() === SMCApi.ValueType.STRING) {
            const value = String(m.getValue()).trim();
            if (value.length > 0) {
                try {
                    if (value.contains(".")) {
                        result = parseFloat(value);
                    } else {
                        result = parseInt(value);
                    }
                } catch (e) {
                    result = 0;
                }
            } else {
                result = 0;
            }
        } else if (m.getType() === SMCApi.ValueType.BOOLEAN) {
            result = m.getValue() ? 1 : 0;
        } else if (m.getType() === SMCApi.ValueType.BYTES) {
            result = m.getValue().length;
        } else if (m.getType() === SMCApi.ValueType.OBJECT_ARRAY) {
            result = m.getValue().size();
        } else {
            result = Number(m.getValue());
        }
        return result;
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {number}
     */
    toNumberField: function (m) {
        if (typeof m === undefined || m == null || m.getValue() == null)
            return 0;
        let result;
        if (m.getType() === SMCApi.ObjectType.STRING) {
            const value = String(m.getValue()).trim();
            if (value.length > 0) {
                try {
                    if (value.contains(".")) {
                        result = parseFloat(value);
                    } else {
                        result = parseInt(value);
                    }
                } catch (e) {
                    result = 0;
                }
            } else {
                result = 0;
            }
        } else if (m.getType() === SMCApi.ObjectType.BOOLEAN) {
            result = m.getValue() ? 1 : 0;
        } else if (m.getType() === SMCApi.ObjectType.BYTES) {
            result = m.getValue().length;
        } else if (m.getType() === SMCApi.ObjectType.OBJECT_ARRAY) {
            result = m.getValue().size();
        } else if (m.getType() === SMCApi.ObjectType.OBJECT_ELEMENT) {
            /** @type {SMCApi.ObjectField[]}*/
            const fields = m.getValue().getFields();
            result = fields.length;
        } else {
            result = Number(m.getValue());
        }
        return result;
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {boolean}
     */
    toBoolean: function (m) {
        if (typeof m === undefined || m == null)
            return false;
        let result;
        if (m.getType() === SMCApi.ValueType.STRING) {
            result = Boolean(m.getValue());
        } else if (m.getType() === SMCApi.ValueType.BOOLEAN) {
            result = m.getValue();
        } else if (m.getType() === SMCApi.ValueType.BYTES || m.getType() === SMCApi.ValueType.OBJECT_ARRAY) {
            result = true;
        } else {
            result = Number(m.getValue()) > 0;
        }
        return result;
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {boolean}
     */
    toBooleanField: function (m) {
        if (typeof m === undefined || m == null || m.getValue() == null)
            return false;
        let result;
        if (m.getType() === SMCApi.ObjectType.STRING) {
            result = Boolean(m.getValue());
        } else if (m.getType() === SMCApi.ObjectType.BOOLEAN) {
            result = m.getValue();
        } else if (m.getType() === SMCApi.ObjectType.BYTES || m.getType() === SMCApi.ObjectType.OBJECT_ARRAY || m.getType() === SMCApi.ObjectType.OBJECT_ELEMENT) {
            result = true;
        } else {
            result = Number(m.getValue()) > 0;
        }
        return result;
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {ObjectArray}
     */
    toObjectArray: function (m) {
        if (typeof m === undefined || m == null)
            return new SMCApi.ObjectArray();
        let objectArray = null;
        if (m.getType() === SMCApi.ValueType.OBJECT_ARRAY) {
            objectArray = m.getValue();
        } else {
            objectArray = new SMCApi.ObjectArray(SmcUtils.convertTo(m.getType()), [m.getValue()]);
        }
        return objectArray != null ? objectArray : new SMCApi.ObjectArray();
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {SMCApi.ObjectArray}
     */
    toObjectArrayField: function (m) {
        if (typeof m === undefined || m == null || m.getValue() == null)
            return new SMCApi.ObjectArray();
        let objectArray = null;
        if (m.getType() === SMCApi.ObjectType.OBJECT_ARRAY) {
            objectArray = m.getValue();
        } else if (m.getType() === SMCApi.ObjectType.OBJECT_ARRAY) {
            objectArray = new SMCApi.ObjectArray(SMCApi.ObjectType.OBJECT_ELEMENT, [m.getValue()]);
        } else {
            objectArray = new SMCApi.ObjectArray(SmcUtils.convertTo(m.getType()), [m.getValue()]);
        }
        return objectArray != null ? objectArray : new SMCApi.ObjectArray();
    },

    /**
     *
     * @param m {SMCApi.IValue}
     * @returns {SMCApi.ObjectElement}
     */
    toObjectElement: function (m) {
        if (typeof m === undefined || m == null)
            return new SMCApi.ObjectElement();
        let objectElement = null;
        if (m.getType() === SMCApi.ValueType.OBJECT_ARRAY) {
            /** @type {SMCApi.ObjectArray} */
            let objectArray = m.getValue();
            if (SmcUtils.isArrayContainObjectElements(objectArray)) {
                objectElement = objectArray.get(0);
            } else if (objectArray.isSimple() && objectArray.size() > 0) {
                objectElement = new SMCApi.ObjectElement();
                for (let i = 0; i < objectArray.size(); i++)
                    objectElement.getFields().push(new SMCApi.ObjectField(String(i), objectArray.get(i), objectArray.getType()));
            }
        } else {
            let objectField = new SMCApi.ObjectField("0");
            objectField.setValue(m.getValue(), SmcUtils.convertTo(m.getType()));
            objectElement = new SMCApi.ObjectElement([objectField]);
        }
        return objectElement != null ? objectElement : new SMCApi.ObjectElement();
    },

    /**
     *
     * @param m {SMCApi.ObjectField}
     * @returns {SMCApi.ObjectElement}
     */
    toObjectElementField: function (m) {
        if (typeof m === undefined || m == null || m.getValue() == null)
            return new SmcUtils.ObjectElement();
        let objectElement = null;
        if (m.getType() === SMCApi.ObjectType.OBJECT_ARRAY) {
            /** @type {SMCApi.ObjectArray} */
            let objectArray = m.getValue();
            if (SmcUtils.isArrayContainObjectElements(objectArray)) {
                objectElement = objectArray.get(0);
            } else if (objectArray.isSimple() && objectArray.size() > 0) {
                objectElement = new SMCApi.ObjectElement();
                for (let i = 0; i < objectArray.size(); i++)
                    objectElement.getFields().push(new SMCApi.ObjectField(String(i), objectArray.get(i), objectArray.getType()));
            }
        } else if (m.getType() === SMCApi.ObjectType.OBJECT_ELEMENT) {
            objectElement = m.getValue();
        } else {
            let objectField = new SMCApi.ObjectField(m.getName());
            objectField.setValue(m.getValue(), m.getType());
            objectElement = new SMCApi.ObjectElement([objectField]);
        }
        return objectElement != null ? objectElement : new SMCApi.ObjectElement();
    },

    /**
     *
     * @param c {SMCApi.ICommand}
     * @returns {boolean}
     */
    hasErrors: function (c) {
        if (typeof c === undefined || c == null)
            return false;
        return c.getActions().length > 0 && c.getActions().some(a => SmcUtils.hasErrorsAction(a));
    },

    /**
     *
     * @param c {SMCApi.ICommand}
     * @returns {boolean}
     */
    hasData: function (c) {
        if (typeof c === undefined || c == null)
            return false;
        return c.getActions().length > 0 && c.getActions().some(a => SmcUtils.hasDataAction(a));
    },

    /**
     *
     * @param a {SMCApi.IAction}
     * @returns {boolean}
     */
    hasErrorsAction: function (a) {
        if (typeof a === undefined || a == null)
            return false;
        return a.getMessages().length > 0 && a.getMessages().some(m => SMCApi.MessageType.ERROR === m.getMessageType() || SMCApi.MessageType.ACTION_ERROR === m.getMessageType());
    },

    /**
     *
     * @param a {SMCApi.IAction}
     * @returns {boolean}
     */
    hasDataAction: function (a) {
        if (typeof a === undefined || a == null)
            return false;
        return a.getMessages().length > 0 && a.getMessages().some(m => SMCApi.MessageType.DATA === m.getMessageType());
    },

    /**
     *
     * @param a {SMCApi.IAction}
     * @returns {SMCApi.IMessage[]}
     */
    getErrorsAction: function (a) {
        if (typeof a === undefined || a == null)
            return [];
        return a.getMessages().filter(m => SMCApi.MessageType.ERROR === m.getMessageType() || SMCApi.MessageType.ACTION_ERROR === m.getMessageType());
    },

    /**
     *
     * @param c {SMCApi.ICommand}
     * @returns {(SMCApi.IMessage[])[]}
     */
    getErrors: function (c) {
        if (typeof c === undefined || c == null)
            return [];
        return c.getActions().map(a => SmcUtils.getErrorsAction(a)).filter(l => l.length > 0);
    },

    /**
     *
     * @param a {SMCApi.IAction}
     * @returns {SMCApi.IMessage[]}
     */
    getDataAction: function (a) {
        if (typeof a === undefined || a == null)
            return [];
        return a.getMessages().filter(m => SMCApi.MessageType.DATA === m.getMessageType());
    },

    /**
     *
     * @param c {SMCApi.ICommand}
     * @returns {(SMCApi.IMessage[])[]}
     */
    getData: function (c) {
        if (typeof c === undefined || c == null)
            return [];
        return c.getActions().map(a => SmcUtils.getDataAction(a)).filter(l => l.length > 0);
    },

    /**
     *
     * @param {SMCApi.ObjectArray} [objectArray]
     * @returns {boolean}
     */
    isSameFields: function (objectArray) {
        if (typeof objectArray === undefined || objectArray == null || objectArray.getType() !== SMCApi.ObjectType.OBJECT_ELEMENT)
            return false;
        let isSame = true;
        /** @type {string[]} */
        let fieldNames = [];
        /** @type {SMCApi.ObjectType[]} */
        let fieldType = null;
        for (let i = 0; i < objectArray.size(); i++) {
            /** @type {SMCApi.ObjectElement} */
            const objectElement = objectArray.get(i);
            if (i === 0) {
                fieldNames = objectElement.getFields().map(f => f.getName());
                fieldType = objectElement.getFields().map(f => f.getType());
            } else if (!objectElement.getFields().every((f, i) => f.getName() === fieldNames[i] && f.getType() === fieldType[i])) {
                isSame = false;
                break;
            }
        }
        return isSame;
    },

    /**
     *
     * @param {SMCApi.ObjectArray} [objectArray]
     * @param {string[]} [fieldPaths]
     * @returns {(SMCApi.ObjectField[])[]}
     */
    findFields: function (objectArray, fieldPaths) {
        if (typeof objectArray === undefined || !SmcUtils.isArrayContainObjectElements(objectArray) || typeof fieldPaths === undefined || fieldPaths == null || fieldPaths.length === 0)
            return [];
        return fieldPaths.map(p => {
            const names = SmcUtils.splitFieldNames(p);
            /** @type {SMCApi.ObjectElement[]} */
            const objectElements = [];
            for (let i = 0; i < objectArray.size(); i++)
                objectElements.push(objectArray.get(i));
            return SmcUtils.findFieldsInner(objectElements, names, 0);
        });
    },

    /**
     *
     * @param objectElements {SMCApi.ObjectElement[]}
     * @param names {string[]}
     * @param level {number}
     * @returns {SMCApi.ObjectField[]}
     */
    findFieldsInner: function (objectElements, names, level) {
        if (names.length <= level)
            return [];
        const name = names[level];
        /** @type {SMCApi.ObjectField[]} */
        const fields = [];
        for (let objectElement of objectElements) {
            const field = objectElement.findField(name);
            if (field != null) {
                const objectField = field;
                if (names.length > level + 1) {
                    const innerObjectElements = SmcUtils.getObjectElements(objectField);
                    if (innerObjectElements != null) {
                        // fields = fields.concat(SmcUtils.findFieldsInner(innerObjectElements, names, level + 1));
                        SmcUtils.arrayExtend(fields, SmcUtils.findFieldsInner(innerObjectElements, names, level + 1));
                    }
                } else {
                    fields.push(objectField);
                }
            }
        }
        return fields;
    },

    /**
     *
     * @param fieldPath {string}
     * @returns {string[]}
     */
    splitFieldNames: function (fieldPath) {
        return fieldPath.split("\\.");
    },

    /**
     *
     * @param {SMCApi.ObjectArray} [objectArray]
     * @returns {boolean}
     */
    isArrayContainObjectElements: function (objectArray) {
        return typeof objectArray !== undefined && objectArray != null && objectArray.size() > 0 && SMCApi.ObjectType.OBJECT_ELEMENT === objectArray.getType();
    },

    /**
     *
     * @param {SMCApi.ObjectArray} [objectArray]
     * @returns {boolean}
     */
    isArrayContainArrays: function (objectArray) {
        return typeof objectArray !== undefined && objectArray != null && objectArray.size() > 0 && SMCApi.ObjectType.OBJECT_ARRAY === objectArray.getType();
    },

    /**
     *
     * @param {SMCApi.ObjectArray} [objectArray]
     * @returns {boolean}
     */
    isArrayContainNumber: function (objectArray) {
        return typeof objectArray !== undefined && objectArray != null && objectArray.size() > 0 && (SMCApi.ObjectType.VALUE_ANY === objectArray.getType() || SMCApi.ObjectType.BYTE === objectArray.getType() || SMCApi.ObjectType.SHORT === objectArray.getType() || SMCApi.ObjectType.INTEGER === objectArray.getType() || SMCApi.ObjectType.LONG === objectArray.getType() || SMCApi.ObjectType.FLOAT === objectArray.getType() || SMCApi.ObjectType.DOUBLE === objectArray.getType() || SMCApi.ObjectType.BIG_INTEGER === objectArray.getType() || SMCApi.ObjectType.BIG_DECIMAL === objectArray.getType());
    },

    /**
     *
     * @param {SMCApi.ObjectArray} [objectArray]
     * @returns {boolean}
     */
    isArrayContainString: function (objectArray) {
        return typeof objectArray !== undefined && objectArray != null && objectArray.size() > 0 && (SMCApi.ObjectType.VALUE_ANY === objectArray.getType() || SMCApi.ObjectType.STRING === objectArray.getType());
    },

    /**
     *
     * @param {SMCApi.ObjectArray} [objectArray]
     * @returns {boolean}
     */
    isArrayContainBytes: function (objectArray) {
        return typeof objectArray !== undefined && objectArray != null && objectArray.size() > 0 && (SMCApi.ObjectType.VALUE_ANY === objectArray.getType() || SMCApi.ObjectType.BYTES === objectArray.getType());
    },

    /**
     *
     * @param {SMCApi.ObjectArray} [objectArray]
     * @returns {boolean}
     */
    isArrayContainBoolean: function (objectArray) {
        return typeof objectArray !== undefined && objectArray != null && objectArray.size() > 0 && (SMCApi.ObjectType.VALUE_ANY === objectArray.getType() || SMCApi.ObjectType.BOOLEAN === objectArray.getType());
    },

    /**
     *
     * @param {SMCApi.ObjectField} [m]
     * @returns {SMCApi.ValueType} or null
     */
    toValueType: function (m) {
        let result = null;
        if (typeof m === undefined || m == null || !m.isSimple())
            return result;
        if (m.getType() === SMCApi.ObjectType.VALUE_ANY) {
            result = SmcUtils.getValueTypeObject(m.getValue());
        } else {
            result = SMCApi.ValueType[m.getType()];
        }
        return result;
    },

    /**
     *
     * @param [value]
     * @returns {SMCApi.ValueType} or null
     */
    getValueTypeObject: function (value) {
        if (typeof value === undefined || value == null)
            return null;
        /*
        if (!Number.isInteger(value) && Number.isFinite(value)) {
            return SMCApi.ValueType.LONG;
        } else if (Number.isInteger(value)) {
            return SMCApi.ValueType.DOUBLE;
         */
        if (value instanceof Number || typeof (value) === "number") {
            const intValue = Math.round(value);
            return value === intValue ? SMCApi.ValueType.LONG : SMCApi.ValueType.DOUBLE;
        } else if (Object.prototype.toString.call(value) === "[object String]") {
            return SMCApi.ValueType.STRING;
        } else if (Array.isArray(value)) {
            return SMCApi.ValueType.BYTES;
        } else if (value === false || value === true) {
            return SMCApi.ValueType.BOOLEAN;
        } else if (value instanceof SMCApi.ObjectArray) {
            return SMCApi.ValueType.OBJECT_ARRAY;
        } else {
            return null;
        }
    },

    /**
     *
     * @param [value]
     * @returns {SMCApi.ObjectType} or null
     */
    getObjectType: function (value) {
        if (typeof value === undefined || value == null)
            return null;
        if (value instanceof SMCApi.ObjectElement) {
            return SMCApi.ObjectType.OBJECT_ELEMENT;
        } else {
            return SmcUtils.convertTo(SmcUtils.getValueTypeObject(value));
        }
    },

    /**
     *
     * @param {SMCApi.ValueType} [type]
     * @returns {SMCApi.ObjectType} or null
     */
    convertTo: function (type) {
        if (typeof type === undefined || type == null)
            return null;
        switch (type) {
            case SMCApi.ValueType.STRING:
                return SMCApi.ObjectType.STRING;
            case SMCApi.ValueType.BYTE:
                return SMCApi.ObjectType.BYTE;
            case SMCApi.ValueType.SHORT:
                return SMCApi.ObjectType.SHORT;
            case SMCApi.ValueType.INTEGER:
                return SMCApi.ObjectType.INTEGER;
            case SMCApi.ValueType.LONG:
                return SMCApi.ObjectType.LONG;
            case SMCApi.ValueType.BIG_INTEGER:
                return SMCApi.ObjectType.BIG_INTEGER;
            case SMCApi.ValueType.FLOAT:
                return SMCApi.ObjectType.FLOAT;
            case SMCApi.ValueType.DOUBLE:
                return SMCApi.ObjectType.DOUBLE;
            case SMCApi.ValueType.BIG_DECIMAL:
                return SMCApi.ObjectType.BIG_DECIMAL;
            case SMCApi.ValueType.BYTES:
                return SMCApi.ObjectType.BYTES;
            case SMCApi.ValueType.BOOLEAN:
                return SMCApi.ObjectType.BOOLEAN;
            case SMCApi.ValueType.OBJECT_ARRAY:
                return SMCApi.ObjectType.OBJECT_ARRAY;
        }
        return null;
    },

    /**
     *
     * @param {SMCApi.ObjectType} [type]
     * @returns {SMCApi.ValueType} or null
     */
    convertToValueType: function (type) {
        if (typeof type === undefined || type == null)
            return null;
        switch (type) {
            case SMCApi.ObjectType.STRING:
                return SMCApi.ValueType.STRING;
            case SMCApi.ObjectType.BYTE:
                return SMCApi.ValueType.BYTE;
            case SMCApi.ObjectType.SHORT:
                return SMCApi.ValueType.SHORT;
            case SMCApi.ObjectType.INTEGER:
                return SMCApi.ValueType.INTEGER;
            case SMCApi.ObjectType.LONG:
                return SMCApi.ValueType.LONG;
            case SMCApi.ObjectType.BIG_INTEGER:
                return SMCApi.ValueType.BIG_INTEGER;
            case SMCApi.ObjectType.FLOAT:
                return SMCApi.ValueType.FLOAT;
            case SMCApi.ObjectType.DOUBLE:
                return SMCApi.ValueType.DOUBLE;
            case SMCApi.ObjectType.BIG_DECIMAL:
                return SMCApi.ValueType.BIG_DECIMAL;
            case SMCApi.ObjectType.BYTES:
                return SMCApi.ValueType.BYTES;
            case SMCApi.ObjectType.BOOLEAN:
                return SMCApi.ValueType.BOOLEAN;
            case SMCApi.ObjectType.OBJECT_ARRAY:
                return SMCApi.ValueType.OBJECT_ARRAY;
        }
        return null;
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param ecId {number}
     * @param params {object[]}
     * @param {number} [maxWorkIntervalMs]
     * @param {number} [sleepTimeMs]
     * @returns {number}
     */
    executeParallel: function (executionContextTool, ecId, params, maxWorkIntervalMs, sleepTimeMs) {
        maxWorkIntervalMs = maxWorkIntervalMs || 0;
        sleepTimeMs = sleepTimeMs || 50;
        const threadId = executionContextTool.getFlowControlTool().executeParallel(SmcUtils.CommandType.EXECUTE, [ecId], params, 0, maxWorkIntervalMs > 0 ? (maxWorkIntervalMs / 1000) : 0);
        SmcUtils.waitThread(executionContextTool, threadId, sleepTimeMs);
        return threadId;
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param threadId {number}
     * @param {number} [sleepTime]
     */
    waitThread: function (executionContextTool, threadId, sleepTime) {
        if (typeof sleepTime === undefined || sleepTime == null || sleepTime < 1)
            sleepTime = 1;
        if (typeof Packages !== undefined) {
            do {
                try {
                    Packages.java.lang.Thread.sleep(sleepTime);
                } catch (e) {
                }
            } while (!executionContextTool.isNeedStop() && executionContextTool.getFlowControlTool().isThreadActive(threadId));
        }
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param threadId {number}
     * @param {number} [sleepTime]
     */
    waitThreadAndRelease: function (executionContextTool, threadId, sleepTime) {
        SmcUtils.waitThread(executionContextTool, threadId, sleepTime);
        executionContextTool.getFlowControlTool().releaseThread(threadId);
    },

    /**
     *
     * @param actions {SMCApi.IAction[]}
     * @returns {SMCApi.IAction} or undefined
     */
    getFirstActionWithData: function (actions) {
        for (let a of actions) {
            if (SmcUtils.hasDataAction(a))
                return a;
        }
        // return actions.find(a => SmcUtils.hasDataAction(a));
        return null;
    },

    /**
     *
     * @param commands {SMCApi.ICommand[]}
     * @returns {SMCApi.IAction} or undefined
     */
    getFirstActionWithDataFromCommands: function (commands) {
        return SmcUtils.getFirstActionWithData(commands.map(c => c.getActions()).flat());
    },

    /**
     *
     * @param actions {SMCApi.IAction[]}
     * @returns {SMCApi.IAction} or undefined
     */
    getLastActionWithData: function (actions) {
        const arr = actions.filter(a => SmcUtils.hasDataAction(a));
        return arr && arr.length > 0 ? arr[arr.length - 1] : null;
    },

    /**
     *
     * @param commands {SMCApi.ICommand[]}
     * @returns {SMCApi.IAction} or undefined
     */
    getLastActionWithDataFromCommands: function (commands) {
        return SmcUtils.getLastActionWithData(commands.map(c => c.getActions()).flat());
    },

    /**
     *
     * @param actions {SMCApi.IAction[]}
     * @returns {SMCApi.IAction} or undefined
     */
    getFirstActionExecuteWithMessages: function (actions) {
        for (let a of actions) {
            if (a.getType() === SMCApi.ActionType.EXECUTE && a.getMessages().length > 0)
                return a;
        }
        // return actions.find(a => a.getType() === SMCApi.ActionType.EXECUTE && a.getMessages().length > 0);
        return null;
    },

    /**
     *
     * @param commands {SMCApi.ICommand[]}
     * @returns {SMCApi.IAction} or undefined
     */
    getFirstActionExecuteWithMessagesFromCommands: function (commands) {
        return SmcUtils.getFirstActionExecuteWithMessages(commands.map(c => c.getActions()).flat());
    },

    /**
     *
     * @param actions {SMCApi.IAction[]}
     * @returns {SMCApi.IAction} or undefined
     */
    getLastActionExecuteWithMessages: function (actions) {
        const arr = actions.filter(a => a.getType() === SMCApi.ActionType.EXECUTE && a.getMessages().length > 0);
        return arr && arr.length > 0 ? arr[arr.length - 1] : null;
    },

    /**
     *
     * @param commands {SMCApi.ICommand[]}
     * @returns {SMCApi.IAction} or undefined
     */
    getLastActionExecuteWithMessagesFromCommands: function (commands) {
        return SmcUtils.getLastActionExecuteWithMessages(commands.map(c => c.getActions()).flat());
    },

    /**
     *
     * @param actions {SMCApi.IAction[]}
     * @returns {SMCApi.ObjectArray} or undefined
     */
    getElements: function (actions) {
        let action = SmcUtils.getFirstActionWithData(actions);
        if (action == null)
            return undefined;
        let objectArray = SmcUtils.getObjectArray(action.getMessages()[0]);
        return SmcUtils.isArrayContainObjectElements(objectArray) ? objectArray : undefined;
    },

    /**
     *
     * @param actions {SMCApi.IAction[]}
     * @returns {SMCApi.ObjectElement} or undefined
     */
    getElement: function (actions) {
        const objectArray = SmcUtils.getElements(actions);
        return objectArray != null && objectArray.size() > 0 ? objectArray.get(0) : undefined;
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param id {number}
     * @param params {object[]}
     * @returns {SMCApi.ObjectElement} or undefined
     */
    executeAndGetElement: function (executionContextTool, id, params) {
        return SmcUtils.getElement(SmcUtils.executeAndGet(executionContextTool, id, params));
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param id {number}
     * @param params {object[]}
     * @returns {SMCApi.ObjectArray} or undefined
     */
    executeAndGetArrayElements: function (executionContextTool, id, params) {
        return SmcUtils.getElements(SmcUtils.executeAndGet(executionContextTool, id, params));
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param id {number}
     * @param params {object[]}
     * @returns {SMCApi.IMessage[]} or undefined
     */
    executeAndGetMessages: function (executionContextTool, id, params) {
        const action = SmcUtils.getFirstActionWithData(SmcUtils.executeAndGet(executionContextTool, id, params));
        return action != null ? action.getMessages() : undefined;
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param id {number}
     * @param params {object[]}
     * @returns {SMCApi.IAction[]}
     */
    executeAndGet: function (executionContextTool, id, params) {
        executionContextTool.getFlowControlTool().executeNow(SMCApi.CommandType.EXECUTE, id, params);
        return executionContextTool.getFlowControlTool().getMessagesFromExecuted(id);
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param id {number}
     * @param params {object[]}
     * @returns {SMCApi.ObjectArray} or undefined
     */
    executeParallelAndGetArrayElements: function (executionContextTool, id, params) {
        return SmcUtils.getElements(SmcUtils.executeParallelAndGet(executionContextTool, id, params));
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param id {number}
     * @param params {object[]}
     * @returns {SMCApi.ObjectElement} or undefined
     */
    executeParallelAndGetElement: function (executionContextTool, id, params) {
        return SmcUtils.getElement(SmcUtils.executeParallelAndGet(executionContextTool, id, params));
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param id {number}
     * @param params {object[]}
     * @returns {SMCApi.IMessage[]} or undefined
     */
    executeParallelAndGetMessages: function (executionContextTool, id, params) {
        const lst = SmcUtils.executeParallelAndGet(executionContextTool, id, params)
            .filter(a => SmcUtils.hasDataAction(a))
            .map(a => a.getMessages());
        // .find(a => true);
        return lst && lst.length > 0 ? lst[0] : null;
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param id {number}
     * @param params {object[]}
     * @returns {SMCApi.IAction[]}
     */
    executeParallelAndGet: function (executionContextTool, id, params) {
        const threadId = SmcUtils.executeParallel(executionContextTool, id, params);
        const data = executionContextTool.getFlowControlTool().getMessagesFromExecuted(threadId, id);
        executionContextTool.getFlowControlTool().releaseThread(threadId);
        return data;
    },

    /**
     *
     * @param t {Error}
     * @returns {string}
     */
    getStackTraceAsString: function (t) {
        return t.stack;
    },

    /**
     *
     * @param t {Error}
     * @returns {string}
     */
    getErrorMessageOrClassName: function (t) {
        return typeof t !== undefined && t != null && typeof t.message !== undefined && t.message != null && t.message.length > 0 ? t.message : (typeof t !== undefined && t != null ? t.name : "");
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @returns {Array.<Array.<Array.<SMCApi.IMessage>>>}
     */
    getMessages: function (executionContextTool) {
        /** @type {Array.<Array.<Array.<SMCApi.IMessage>>>} */
        const result = [];
        for (let i = 0; i < executionContextTool.countSource(); i++) {
            const actions = executionContextTool.getMessages(i);
            /** @type {Array.<Array.<SMCApi.IMessage>>} */
            const resultActions = [];
            for (let j = 0; j < actions.length; j++) {
                const messages = actions[j].getMessages();
                if (messages.length > 0)
                    resultActions.push(messages);
            }
            result.push(resultActions);
        }
        return result;
    },

    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @returns {(SMCApi.IMessage[])[]}
     */
    getLastMessages: function (executionContextTool) {
        /** @type {(SMCApi.IMessage[])[]} */
        const result = [];
        for (let i = 0; i < executionContextTool.countSource(); i++) {
            const actions = executionContextTool.getMessages(i);
            if (actions.length > 0) {
                const action = actions[actions.length - 1];
                if (SmcUtils.hasDataAction(action))
                    result.push(action.getMessages());
            }
        }
        return result;
    },
    /**
     *
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @returns {SMCApi.IMessage[]}
     */
    getMessagesJoin: function (executionContextTool) {
        /** @type {SMCApi.IMessage[]} */
        const result = [];
        for (let i = 0; i < executionContextTool.countSource(); i++) {
            const actions = executionContextTool.getMessages(i);
            if (actions.length > 0) {
                const action = actions[actions.length - 1];
                if (SmcUtils.hasDataAction(action))
                    SmcUtils.arrayExtend(result, action.getMessages());
            }
        }
        return result;
    },

    /**
     * This callback type is called `CheckedConsumerMessages` and is displayed as a global symbol.
     *
     * @callback SmcUtils.CheckedConsumerMessages
     * @param {number} id
     * @param {SMCApi.IMessage[]} obj
     */
    /**
     * This callback type is called `CheckedConsumerAny` and is displayed as a global symbol.
     *
     * @callback SmcUtils.CheckedConsumerAny
     * @param {number} id
     * @param {object} obj
     */
    /**
     * This callback type is called `CheckedConsumerMessagesList` and is displayed as a global symbol.
     *
     * @callback SmcUtils.CheckedConsumerMessagesList
     * @param {number} id
     * @param {(SMCApi.IMessage[])[]} obj
     */

    /**
     *
     * @param configurationTool {SMCApi.ConfigurationTool}
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param func {SmcUtils.CheckedConsumerMessages}
     */
    processMessages: function (configurationTool, executionContextTool, func) {
        for (let i = 0; i < executionContextTool.countSource(); i++)
            SmcUtils.processMessagesInEc(configurationTool, executionContextTool, i, func);
    },

    /**
     *
     * @param configurationTool {SMCApi.ConfigurationTool}
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param id {number}
     * @param func {SmcUtils.CheckedConsumerMessages}
     */
    processMessagesInEc: function (configurationTool, executionContextTool, id, func) {
        if (executionContextTool.countSource() > id) {
            executionContextTool.getMessages(id).forEach(a => SmcUtils.executor(configurationTool, executionContextTool, id, SmcUtils.arrayExtend([], a.getMessages()), func));
        } else {
            SmcUtils.executor(configurationTool, executionContextTool, id, null, func);
        }
    },

    /**
     *
     * @param configurationTool {SMCApi.ConfigurationTool}
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param id {number}
     * @param messages {object}
     * @param func {SmcUtils.CheckedConsumerAny}
     */
    executor: function (configurationTool, executionContextTool, id, messages, func) {
        try {
            func(id, messages);
        } catch (e) {
            executionContextTool.addError(SmcUtils.getErrorMessageOrClassName(e));
            configurationTool.loggerWarn(SmcUtils.getStackTraceAsString(e));
        }
    },

    /**
     *
     * @param configurationTool {SMCApi.ConfigurationTool}
     * @param executionContextTool {SMCApi.ExecutionContextTool}
     * @param func {SmcUtils.CheckedConsumerMessagesList}
     */
    processMessagesAll: function (configurationTool, executionContextTool, func) {
        /** @type {(SMCApi.IMessage[])[]} */
        const data = [];
        for (let i = 0; i < executionContextTool.countSource(); i++) {
            let action = SmcUtils.getLastActionWithData(executionContextTool.getMessages(i));
            data.push(action != null ? SmcUtils.arrayExtend([], action.getMessages()) : []);
        }
        SmcUtils.executor(configurationTool, executionContextTool, -1, data, func);
    },

    /**
     *
     * @param objectArray {SMCApi.ObjectArray}
     * @returns {SMCApi.ObjectElement[]}
     */
    toList: function (objectArray) {
        if (!SmcUtils.isArrayContainObjectElements(objectArray))
            return [];
        /** @type {SMCApi.ObjectElement[]} */
        const list = [];
        for (let i = 0; i < objectArray.size(); i++)
            list.push(objectArray.get(i));
        return list;
    },


    /**
     *
     * @param actions {SMCApi.IAction[]}
     * @returns {SMCApi.IMessage[]}
     */
    getLastActionWithDataList: function (actions) {
        let action = SmcUtils.getLastActionWithData(actions);
        return action != null ? SmcUtils.arrayExtend([], action.getMessages()) : [];
    },

    /**
     *
     * @param actions {SMCApi.IAction[]}
     * @returns {SMCApi.IMessage[]}
     */
    getFirstActionWithDataList: function (actions) {
        let action = SmcUtils.getFirstActionWithData(actions);
        return action != null ? SmcUtils.arrayExtend([], action.getMessages()) : [];
    },

    /**
     *
     * @param array1 {object[]}
     * @param array2 {object[]}
     * @return {*}
     */
    arrayExtend: function (array1, array2) {
        array2.forEach(o => array1.push(o));
        return array1;
    },

    /**
     * convertFromObjectArray
     * @param objectArray {SMCApi.ObjectArray}
     * @param silent {boolean}
     * @return {Object[]}
     */
    convertFromObjectArray: function (objectArray, silent) {
        let result = [];
        if (objectArray == null || !(objectArray instanceof SMCApi.ObjectArray) || objectArray.size() === 0)
            return result;
        try {
            if (objectArray.isSimple()) {
                result = SmcUtils.toList(objectArray);
            } else if (SmcUtils.isArrayContainArrays(objectArray)) {
                for (let i = 0; i < objectArray.size(); i++) {
                    /** @type {SMCApi.ObjectArray} */
                    let arr = objectArray.get(i);
                    if (arr.isSimple())
                        result.append(SmcUtils.toList(arr));
                }
            } else if (SmcUtils.isArrayContainObjectElements(objectArray)) {
                result = SmcUtils.toList(objectArray)
                    .map(o => SmcUtils.convertFromObjectElement(o, silent))
                    .filter(o => o != null);
            }

        } catch (e) {
            if (!silent)
                throw e
        }
        return result;
    },

    /**
     * convertFromObjectElement
     * @param objectElement {SMCApi.ObjectElement}
     * @param silent {boolean}
     * @return {Object}
     */
    convertFromObjectElement: function (objectElement, silent) {
        let result = {};
        if (objectElement == null || !(objectElement instanceof SMCApi.ObjectElement))
            return result;
        try {
            for (let field of objectElement.getFields()) {
                let typev = field.getType();
                let value = field.getValue();
                if (value != null) {
                    if (typev === SMCApi.ObjectType.OBJECT_ARRAY) {
                        value = SmcUtils.convertFromObjectArray(value, silent);
                    } else if (typev === SMCApi.ObjectType.OBJECT_ELEMENT) {
                        value = SmcUtils.convertFromObjectElement(value, silent)
                    }
                }
                result[field.getName()] = value;
            }
        } catch (e) {
            if (!silent)
                throw e
        }
        return result;
    },

    /**
     * convertToObjectArray
     * @param arr {Object[]}
     * @param silent {boolean}
     * @return {SMCApi.ObjectArray}
     */
    convertToObjectArray: function (arr, silent) {
        const result = new SMCApi.ObjectArray();
        if (arr == null || arr.length === 0)
            return result;
        try {
            const type = SmcUtils.convertTo(SmcUtils.getValueTypeObject(arr[0]));
            if (type != null) {
                result.type = type;
                arr.forEach(v => result.add(v));
            } else {
                arr.forEach(v => result.add(SmcUtils.convertToObjectElement(v, silent)));
            }
        } catch (e) {
            if (!silent)
                throw e
        }
        return result;
    },

    /**
     * convertToObjectElement
     * @param obj {Object}
     * @param silent {boolean}
     * @return {SMCApi.ObjectElement}
     */
    convertToObjectElement: function (obj, silent) {
        const result = new SMCApi.ObjectElement();
        if (obj == null)
            return result;
        try {
            for (const prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    let value = obj[prop];
                    let type = SmcUtils.convertTo(SmcUtils.getValueTypeObject(value));
                    if (value != null && (type == null || type === SMCApi.ObjectType.BYTES)) {
                        if (Array.isArray(value)) {
                            value = SmcUtils.convertToObjectArray(value, silent);
                            type = SMCApi.ObjectType.OBJECT_ARRAY;
                        } else {
                            value = SmcUtils.convertToObjectElement(value, silent);
                            type = SMCApi.ObjectType.OBJECT_ELEMENT;
                        }
                    }
                    result.getFields().push(new SMCApi.ObjectField(prop, value, type));
                }
            }
        } catch (e) {
            if (!silent)
                throw e
        }
        return result;
    }

}