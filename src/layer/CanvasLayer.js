/**
 * CanvasLayer component
 * A base layer for canvas-based components
 */

import React from 'react';
import { Layer } from './Layer';

/**
 * CanvasLayer - A specialized layer for canvas-based content
 * This provides a base implementation for canvas-based layers
 */
class CanvasLayer extends Layer {
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
