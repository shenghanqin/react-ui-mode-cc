import React from 'react'

import withUiMode from '@xiaoxili/react-ui-mode-cc'
import '@xiaoxili/react-ui-mode-cc/dist/index.css'

interface Props {
  isPCMode?: boolean
  uiMode?: boolean
}
class App extends React.Component<Props, {}> {
  render() {
    const { isPCMode, uiMode } = this.props

    console.log('uiMode :>> ', isPCMode, uiMode);

    return (
      <div>1234</div>
    )
  }
}


export default withUiMode({})(App)
