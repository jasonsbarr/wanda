/**
 * Gets the type of an object property if it exists
 * @param {import("./types").Object} type
 * @param {string} name
 * @returns {import("./types").Type|null}
 */
export const propType = (type, name) => {
  const prop = type.properties.find(({ name: propName }) => propName === name);
  return prop ? prop.type : null;
};
