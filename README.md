#深圳规划设计院后台管理系统

#### 作者：毫末科技

## 概述

本项目基于[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)，

官方说明见[官方中文说明](./README.zh-CN.md)

## 使用

### 安装

    npm install

### 打包

    npm run build:prod

### 部署

测试环境部署



生产环境部署



## 开发

```bash
# 克隆项目
git clone ssh://git@gitlab.haomo-studio.com:15822/UPDIS/updis.git

# 安装依赖
npm install
   
# 建议不要用cnpm安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```
浏览器访问 http://localhost:9527

### 发布
```bash
# 构建测试环境
npm run build:sit

# 构建生成环境
npm run build:prod
```

### 其它
```bash
# --report to build with bundle size analytics
npm run build:prod --report

# --preview to start a server in local to preview
npm run build:prod --preview

# lint code
npm run lint

# auto fix
npm run lint -- --fix
```

## 参考