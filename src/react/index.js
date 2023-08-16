// 注入react和reactdom
import "./react.js";
// 引入全局变量
import { commit } from "./commit.js";
import {
  useCurrentFiber,
  useHookIndex,
  useNextUnitOfWork,
  useWorkInProgressRoot,
} from "./global";
import { reconcileChildren } from "./reconcile.js";
import { createDom } from "./fiber.js";

function performUnitOfWork() {
  // 当前的工作单元
  var [nextUnitOfWork, setNextUnitOfWork] = useNextUnitOfWork();
  var [, setHookIndex] = useHookIndex();
  var [, setCurrentFiber] = useCurrentFiber();
  if (!nextUnitOfWork) {
    return;
  }
  let type = nextUnitOfWork.type;
  if (!nextUnitOfWork.dom) {
    nextUnitOfWork.dom = createDom(nextUnitOfWork);
  }

  if (type instanceof Function) {
    if (type.prototype.isReactComponent) {
      var component = nextUnitOfWork?.alternate?.component || new type();
      nextUnitOfWork.component = component;
      reconcileChildren(nextUnitOfWork, [
        component.render(nextUnitOfWork.props),
      ]);
    } else {
      setHookIndex(0);
      setCurrentFiber(nextUnitOfWork);
      reconcileChildren(nextUnitOfWork, [type(nextUnitOfWork.props)]);
    }
  } else {
   
    reconcileChildren(nextUnitOfWork, nextUnitOfWork?.props?.children || []);
  }
  if (nextUnitOfWork.child) {
    setNextUnitOfWork(nextUnitOfWork.child);
    return;
  }

  let nextFiber = nextUnitOfWork;
  while (nextFiber) {
    if (nextFiber.sibling) {
      setNextUnitOfWork(nextFiber.sibling);
      return;
    }
    nextFiber = nextFiber.parent;
  }

  if (!nextFiber) {
    setNextUnitOfWork(null);
  }
}

function workLoop(deadline) {
  let shouldYield = false;
  var [nextUnitOfWork] = useNextUnitOfWork();
  var [workInProgressRoot] = useWorkInProgressRoot();
  while (nextUnitOfWork && !shouldYield) {
    performUnitOfWork();
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && workInProgressRoot) {
    commit();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
