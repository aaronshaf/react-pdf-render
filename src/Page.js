import React, { Component } from 'react'
import TextLayer from './TextLayer'
import PDFJSTextLayer from './PDFJSTextLayer'

export default class Page extends Component {
  state = {
    pdfPage: null
  }

  setCanvasRef = node => {
    this.canvas = node
  }

  componentDidMount() {
    this.props.pdf.getPage(1).then(pdfPage => {
      const pageViewport = pdfPage.getViewport(this.props.scale)
      this.setState(state => {
        return { ...state, pdfPage, pageViewport }
      }, this.updateCanvas)

      pdfPage.getOperatorList().then(function(opList) {
        console.debug({ opList })
      })
    })
  }

  updateCanvas = () => {
    const pdfPage = this.state.pdfPage

    //
    // Prepare canvas using PDF page dimensions
    //
    const canvas = this.canvas
    const context = canvas.getContext('2d')
    canvas.height = this.state.pageViewport.height
    canvas.width = this.state.pageViewport.width

    //
    // Render PDF page into canvas context
    //
    const renderContext = {
      canvasContext: context,
      viewport: this.state.pageViewport
    }
    pdfPage.render(renderContext)
    this.loadTextLayer()
  }

  loadTextLayer = () => {
    if (!this.state.pdfPage) {
      return
    }
    this.state.pdfPage
      .getTextContent({ normalizeWhitespace: true })
      .then(textContent => {
        this.setState(state => ({ ...state, textContent }))
      })
      .catch(error => {
        console.error('GET_TEXT_CONTENT_ERROR', error)
      })
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <canvas
          ref={this.setCanvasRef}
          style={{
            border: '1px solid black'
          }}
        />
        {this.state.textContent && (
          <PDFJSTextLayer
            pageNumber={1}
            pageViewport={this.state.pageViewport}
            textContent={this.state.textContent}
          />
        )}
        {this.state.textContent && (
          <TextLayer
            pageViewport={this.state.pageViewport}
            textContent={this.state.textContent}
          />
        )}
        {!this.state.textContent && 'uh oh'}
      </div>
    )
  }
}
