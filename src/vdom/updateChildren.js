import patchVnode from "./patchVnode";   //匹配成功后进行节点上树
/* 
diff核心--子节点更新
*/

//同一节点判断
function sameVndoe (vNode1, vNode2) {
  if(vNode1.key === undefined || vNode2.key === undefined)return false;
  return vNode1.key === vNode2.key&&vNode1.tag === vNode2.tag;
}

//参数: (真实dom节点,旧虚拟子节点,新虚拟子节点)
export default function updateChildren (parentElm, oldCh, newCh) {
  let oldStartIdx = 0;                //旧前指针
  let oldEndIdx = oldCh.length - 1;   //旧后指针
  let newStartIdx = 0;                //新前指针
  let newEndIdx = newCh.length - 1;   //新后指针

  let oldStartVnode = oldCh[0];               //旧前虚拟节点
  let oldEndVnode = oldCh[oldCh.length - 1];  //旧后虚拟节点
  let newStartVnode = newCh[0];               //新前虚拟节点
  let newEndVnode = newCh[newCh.length - 1];  //新后虚拟节点

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {

    //undefiend指针移动(可以先移动,也可以在前面两种情况对比时移动)
    if(oldStartVnode === undefined||oldEndVnode === undefined){
      if(oldStartVnode === undefined)oldStartVnode = oldCh[++oldStartIdx];
      if(oldEndVnode === undefined)oldEndVnode = oldCh[--oldEndIdx];

    }else if (sameVndoe(oldStartVnode, newStartVnode)) {  //旧前-新前
      console.log('1：');
      patchVnode(oldStartVnode, newStartVnode);
      //更新指针
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];

    } else if (sameVndoe(oldEndVnode, newEndVnode)) {     //旧后-新后
      console.log('2：');
      patchVnode(oldEndVnode, newEndVnode);
      //更新指针
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];

    } else if (sameVndoe(oldStartVnode, newEndVnode)) {   //旧前-新后
      console.log('3：');
      patchVnode(oldStartVnode, newEndVnode);
      //移动节点: 把旧前节点移动到旧后节点后
      if(oldEndIdx == oldCh.length - 1){
        parentElm.appendChild(oldStartVnode.el);
      }else{
        parentElm.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      }
      //更新指针
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];

    } else if (sameVndoe(oldEndVnode, newStartVnode)) {   //旧后-新前
      console.log('4：');
      patchVnode(oldEndVnode, newStartVnode);
      //移动节点: 把旧后节点移动到旧前节点前
      parentElm.insertBefore(oldEndVnode.el, oldStartVnode.el);
      //更新指针
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];

    } else {                                            //键值查找
      console.log('5：');
      //创建一个对象，存取旧虚拟节点的有效key值
      const keyMap = {};
      for (let i = oldStartIdx; i <= oldEndIdx; i++) {
        const key = oldCh[i]?.key;
        if (key) keyMap[key] = i;
      }
      console.log('keyMap: ', keyMap);
      //在旧节点集中寻找与新节点匹配的节点
      let idxInOld = keyMap[newStartVnode.key];
      if (idxInOld) {  //匹配成功--新旧节点对比
        console.log('查找:匹配成功--新旧节点对比');
        let matchedVnode = oldCh[idxInOld];
        patchVnode(matchedVnode, newStartVnode);
        //将匹配节点标记为undefined并移动到旧前的前面
        //--变为undefined是为了避免后续扫描；移动到旧前之前是为了调整新节点位置
        oldCh[idxInOld] = undefined;
        parentElm.insertBefore(matchedVnode.el,oldStartVnode.el)

      } else {         //匹配失败--创建全新节点
        console.log('查找:匹配失败--创建全新节点');
        // let newStartVnodeElm = createElement(newStartVnode);
        parentElm.insertBefore(newStartVnode.el, oldStartVnode.el);
      }

      newStartVnode = newCh[++newStartIdx];
    }
  }

  while (oldStartIdx <= oldEndIdx) {    //有多余旧节点--删除
    parentElm.removeChild(oldStartIdx.el);
    oldStartIdx = oldCh[++oldStartIdx];
  }
  while (newStartIdx <= newEndIdx) {    //有多出的新节点--注入
    parentElm.appendChild(newStartVnode.el);
    newStartVnode = newCh[++newStartIdx];
  }
}