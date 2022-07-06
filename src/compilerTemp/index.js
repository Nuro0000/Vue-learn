import parseHTMLToAst from "./parseHTMLToAst";
import parseAstToRender from "./parseAstToRender";

//HTML -> AST -> Render

export default function compiler(template){
  var ast = parseHTMLToAst(template);     //对应源码:parseHTML方法
  console.log(ast);
  const render = parseAstToRender(ast);
  return render;
}