import compile from '.'
/* 
挂载函数 template -> AST树 -> render函数
 */
export default function mount (vm) {
  //获取挂载点
  let options = vm.$options;
  let { el } = options;
  el = document.querySelector(el);
  vm.$el = el;
  //不同情况应对
  //没有render函数时--针对初次初始化
  if (!options.render) {
    let template = options.template;
    //用户没写template时(就必须写el)
    if (!template && el) {
      template = el.outerHTML;
    }
    //模板编译
    const render = compile(options.template);
    options.render = render;

  }

}
