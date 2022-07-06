
var uid = 0  //每个实例绑定一个独有的id

export default class Dep{
  constructor(){
    console.log('dep新建实例');
    this.id = uid++;
    //储存订阅者(subs:subscribes)--Watcher实例
    this.subs = [];
  }
  //添加订阅
  addSub(sub){
    this.subs.push(sub);
  }
  //添加依赖
  depend(){
    if(Dep.target){
      this.addSub(Dep.target);
    }
  }
  //通知更新
  nodify(){
    console.log('触发更新(nodify)了');
    //浅克隆一份订阅者集合
    const subs = this.subs.slice();
    //遍历
    for(let sub of subs){
      sub.update();
    }
  }
}

//收集目标:实例化Watcher时会赋值Dep.target = Watcher实例
Dep.target = null