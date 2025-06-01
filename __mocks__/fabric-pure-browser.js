// Mock for fabric-pure-browser
const fabric = {
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
      setCoords: jest.fn()
    };
    if (callback) callback(img);
    return img;
  }),
  Line: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockReturnThis(),
    setCoords: jest.fn()
  })),
  Rect: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockReturnThis(),
    setCoords: jest.fn()
  })),
  Circle: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockReturnThis(),
    setCoords: jest.fn()
  })),
  Polyline: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockReturnThis(),
    setCoords: jest.fn()
  })),
  Group: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockReturnThis(),
    setCoords: jest.fn(),
    add: jest.fn()
  })),
  Text: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockReturnThis(),
    setCoords: jest.fn()
  })),
  util: {
    loadImage: jest.fn().mockImplementation((url, callback) => {
      const img = new Image();
      callback(img);
      return img;
    })
  }
};

export default { fabric };
