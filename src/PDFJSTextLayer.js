import './pdf_viewer.css'
import React from 'react'
import debounce from 'lodash/debounce'

// type Props = {|
//   pageNumber: number,
//   textContent: Object,
//   viewport: Object,
//   viewportHeight: number,
//   viewportWidth: number
// |}

export default class PDFJSTextLayer extends React.Component {
  constructor(props) {
    super(props)
    const isFirefox =
      window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    const isMSEdgeOrIE = Boolean(window.MSInputMethodContext)
    const isEnhancedTextSelectionEnabled =
      isFirefox === false && isMSEdgeOrIE === false
    this.state = {
      isEnhancedTextSelectionEnabled,
      isMSEdgeOrIE
    }
  }

  componentWillMount() {
    this.renderTextLayerDebounced = debounce(() => {
      this.renderTextLayerRequest = window.requestAnimationFrame(
        this.renderTextLayer
      )
    }, 200)
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.renderTextLayerRequest)
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const shouldUpdate: boolean =
      this.props.viewportHeight !== nextProps.viewportHeight ||
      this.props.viewportWidth !== nextProps.viewportWidth ||
      this.props.pageNumber !== nextProps.pageNumber ||
      this.props.textContent !== nextProps.textContent
    return shouldUpdate
  }

  componentDidUpdate() {
    this.renderTextLayerDebounced()
  }

  componentDidMount() {
    this.renderTextLayerRequest = window.requestAnimationFrame(
      this.renderTextLayer
    )
  }

  renderTextLayer = () => {
    Promise.resolve().then(() => {
      deleteAllChildNodes(this.div)

      let textLayerFrag = document.createDocumentFragment()
      this.textLayerRenderTask = window.PDFJS.renderTextLayer({
        textContent: this.props.textContent,
        // textContentStream: this.textContentStream,
        container: textLayerFrag,
        viewport: this.props.pageViewport,
        // textDivs: this.textDivs,
        // textContentItemsStr: this.textContentItemsStr,
        // timeout
        enhanceTextSelection: this.state.isEnhancedTextSelectionEnabled
      })
      this.textLayerRenderTask.promise.then(
        () => {
          this.div.appendChild(textLayerFrag)
        },
        reason => {
          console.debug({ reason })
          // Cancelled or failed to render text layer; skipping errors.
        }
      )
    })
  }

  setDiv = (node: HTMLElement | null) => {
    if (node instanceof HTMLElement) {
      this.div = node
    }
  }

  render() {
    return (
      <div
        className="PDFJSTextLayer-container"
        style={{
          height: `${this.props.viewportHeight}px`,
          width: `${this.props.viewportWidth}px`,
          position: 'absolute',
          left: 0,
          top: 0
        }}
      >
        <div className="textLayer" ref={this.setDiv} />
      </div>
    )
  }
}

function deleteAllChildNodes(node: HTMLElement): void {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}
