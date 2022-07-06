//(从虚拟节点)生成元素节点
function createVnode (tag, attrs = {}, ...children) {
  //不用处理嵌套,在render函数中已经处理过,内部的children就已经是vnode节点
  return vnode(tag, attrs, children);
}

//(从虚拟节点)生成文本节点
function createTextVnode (text) {
  return vnode(undefined, undefined, undefined,text)
}

function vnode (tag, props, children, text,el) {
  let key = props?.key;
  return {
    tag,
    props,
    children,
    text,
    el,
    key
  }
}

export {
  createVnode,
  createTextVnode,
  vnode
}