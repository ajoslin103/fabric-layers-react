// Mock for chai
const expect = (val) => ({
  to: {
    equal: (expected) => val === expected,
    be: {
      true: () => val === true,
      false: () => val === false,
      null: () => val === null,
      undefined: () => val === undefined,
      instanceof: (type) => val instanceof type
    },
    have: {
      property: (prop) => Object.prototype.hasOwnProperty.call(val, prop),
      length: (length) => val.length === length
    },
    deep: {
      equal: (expected) => JSON.stringify(val) === JSON.stringify(expected)
    }
  }
});

module.exports = { expect };
