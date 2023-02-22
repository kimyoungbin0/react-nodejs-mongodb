export const addCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getRandomInt = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start + 1) + start);
};
