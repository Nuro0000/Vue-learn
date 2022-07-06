//为对象添加静态读写属性
export function def(val,key,ob,enumerable){
  Object.defineProperty(val,key,{
    value:ob,
    enumerable,
    writable:true,
    configurable:true
  })
}