import * as React from 'react'
import './constants.css'
let mqlMedia = window.matchMedia('(orientation: portrait)') 

// 输出当前屏幕模式
const getUiMode = (mql: MediaQueryList | MediaQueryListEvent) => {

  let width = mql.matches ? Math.min(window.screen.width, window.screen.height) : Math.max(window.screen.width, window.screen.height)

  if (width > 1000) return 'pc'

  return 'mobile'

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
        uiMode = getUiMode(mqlMedia)
        isPCMode = getIsPcMode(uiMode)
      }

      console.log('isSingleMode :>> ', isSingleMode);
      this.state = {
        orientation: '',
        isSingleMode,
        widthMode,
        uiMode: uiMode,
        isPCMode: isPCMode,
      }
    }

    componentDidMount() {
      if (!this.state.isSingleMode) {
        mqlMedia.addListener(this.changeUiMode)

      }
    }

    componentWillUnmount() {
      if (!this.state.isSingleMode) {
        mqlMedia.removeListener(this.changeUiMode)
      }
    }

    changeUiMode = (mqlEvent: MediaQueryListEvent) => {
      console.log('组件内 mqlEvent.matches :>> ', mqlEvent.matches);
      console.log('"change" :>> ', mqlEvent);
      let newUiMode = getUiMode(mqlEvent)

      if (newUiMode !== this.state.uiMode) {
        this.setState({
          uiMode: newUiMode,
          isPCMode: getIsPcMode(newUiMode)
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
