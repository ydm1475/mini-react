let nextUnitOfWork = null;
let workInProgressRoot = null; // 当前工作的 fiber 树
let currentRoot = null; // 上一次渲染的 fiber 树
let deletions = []; // 删除相关
let hookIndex = 0;
let currentFiber = null;

export function useNextUnitOfWork() {
  function setNextUnitOfWork(value) {
    nextUnitOfWork = value;
  }
  return [nextUnitOfWork, setNextUnitOfWork];
}

export function useWorkInProgressRoot() {
  function setWorkInProgressRoot(value) {
    workInProgressRoot = value;
  }
  return [workInProgressRoot, setWorkInProgressRoot];
}

export function useCurrentRoot() {
  function setCurrentRoot(value) {
    currentRoot = value;
  }
  return [currentRoot, setCurrentRoot];
}

export function useDeletions() {
  function setDeletions(value) {
    deletions = value;
  }
  return [deletions, setDeletions];
}

export function useHookIndex() {
  function setHookIndex(value) {
    hookIndex = value;
  }
  return [hookIndex, setHookIndex];
}

export function useCurrentFiber() {
  function setCurrentFiber(value) {
    currentFiber = value;
  }
  return [currentFiber, setCurrentFiber];
}
