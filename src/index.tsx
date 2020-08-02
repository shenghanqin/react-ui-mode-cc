import * as React from 'react'
import './constants.css'
let mqlMedia = window.matchMedia('(orientation: portrait)') 

// 输出当前屏幕模式
// const getUiMode = (widthModeString: string) => {
  
//   let widthModeQuery = window.matchMedia(widthModeString)
//   let uiMode = !widthModeQuery.matches ? 'pc' : 'mobile'
//   return uiMode

// }

// 输出当前屏幕模式
const getUiModeOrientation = (widthMode: number) => {
  const compareWidth = window.orientation === 0 || window.orientation === 180
    ? Math.min(window.screen.width, window.screen.height)
    : Math.max(window.screen.width, window.screen.height)

  const uiMode = compareWidth < widthMode ? 'mobile' : 'pc'
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
  orientation: string
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
        uiMode = getUiModeOrientation(widthMode)
        isPCMode = getIsPcMode(uiMode)
      }

      this.state = {
        orientation: '',
        isSingleMode,
        widthMode,
        uiMode: uiMode,
        isPCMode: isPCMode,
      }
    }

    componentDidMount() {
      mqlMedia.addListener(this.changeUiMode)
      if (!this.state.isSingleMode) {
        window.addEventListener('orientationchange', this.onOrientationChange, false)
      }
    }

    componentWillUnmount() {
      if (!this.state.isSingleMode) {
        window.removeEventListener('orientationchange', this.onOrientationChange, false)
      }
      mqlMedia.addListener(this.changeUiMode)
    }

    changeUiMode = (mql: MediaQueryListEvent) => {
      console.log('组件内 changeUiMode mql :>> ', mql);
      console.log('matches :>> ', 'matches' in mql, '方向', mql.matches ? '竖屏' : '横屏');
      this.setState({
        orientation: mql.matches ? '竖屏' : '横屏'
      })
    } 

    onOrientationChange = () => {
      let newUiMode = getUiModeOrientation(this.state.widthMode)
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


export default (options: OptionsProps) => {
  return (Cmp: React.ComponentType) => withUiMode(Cmp, options)
}
