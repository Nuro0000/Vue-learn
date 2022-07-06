import updateChildren from "./updateChildren";
/* 
  同一个标签节点对比处理
 */
export default function patchVnode(oldVnode,newVnode){
  //判断新节点有没有children
  if(newVnode.children === undefined){  //新的没有子节点 --内容替换 注：由于不是节点替换,所以要手动改变el指向(到上树的旧节点上)
    if(newVnode.text !== oldVnode.text){  //两个节点文本内容不一样才更新
      console.log('oldVnode.el: ', oldVnode.el);
      oldVnode.el.innerHTML = newVnode.text;   //渲染页面仅替换文本
      newVnode.el = oldVnode.el;              //虚拟节点内部改变el指向
      oldVnode.el = null;
      console.log('newVnode: ', newVnode);
    }
  }else if(oldVnode.children === undefined || oldVnode.children.length === 0){  //新的有,旧的没有
    oldVnode.el.innerHTML = newVnode.el.innerHTML; //newVnode在patch阶段已经标记上树
    newVnode.el = oldVnode.el;
    oldVnode.el = null;

  }else{    //新的有,旧的也有--diff核心
    updateChildren(oldVnode.el,oldVnode.children,newVnode.children);
  }
}