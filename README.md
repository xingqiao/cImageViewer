# cimageviewer.js - 图片浏览器

## DEMO

<http://y.qq.com/m/demo/ctools/civ.html>

## GitHub

<https://github.com/xingqiao/cImageViewer/>

## 支持功能

- 支持缩放查看图片

- 支持保存图片到本地

## 文件说明

| 文件 | 描述 |
|-|-|
| cimageviewer.core.js | 核心实现 |
| cimageviewer.constant.js | 常量定义 |
| cimageviewer.qm.js | QQ音乐下载定制封装，实现 save 方法 |

## 初始化

> 不依赖其他第三方库

```html
<script src="cimageviewer.js"></script>
```

```javascript
var civ = new CIV({
    animation: CIV.ANIMATION.TRANSLATE,
    background: "#0ff",
    list: [
        "//y.gtimg.cn/music/common/upload/t_cm3_photo_publish/1432027858747126350.jpg",
        {
            src: "//y.gtimg.cn/music/common/upload/t_cm3_photo_publish/1432027474009126350.jpg",
            desc: "图片描述"
        },
        "//y.gtimg.cn/music/common/upload/t_cm3_photo_publish/1432035906703126350.jpg",
        "//y.gtimg.cn/music/common/upload/t_cm3_photo_publish/1432035984898126350.jpg"
    ],
    onclick: function () {
        console.log(this.index); // civ == this
    }
}).show();
```

## 初始化参数

| 参数 | 类型 | 默认值 | 描述 |
|-|-|-|-|
| list | Array | \- | 图片列表，参数可以是图片链接或者img标签 |
| index | Number | 0 | 查看的图片序号 |
| loop | Boolean | true | 是否循环查看 |
| orderNumber | Boolean | true | 是否展示图片序号 |
| close | Boolean | true | 是否展示关闭按钮 |
| arrow | Boolean | true | 是否展示左右切换箭头 |
| save | Boolean | false | 是否展示保存按钮 |
| saveBtn | String | "保存图片" | 保存按钮文本 |
| noSave | Boolean | false | 禁用默认保存逻辑 |
| preload | Boolean | false | 是否预加载图片 |
| dots | Boolean | true | 是否展示 |
| background | String | "#000" | 弹窗背景色，默认为黑色 |
| animation | String | "translate" | 切换动画，默认是平移，值在 CIV.ANIMATION 中定义义 |

## CIV对象属性

| 属性名 | 类型 | 值 | 描述 |
|-|-|-|-|
| list | Array | \- | 获取或设置图片列表 |
| index | Number | \- | 获取或设置当前查看的图片 |
| loop | Boolean | \- | 获取或设置循环查看 |
| version | String | \- | 获取组件版本号 |
| close | Boolean | \- | 获取或设置关闭按钮设置 |
| save | Boolean | \- | 获取或设置保存按钮设置 |
| saveBtn | String | \- | 获取或设置保存按钮文本 |

## CIV对象方法

| 方法名 | 描述 |
|-|-|
| show | 打开弹窗 |
| hide | 关闭弹窗 |
| reset | 重置图片缩放状态 |
| prev | 查看上一页 |
| next | 查看下一页 |

## CIV对象事件

| 事件名 | 描述 |
|-|-|
| show | 事件在打开弹窗时触发 |
| hide | 事件在关闭弹窗时触发 |
| slidestart | 事件在开始滑动时触发 |
| slideend | 事件在滑动停止时触发 |
| slidechange | 事件在页面切换时触发 |
| click | 事件在点击图片时触发 |
| save | 事件在保存图片时触发 |

## 常量定义

### 切换动画类型 CLIP.ANIMATION

| 常量 | 值 | 描述 |
|-|-|-|
| CLIP.ANIMATION.TRANSLATE | "translate" | 平移 |
