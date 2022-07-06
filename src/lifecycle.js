import patch from "./vdom/patch";

function mountComponent(vm){

  vm._update(vm._render());  //实现dom更新(每次更新时传入最新的vm实例,使数据变化得到响应)
}

function lifecycleMixin(Vue){
  //更新视图方法定义
  Vue.prototype._update = function (vnode){
    patch(this.$el,vnode);
  }
}

export{
  lifecycleMixin,
  mountComponent
}