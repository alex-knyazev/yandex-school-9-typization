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

type ObjectWithStringKey  = { [string]: any };
type ArrayWithAny = Array<any>;

type FunctionType =
  & ((ObjectWithStringKey|ArrayWithAny, ...Array<ObjectWithStringKey|ArrayWithAny> ) => ObjectWithStringKey)
  & ((boolean, ObjectWithStringKey|ArrayWithAny, ...Array<ObjectWithStringKey|ArrayWithAny>) => ObjectWithStringKey)

const extend: FunctionType = function(deepOrTarget: any, targetOrFirstSource: any, ...restSources: any ): ObjectWithStringKey {
  let deep: boolean;
  let target: ObjectWithStringKey;
  let sources: Array<ObjectWithStringKey>;
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
          let clone:any;
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

const result:ObjectWithStringKey = extend({a: 4}, {d: 2}, {b: 3});
console.log(result)


const result2:ObjectWithStringKey = extend(true, {a: 4}, {f: 222, c:  333}, {d: 2}, {b: 3});
console.log(result2);


const result3:ObjectWithStringKey = extend(true, [22, 33], {a: 2});
console.log(result3);