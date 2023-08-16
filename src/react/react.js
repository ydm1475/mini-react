import { TEXTTYPE } from "./constant";
import { commitRender, createRoot } from "./fiber";
class Component {
  constructor(props) {
    this.props = props;
  }
  isReact = true
}
Component.prototype.isReactComponent = true;
Component.prototype.setState = function (param) {
  if (typeof param === "function") {
    const result = param(this.state, this.props);
    this.state = {
      ...this.state,
      ...result,
    };
  } else {
    this.state = {
      ...this.state,
      ...param,
    };
  }

  commitRender();
};
class MiniReact {
  Component = Component;

  createTextElement = (text) => {
    return {
      type: TEXTTYPE,
      props: {
        nodeValue: text,
        children: [],
      },
    };
  };
  createElement = (type, config, ...children) => {
    return {
      type,
      props: {
        ...config,
        children: children.map((child) =>
          typeof child != "object" ? this.createTextElement(child) : child
        ),
      },
    };
  };

  render = (element, container) => {
    createRoot(element, container);
  };
}

var miniReactInstance = new MiniReact();
window.React = miniReactInstance;
window.ReactDom = miniReactInstance;
