import generate from "./generate";

export default function parseAstToRender(ast){
  const code = generate(ast);
  console.log('code: ', code);
  //参考with用法(参数解构):obj = {a:1,b:2} with(obj){console.log(a,b,a+b)} --> 1 2 3
  //这样就能通过this(Vue实例)直接取到内部的变量值
  //对于内部的_c、_v、_s方法，需要先在原型上扩充才能使用。
  const render = new Function(`with(this){return ${code}}`);
  console.log('render: ', render);
  //render为一个函数,模板数据根据模板已定,需传入参数为vm实例
  return render;
}