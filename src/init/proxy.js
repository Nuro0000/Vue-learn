export default function proxy(target,sourceKey,key){
  Object.defineProperty(target,key,{
    get(){
      //访问 vm.t --得到--> vm._data.t
      return target[sourceKey][key];
    },
    set(newKey){
      target[sourceKey][key] = newKey;
    }
  })
}