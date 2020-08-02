import * as React from 'react'
import './constants.css';

// const userAgent = window.navigator.userAgent
// const userAgentLowerCase = userAgent.toLocaleLowerCase()

// const isWeixin = () => {
//   let result = userAgentLowerCase.match(/micromessenger/i)
//   let resultStr = Array.isArray(result) && result[0] ? result[0] : result
//   return resultStr === 'micromessenger'
// }

const mqlMedia = window.matchMedia('(orientation: portrait)')
// const isPadWeixin = isWeixin() && userAgentLowerCase.includes('ipad')

function onMatchMediaChange(mql:any = mqlMedia) {
  if (mql.matches) {
    //竖屏
    // console.log('此时竖屏')
    return 'portrait'
  } else {
    //横屏
    // console.log('此时横屏')
    return 'horizontal'
  }

}

// 输出当前屏幕模式
const getUiMode = (mql: MediaQueryList | MediaQueryListEvent) => {

  // if (isPadWeixin) return 'mobile'

  if (!('onorientationchange' in window)) return 'pc'

  // if (!('onchange' in mqlMedia)) return 'mobile'
  console.log('mql :>> ', mql);

  let status = onMatchMediaChange(mql)
  console.log('status :>> ', status);
  let width = status === 'portrait' ? Math.min(window.screen.width, window.screen.height) : Math.max(window.screen.width, window.screen.height)

  if (width > 1000) return 'pc'

  return 'mobile'

}

const getIsPcMode = (uiMode: string) => uiMode === 'pc'


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
      let uiMode = getUiMode(mqlMedia)
      let isPCMode = getIsPcMode(uiMode)
      const { widthMedia } = options
      console.log(1)
      console.log('mqlMedia', mqlMedia, 'onchange' in mqlMedia, mqlMedia.onchange)
      console.log('widthMedia :>> ', widthMedia);
      console.log('2 :>> ', 2);
      this.state = {
        uiMode: uiMode,
        isPCMode: isPCMode,
      }
    }

    componentDidMount() {
      // if(('onchange' in mqlMedia)) {
        mqlMedia.addListener(this.changeUiMode)
      // } else {
      //   window.addEventListener('orientationchange', this.onOrientationChange)
      // }
    }

    componentWillUnmount() {
      // if ('onchange' in mqlMedia) {
        mqlMedia.removeListener(this.changeUiMode)
      // } else {
      //   window.removeEventListener('orientationchange', this.onOrientationChange)
      // }
    }

    changeUiMode = (mqlEvent: MediaQueryListEvent) => {
      console.log('mqlEvent.matches :>> ', mqlEvent.matches);
      console.log('"change" :>> ', mqlEvent);
      let newUiMode = getUiMode(mqlEvent)

      if (newUiMode !== this.state.uiMode) {
        this.setState({
          isPCMode: getIsPcMode(newUiMode),
          uiMode: newUiMode
        })
      }
    }

    // onOrientationChange = () => {

    //   console.log('orientation :>> ', window.orientation);
    //   setTimeout(() => {
    //     let mqlNow = window.matchMedia('(orientation: portrait)')
    //     console.log('mqlNow :>> ', mqlNow);
    //     let newUiMode = getUiMode('', mqlNow)
    //     console.log('newUiMode :>> ', newUiMode);
    //     if (newUiMode !== this.state.uiMode) {
    //       this.setState({
    //         isPCMode: getIsPcMode(newUiMode),
    //         uiMode: newUiMode
    //       })
    //     }
        
    //   }, 30);
    // }

    render() {
      return <Cmp {...this.state} {...this.props} />
    }
  }
}


export default (options: OptionsProps) => {
  return (Cmp: React.ComponentType) => withUiMode(Cmp, options)
}
