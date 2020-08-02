import React from 'react'

import withUiMode from '@xiaoxili/react-ui-mode-cc'
import * as clipboard from 'clipboard-polyfill/text'
import Page from './components/page';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let mqlMedia = window.matchMedia('(orientation: portrait)') 

interface Props {
  isPCMode?: boolean
  uiMode?: string
}
interface State {
  orientation?: string
}

const uaStr = window.navigator.userAgent

class App extends React.Component<Props, State> {
  constructor(props: Props){
    super(props)
    this.state = {
      orientation: mqlMedia.matches ? '竖屏' : '横屏'
    }
  }

  // 横竖屏切换监听 
  componentDidMount() {
    mqlMedia.addListener(this.changeUiMode)
  }
  componentWillUnmount() {
    mqlMedia.removeListener(this.changeUiMode)
  }
  changeUiMode = (mql: MediaQueryListEvent) => {
    console.log('changeUiMode mql :>> ', mql);
    this.setState({
      orientation: mql.matches ? '竖屏' : '横屏'
    })
  } 

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
    const { orientation } = this.state

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
            <h2>matchMedia 支持情况</h2>
            <p>屏幕方向：{orientation}</p>
            <p>addListener：{ 'addListener' in mqlMedia ? '支持' : '不支持'}</p>

          </div>
          <div>
            <h2>设备宽高：{window.screen.width}x{window.screen.height}</h2>
            <p>页面宽高 innerWidth：{window.innerWidth} innerHeight：{window.innerHeight}</p>
          </div>
          <div>
            <h2>当前屏幕模式</h2>
            {uiMode} ui
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
