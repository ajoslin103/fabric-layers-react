// Mock for fabric module with all required properties pre-defined
class FabricObject {
  constructor(options = {}) {
    this.options = options;
    this.originX = 'center';
    this.originY = 'center';
    this.lockUniScaling = true;
    this.hasControls = false;
    this.hasBorders = false;
    this.selectable = false;
    this.hoverCursor = 'default';
    this.objectCaching = false;
  }
}

class FabricGroup extends FabricObject {
  constructor(objects, options = {}) {
    super(options);
    this.objects = objects || [];
    this.type = 'group';
    this.objectCaching = true;
    this.selectionBackgroundColor = 'rgba(45,207,171,0.25)';
  }
  
  add(object) {
    this.objects.push(object);
    return this;
  }
  
  remove(object) {
    const index = this.objects.indexOf(object);
    if (index !== -1) {
      this.objects.splice(index, 1);
    }
    return this;
  }
}

class FabricRect extends FabricObject {
  constructor(options = {}) {
    super(options);
    this.type = 'rect';
  }
}

class FabricCircle extends FabricObject {
  constructor(options = {}) {
    super(options);
    this.type = 'circle';
  }
}

class FabricCanvas {
  constructor(element) {
    this.element = element;
    this.objects = [];
  }
  
  add(object) {
    this.objects.push(object);
    return this;
  }
  
  remove(object) {
    const index = this.objects.indexOf(object);
    if (index !== -1) {
      this.objects.splice(index, 1);
    }
    return this;
  }
  
  renderAll() {
    return this;
  }
}

// Create the fabric object with all classes
const fabric = {
  Canvas: FabricCanvas,
  Object: FabricObject,
  Group: FabricGroup,
  Rect: FabricRect,
  Circle: FabricCircle
};

// Make fabric global for Constants.js
global.fabric = fabric;

module.exports = { fabric };
