import { updateDom } from "./fiber";
import { TAGS } from "./constant";
import { useCurrentRoot, useDeletions, useWorkInProgressRoot } from "./global";

export function commit() {
  const [deletions, setDeletions] = useDeletions();
  deletions.forEach(commitWork);
  setDeletions([]);

  var [workInProgressRoot, setWorkInProgressRoot] = useWorkInProgressRoot();
  var [, setCurrentRoot] = useCurrentRoot();
  commitWork(workInProgressRoot.child);
  setCurrentRoot(workInProgressRoot);
  setWorkInProgressRoot(null);
}

export function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  // 兼容
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === TAGS.DELETION) {
    // 只处理删除
    commitDeletion(fiber, domParent);
    return;
  }

  commitWork(fiber.child);
  if (fiber.effectTag === TAGS.PLACEMENT && fiber.dom != null) {
    let targetPositionDom = domParent?.childNodes?.[fiber.index];
    if (targetPositionDom) {
      domParent.insertBefore(fiber.dom, targetPositionDom);
    } else {
      domParent.appendChild(fiber.dom);
    }
  }

  if (fiber.effectTag === TAGS.UPDATE && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }

  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber?.dom && !(fiber.dom instanceof DocumentFragment)) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber?.child, domParent);
  }
}
