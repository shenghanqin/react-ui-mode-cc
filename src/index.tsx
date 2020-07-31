import * as React from 'react'
import './constants.css';

// const userAgent = window.navigator.userAgent
// const userAgentLowerCase = userAgent.toLocaleLowerCase()

// const isWeixin = () => {
//   let result = userAgentLowerCase.match(/micromessenger/i)
//   let resultStr = Array.isArray(result) && result[0] ? result[0] : result
//   return resultStr === 'micromessenger'
// }

// const mqlMedia = window.matchMedia('(orientation: portrait)')
// const isPadWeixin = isWeixin() && userAgentLowerCase.includes('ipad')

// function onMatchMediaChange(mql:any = mqlMedia) {
//   if (mql.matches) {
//     //竖屏
//     // console.log('此时竖屏')
//     return 'portrait'
//   } else {
//     //横屏
//     // console.log('此时横屏')
//     return 'horizontal'
//   }

// }

// 输出当前屏幕模式
const getUiMode = (widthMediaString: string) => {
  
  let widthMediaQuery = window.matchMedia(widthMediaString)
  console.log('widthMediaString :>> ', widthMediaString, widthMediaQuery);
  return !widthMediaQuery.matches ? 'pc' : 'mobile'

}

const getIsPcMode = (uiMode: string) => uiMode === 'pc'

const getWidthMediaString = (widthMedia: number) => `(max-width: ${widthMedia}px)`

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
  widthMedia?: number
}

export function withUiMode(Cmp: React.ComponentType, options: OptionsProps) {
  return class WithUIRem extends React.Component<UIProps, UIState> {
    constructor(props: UIProps) {
      super(props)
      // 恒定 pc
      // 恒定 mobile
      // 需要转换的
      
      
      const { widthMedia = 1023 } = options
      let widthMediaString = getWidthMediaString(widthMedia)
      let widthMediaQuery = window.matchMedia(widthMediaString)
      console.log('this.widthMediaString :>> ', widthMediaString)
      console.log(1, widthMediaQuery)
      
      let uiMode = 'mobile'
      let isPCMode = false
      let isSingleMode = false

      if (!('onorientationchange' in window)) {
        isSingleMode = true
        uiMode = 'pc'
        isPCMode = true
      } else if (Math.max(window.innerWidth, window.innerHeight) < widthMedia) {
        isSingleMode = true
      } else {
        uiMode = getUiMode(widthMediaString)
        // uiMode = getUiMode(mqlMedia)
        isPCMode = getIsPcMode(uiMode)
        // console.log('mqlMedia', mqlMedia, 'onchange' in mqlMedia, mqlMedia.onchange)
        // console.log('widthMedia :>> ', widthMedia);

        // console.log('2 :>> ', 2);


      }

      console.log('isSingleMode :>> ', isSingleMode);


      this.state = {
        isSingleMode,
        widthMedia,
        widthMediaString,
        uiMode: uiMode,
        isPCMode: isPCMode,
      }
    }

    componentDidMount() {
      // if(('onchange' in mqlMedia)) {
      //   mqlMedia.addListener(this.changeUiMode)
      // } else {
        window.addEventListener('orientationchange', this.onOrientationChange)
      // }
    }

    componentWillUnmount() {
      // if ('onchange' in mqlMedia) {
      //   mqlMedia.removeListener(this.changeUiMode)
      // } else {
        window.removeEventListener('orientationchange', this.onOrientationChange)
      // }
    }

    changeUiMode = (event: MediaQueryListEvent) => {
      console.log('"change" :>> ', event);
      let newUiMode = getUiMode(this.state.widthMediaString)
      if (newUiMode !== this.state.uiMode) {
        this.setState({
          isPCMode: getIsPcMode(newUiMode),
          uiMode: newUiMode
        })
      }
    }

    onOrientationChange = () => {

      console.log('orientation :>> ', window.orientation);
      setTimeout(() => {
        // let mqlNow = window.matchMedia('(orientation: portrait)')
        // console.log('mqlNow :>> ', mqlNow);
        let newUiMode = getUiMode(this.state.widthMediaString)
        console.log('newUiMode :>> ', newUiMode);
        if (newUiMode !== this.state.uiMode) {
          this.setState({
            isPCMode: getIsPcMode(newUiMode),
            uiMode: newUiMode
          })
        }
        
      }, 30);
    }

    render() {
      return <Cmp {...this.state} {...this.props} />
    }
  }
}


export default (options: OptionsProps) => {
  return (Cmp: React.ComponentType) => withUiMode(Cmp, options)
}
