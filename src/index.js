import "./react/index.js";
import { useState } from "./react/fiber.js";
import "./style.css";

class Counter extends React.Component {
  state = {
    count: 1,
  };
  handleAdd = () => {
    this.setState((state) => ({ count: state.count + 1 }));
  };

  handleClick = () => {
    this.setState((state) => ({ count: state.count - 1 }));
  };

  render() {
    return (
      <div className="wrap">
        <h3>计数器1</h3>
        <div>
          <span className="title">当前计数为：{this.state.count}</span>
        </div>
        <div>
          <button onClick={this.handleAdd}>计数增加</button>
        </div>
        <div>
          <button onClick={this.handleClick}>计数减少</button>
        </div>
      </div>
    );
  }
}

var CounterFn = () => {
  var [state, setState] = useState(20);

  const handleClick = () => {
    setState((state) => state + 1);
  };
  const handleDelete = () => {
    setState((state) => state - 1);
  };

  return (
    <div className="wrap" id="counter2">
      <h3>计数器2</h3>
      <div>
        <span className="title">当前计数为：{state}</span>
      </div>
      <div>
        <button onClick={handleClick}>计数增加</button>
      </div>
      <div>
        <button onClick={handleDelete}>计数减少</button>
      </div>
    </div>
  );
};

var Menu = () => {
  var [data, setData] = useState([
    "西红柿炒鸡蛋",
    "干锅土豆片",
    "鱼香鸡蛋",
    "鱼香茄子",
  ]);
  const handleDelete = (i) => {
    setData((data) => data.filter((_, index) => index != i));
  };
  return (
    <div className="wrap">
      <h3>我的拿手菜好菜</h3>
      <ul>
        {data.map((item, i) => (
          <div className="item">
            <li>{item}</li>
            <span onClick={() => handleDelete(i)}>删除</span>
          </div>
        ))}
      </ul>
    </div>
  );
};

var App = () => {
  var [state, setState] = useState({
    countOneVisible: true,
    countTwoVisible: true,
    menuVisible: true,
  });
  return (
    <div id="app">
      {state.countOneVisible ? <Counter></Counter> : <></>}
      {state.menuVisible ? <Menu></Menu> : <></>}
      {state.countTwoVisible ? <CounterFn></CounterFn> : <></>}
      <div>
        <button
          className="button"
          onClick={() => {
            setState((state) => ({
              ...state,
              countOneVisible: !state.countOneVisible,
            }));
          }}
        >{`${state.countOneVisible ? "隐藏" : "显示"}计数器1`}</button>
        <button
          className="button"
          onClick={() => {
            setState((state) => ({
              ...state,
              menuVisible: !state.menuVisible,
            }));
          }}
        >{`${state.menuVisible ? "隐藏" : "显示"}菜谱`}</button>
        <button
          className="button"
          onClick={() => {
            setState((state) => ({
              ...state,
              countTwoVisible: !state.countTwoVisible,
            }));
          }}
        >{`${state.countTwoVisible ? "隐藏" : "显示"}计数器2`}</button>
      </div>
    </div>
  );
};

ReactDom.render(<App />, document.getElementById("root"));
