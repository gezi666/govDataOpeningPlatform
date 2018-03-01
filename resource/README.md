>  本项目是基于GULP实现前后端模版


### 项目技术架构
***
*  gulp
*  gulp-bro
*  gulp-less
*  babelify
*  gulp-minify-css
*  gulp-minify-html
*  gulp-watch
*  gulp-file-include
*  gulp-imagemin
*  gulp-clean
*  browser-sync
***


### 安装


通过`npm`安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))

```
npm install

```

启动服务(http://localhost:3000)


```
npm run dev
```

### 目录结构

<pre>
├── dist               // 最终生产的代码
├── package.json       // 项目配置文件
├── gulpfile.json      // gulp配置文件
├── src                // 生产目录
│   ├── img            // 图片资源
│   ├── css            // css 资源
│   ├── js             // js 资源
│   ├── html           //  页面 
</pre>

### 实现的功能

* 图片压缩
* 支持es6
* 支持html include
* 支持less
* 浏览器实时刷新
* 等等

### 注意事项
*本方案是最终生产的代码支持ie8 支持es6 



