/**
 * CanvasLayer component
 * A React extension of the core CanvasLayer class
 */

import React from 'react';
import { CanvasLayer as CoreCanvasLayer } from 'fabric-layers';

/**
 * CanvasLayer - A specialized layer for canvas-based content with React integration
 * This extends the core CanvasLayer with React-specific functionality
 */
class CanvasLayer extends CoreCanvasLayer {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  /**
   * Initialize the canvas context
   */
  initCanvas() {
    if (this.canvasRef.current) {
      this.ctx = this.canvasRef.current.getContext('2d');
    }
  }

  /**
   * Clear the canvas
   */
  clearCanvas() {
    if (this.ctx && this.canvasRef.current) {
      this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    }
  }

  /**
   * Resize the canvas to match parent dimensions
   */
  resizeCanvas() {
    if (this.canvasRef.current && this.canvasRef.current.parentElement) {
      const parent = this.canvasRef.current.parentElement;
      this.canvasRef.current.width = parent.clientWidth;
      this.canvasRef.current.height = parent.clientHeight;
    }
  }

  /**
   * Component lifecycle method - after mounting
   */
  componentDidMount() {
    super.componentDidMount();
    this.initCanvas();
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  /**
   * Component lifecycle method - before unmounting
   */
  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }

  /**
   * Render method
   */
  render() {
    const { style, className, ...otherProps } = this.props;
    return React.createElement(
      'div',
      {
        className,
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          ...style
        }
      },
      React.createElement('canvas', {
        ref: this.canvasRef,
        ...otherProps,
        style: {
          display: 'block',
          width: '100%',
          height: '100%'
        }
      })
    );
  }
}

export default CanvasLayer;
