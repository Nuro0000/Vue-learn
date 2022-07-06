//过滤空格与换行
export default function filterSpace(words){
  //去除多余空格/换行(连续的空格或换行只留下一个(html规则是留下字符前的单空格,换行转换为空格))
  var _words = '';
  for(let i = 0;i < words.length;i++){
    if(words[i]!=' '&&words[i]!='\n'){
      _words+=words[i];
    }else if(i<words.length-1&&words[i+1]!=' '&&words[i+1]!='\n'){    //当前为空格/换行且下一位非空格/换行
      _words+=' ';
    }
  }
  return _words;
}