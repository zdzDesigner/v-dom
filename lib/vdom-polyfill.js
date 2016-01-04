if (!Object.create) {
    Object.create = function(o) {
        function F() {}
        F.prototype = o
        var newf = new F()
        return newf
    }
}

if (!Object.keys) {
    Object.keys = function(o) {
        var a = []
        for (var i in o)
            if (o.hasOwnProperty(i)) a.push(i)
        return a
    }
}



function __objToStr(o) {
    return Object.prototype.toString.call(o);
};
exports.__objToStr = __objToStr;

function __isDate(o) {
    return typeof o === 'object' && __objToStr(o) === '[object Date]';
};
exports.__isDate = __isDate;

function __isArray(o) {
    return typeof o === 'object' && __objToStr(o) === '[object Array]';
};
exports.__isArray = __isArray;

function __isRegExp(o) {
    return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
};
exports.__isRegExp = __isRegExp;