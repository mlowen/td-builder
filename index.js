export function dependantProperty(func, deps) {
  func.dependencies = deps;
  return func;
}

function populate(key, obj, factory, overrides) {
  if (key in overrides) { return overrides[key]; }
  if (factory[key] instanceof Function) { return factory[key](obj, overrides); }

  return factory[key];
}

export default function build(factory, overrides = {}) {
  const order = (prev, current) => {
    if (prev.includes(current)) { return prev; }
    if (factory[current] instanceof Function && factory[current].dependencies) {
      return [ ...factory[current].dependencies.reduce(order, prev), current ];
    }

    return [ ...prev, current];
  }

  return Object.keys(factory).reduce(order, []).reduce((obj, key) => {
    return {
      ...obj,
      [key]: populate(key, obj, factory, overrides)
    };
  }, {});
}