/* 
  <div id="app" style="color:red;font-size:20px;">
    你好,{{ name }} 再见
    <span class="text" style="color:green">{{age}}</span>
    <p>欢迎光临</p>
  </div> 

_c() => createElement()
_v() => createTextNode()
_s() => 获取{{name}}中name的值
*/
function vrender () {                          //格式: _c(tag,attrs,...children)
  return `
    _c(
      'div',
      {
        id:"app",
        style:{
          "color":"red",
          "font-size":"20px"
        }
      },
      _v("你好,"+_s(name)+" 再见"),
      _c(
        "span",
        {
          "class":"text",
          "stlye":{
            "color":"green"
          }
        },
        _v(_s(age))
      ),
      _c(
        "p",
        {
          _v("欢迎光临")
        }
      )

    )
  `
}
//双大括号匹配
const defaultTagReg = /\{\{((?:.|\r?\n)+?)\}\}/g;

export default function generate (el) {   //结果: _c(tag,attrs,...children)
  let children = getChildren(el);
  if (el.type === 1) {
    //不能换行，否则会导致后续render函数生成时return一个空值(自动补undefined)
    return `_c('${el.tag}',${el.attrs.length > 0 ?`{${formatProps(el.attrs)}}` : 'undefined'}
      ${children ? `,${children}` : ''})`
  } else if (el.type === 3) {
    return `_v(${parseText(el.text)})`
  }
}

function formatProps (attrs) {
  //结果字符串
  let attrStr = '';
  for (let attr of attrs) {
    //对style类型先特殊处理
    if (attr.name === 'style') {
      let styleAttrs = {};
      //value转换成对象格式
      attr.value.split(';').map((item => {
        let [key, value] = item.split(':');
        styleAttrs[key] = value;
      }))
      attr.value = styleAttrs;
    }
    //通用处理
    attrStr += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  //返回JSON类型数据
  return `${attrStr.slice(0, -1)}`;    //去除最后多余的逗号
}

function getChildren (el) {
  if (!el.children) return undefined;
  const children = el.children;
  return children.map(child => generate(child)).join(',')
}

function parseText (text) {
  if (!defaultTagReg.test(text)) {
    return JSON.stringify(text);
  } else {
    //对含{{}}的文本进行转换
    let match,
    index,
    lastIndex = defaultTagReg.lastIndex = 0,  //重置指针(前面匹配过)
    textArr = [];
    while(match = defaultTagReg.exec(text)){
      index = match.index;
      //将{{}}之前的可能出现的文本push
      if(index > lastIndex){
        textArr.push(JSON.stringify(text.slice(lastIndex,index)))
      }
      //将{{}}内部变量push
      textArr.push(`_s(${match[1].trim()})`);  
      lastIndex = index + match[0].length;
    }
    //将后续常规文本push
    if(lastIndex < text.length){   
      textArr.push(JSON.stringify(text.slice(lastIndex)))
    }
    return textArr.join('+')     //+号来区分不同类型
  }
}