export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

export const getLocalStorage = (key) => {
  return localStorage.getItem(key);
};

export const removeLocalStorage = (key) => {
  return localStorage.removeItem(key);
};

export const valueToPercent = (max, value) => {
  return (value * 100) / max;
};

export const percentToValue = (max, value) => {
  return (value * max) / 100;
};

export const addId = (payload, keyId, keyName) => {
  return payload.map((item) => {
    item.id = item[keyId];
    item.name = item[keyName];
    return item;
  });
};
