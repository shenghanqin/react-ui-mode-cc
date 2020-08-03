import * as React from 'react'

let mqlMedia = window.matchMedia('(orientation: portrait)') 

// Wait until innerheight changes, for max 120 frames
// const orientationChanged = () => {
//   const timeout = 120;
//   return new window.Promise(function (resolve) {
//     const go = (i: number, height0: number) => {
//       window.innerWidth != height0 || i >= timeout ?
//         resolve() :
//         window.requestAnimationFrame(() => go(i + 1, height0));
//     };
//     go(0, window.innerWidth);
//   })
// }

// 输出当前屏幕模式
const getUiMode = (widthMode: number) => {
  let witdhMql = window.matchMedia(`(max-width: ${widthMode}px)`)

  let uiMode = !witdhMql.matches ? 'pc' : 'mobile'
  
  console.log('uiMode :>> ', uiMode);
  return uiMode
}

const getIsPcMode = (uiMode: string) => uiMode === 'pc'

export const isPadWeixin = () => {
  const userAgent = window.navigator.userAgent
  const userAgentLowerCase = userAgent.toLocaleLowerCase()
  return userAgentLowerCase.includes('micromessenger') && userAgentLowerCase.includes('ipad')
}

interface OptionsProps {
  widthMode?: number,
  /**
   * iPad 微信使用 Mobile 模式
   */
  isPadWechatMobile?: boolean
}

interface UIProps {
  isPCMode?: boolean
}

interface UIState {
  /**
   * 单一模式。要么是pc，要么是Mobile
   */
  isSingleMode: boolean
  /**
   * 屏幕断点，默认为 1000px
   */
  widthMode: number,
  /**
   * 屏幕 UI 模式，值为 pc、mobile
   */
  uiMode: string
  /**
   * 是否为 PC 模式
   */
  isPCMode: boolean
}

export function withUiMode(Cmp: React.ComponentType, options: OptionsProps) {
  return class WithUIRem extends React.Component<UIProps, UIState> {
    constructor(props: UIProps) {
      super(props)

      // 需要转换的
      let { widthMode = 1000, isPadWechatMobile = false } = options
      let uiMode = 'mobile'
      let isPCMode = false
      let isSingleMode = false

      if (isPadWechatMobile && isPadWeixin()) {
        // 恒定 mobile
        isSingleMode = true
      } else if (!('onorientationchange' in window) || Math.min(window.screen.width, window.screen.height) >= widthMode) {
        // 恒定 pc
        isSingleMode = true
        uiMode = 'pc'
        isPCMode = true
      } else if (Math.max(window.screen.width, window.screen.height) < widthMode) {
        // 恒定 mobile
        isSingleMode = true
      } else {
        // 横竖屏切换的
        uiMode = getUiMode(widthMode)
        isPCMode = getIsPcMode(uiMode)
      }

      this.state = {
        isSingleMode,
        widthMode,
        uiMode: uiMode,
        isPCMode: isPCMode,
      }
    }

    componentDidMount() {
      console.log('this.state.isSingleMode :>> ', this.state.isSingleMode);
      if (!this.state.isSingleMode) {
        mqlMedia.addListener(this.mediaChange)
      }
    }

    componentWillUnmount() {
      if (!this.state.isSingleMode) {
        mqlMedia.removeListener(this.mediaChange)
      }
    }

    // 横竖屏切换后，需要再监听一下 onResize 事件后判断 maxWidth 才是准确的
    mediaChange = () => {
      // console.log('mediaChange 2 :>> ', 2);
      // orientationChanged().then(() => {
        
      // })
      console.log('afterMediaChange 3 :>> ', 3);
      const { uiMode, widthMode } = this.state
      let newUiMode = getUiMode(widthMode)

      if (newUiMode !== uiMode) {
        this.setState({
          uiMode: newUiMode,
          isPCMode: getIsPcMode(newUiMode)
        })
      }
      // var afterMediaChange = () => {
      //   window.removeEventListener('resize', afterMediaChange)
      // };
      // window.addEventListener('resize', afterMediaChange)
    }

    render() {
      return <Cmp {...this.state} {...this.props} />
    }
  }
}


export default (options: OptionsProps) => {
  return (Cmp: React.ComponentType) => withUiMode(Cmp, options)
}
