import filterSpace from '../utils/filterSpace'
import parseAttrs from './parseAttrs';

export default function parseHTMLToAst(template){
  template = filterSpace(template.trim());
  console.log('template: ', template);

  let index = 0;
  let len = template.length;
  let rest = '';

  let AST = {};

  let stackElm = [];
  //识别串
  let startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
  let endRegExp = /^\<\/([a-z]+[1-6]?)\>/;
  let wordRegExp = /(^[^\<]+)/;     //以非<开头的不包含<的连续串
  while(index < len - 1){
    rest = template.slice(index);
    //识别开始标签
    if(startRegExp.test(rest)){
      //match返回一个数组:[匹配串,括号子串,匹配下标]
      let tag = rest.match(startRegExp)[1];
      let attrsStr = rest.match(startRegExp)[2];
      let attrsLen;
      if(attrsStr){
        var attrs = parseAttrs(attrsStr);
        attrsLen = attrsStr.length;
      }else{
        attrsLen = 0;
      }
      console.log('检测到开始标记',tag);
      //入栈
      stackElm.push({tag,attrs,children:[]});
      index += tag.length + attrsLen + 2;

    }else if(endRegExp.test(rest)){
      let endTag = rest.match(endRegExp)[1];
      console.log('检测到结束标记',endTag);
      //出栈--加入上层标签children
      let elm = stackElm.pop();
      if(elm.tag != endTag){
        throw new Error(elm+'标签未封闭！');
      }
      if(stackElm.length > 0){
        stackElm[stackElm.length-1].children.push(elm)   //该元素属于上一个元素的children
      }else{ //顶层
        AST = elm;
      }

      index += endTag.length + 3;

      //文字处理
    }else if(wordRegExp.test(rest)){
      let word = rest.match(wordRegExp)[1];
      console.log('检测到文字',word);
      stackElm[stackElm.length-1].children.push({"text":word,"type":3});
      index += word.length;
    }else{
      index ++;
    }
  }
  console.log("AST",AST);
}