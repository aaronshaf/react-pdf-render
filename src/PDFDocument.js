import React, { Component } from 'react'
import Page from './Page'
import PDFJS from 'pdfjs-dist'

export default class PDFDocument extends Component {
  state = {
    pdf: null
  }

  componentDidMount() {
    PDFJS.getDocument(this.props.file).then(pdf => {
      this.setState({ pdf })
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.pdf && <Page scale={1.5} pdf={this.state.pdf} number={0} />}
      </div>
    )
  }
}
