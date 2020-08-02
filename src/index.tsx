import * as React from 'react'
import './constants.css'
let mqlMedia = window.matchMedia('(orientation: portrait)') 

// 输出当前屏幕模式
const getUiMode = (mql: MediaQueryList | MediaQueryListEvent, widthMode: number) => {

  // 竖屏
  let isPortrait = mql.matches

  // 设备宽
  let compareScreenWidth = isPortrait ? Math.min(window.screen.width, window.screen.height) : Math.max(window.screen.width, window.screen.height)
  // 网页宽
  let compareInnerWitdh = isPortrait ? Math.min(window.innerWidth, window.innerHeight) : Math.max(window.innerWidth, window.innerHeight)

  // 当屏幕宽与网页宽一致并且大于宽度断点，才认为是pc
  let uiMode = compareScreenWidth === compareInnerWitdh && compareScreenWidth > widthMode ? 'pc' : 'mobile'
  
  console.log('uiMode :>> ', compareScreenWidth, compareInnerWitdh, uiMode);

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

      console.log('max', Math.max(window.screen.width, window.screen.height))
      
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
        uiMode = getUiMode(mqlMedia, widthMode)
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
      console.log('this.state.isSingleMode :>> ', this.state.isSingleMode);
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
      console.log('组件内 mqlEvent :>> ', mqlEvent);
      console.log('组件内 mqlEvent.matches :>> ', mqlEvent.matches);
      const { uiMode, widthMode } = this.state
      let newUiMode = getUiMode(mqlEvent, widthMode)

      if (newUiMode !== uiMode) {
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
