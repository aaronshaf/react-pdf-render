// @flow
import React, { Component } from 'react'
import { concatenateMatrices } from './utils'

type Props = {
  pageViewport: Object,
  textContent: Object
}

// reused to determine text size
const canvas = document.createElement('canvas')
const textCanvasContext = canvas.getContext('2d', { alpha: false })

export default class TextItem extends Component<Props> {
  render() {
    const item = this.props.item
    const itemStyle = this.props.itemStyle

    const tx = concatenateMatrices(
      this.props.pageViewport.transform,
      item.transform
    )
    const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3])

    textCanvasContext.font = `${fontHeight}px` + ' ' + itemStyle.fontFamily
    const measuredCanvasTextWidth = textCanvasContext.measureText(item.str)
      .width

    const canvasWidth =
      itemStyle.vertical === true
        ? item.height * this.props.pageViewport.scale
        : item.width * this.props.pageViewport.scale
    const scale = canvasWidth / measuredCanvasTextWidth
    const transform = [`scaleX( ${scale} )`]

    const angle = itemStyle.vertical
      ? Math.atan2(tx[1], tx[0]) + Math.PI / 2
      : Math.atan2(tx[1], tx[0])

    let fontAscent = fontHeight
    if (itemStyle.ascent) {
      fontAscent = itemStyle.ascent * fontAscent
    } else if (itemStyle.descent) {
      fontAscent = (1 + itemStyle.descent) * fontAscent
    }

    const left = angle === 0 ? tx[4] : tx[4] + fontAscent * Math.sin(angle)
    const top =
      angle === 0 ? tx[5] - fontAscent : tx[5] - fontAscent * Math.cos(angle)

    const style = {
      left: `${left}px`,
      top: `${top}px`,
      fontSize: `${fontHeight}px`,
      fontFamily: itemStyle.fontFamily,
      transform
    }

    return (
      <div className="TextItem" style={style}>
        {item.str}
      </div>
    )
  }
}
