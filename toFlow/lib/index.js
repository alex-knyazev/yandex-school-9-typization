const hasOwnProperty = Object.prototype.hasOwnProperty;
const toString = Object.prototype.toString;

/**
 * Проверяет, что переданный объект является "плоским" (т.е. созданным с помощью "{}"
 * или "new object").
 */
function isPlainObject(obj) {
  if (toString.call(obj) !== '[object Object]') {
    return false;
  }
  const prototype = Object.getPrototypeOf(obj);
  return prototype === null || prototype === Object.prototype;
}

const extend = function (deepOrTarget, targetOrFirstSource, ...restSources) {
  let deep;
  let target;
  let sources;
  if (typeof deepOrTarget === 'boolean') {
    deep = deepOrTarget;
    target = targetOrFirstSource;
    sources = restSources;
  } else {
    deep = false;
    target = deepOrTarget;
    sources = [targetOrFirstSource, ...restSources];
  }

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];

    for (const key in source) {
      if (hasOwnProperty.call(source, key)) {
        const val = source[key];
        const isArray = val && Array.isArray(val);
        const isValPlainObject = isPlainObject(val);
        if (deep && val && (isValPlainObject || isArray)) {
          let clone;
          const src = target[key];
          if (isArray) {
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }
          target[key] = extend(deep, clone, val);
        } else {
          target[key] = val;
        }
      }
    }
  }

  return target;
};

const result = extend({ a: 4 }, { d: 2 }, { b: 3 });
console.log(result);

const result2 = extend(true, { a: 4 }, { f: 222, c: 333 }, { d: 2 }, { b: 3 });
console.log(result2);

const result3 = extend(true, [22, 33], { a: 2 });
console.log(result3);