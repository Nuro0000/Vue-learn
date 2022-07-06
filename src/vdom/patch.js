import patchVnode from './patchVnode'
import { vnode } from './vnode';     //由于涉及真实dom的转换,需要引入vnode而不是createVnode
export default function patch (oldVnode, newVnode) {
  //监测oldVnode是不是虚拟dom
  if (!oldVnode?.tag) {    //oldVndoe没有tag属性，就证明是非虚拟节点
    oldVnode = vnode(
      oldVnode.tagName.toLowerCase(), //tag   toLowerCase(): 转换小写
      {},   //这两行后续比较children时处理
      [],
      undefined,
      oldVnode                        //标记上树节点
    )
  }

  //为新虚拟节点创建真实dom节点
  var newVnodeElm = createElement(newVnode);

  //获取旧真实dom节点
  if (oldVnode.el == undefined) {  //若旧节点未上树，无法定位
    throw `The first vnode can not be found on realDomTree`
  } else {
    var oldVnodeElm = oldVnode.el;
  }

  //判断是否为同一个节点
  if (oldVnode.tag === newVnode.tag) {
    patchVnode(oldVnode, newVnode);

  } else {//非同一个节点，暴力删除旧节点，插入新节点

    //注入新节点
    if (newVnodeElm) {
      oldVnodeElm.parentNode.insertBefore(newVnodeElm, oldVnodeElm);
    }

    //删除旧节点
    oldVnodeElm.parentNode.removeChild(oldVnodeElm);

    //--先注入新节点再删除旧节点,是为了让新节点根据旧节点定位到原处
  }

}

//将虚拟节点变为真实节点
function createElement (vnode) {

  //元素节点
  if (vnode.tag !== undefined) {
    vnode.el = document.createElement(vnode.tag);
    //属性设置
    updateProps(vnode);
    if(vnode.children){
      for (let item of vnode.children) {
        vnode.el.appendChild(createElement(item));
      }
    }
    //文本节点
  } else {
    vnode.el = document.createTextNode(vnode.text);
  }
  return vnode.el;
}

function updateProps (vnode) {
  const el = vnode.el,
    newProps = vnode.props || {};
  for (let key in newProps) {
    if (key === 'style') {
      for (let skey in newProps.style) {
        el.style[skey] = newProps.style[skey];
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}