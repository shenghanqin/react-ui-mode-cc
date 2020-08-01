import React from 'react'

import withUiMode from '@xiaoxili/react-ui-mode-cc'
import '@xiaoxili/react-ui-mode-cc/dist/index.css'
import * as clipboard from 'clipboard-polyfill/text'
import Page from './components/page';

interface Props {
  isPCMode?: boolean
  uiMode?: string
}

console.log(clipboard)

const uaStr = window.navigator.userAgent

class App extends React.Component<Props, {}> {
  copyToClipboard = (str: string | undefined = '') => {
    console.log('str', str)
    clipboard.writeText(str).then(
      function () {
        console.log("success!")
      },
      function () {
        console.log("error!")
      }
    )
  }

  render() {
    const { isPCMode, uiMode } = this.props

    console.log('render uiMode :>> ', isPCMode, uiMode);

    return (
      <Page
        pageClassName={`page-container ${isPCMode ? 'page-mode-pc' : 'page-mode-mobile'}`}
        title={'融合响应式设计 React 版 - 小溪里'}
        isPCMode={isPCMode}
      >
        <div onClick={this.copyToClipboard.bind(this, uaStr)}>
          <h2>当前设备标识符</h2>
          {uaStr}
        </div>
        <div>
          <h2>当前屏幕模式</h2>
          {uiMode} ui
        </div>
        <div>
          <h2>设备宽高</h2>
          {window.innerWidth}x{window.innerHeight}
        </div>
        <div>
          <h2>isPCMode：</h2>
          {isPCMode ? 'true' : 'false'}
        </div>
      </Page>
    )
  }
}


export default withUiMode({
  // 区分模式的宽度
  widthMode: 1000,
  // iPad 微信恒定为 Mobile UI
  isPadWechatMobile: true
})(App)
