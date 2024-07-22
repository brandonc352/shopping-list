import { headers } from "../../backendData/itemsData.js";
import { itemsData } from "../../backendData/itemsData.js";
export const transformItemsData = (data) => {
  return data.map((item) => ({
    ...item,
    selected: false, // Add the 'selected' property set to false
  }));
};

export const parsePricePerUnit = (pricePerUnit) => {
  const strValue = String(pricePerUnit); // Ensure pricePerUnit is a string
  const match = strValue.match(/(\d+(\.\d+)?)\s*(¢\/oz|¢\/fl oz|\/ea)/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[3],
    };
  }
  return null;
};

export const getHeaderValueIndex = (headerKey) => {
  return headers.findIndex((header) => header === headerKey);
};

export const sortItems = (items, sorting) => {
  return items.sort((a, b) => {
    const aValue = a[getHeaderValueIndex(sorting.key)];
    const bValue = b[getHeaderValueIndex(sorting.key)];

    if (sorting.key === headers[7]) {
      // Sorting by "Price Per Unit"
      const aParsed = parsePricePerUnit(aValue);
      const bParsed = parsePricePerUnit(bValue);

      if (aParsed && bParsed) {
        if (aParsed.unit === bParsed.unit) {
          return sorting.ascending
            ? aParsed.value - bParsed.value
            : bParsed.value - aParsed.value;
        } else {
          return sorting.ascending
            ? aParsed.unit.localeCompare(bParsed.unit)
            : bParsed.unit.localeCompare(aParsed.unit);
        }
      } else if (aParsed) {
        return sorting.ascending ? -1 : 1;
      } else if (bParsed) {
        return sorting.ascending ? 1 : -1;
      } else {
        return sorting.ascending
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    } else {
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return sorting.ascending ? aValue - bValue : bValue - aValue;
      } else {
        return sorting.ascending
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    }
  });
};

// Export other functions as needed
