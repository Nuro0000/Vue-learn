//属性 id="app" id='app' id=app
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
//标签名 <my-header></my-header>
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
//特殊标签名 <my:header></my:header>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
//开始标签 <div
const startTagOpen = new RegExp(`^<${qnameCapture}`)
//结束符 > />
const startTagClose = /^\s*(\/?)>/
//结束标签 </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

export default function parseHTMLToAst (html) {
  html = html.trim();

  let root, currentParent, stack = [];

  while (html) {
    //获取<位置
    let tagStart = html.indexOf('<');
    //可能是开始或结束标签
    if (tagStart === 0) {
      //开始标签处理
      const startTagMatch = html.match(startTagOpen);
      if (startTagMatch) {
        start(startTagMatch);
        continue;
      }

      //结束标签处理
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch);
        continue;
      }
    }
    //处理标签外的文本部分
    if (tagStart > 0) {
      const text = html.substring(0, tagStart);
      advance(text.length);
      //处理文本
      chars(text);
    }
  }
  return root;

  //内置方法集
  //处理开始标签内部内容
  function start (startTagMatch) {
    let tagName = startTagMatch[1],
    attrs = [],
    attr,
    end;

    advance(startTagMatch[0].length);
    //匹配到标签属性
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      attrs.push({
        name: attr[1],
        value: attr[3] || attr[4] || attr[5]   //不同类型属性的位置不同
      })
      advance(attr[0].length);
    }
    //到达闭口
    if (end) {
      //生成节点,入栈
      const element = createASTElement(tagName, attrs);
      stack.push(element);
      currentParent = element;  //改变父指针指向(用于添加children)
      advance(end[0].length);
    } else {
      throw Error("未匹配到标签属性和标签闭口!");
    }

  }

  function end (endTagMatch) {
    let tagName = endTagMatch[1];
    advance(endTagMatch[0].length);
    const element = stack.pop();
    if (tagName != element.tag) {
      throw Error('节点未封闭!');
    }
    if (stack.length > 0) {
      currentParent = stack[stack.length - 1];
      element.parent = currentParent;
      currentParent.children.push(element);
    }else{
      root = element;
    }
  }

  function chars (text) {
    text = text.trim();
    if (text.length > 0) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }

  //生成AST元素
  function createASTElement (tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs,
      parent
    }
  }

  function advance (n) {
    html = html.substring(n);
  }
}

