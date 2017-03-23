
/**
 * 查询结果返回类
 */

module.exports = class Response {
    constructor() {

    }
    set Code(value) {
        this._Code = value;
    }
    get Code() {
        return this._Code;
    }

    set Message(Message) {
        this._Message = Message;
    }

    get Message() {
        return this._Message;
    }

    set data(value) {
        this._data=value;
    }

    get data() {
        return this._data;
    }
};

