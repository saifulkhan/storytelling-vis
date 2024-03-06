export function getObjectKeysArray(obj: any[]): string[] {
  // function to check if a value is an object
  const isObject = (value) => {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  };

  // ensure the array is not empty and contains objects
  if (!Array.isArray(obj) || obj.length === 0 || !isObject(obj[0])) {
    return [];
  }

  // extract keys from the first object
  const keys = Object.keys(obj[0]);
  return keys;
}

export function sortObjectKeysInPlace(obj) {
  let keys = Object.keys(obj);
  keys.sort();
  let sortedObj = {};
  keys.forEach((key) => {
    sortedObj[key] = obj[key];
  });
  // Reassign the sorted keys to the original object
  Object.keys(sortedObj).forEach((key) => {
    obj[key] = sortedObj[key];
  });
  return obj; // Optional: Return the sorted object
}
