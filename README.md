## 项目介绍 

`react-ui-mode-cc` 是融合响应式设计的 React 版实现，基于 [create-react-library](https://github.com/transitive-bullshit/create-react-library)构建，使用 [云开发 CloudBase Framework](https://github.com/TencentCloudBase/cloudbase-framework)部署到腾讯云静态网站托管。 

可以访问 [示例网站](https://www.xiaoxili.com/packages/react-ui-mode-cc)来查看效果，源码细节在 [https://github.com/shenghanqin/react-address-picker-cc](https://github.com/shenghanqin/react-address-picker-cc)。 

融合响应式设计，利用 JavaScript 判断 和 CSS 来进行媒体查询，是响应式设计与自适应设计结合的方案。 

* 自适应设计：根据设备特点，使用 JavaScript 来区分 PC UI 和 Mobile UI 
* 响应式设计：在需要调整出更好的 UI 时，可以加入一些 CSS 媒体查询的断点，比如常见的大屏显示效果 

完整介绍文章为：《 [响应式布局新方案——融合响应式设计](https://www.xiaoxili.com/blog/posts/fusion-web-design.html)》 

>文章内示例源码与 `react-ui-mode-cc` 会有部分不同， `react-ui-mode-cc` 会不断升级 

![](https://image-hosting.xiaoxili.com/img/20200730093122.png)
![](https://image-hosting.xiaoxili.com/img/20200730093044.png)

### 安装方法 

```plain
# npm 安装 
npm install @xiaoxili/react-ui-mode-cc --save 
# yarn 安装 
yarn add @xiaoxili/react-ui-mode-cc 
```
### 调用方法 

```typescript
// 引入 withUiMode 
import withUiMode from '@xiaoxili/react-ui-mode-cc' 
// 引入 CSS 预设变量，可选项 
import '@xiaoxili/react-ui-mode-cc/dist/index.css' 
interface Props { 
  isPCMode?: boolean 
  uiMode?: string 
} 
// 装饰器的调用方式 
@withUiMode({ 
  // 区分模式的宽度 
  widthMode: 1000, 
  // iPad 微信恒定为 Mobile UI 
  isPadWechatMobile: true 
}) 
export default class App extends React.Component<Props, {}> { 
  render() { 
    const { isPCMode, uiMode } = this.props 
    console.log('uiMode :>> ', isPCMode, uiMode); 
    return ( 
      <div className={`page-container ${isPCMode ? 'com-mode-pc' : 'com-mode-mobile'}`}> 
        <div> 
          <h2>当前屏幕模式</h2> 
          {uiMode} ui 
        </div> 
        <div> 
          <h2>isPCMode：</h2> 
          {isPCMode ? 'true' : 'false'} 
        </div> 
      </div> 
    ) 
  } 
} 
```
```typescript
// 高阶组件的方式调用 
class App extends React.Component {} 
export default withUiMode({ 
  // 区分模式的宽度 
  widthMode: 1000, 
  // iPad 微信恒定为 Mobile UI 
  isPadWechatMobile: true 
})(App) 
```
### Options 选项 

基本原理：JavaScript 横竖屏判断加设备宽度 

|属性名 |类型 |默认值 |描述 |
|:----|:----|:----|:----|
|widthMode |Number |1000 |区分模式的宽度 |
|isPadWechatMobile |Boolean |false |iPad 微信是否恒定为 Mobile UI |

### CSS 变量 —— CSS 媒体查询 

基本原理：在不同的 UI 模式内的变量设置 

#### 预处理的 CSS 变量示例 

可以使用 Stylus、LESS、SCSS 来设置 

```scss
// Mobile 模式下页面最大宽 
$xxl-max-body-width: 768px;
// Mobile 模式下的内容宽度 
$xxl-max-body-width-center: ($xxl-max-body-width - 40px);

// PC 模式下小屏的宽度断点 
$xxl-page-min-width: 1000px;
// PC 小屏模式下的内容宽度 
$xxl-page-min-width-center: ($xxl-page-min-width - 40px);
// PC 模式下大屏的宽度断点 
$xxl-page-max-width: 1200px;
// PC 大屏模式下的内容宽度 
$xxl-page-max-width-center: ($xxl-page-max-width - 40px);
```
### 重要版本升级记录 

* v0.1.1 将横竖屏切换监听改为 `window.matchMedia('(orientation: portrait)')`，并针对 iPad 上进行多次测试
* v0.1.0 首次上线，支持设置模块宽度、iPad 微信是否恒定为 Mobile UI 

 

## 原理解析 

### **依据设备横竖屏及宽高特点** 

|设备 |网页宽高 |UI 模式 |
|:----|:----|:----:|:----|:----:|:----|
|手机 iPhone11 pro max |414x896 |Mobile |
|iPad mini 7.9 寸 |1024x768 |Mobile |
|ipad 10.2 寸 |1080x810 |横屏 PC、竖屏 Mobile |
|iPad Air 10.5 寸 |1112 x 834 |横屏 PC、竖屏 Mobile |
|iPad Pro 11 寸 |1194x834 |横屏 PC、竖屏 Mobile |
|iPad Pro 12.9 寸 |1366x1024 |横屏 PC、竖屏 Mobile |
|CCtalk PC 客户端 |1070x650 |横屏 PC |
|笔记本电脑、2k、4k |1280x800 |横屏 PC |

#### 效果图 

![](https://image-hosting.xiaoxili.com/img/20200730093000.png)

![](https://image-hosting.xiaoxili.com/img/20200730093022.png)


区分 Mobile UI 和 PC UI 的完整的判断逻辑如下： 

1. 在 iPad 微信 App 上可设置强制显示 Mobile 效果 
2. 笔记本电脑，不支持 `onorientationchange` 横竖屏切换的，就认定为 `PC`  
    * 不使用 `onRisize` 来监听网页的宽高，因为性能消耗大 
    * 并且当浏览器拖动小了，支持左右滚动 
3. 若 `window.screen.width, window.screen.height` 的最大值也比 `widthMode` 宽度断点大，那就可以认为是 `PC` ，如 iPad Pro 12.9 寸。 
4. 若 `window.screen.width, window.screen.height` 的最大值也比 `widthMode` 宽度断点还小，那就可以认为是 `Mobile`  
5. 进入页面时，竖屏时以 `window.screen.width, window.screen.height` 中数值小的那个来判断，横屏中以 `window.screen.width, window.screen.height` 数值大的来判断，当宽度大于 `1000px` 时认为是 `PC` ，宽度小于 `1000px` 时，认定为 `Mobile` 。 
   * 
6. 横竖屏切换时，重复第 **5** 步的判断 
   * 方案一：监听 `window.matchMedia('(orientation: portrait)')`，目前测试这个方案比较理想
   * 方案二：监听 `onorientationchange` 及 `window.orientation`

**备注：** 

* iPad 微信 app 横屏“扫一扫”，会以“左聊天列表、右侧网页”的布局，此时宽度比预期的小 `320px`，应当认为是 `mobile`。
* 在横竖屏切换后，需要加 `300ms` 延时，之后获取的 `innerWidth` 和 `innerHeight` 才是准确的。

#### 源码地址 

[https://github.com/shenghanqin/react-ui-mode-cc/blob/master/src/index.tsx](https://github.com/shenghanqin/react-ui-mode-cc/blob/master/src/index.tsx)

### UI 模式下进行增强的响应式布局 

在区分好 PC UI 和 Mobile UI 的判断设定后，我们还要关心的是在一些常见的设备上的显示效果，比如 iPad 横竖屏、大屏显示器。 

#### Mobile UI 效果中的优化 

在 Mobile UI 模式下，iPad Mini 竖屏的为 768px，此时显示的平铺拉伸版效果 

所以 Mobile UI 就有了如下的 CSS 最大宽的设定： 

```stylus
// Mobile 模式下页面最大宽 
$max-body-width = 768px 
// Mobile 模式下的内容宽度 
$max-body-width-center = $max-body-width - 40px 
```

![](https://image-hosting.xiaoxili.com/img/20200730093122.png)


#### PC UI 效果中的优化 

在上面的 PC UI 的判定中，我们是以 1000px 作为判断区间的，那么在这个宽度下，推荐设计师以 960px 为设计宽度，这样两侧就各有 32 px 的留白，以此来增加整个页面的呼吸感。 

那么，市面上绝大部分的设备其实是比 1280px 还要大的。此时，可以选择以 1200px 作为更大屏的媒体查询断点。也就是说，我这里运用了响应式设计中的 CSS 媒体查询。 

为何不选用 1400px 呢，因为在 CCtalk 上课的网师、学生所使用的主流设备分辨率宽度还是在 1280px、1366px、1440px这几个区间的。 

所以，有如下 PC UI 的 CSS 最大宽设定： 

```stylus
// PC 模式下小屏的宽度断点 
$page-min-width = 1000px 
// 小屏模式下的内容宽度 
$page-min-width-center = $page-min-width - 40px 
// PC 模式下大屏的宽度断点 
$page-max-width = 1200px 
// 大屏模式下的内容宽度 
$page-max-width-center = $page-max-width - 40px 
```
![](https://image-hosting.xiaoxili.com/img/20200730093044.png)

## License

MIT © [https://github.com/shenghanqin/](https://github.com/https://github.com/shenghanqin/)
