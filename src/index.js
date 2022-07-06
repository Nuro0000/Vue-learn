import { initMixin } from "./init";
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vdom'

export default function Vue (options) {
  this._init(options);    //从initMixin中提取的方法
}
//初始化方法拓展
initMixin(Vue);
//生命周期方法拓展
lifecycleMixin(Vue);
//渲染函数拓展
renderMixin(Vue);

window.Vue = Vue;