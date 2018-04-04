interface ObjectWithProperties {
  [key: string]: any
}

/**
 * Проверяет, что переданный объект является "плоским" (т.е. созданным с помощью "{}"
 * или "new object").
 */
function isPlainObject(obj: any) {
  if (ObjectMethods.toString.call(obj) !== '[object Object]') {
    return false;
  }
  const prototype: Object = Object.getPrototypeOf(obj);
  return prototype === null ||
    prototype === Object.prototype;
}

/**
 * Копирует перечислимые свойства одного или нескольких объектов в целевой объект.
 */
function extend(deep: boolean, target: object, ...sources: object[]): object;
function extend(target: object, ...sources: object[]): object;

function extend(deepOrTarget: any, targetOrFirstSource: object, ...restSources: object[] ): object {
  let deep: Boolean;
  let target: ObjectWithProperties;
  let sources: object[];
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
    const source: ObjectWithProperties = sources[i];
    
    for (const key in source) {
      if (ObjectMethods.hasOwnProperty.call(source, key)) {
        const val:any = source[key];
        const isArray:boolean = val && Array.isArray(val);
        const isValPlainObject:boolean = isPlainObject(val);
        
        if (deep && val && (isValPlainObject || isArray)) {
          let clone:object;
          const src:any = target[key];
          if (isArray) {
            clone = src && Array.isArray(src) ? src : [];
          } else {
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
};

 console.log(extend({a: 4}, {a: 2}, [333, 4444] ))

