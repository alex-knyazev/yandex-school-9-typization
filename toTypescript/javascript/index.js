var ObjectMethods;
(function (ObjectMethods) {
    ObjectMethods.hasOwnProperty = Object.prototype.hasOwnProperty;
    ObjectMethods.toString = Object.prototype.toString;
})(ObjectMethods || (ObjectMethods = {}));
/**
 * Проверяет, что переданный объект является "плоским" (т.е. созданным с помощью "{}"
 * или "new object").
 */
function isPlainObject(obj) {
    if (ObjectMethods.toString.call(obj) !== '[object Object]') {
        return false;
    }
    var prototype = Object.getPrototypeOf(obj);
    return prototype === null ||
        prototype === Object.prototype;
}
function extend(deepOrTarget, targetOrFirstSource) {
    var restSources = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        restSources[_i - 2] = arguments[_i];
    }
    var deep;
    var target;
    var sources;
    if (typeof deepOrTarget === 'boolean') {
        deep = deepOrTarget;
        target = targetOrFirstSource;
        sources = restSources;
    }
    else {
        deep = false;
        target = deepOrTarget;
        sources = [targetOrFirstSource].concat(restSources);
    }
    for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        for (var key in source) {
            if (ObjectMethods.hasOwnProperty.call(source, key)) {
                var val = source[key];
                var isArray = val && Array.isArray(val);
                var isValPlainObject = isPlainObject(val);
                if (deep && val && (isValPlainObject || isArray)) {
                    var clone = void 0;
                    var src = target[key];
                    if (isArray) {
                        clone = src && Array.isArray(src) ? src : [];
                    }
                    else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[key] = extend(deep, clone, val);
                }
                else {
                    target[key] = val;
                }
            }
        }
    }
    return target;
}
;
console.log(extend(true, { a: 22 }, { b: 333 }, {}));
