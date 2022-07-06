import parseHTMLToAst from "./parseHTMLToAst";
import parseAstToRender from "./parseAstToRender";

//HTML -> AST -> Render

export default function compiler(template){
  const ast = parseHTMLToAst(template);     //对应源码:parseHTML方法
  const render = parseAstToRender(ast);
  return render;
}