import * as React from 'react'
import './constants.css';

// 输出当前屏幕模式
// const getUiMode = (widthMediaString: string) => {
  
//   let widthMediaQuery = window.matchMedia(widthMediaString)
//   console.log('width,height', window.innerWidth, window.innerHeight)
//   let uiMode = !widthMediaQuery.matches ? 'pc' : 'mobile'
//   console.log('widthMediaString :>> ', widthMediaString, widthMediaQuery, '模式：', uiMode);
//   return uiMode

// }
// 输出当前屏幕模式
const getUiModeOrientation = (widthMedia: number) => {
  console.log('newUiMode onOrientationChange:>> ', );
  const compareWidth = window.orientation === 0 || window.orientation === 180
    ? Math.min(window.screen.height, window.screen.width)
    : Math.max(window.screen.height, window.screen.width)

  const uiMode = compareWidth < widthMedia ? 'mobile' : 'pc'
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
  widthMedia?: number,
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
  widthMedia: number,
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
      let { widthMedia = 1000, isPadWechatMobile = false } = options
      let uiMode = 'mobile'
      let isPCMode = false
      let isSingleMode = false
      console.log('window.innerWidth :>> ', window.innerWidth, window.innerHeight);

      // 恒定 pc
      if (!('onorientationchange' in window)) {
        isSingleMode = true
        uiMode = 'pc'
        isPCMode = true
      } else if (isPadWechatMobile && isPadWeixin()) {
        isSingleMode = true
      } else if (Math.max(window.screen.height, window.screen.width) < widthMedia) {
        // 恒定 mobile
        isSingleMode = true
      } else {
        // 横竖屏切换的
        uiMode = getUiModeOrientation(widthMedia)
        isPCMode = getIsPcMode(uiMode)
      }

      this.state = {
        isSingleMode,
        widthMedia,
        uiMode: uiMode,
        isPCMode: isPCMode,
      }
    }

    componentDidMount() {
      if (!this.state.isSingleMode) {
        window.addEventListener('orientationchange', this.onOrientationChange, false)
      }
    }

    componentWillUnmount() {
      if (!this.state.isSingleMode) {
        window.removeEventListener('orientationchange', this.onOrientationChange, false)
      }
    }

    onOrientationChange = () => {
      let newUiMode = getUiModeOrientation(this.state.widthMedia)
      console.log('newUiMode :>> ', newUiMode, this.state.uiMode);
      if (newUiMode !== this.state.uiMode) {
        this.setState({
          isPCMode: getIsPcMode(newUiMode),
          uiMode: newUiMode
        })
      }
    }

    render() {
      console.log('render window.innerWidth222 :>> ', window.innerWidth, window.innerHeight);
      return <Cmp {...this.state} {...this.props} />
    }
  }
}


export default (options: OptionsProps) => {
  return (Cmp: React.ComponentType) => withUiMode(Cmp, options)
}
