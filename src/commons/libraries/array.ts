import _ from "lodash";

export const reduceArray = (arr: any[], n: number) => {
  if (n <= 1) {
    return arr;
  }
  return _.filter(arr, (_, i) => (i + 1) % n === 0);
};
