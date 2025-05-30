import { ImageLayer } from '../../src/image/ImageLayer';
import { fabric } from 'fabric-pure-browser';

// Mock the fabric.Image class
jest.mock('fabric-pure-browser', () => {
  return {
    fabric: {
      Image: jest.fn().mockImplementation((url, callback) => {
        const img = {
          set: jest.fn().mockReturnThis(),
          scale: jest.fn().mockReturnThis(),
          setCoords: jest.fn(),
          on: jest.fn(),
          getWidth: jest.fn().mockReturnValue(100),
          getHeight: jest.fn().mockReturnValue(100),
          width: 100,
          height: 100
        };
        if (callback) callback(img);
        return img;
      })
    }
  };
});

describe('ImageLayer', () => {
  let imageLayer;
  
  beforeEach(() => {
    // Create a new image layer instance before each test
    imageLayer = new ImageLayer({
      id: 'test-image',
      url: 'https://example.com/test-image.jpg',
      position: { x: 100, y: 200 },
      width: 300,
      height: 200,
      opacity: 0.9,
      draggable: true
    });
  });
  
  test('should initialize with correct properties', () => {
    expect(imageLayer.id).toBe('test-image');
    expect(imageLayer.url).toBe('https://example.com/test-image.jpg');
    expect(imageLayer.position.x).toBe(100);
    expect(imageLayer.position.y).toBe(200);
    expect(imageLayer.width).toBe(300);
    expect(imageLayer.height).toBe(200);
    expect(imageLayer.opacity).toBe(0.9);
    expect(imageLayer.draggable).toBe(true);
    expect(imageLayer.class).toBe('image-layer');
  });
  
  test('should use default values when not provided', () => {
    const defaultImageLayer = new ImageLayer({
      url: 'https://example.com/default-image.jpg'
    });
    
    expect(defaultImageLayer.width).toBe(-1); // Auto width
    expect(defaultImageLayer.height).toBe(-1); // Auto height
    expect(defaultImageLayer.draggable).toBe(false);
    expect(defaultImageLayer.opacity).toBe(1);
  });
  
  test('should call fabric.Image to load the image', () => {
    expect(fabric.Image).toHaveBeenCalled();
    expect(fabric.Image.mock.calls[0][0]).toBe('https://example.com/test-image.jpg');
  });
  
  test('should handle image loading callback', () => {
    // Create a new image layer to trigger the callback
    const newImageLayer = new ImageLayer({
      url: 'https://example.com/new-image.jpg'
    });
    
    // The callback should have been called
    expect(fabric.Image).toHaveBeenCalledTimes(2);
    
    // The second call should be for our new image
    const mockCallback = fabric.Image.mock.calls[1][1];
    expect(typeof mockCallback).toBe('function');
    
    // Create a mock image object
    const mockImg = {
      set: jest.fn().mockReturnThis(),
      scale: jest.fn().mockReturnThis(),
      setCoords: jest.fn(),
      on: jest.fn(),
      getWidth: jest.fn().mockReturnValue(200),
      getHeight: jest.fn().mockReturnValue(150),
      width: 200,
      height: 150
    };
    
    // Call the callback with our mock image
    mockCallback(mockImg);
    
    // The image should have been set up correctly
    expect(mockImg.set).toHaveBeenCalledWith(expect.objectContaining({
      originX: 'center',
      originY: 'center',
      left: expect.any(Number),
      top: expect.any(Number)
    }));
  });
  
  test('should auto-scale image when width and height are not specified', () => {
    // Create a new image layer with auto dimensions
    const autoSizeImageLayer = new ImageLayer({
      url: 'https://example.com/auto-size.jpg',
      width: -1,
      height: -1
    });
    
    // The callback should have been called
    expect(fabric.Image).toHaveBeenCalledTimes(3);
    
    // The third call should be for our auto-size image
    const mockCallback = fabric.Image.mock.calls[2][1];
    
    // Create a mock image object
    const mockImg = {
      set: jest.fn().mockReturnThis(),
      scale: jest.fn().mockReturnThis(),
      setCoords: jest.fn(),
      on: jest.fn(),
      getWidth: jest.fn().mockReturnValue(300),
      getHeight: jest.fn().mockReturnValue(200),
      width: 300,
      height: 200
    };
    
    // Call the callback with our mock image
    mockCallback(mockImg);
    
    // The image should not have been scaled
    expect(mockImg.scale).not.toHaveBeenCalled();
  });
});
