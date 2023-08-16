import { FRAGEMENT, TEXTTYPE } from "./constant";
import {
  useCurrentFiber,
  useCurrentRoot,
  useHookIndex,
  useNextUnitOfWork,
  useWorkInProgressRoot,
} from "./global";

export function commitRender() {
  var [, setWorkInProgressRoot] = useWorkInProgressRoot();
  var [, setNextUnitOfWork] = useNextUnitOfWork();
  var [currentRoot] = useCurrentRoot();
  var wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
    hooks: currentRoot.hook || [],
  };
  setWorkInProgressRoot(wipRoot);
  setNextUnitOfWork(wipRoot);
}

export function createRoot(element, container) {
  var [, setWorkInProgressRoot] = useWorkInProgressRoot();
  var [, setNextUnitOfWork] = useNextUnitOfWork();
  var [currentRoot] = useCurrentRoot();
  var data = {
    dom: container,
    props: {
      children: [element],
    },
    hooks: [],
    alternate: currentRoot,
  };
  setWorkInProgressRoot(data);

  setNextUnitOfWork(data);
}

export function useState(initial) {
  var [currentFiber, setCurrentFiber] = useCurrentFiber();

  var [hookIndex, setHookIndex] = useHookIndex();
  var oldHook = currentFiber?.alternate?.hooks?.[hookIndex];
  var hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  var actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });
  const setState = (action) => {
    if (action instanceof Function) {
      hook.queue.push(action);
    } else {
      hook.queue.push(() => action);
    }
    commitRender();
  };
  currentFiber.hooks = (currentFiber.hooks || []).concat(hook);
  setCurrentFiber(currentFiber);
  setHookIndex(hookIndex + 1);

  return [hook.state, setState];
}

export function createDom(fiber) {
  if (fiber.type instanceof Function || fiber.type === FRAGEMENT) {
    return document.createDocumentFragment();
  }
  const dom =
    fiber.type == TEXTTYPE
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}

const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);
export function updateDom(dom, prevProps, nextProps) {
  if (typeof nextProps !== "object") {
    return;
  }
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
