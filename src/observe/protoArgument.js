import { def } from "../utils/utils";

//获取数组原型
const arrProto = Array.prototype;
//建立一个继承自数组原型的对象，用于改写数组方法
var arrayMethods = Object.create(arrProto);
//方法集
const arrayMethodsList = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'deverse',
  'splice'
]

for (let methodName of arrayMethodsList) {
  //保留原始方法
  const original = arrProto[methodName];
  //定义新方法
  def(arrayMethods, methodName, function (...args) {
    //将该数组的__ob__取出来，该__ob__必然被添加过，因为数组不可能在顶层
    //当扫描到一个属性时，先进行了__ob__标记才继续深层分析(判断是不是数组)
    const ob = this.__ob__;
    //出发原始方法实现基本功能--并保存返回值(有的话要返回)
    let result = original.apply(this, args)
    //保存新增数组项
    let inserted = []
    switch (methodName) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':         //splice的参数为 [开始位置,截取长度,新增数据]
        inserted = args.slice(2);
    }
    //将新增数据也变成响应式
    if (inserted) {
      ob.forArray(inserted);
    }
    //发布订阅
    ob.def.notify();
    return result;   //返回原始操作结果(对于pop等来讲是必要的)
  }, false)
}

export default function protoArgument(data){
  //将方法集放置在val数组的原型上(原型覆盖)
  Object.setPrototypeOf(data, arrayMethods);
}