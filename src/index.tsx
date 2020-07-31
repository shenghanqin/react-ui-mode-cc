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
const getUiMode = (uiMode = '', mql: MediaQueryList | MediaQueryListEvent) => {
  if (uiMode) return uiMode
  
  // if (isPadWeixin) return 'mobile'

  if (!('onorientationchange' in window)) return 'pc'
  console.log('mql :>> ', mql);

  let status = onMatchMediaChange(mql)
  console.log('status :>> ', status);
  let width = status === 'portrait' ? Math.min(window.innerWidth, window.innerHeight) : Math.max(window.innerWidth, window.innerHeight)

  if (width > 1040) return 'pc'

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
      let uiMode = getUiMode('', mqlMedia)
      let isPCMode = getIsPcMode(uiMode)
      const { widthMedia } = options
      console.log(1)
      // console.log('mqlMedia', mqlMedia)
      console.log('widthMedia :>> ', widthMedia);
      console.log('2 :>> ', 2);
      this.state = {
        uiMode: uiMode,
        isPCMode: isPCMode,
      }
    }

    componentDidMount() {
      mqlMedia.addListener(this.changeUiMode)
    }

    componentWillUnmount() {
      mqlMedia.removeListener(this.changeUiMode)
    }

    changeUiMode = (event: MediaQueryListEvent) => {
      console.log('"change" :>> ', event);
      const { target = {} } = event
      console.log('mql :>> ', target);
      let newUiMode = getUiMode('', event)
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
