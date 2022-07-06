import observe from "./observe";
import { def } from "../utils/utils";
import protoArgument from "./protoArgument";
import Dep from "./Dep";

/* 
监听类--为对象属性添加监听标识，并深度遍历内部属性
 */
export default class Observer {
  constructor(data) {
    //每一个Observer实例都有一个dep(即每个对象(/数组)数据都绑定了一个dep实例)
    //在这里的dep绑定主要是为了暴露给数组使用的;
    //而对象属性的dep是在defineReactive中(通过闭包)绑定的。
    this.dep = new Dep();  //注意不是data的属性

    //为对象添加__ob__属性标识，不会处理到非对象，在observe中会判别;
    //不被判别的第一个元素一定是vue的data对象;
    //将data对象的__ob__属性(通过this)指向创建的实例(所以上面实例的dep属性就成了data.__ob__的dep属性)
    def(data, '__ob__', this, false);
    //分类处理
    if (Array.isArray(data)) {
      //数组处理
      protoArgument(data);      //先进行原型方法覆盖
      this.forArray(data);
    } else {
      //对象处理
      this.walk(data);
    }
  }
  //内部(可枚举)属性依次添加监听（内部也会调用Observer，形成递归）
  walk (val) {
    for (let key in val) {
      defineReactive(val, key);
    }
  }
  //为数组内部的属性的变化添加监听
  forArray (val) {
    for (let i in val) {
      observe(val[i]);
      //为什么这里不是用defineReactive?
      //因为数组不是为每一个下标都添加监听,而是直接监听内部属性变化;
      //由于数组常常批量操作,如果监听下标的话非常消耗资源。
    }
  }
}

//设置监听(当前属性)
export function defineReactive (data, key, val) { //监听对象,监听字段,预设值(中转变量)
  //依赖收集器--每个属性(data[key])都有一个(看这个函数的闭包),get时收集该属性的依赖,set时提醒他们更新
  const dep = new Dep;

  if (arguments.length == 2) {   //没有预设值就取对象的key值
    val = data[key];
  }
  //为子属性添加监听(按照逻辑不是应该放在最后面？--因为也要为子属性收集当前依赖)
  //子属性的更新不仅涉及到自身的依赖更新,也属于父级的更新,所以也要通知父级的依赖。
  let childOb = observe(val);

  Object.defineProperty(data, key, {
    //可枚举
    enumerable: true,
    //可配置(如delete)
    configurable: true,
    get () {
      console.log('要读取 属性' + key)
      //收集依赖(如果仍处于收集阶段)
      if (Dep.target) {
        dep.depend();
        //为子属性收集该依赖
        if (childOb) {
          childOb.dep.depend();
        }
      }
      return val;
    },
    set (newValue) {
      console.log('要给属性' + key + '赋值')
      if (val === newValue) return
      //对于新设的值，也要为其添加监听
      val = newValue;
      observe(newValue);
      //发布订阅模式--提醒更新
      dep.nodify();
    }
  })

}





