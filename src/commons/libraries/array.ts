import _ from "lodash";

export const reduceArray = (arr: any[], n: number) => {
  if (arr !== undefined && arr.length > 0) {
    if (n <= 1) {
      return arr;
    }
    return _.filter(arr, (_, i) => (i + 1) % n === 0);
  }
  return [];
};

export const reduceMaxArray = (indexArr: any[], dataArr: any[], averageArr: any[], n: number) => {
  if (dataArr !== undefined && dataArr.length > 0) {
    if (n <= 1) {
      return {
        maxIndexArray: indexArr,
        maxDataArray: dataArr,
        maxAverageArray: averageArr,
      };
    }

    let maxIndexArray: any[] = [];
    let maxDataArray: any[] = [];
    let maxAverageArray: any[] = [];
    _.chunk(dataArr, n).forEach((chunk, i) => {
      const indexArrChunk = _.slice(indexArr, i * n, (i + 1) * n);
      const averageArrChunk = _.slice(averageArr, i * n, (i + 1) * n);
      const max = _.max(chunk);
      const maxIndex = _.indexOf(chunk, max);
      maxIndexArray.push(indexArrChunk[maxIndex]);
      maxDataArray.push(max);
      maxAverageArray.push(averageArrChunk[maxIndex]);
    });

    // console.log("maxIndexArray", maxIndexArray);
    // console.log("reduceMaxArray", maxDataArray);
    // console.log("reduceMaxAverageArray", maxAverageArray);

    return {
      maxIndexArray: maxIndexArray,
      maxDataArray: maxDataArray,
      maxAverageArray: maxAverageArray,
    };
  }
  return [];
};

export const getThresholdData = (arr1: any[], arr2: any[], arr3: any[], tv: number) => {
  let result = [];
  for (let i = 0; i < arr1.length; i++) {
    const sector = `${arr1[i][0]}~${arr1[i][arr1[i].length - 1]}`;
    const maxValue = Number(_.max(arr2[i]));
    const maxValueIndex = _.indexOf(arr2[i], maxValue);
    const maxIndex = arr1[i][maxValueIndex];
    const maxAverage = arr3[i][maxValueIndex];
    // if (maxValue >= tv) {
    //   result.push({ sector, maxIndex, maxValue, maxAverage });
    // }
    if ((Math.abs(maxValue - maxAverage) / Math.abs(maxAverage)) * 100 >= tv) {
      result.push({ sector, maxIndex, maxValue, maxAverage });
    }
  }
  return result;

  // 일부 값만 제거하는 경우 (상위 2개, 하위 2개 제거)
  // const sortedResult = _.orderBy(result, ["maxValue"], ["desc"]);
  // const topTwoMaxValues = sortedResult.slice(0, 2).map((obj) => obj.maxValue);
  // const bottomTwoMaxValues = sortedResult.slice(-2).map((obj) => obj.maxValue);
  // const filteredResult = sortedResult.filter((obj) => !topTwoMaxValues.includes(obj.maxValue) && !bottomTwoMaxValues.includes(obj.maxValue));
  // return filteredResult;
};

export const averageByColumn = (arr: any) => {
  // 배열의 길이를 열(column)의 개수로 사용합니다.
  const columnCount = arr[0].length;

  // 결과를 저장할 배열을 만듭니다.
  const result = new Array(columnCount).fill(0);

  // 각 열의 합을 구합니다.
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < columnCount; j++) {
      result[j] += arr[i][j];
    }
  }

  // 각 열의 평균을 구합니다.
  for (let j = 0; j < columnCount; j++) {
    result[j] /= arr.length;
  }

  return result;
};

export const subtractArrays = (arr1: any, arr2: any, length: number) => {
  // 결과를 저장할 배열을 만듭니다.
  const result = [];

  // 두 배열의 각 요소를 뺀 결과를 구합니다.
  for (let i = 0; i < arr1.length; i++) {
    // 현재 행(row)의 결과를 저장할 배열을 만듭니다.
    const row = [];

    // 현재 행(row)의 각 열(column)을 구합니다.
    for (let j = 0; j < arr1[i].length; j++) {
      const value = arr1[i][j] - arr2[j];
      row.push(Number(value.toFixed(length)));
    }

    // 현재 행(row)의 결과를 결과 배열에 추가합니다.
    result.push(row);
  }

  return result;
};

export const roundArray: any = (arr: any, length: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result.push(roundArray(arr[i]));
    } else {
      result.push(Number(arr[i].toFixed(length)));
    }
  }
  return result;
};
