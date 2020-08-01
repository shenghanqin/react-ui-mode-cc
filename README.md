**本文知识点** 

* 响应式设计与自适应设计的联系与区别 
* 融合响应式的概念、实现思路及源码示例 
* 融合响应式设计在CCtalk的实践 

## 前言 

读正文前，可以先看的文章为《前端基础知识概述 -- 移动端开发的屏幕、图像、字体与布局的兼容适配》 [https://www.cnblogs.com/coco1s/p/11463599.html](https://www.cnblogs.com/coco1s/p/11463599.html)。 

我这里抽取中其中的一段来叙述： 

>从定义上而言，RWD 是一套代码，适用于所有屏幕。而 AWD 则是多端多套代码。我觉得这两者的本质都是致力于适配不同设备，更好地提升用户体验。 
>RWD 和 AWD 两者都是为了适配各种不同的移动设备，致力于提升用户体验所产生的的技术。核心思想是用技术来使网页适应从小到大（现在到超大）的不同分辨率的屏幕。通常认为，RWD 是 AWD 的子集。  
>RWD：Ethan Marcote 的文章是大家认为 RWD 的起源。他提出的 RWD 方案是通过 HTML 和 CSS 的媒体查询技术，配合流体布局实现。RWD 倾向于只改变元素的外观布局，而不大幅度改变内容。Jeffrey Zeldman 总结说，我们就把 RWD 定义为一切能用来为各种分辨率和设备性能优化视觉体验的技术。  
>AWD：Adaptive Design 是 Aaron Gustafson 的书的标题。 **他认为 AWD 在包括 RWD 的 CSS 媒体查询技术以外，也要用 Javascript 来操作 HTML 来更适应移动设备的能力。AWD 有可能会针对移动端用户减去内容，减去功能。AWD 可以在服务器端就进行优化，把优化过的内容送到终端上。**  

![](https://image-hosting.xiaoxili.com/img/20200730092734.png)

相关文章： 

* [Quora - Responsive Design vs. Adaptive Design?](https://www.quora.com/What-is-the-difference-between-responsive-and-adaptive-design)
* [zhihu -- Responsive design 和 Adaptive design 的区别](https://www.zhihu.com/question/20628050?rf=24334181)

* 书籍为《渐进增强：跨平台用户体验设计》，其英文原版地址为： [https://adaptivewebdesign.info/](https://adaptivewebdesign.info/)，在里面还提供了原版第一章节的 PDF 试读。 
## 正文开始： 

### 概念：融合响应式设计 

从上文中我们可以尝试得出一种新的解决方案，那就是利用 JavaScript 和 CSS 来进行媒体查询，是响应式设计与自适应设计结合的方案，我这里给起一个好记的名字叫做融合响应式设计（ Fusion Web Design，简称 FWD ）。 

技术原则： 


* JavaScript 判断尽量少 
* CSS 媒体查询的断点也尽量少 

UI效果 


* 在笔记本、平板电脑、智能手机上展示合适的 UI 效果 
* PC UI：给笔记本等设备上看的大屏效果 
* Mobile UI：给智能手机上看的小屏效果 

![](https://image-hosting.xiaoxili.com/img/20200730092927.png)

但这里，还是有一个遗漏的为平板电脑上效果。 

先前，iPad Air 或 iPad Mini 会被归类到智能手机的 Mobile UI 范围，但是这两年新出的 iPad Pro 的宽高单纯展示 PC UI 或 Mobile UI，效果都不是很理想。 


* iPad Pro （横屏 1366px）展示 Mobile站点内容，中间内容区域只有 768px 
* iPad Mini （横屏 1024px）展示PC 站点内容，右侧容易被截取 

![](https://image-hosting.xiaoxili.com/img/20200730092834.png)

### **先说为何不能以 UserAgent 来作为依据** 

iPad 装着 iOS 系统，其 UserAgent 中包含着 iPad 字眼，一般可用来判断 iPad。 

```plain
Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1 
```
那么，这里的一个的难点为不能使用 UserAgent 来判断 iPad Pro（iPad OS），因为它的 UserAgent 太像 MacBook Pro。 

iPad Pro 上装着 iPad OS 系统，其 UserAgent 为 

```plain
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15 
```
MacBook Pro 的 Safari 浏览器的 UserAgent 为 
```plain
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 
```
当然，也不能一直通过 UserAgent 来区分各种设备，因为以后新出的设备会更多。 


* 12.9 英寸 iPad Pro (第四、三、二、一代) 
* 11 英寸 iPad Pro (第二、一代) 
* 10.5 英寸 iPad Pro 
* 9.7 英寸 iPad Pro 
* iPad (第七、六、五代) 
* iPad mini (第五、4代) 
* iPad Air (第三、2代) 
* ... 
### **依据设备横竖屏及宽高特点** 

这里，我先列举一下我的目标设备的网页宽高、设备特点。 

|设备 |网页宽高 |设备特点 |
|:----|:----|:----:|:----|:----:|:----|
|手机 iPhone11 pro max |414x896 |支持横竖屏 |
|iPad 7.9 寸 |1024x768 |支持横竖屏 |
|iPad Pro 11 寸 |1194x834 |支持横竖屏 |
|iPad Pro 12.9 寸 |1366x1024 |支持横竖屏 |
|CCtalk PC 客户端 |1070x650 |只有横屏 |
|普通笔记本电脑 |1280x800 |只有横屏 |
|900p |1440x900 |只有横屏 |
|1080p |1920x1080 |只有横屏 |
|2k |2560x1440 |只有横屏 |
|4k |3840x2560 |只有横屏 |

判断的主要依据： 


* 设备是否支持横竖屏切换 
* 刚进页面时设备的宽高 
* 设备在横竖屏切换后的宽高 

那么，常见的设备显示效果如下： 


* 常见笔记本电脑的最小宽高为 1280x800，显示的为 PC UI 
* 常见智能手机的最大屏为 iPhone11 pro max，网页宽高为 414x896，无论是横竖屏都现实的是 Mobile UI。 

难点还是在 iPad 设备上，根据上面的表格我们发现，平板电脑支持横竖屏切换，竖屏范围在 768、834、1024 上，横屏范围在1024、1194、1366上。 

最大的难点就在于，1024宽度应该显示 Mobile UI 还是PC UI呢？ 

这里我选择将判断的断点改为 `1040px` 上，就是将最大宽不超过 1024px 的设备都认为 `Mobile UI` 。 

|设备 |网页宽高 |UI 模式 |
|:----|:----|:----:|:----|:----:|:----|
|手机 iPhone11 pro max |414x896 |Mobile |
|iPad 7.9 寸 |1024x768 |Mobile |
|iPad Pro 11 寸 |1194x834 |横屏 PC、竖屏 Mobile |
|iPad Pro 12.9 寸 |1366x1024 |横屏 PC、竖屏 Mobile |
|CCtalk PC 客户端 |1070x650 |横屏 PC |
|笔记本电脑、2k、4k |1280x800 |横屏 PC |

#### 效果图 

![](https://image-hosting.xiaoxili.com/img/20200730093000.png)

![](https://image-hosting.xiaoxili.com/img/20200730093022.png)


区分 Mobile UI 和 PC UI 的完整的判断逻辑如下： 


1. 笔记本电脑，不支持 `onorientationchange` 横竖屏切换的，就认定为 `PC`  

    * 不使用 `onRisize` 来监听网页的宽高，因为性能消耗大 
    * 并且当浏览器拖动小了，支持左右滚动 
2. 进入页面时，竖屏时以 `window.innerWidth, window.innerHeight` 中数值小的那个来判断，横屏中以 `window.innerWidth, window.innerHeight` 数值大的来判断，当宽度大于 `1040px` 时认为是 `PC` ，宽度小于 `1040px` 时，认定为 `Mobile` 。 
3. 横竖屏切换时，重复第 2 步的判断 

备注： 


*  `window.innerWidth, window.innerHeight` 在安卓和 iOS 上的横竖屏切换上有不一致的地方，所以以最大值或最小值来做更准确。 
#### 源码示例 

```javascript
import React from 'react' 
// JavaScript 的媒体查询 
const mqlMedia = window.matchMedia('(orientation: portrait)') 

function onMatchMediaChange(mql = window.matchMedia('(orientation: portrait)')) { 
  if (mql.matches) { 
    //竖屏 
    return 'portrait' 
  } else { 
    //横屏 
    return 'horizontal' 
  } 
} 
// 输出当前屏幕模式 
const getUiMode = (uiMode = '', mql) => { 
  if (uiMode) return uiMode 
  if (!('onorientationchange' in window)) return 'pc' 
  let status = onMatchMediaChange(mql) 
  let width = status === 'portrait' ? Math.min(window.innerWidth, window.innerHeight) : Math.max(window.innerWidth, window.innerHeight) 
  if (width > 1040) return 'pc' 
  return 'mobile' 
} 
const getIsPcMode = (uiMode) => uiMode === 'pc' 
/** 
 * UI 模式，判断逻辑 
 * @export 
 * @param {*} Cmp 
 * @returns 
 */ 
export function withUiMode(Cmp, options = {}) { 
  return class WithUIRem extends React.Component { 
    constructor(props) { 
      super(props) 
      let uiMode = getUiMode() 
      let isPCMode = getIsPcMode(uiMode) 
      this.state = { 
        uiMode: uiMode, 
        isPCMode: isPCMode, 
      } 
    } 
    // 横竖屏切换监听 
    componentDidMount() { 
      mqlMedia.addListener(this.changeUiMode) 
    } 
    componentWillUnmount() { 
      mqlMedia.removeListener(this.changeUiMode) 
    } 
    changeUiMode = (mql) => { 
      let newUiMode = getUiMode('', mql) 
      if (newUiMode !== this.state.uiMode) { 
        this.setState({ 
          isPCMode: getIsPcMode(newUiMode), 
          uiMode: newUiMode 
        }) 
      } 
    } 
    render() { 
      return <Cmp {...this.state} {...this.props} /> 
    } 
  } 
} 
export default (options) => { 
  return (Cmp) =>  withUiMode(Cmp, options) 
} 
```
 
### 调用方法 

```javascript
// 装饰器的方式来使用 
@withUiMode() 
export default class Video extends React.Component { 
  render() { 
    const { isPCMode, uiMode } = this.props 
    return ( 
      <Page isPCMode={isPCMode}></Page> 
    ) 
  } 
} 
```
### 符合设计师需求的细节 

在区分好 PC UI 和 Mobile UI 的判断设定后，我们还要关心的是在一些常见的设备上的显示效果，比如 iPad 横竖屏、大屏显示器。 

#### Mobile UI 效果中的优化 

在 Mobile UI 模式下，iPad Mini 显示效果如下： 


* 竖屏的为 768px，此时显示的平铺拉伸版效果 

* 横屏的为 1024px，此时显示的平铺拉伸版效果 

所以 Mobile UI 就有了如下的 CSS 最大宽的设定： 

```less
// Mobile 模式下页面最大宽 
$max-body-width = 768px 
// Mobile 模式下的内容宽度 
$max-body-width-center = $max-body-width - 40px 
```
![](https://image-hosting.xiaoxili.com/img/20200730093044.png)

#### PC UI 效果中的优化 

在上面的 PC UI 的判定中，我们是以 1040px 作为判断区间的，那么在这个宽度下，推荐设计师以 960px 为设计宽度，这样两侧就各有 40px 的留白，以此来增加整个页面的呼吸感。 

那么，市面上绝大部分的设备其实是比 1280px 还要大的。此时，可以选择以 1220px 作为更大屏的媒体查询断点。也就是说，我这里运用了响应式设计中的 CSS 媒体查询。 

为何不选用 1400px 呢，因为在 CCtalk 上课的网师、学生所使用的主流设备分辨率宽度还是在 1280px、1366px、1440px这几个区间的。 

所以，有如下 PC UI 的 CSS 最大宽设定： 

```less
// PC 模式下小屏的宽度断点 
$page-min-width = 1040px 
// 小屏模式下的内容宽度 
$page-min-width-center = $page-min-width - 80px 
// PC 模式下大屏的宽度断点 
$page-max-width = 1220px // 触屏三合一上的最大宽 
// 大屏模式下的内容宽度 
$page-max-width-content = $page-max-width - 60px 
```
![](https://image-hosting.xiaoxili.com/img/20200730093122.png)

### 设计规范 

使用融合响应式设计时，需要尽量在设计师进行 UI 设计前就与其商量好设计规范。 

我认为需要注意如下两点： 


1. 只修改模块的宽度、边距 
2. 保证模块内的所有细节都不调整模块细节内容的 UI，如字体、宽高、间距 

如果 Mobile UI 与 PC UI 的细节差异很大，那无论是响应式设计、自适应设计，还是我认为的融合响应式设计，在网页制作过程中，都是非常难做的，后期维护成本也是非常高的。 

### 小结 

融合响应式设计（ Fusion Web Design，简称 FWD），利用 JavaScript 和 CSS 来进行媒体查询，是响应式设计与自适应设计结合的方案。 


* 自适应设计：根据设备特点，使用 JavaScript 来区分 PC UI 和 Mobile UI 
* 响应式设计：在需要调整出更好的 UI 时，可以加入一些 CSS 媒体查询的断点，比如常见的大屏显示效果 
## 融合响应式设计在 CCtalk 这边的实践 

### 业务场景 


* 以触屏 UI 为主，兼容 PC 电脑上的效果 
* 特点为展示型居多，交互不复杂，跳转不复杂的情况 
### 多端场景 


* 电脑：浏览器、CCtalk PC 客户端、微信浏览器 
* ipad：Safari、微信浏览器，包含横竖屏切换 
* 手机：浏览器、CCtalk App、微信浏览器，包含横竖屏切换 

#### 兼容性要求 


* 兼容主流浏览器及主流分辨率 
* 浏览器最低兼容 IE11，不再兼容 IE9、IE10 
* IE11 上注意 flex 布局中 CSS 属性兼容性 
### 效果图 

**CCtalk 节目页面** 

![](https://image-hosting.xiaoxili.com/img/20200730093159.png)

### CCtalk 新版首页 

完整版请访问： [https://www.cctalk.com](https://www.cctalk.com)

![](https://image-hosting.xiaoxili.com/img/20200730093227.png)
