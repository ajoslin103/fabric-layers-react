import { Layer } from '../../src/layer/Layer';

describe('Layer', () => {
  let layer;
  
  beforeEach(() => {
    // Create a new layer instance before each test
    layer = new Layer({
      id: 'test-layer',
      label: 'Test Layer',
      draggable: true,
      zIndex: 5,
      opacity: 0.8
    });
  });
  
  test('should initialize with correct properties', () => {
    expect(layer.id).toBe('test-layer');
    expect(layer.label).toBe('Test Layer');
    expect(layer.draggable).toBe(true);
    expect(layer.zIndex).toBe(5);
    expect(layer.opacity).toBe(0.8);
  });
  
  test('should use default values when not provided', () => {
    const defaultLayer = new Layer({});
    expect(defaultLayer.label).toBe(null);
    expect(defaultLayer.draggable).toBe(false);
    expect(defaultLayer.zIndex).toBe(1);
    expect(defaultLayer.opacity).toBe(1);
  });
  
  test('should set style properties correctly', () => {
    expect(layer.style).toBeDefined();
    expect(layer.style.zIndex).toBe(5);
    expect(layer.style.draggable).toBe(true);
    expect(layer.style.id).toBe('test-layer');
  });
  
  test('should set cursor styles based on layer properties', () => {
    // Clickable layer should have pointer cursor
    const clickableLayer = new Layer({ clickable: true });
    expect(clickableLayer.hoverCursor).toBe('pointer');
    
    // Non-clickable layer should have default cursor
    const nonClickableLayer = new Layer({ clickable: false });
    expect(nonClickableLayer.hoverCursor).toBe('default');
    
    // Move cursor should be set to 'move'
    expect(layer.moveCursor).toBe('move');
  });
});
