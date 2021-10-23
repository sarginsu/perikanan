export function SortString(value, nextValue) {
  const valueA = value && value.toUpperCase();
  const valueB = nextValue && nextValue.toUpperCase();
  if (valueA < valueB) {
    return -1;
  } else if (valueA > valueB) {
    return 1;
  }
  return 0;
}

export function SortStringDate(value, nextValue) {
  const valueA = new Date(value).getTime();
  const valueB = new Date(nextValue).getTime();
  if (valueA < valueB) {
    return -1;
  } else if (valueA > valueB) {
    return 1;
  }
  return 0;
}

export function SortNumber(value, nextValue) {
  const valueA = parseInt(value) || 0;
  const valueB = parseInt(nextValue) || 0;
  if (valueA < valueB) {
    return -1;
  } else if (valueA > valueB) {
    return 1;
  }
  return 0;
}