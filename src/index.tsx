import * as React from 'react'
import './constants.css';

// 输出当前屏幕模式
const getUiMode = (widthMediaString: string) => {
  
  let widthMediaQuery = window.matchMedia(widthMediaString)
  console.log('widthMediaString :>> ', widthMediaString, widthMediaQuery);
  return !widthMediaQuery.matches ? 'pc' : 'mobile'

}

const getIsPcMode = (uiMode: string) => uiMode === 'pc'

const getWidthMediaString = (widthMedia: number) => `(max-width: ${widthMedia}px)`

export const isPadWeixin = () => {
  const userAgent = window.navigator.userAgent
  const userAgentLowerCase = userAgent.toLocaleLowerCase()
  return userAgentLowerCase.includes('micromessenger') && userAgentLowerCase.includes('ipad')
}

/**
 * rem适配, 适用于移动端适配
 * @export
 * @param {*} Cmp
 * @returns
 */
interface UIProps {
  isPCMode?: boolean
}

interface UIState {
  /**
   * 单一模式，要么是pc，要么是Mobile
   */
  isSingleMode: boolean
  widthMedia: number,
  widthMediaString: string,
  uiMode: string
  isPCMode: boolean
}
interface OptionsProps {
  widthMedia?: number,
  /**
   * iPad 微信使用 Mobile 模式
   */
  isPadWechatMobile?: boolean
}

/* ipad 5th 1024x 768 */
/* ipad 7th 1080x 810 */

export function withUiMode(Cmp: React.ComponentType, options: OptionsProps) {
  return class WithUIRem extends React.Component<UIProps, UIState> {
    constructor(props: UIProps) {
      super(props)
      
      // 需要转换的
      let { widthMedia = 1000, isPadWechatMobile = false } = options
      let widthMediaString = getWidthMediaString(widthMedia)
      
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
        // ipad mini 竖屏的innnerWidth与innerHeight为 768x954，与期望的设备高有差异
        isSingleMode = true
        console.log('2 :>> ', 2);
      } else {
        console.log('1 :>> ', 1);
        // 横竖屏切换的
        uiMode = getUiMode(widthMediaString)
        isPCMode = getIsPcMode(uiMode)
      }

      this.state = {
        isSingleMode,
        widthMedia,
        widthMediaString,
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
      // console.log(window.orientation, window.innerWidth)
       
      // console.log('newUiMode onOrientationChange:>> ', );
      // let compareWidth = window.orientation === 0 || window.orientation === 180
      //   ? Math.min(window.screen.height, window.screen.width)
      //   : Math.max(window.screen.height, window.screen.width)

      // let newUiMode = compareWidth < this.state.widthMedia ? 'mobile' : 'pc'
      // if (newUiMode !== this.state.uiMode) {
      //   this.setState({
      //     isPCMode: getIsPcMode(newUiMode),
      //     uiMode: newUiMode
      //   })
      // }
      setTimeout(() => {
        let newUiMode = getUiMode(this.state.widthMediaString)
        console.log('newUiMode :>> ', newUiMode, this.state.uiMode);
        if (newUiMode !== this.state.uiMode) {
          this.setState({
            isPCMode: getIsPcMode(newUiMode),
            uiMode: newUiMode
          })
        }
      }, 30);
    }

    render() {
      console.log('render window.innerWidth :>> ', window.innerWidth, window.innerHeight);
      return <Cmp {...this.state} {...this.props} />
    }
  }
}


export default (options: OptionsProps) => {
  return (Cmp: React.ComponentType) => withUiMode(Cmp, options)
}
