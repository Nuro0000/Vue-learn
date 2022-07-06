import compile from './compiler'
import initData from './init/initData'
import {mountComponent} from './lifecycle'
/* 
  原型方法混入
 */
function initMixin (Vue) {
  //初始化方法定义
  Vue.prototype._init = function (options) {

    this.$options = options;

    //数据初始化(数据代理+响应式添加)
    initData(this);

    //挂载(dom更新)
    if (this.$options.el) {
      this.$mount(this)
    }
  }

  //挂载方法定义
  Vue.prototype.$mount = function (vm) {
    //获取挂载点
    let options = vm.$options;
    let { el } = options;
    el = document.querySelector(el);
    vm.$el = el;
    //不同情况应对
    //没有render函数时--针对初次初始化
    //(在组件存在的整个生命周期内,认为模板不会变化,render只针对数据变化做响应式更新,
    //像数组的变化导致的html元素变化属于数据的变化,在传入数据后会改变,不属于template改变,
    //任何的template改变(如手动修改)都会导致组件重建,而不属于响应式更新)
    if (!options.render) {
      let template = options?.template;
      //用户没写template时(就从el中获取真实dom)
      if (!template && el) {
        options.template = el.outerHTML;
      }
      //模板编译(配置到$options上--为renderMixin提供拓展)
      const render = compile(options.template);
      options.render = render;
    }
    //组件挂载(vm实例就是一个组件,完成dom更新)
    mountComponent(vm);
  }

}

export {
  initMixin
}