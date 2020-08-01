import React from 'react'

import withUiMode from '@xiaoxili/react-ui-mode-cc'
import * as clipboard from 'clipboard-polyfill/text'
import Page from './components/page';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  isPCMode?: boolean
  uiMode?: string
}

const uaStr = window.navigator.userAgent

class App extends React.Component<Props, {}> {

  notify = (str: string = '') => toast(str)

  copyToClipboard = (str: string | undefined = '') => {
    console.log('str', str)
    clipboard.writeText(str).then(
      () => {
        this.notify('复制成功')
      },
      () => {
        this.notify('复制失败!')
      }
    )
  }

  render() {
    const { isPCMode, uiMode } = this.props

    console.log('render uiMode :>> ', isPCMode, uiMode);

    return (
      <Page
        pageClassName={`page-home ${isPCMode ? 'page-mode-pc' : 'page-mode-mobile'}`}
        title={'融合响应式设计 React 版 - 小溪里'}
        isPCMode={isPCMode}
      >
        <div className="page-container">
          <div onClick={this.copyToClipboard.bind(this, uaStr)}>
            <h2>当前设备 UserAgent（点击可复制）</h2>
            <div style={{ wordBreak: 'break-all' }}>{uaStr}</div>
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
        </div>
        <ToastContainer position="bottom-center" />
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
