
interface IObjectStringKey {
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
function extend(deep: boolean, target: IObjectStringKey, ...sources: IObjectStringKey[]): IObjectStringKey;
function extend(target: IObjectStringKey, ...sources: IObjectStringKey[]): IObjectStringKey;

function extend(deepOrTarget: any, targetOrFirstSource: IObjectStringKey, ...restSources: IObjectStringKey[] ): IObjectStringKey {
  let deep: Boolean;
  let target: IObjectStringKey;
  let sources: IObjectStringKey[];
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
    const source: IObjectStringKey = sources[i];
    
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

 console.log(extend(true, {a: 22}, { b: 333}, {}))

