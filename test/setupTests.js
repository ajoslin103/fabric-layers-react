// Jest setup file
import '@testing-library/jest-dom';

// Mock the fabric.js library
jest.mock('fabric-pure-browser', () => {
  return {
    fabric: {
      Canvas: jest.fn().mockImplementation(() => ({
        add: jest.fn(),
        remove: jest.fn(),
        renderAll: jest.fn(),
        getContext: jest.fn().mockReturnValue({
          clearRect: jest.fn()
        }),
        setWidth: jest.fn(),
        setHeight: jest.fn(),
        on: jest.fn(),
        off: jest.fn()
      })),
      Image: jest.fn().mockImplementation((url, callback) => {
        const img = {
          set: jest.fn().mockReturnThis(),
          scale: jest.fn().mockReturnThis(),
          setCoords: jest.fn(),
          on: jest.fn()
        };
        if (callback) callback(img);
        return img;
      }),
      Group: jest.fn().mockImplementation(() => ({
        add: jest.fn(),
        set: jest.fn().mockReturnThis(),
        setCoords: jest.fn(),
        on: jest.fn(),
        bringToFront: jest.fn()
      })),
      Line: jest.fn().mockImplementation(() => ({
        set: jest.fn().mockReturnThis(),
        setCoords: jest.fn()
      })),
      Text: jest.fn().mockImplementation(() => ({
        set: jest.fn().mockReturnThis(),
        setCoords: jest.fn()
      })),
      Point: jest.fn().mockImplementation((x, y) => ({ x, y }))
    }
  };
});
