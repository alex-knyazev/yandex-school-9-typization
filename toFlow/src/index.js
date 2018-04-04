// @flow

const hasOwnProperty: (key:string) => boolean = Object.prototype.hasOwnProperty;
const toString: (obj:any) => string = Object.prototype.toString;

/**
 * Проверяет, что переданный объект является "плоским" (т.е. созданным с помощью "{}"
 * или "new object").
 */
function isPlainObject(obj: any) {
  if (toString.call(obj) !== '[object Object]') {
    return false;
  }
  const prototype: Object = Object.getPrototypeOf(obj);
  return prototype === null ||
    prototype === Object.prototype;
}

type FunctionType =
  & (({}|[], ...Array<{}|[]> ) => {})
  & ((boolean, {}|[], ...Array<{}|[]>) => {})

const extend: FunctionType = function(deepOrTarget: any, targetOrFirstSource: any, ...restSources: any ): {} {
  let deep: boolean;
  let target: {};
  let sources: Array<{}>;
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
    const source: {} = sources[i];
    
    for (const key in source) {
      if (hasOwnProperty.call(source, key)) {
        const val:any = source[key];
        const isArray:boolean = val && Array.isArray(val);
        const isValPlainObject:boolean = isPlainObject(val);
        if (deep && val && (isValPlainObject || isArray)) {
          let clone: any;
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

const result = extend({a: 4}, {d: 2}, {b: 3});

const result2 = extend(true, {a: 4}, {f: 222, c:  333}, {d: 2}, {b: 3});

