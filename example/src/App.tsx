import React from 'react'

import withUiMode from '@xiaoxili/react-ui-mode-cc'
import '@xiaoxili/react-ui-mode-cc/dist/index.css'
import * as clipboard from 'clipboard-polyfill/text'

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

    console.log('uiMode :>> ', isPCMode, uiMode);

    return (
      <div className="page-container">
        <div onClick={this.copyToClipboard.bind(this, uaStr)}>
          <h2>当前设备标识符</h2>
          {uaStr}
        </div>
        <div onClick={this.copyToClipboard.bind(this, uiMode)}>
          <h2>当前屏幕模式</h2>
          {uiMode} ui
        </div>
        <div>
          <h2>isPCMode：</h2>
          {isPCMode ? 'true' : 'false'}
        </div>
      </div>
    )
  }
}


export default withUiMode({})(App)
