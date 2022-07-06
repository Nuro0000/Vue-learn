import observe from "../observe/observe";
import Watcher from "../observe/Watcher";
import proxy from "./proxy";

//数据初始化
export default function initData(vm){
  const {data} = vm.$options;
  let _data = vm._data = {};
  if(data){
    _data = vm._data = typeof data === 'function'?data():data;
  }
  //完成代理
  for(let key in _data){
    proxy(vm,'_data',key)
  }
  //响应式添加
  observe(vm._data);
  // let update = function (){
  //   return vm._update(vm._render())
  // }
  // new Watcher(vm,'_data',update);
}