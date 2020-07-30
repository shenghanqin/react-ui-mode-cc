import * as React from 'react'
import styles from './styles.module.css'

const userAgent = window.navigator.userAgent
const userAgentLowerCase = userAgent.toLocaleLowerCase()

const isWeixin = () => {
  let result = userAgentLowerCase.match(/micromessenger/i)
  let resultStr = Array.isArray(result) && result[0] ? result[0] : result
  return resultStr === 'micromessenger'
}

const mqlMedia = window.matchMedia('(orientation: portrait)')
const isPadWeixin = isWeixin() && userAgentLowerCase.includes('iad')

function onMatchMediaChange(mql = window.matchMedia('(orientation: portrait)')) {
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
const getUiMode = (uiMode = '', mql: MediaQueryList) => {
  if (uiMode) return uiMode
  if (isPadWeixin) return 'mobile'

  if (!('onorientationchange' in window)) return 'pc'

  let status = onMatchMediaChange(mql)
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
interface Props {
  text: string
}
interface OptionsProps {
  widthMedia: number
}

export function withUiMode(Cmp: React.ComponentType, options: OptionsProps) {
  return class WithUIRem extends React.Component {
    constructor(props: Props) {
      super(props)
      let uiMode = getUiMode('', mqlMedia)
      let isPCMode = getIsPcMode(uiMode)
      const { widthMedia } = options
      console.log('widthMedia :>> ', widthMedia);

      this.state = {
        uiMode: uiMode,
        isPCMode: isPCMode,
      }
    }
    render() 
    {
      return <Cmp {...this.state} {...this.props} />
    }
  }
}


export default (options: OptionsProps) => {
  return (Cmp: React.ComponentType) => withUiMode(Cmp, options)
}

export const ExampleComponent = ({ text }: Props) => {
  return <div className={styles.test}>Example Component: {text}</div>
}
