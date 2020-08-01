import React from 'react'
import './styles.css'

export default class Page extends React.Component {
  static defaultProps = {
    isPCMode: false,
  }

  render() {
    const { isPCMode } = this.props

    console.log('header isPCMode :>> ', isPCMode);
    return (
      <header>
        <div className={`header-main ${isPCMode ? 'header-pc' : ''}`}>
          <h1 className="logo">
            <a href='/'>
              小溪里 xiaoxili.com
            </a>
          </h1>
          <nav className="main-nav">
            <a href='/'>首页</a>
            <a href='/blog' title="小溪里博客">博客</a>
            <a href='/hi-face' title="Hi头像教程">小册</a>
            <a href='/about.html'>关于</a>
          </nav>
        </div>
      </header>
    )
  }
}