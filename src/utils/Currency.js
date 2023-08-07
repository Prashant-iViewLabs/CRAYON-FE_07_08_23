import currencyFormatter from "currency-formatter";

export const formatCurrency = (value, currencyCode = "USD") => {
  return currencyFormatter.format(value, { code: currencyCode });
};

export const formatCurrencyWithCommas = (value, currencyCode) => {
  return currencyFormatter.format(value, { thousand: "," });
};
