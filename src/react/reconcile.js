import { TAGS } from "./constant";
import { useDeletions } from "./global";

export function reconcileChildren(wipFiber, elements) {
  var oldFiber = wipFiber?.alternate?.child;
  var index = 0;
  var prevSibling = null;

  // 处理嵌套情况
  elements = elements.flat(Infinity);

  while (index < elements.length || oldFiber) {
    let element = elements[index];
    let sameType = oldFiber?.type && oldFiber?.type === element?.type;
    var [deletions, setDeletions] = useDeletions();
    let newFiber = null;
    if (sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: TAGS.UPDATE,
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: element.dom,
        parent: wipFiber,
        alternate: null,
        effectTag: TAGS.PLACEMENT,
        index,
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = TAGS.DELETION;
      setDeletions(deletions.concat(oldFiber));
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (prevSibling && newFiber) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
