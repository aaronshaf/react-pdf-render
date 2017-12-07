import './TextLayer.css'
import React, { Component } from 'react'
import TextItem from './TextItem'

type Props = {
  pageViewport: Object,
  textContent: Object
}

class TextLayer extends Component<Props> {
  render() {
    const styles = this.props.textContent.styles
    const textDivs = this.props.textContent.items.map((item, index) => {
      return (
        <TextItem
          key={index}
          item={item}
          itemStyle={styles[item.fontName]}
          pageViewport={this.props.pageViewport}
        />
      )
    })
    return <div className="TextLayer">{textDivs}</div>
  }
}

export default TextLayer
