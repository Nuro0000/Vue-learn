import {createVnode,createTextVnode} from './vnode';

//方法混入--实现render函数(生成虚拟节点)
function renderMixin(Vue){
  Vue.prototype._c = function (){
    return createVnode(...arguments);
  }
  Vue.prototype._s = function (value){
    if(value === null) return;
    return typeof value === 'object'?JSON.stringify(value):value;
  }
  Vue.prototype._v = function (text){
    return createTextVnode(text);
  }


  Vue.prototype._render = function(){
    const render = this.$options.render,  //这里的$options.render在init阶段注入
    vnode = render.call(this);
    
    return vnode;
  }
}

export {
  renderMixin
}