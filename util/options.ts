export const numberFormatter = (num: number) => {
  let newNumber = "";

  if (num >= 1000000000) {
    newNumber = (num / 1000000000).toFixed(1) + "B";
  } else if (num >= 1000000) {
    newNumber = (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    newNumber = (num / 1000).toFixed(1) + "K";
  } else {
    newNumber = `${num}`;
  }

  return newNumber;
};
