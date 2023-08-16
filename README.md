# 运行
- 安装 npm install安装依赖
- 运行 npm run start启动该项目

# 目录结构介绍
- src/index.js 放置了测试案例
- src/react为本文核心实现
    - commit.js 与浏览器交互：实现元素渲染或者更新元素属性
    - contant.js 放置了一些常量
    - fiber.js 主要利用fiber数据结构实现了useState
    - global.js 放置了react中的全局变量
    - index.js 监听全局变量nextUnitOfWork的变化，执行对象工作流
    - react.js 注入react实例
    - reconclie.js 生成fiber结构并加入对应标记

# 渲染的完整流程介绍
- 首次ReactDom.render -> createRoot -> workLoop中的performUnitOfWork -> reconcileChildren  ->  workLoop中的commit

# 参考文档
- 本文章参考https://pomb.us/build-your-own-react/
- build-your-own-react最初代码实现：https://codesandbox.io/s/didact-8-21ost?file=/src/index.js:2309-2318