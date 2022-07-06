import Observer from "./Observer";
/* 
  为对象属性添加深层监听,原始属性不需处理
  --对象的本层值已经在defineReactive中添加了监听
 */
export default function observe(val){
  if(typeof(val)!=='object')return;   //原始值不存在深层监听
  //获取val的__ob__属性--本身没有就先为其添加。--即判断数据是否为响应式;不是就添加响应式
  let ob = val.__ob__?val.__ob__:new Observer(val);

  //返回这个ob可以让其他实例获取Observer类的属性(主要是dep)和方法。
  return ob;
}