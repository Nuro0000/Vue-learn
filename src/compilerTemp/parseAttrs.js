export default function (attrsStr) {
  attrsStr = attrsStr.slice(1); //第一位必为空格
  let point = 0;
  //收集每一项属性
  let attrs = [];
  //空格处理
  let isInner = false;      //表示是否在引号内-在则不处理空格

  for(let i = 0,len = attrsStr.length;i < len;i++){
    let char = attrsStr[i];
    if (char == '"') {
      isInner = !isInner;
    } else if (char == ' ' && !isInner) {
      attrs.push(attrsStr.substring(point,i));
      point = i;
    }
  }
  //最后一项
  attrs.push(attrsStr.substring(point));

  //处理每一项
  attrs = attrs.map((item)=>{
    console.log('item: ', item);
    let o = item.match(/(.+)="(.+)"$/);
    console.log('o: ', o);
    return{
      name:o[1],
      value:o[2]
    }
  })
  return attrs;
}

