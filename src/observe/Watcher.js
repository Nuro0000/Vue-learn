import Dep from "./Dep";

var uid = 0;
export default class Watcher {
  constructor(target, propstr, cb) {       //监听对象,属性,属性更新时要触发的回调(更新dom)
    this.id = uid++;
    this.target = target;
    this.getter = parsePath(propstr);   //解析属性(针对连点属性)路径函数
    this._cb = cb;
    this.value = this.get();
  }
  update () {
    //触发更新
    this.run();
  }

  get () {
    //进入依赖收集阶段: 将全局Dep.target指向该Watcher实例
    Dep.target = this;
    const obj = this.target;

    var value;
    try {
      value = this.getter(obj);   //获取监听的属性--触发连锁收集依赖
    } finally {
      //收集结束后target"让位",防止重复收集
      Dep.target = null;
    }
    return value;
  }
  run () {
    const value = this.get();
    if (value !== this.value || typeof value == 'object') {
      const oldValue = this.value;
      this.value = value;
      this._cb.call(this.target, value, oldValue);
    }
  }
}

function parsePath (propstr) {
  var propArr = propstr.split('.');
  return (obj) => {
    for (let item of propArr) {
      if (!obj) return;   //不存在则直接返回
      //★这个过程不断读取数据,触发属性get,也就收集了依赖
      //沿途的属性都收集了该依赖(Watcher实例),任何一个改动时都会提醒该实例触发更新(执行回调)
      obj = obj[item];
    }
    return obj;
  }
}
//例：var o = {a:{b:{c:{d:123}}}},fn = parsePath(a.b.c.d)
//此后传入实例0即可得到对应属性：fn(o) == 123;
//上面的parsePath函数的做法称为：JS函数柯里化:
//把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数