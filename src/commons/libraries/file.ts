import _ from "lodash";
import Papa from "papaparse";

export const checkFileExists = async (filePath: string) => {
  try {
    const response = await fetch(filePath);
    if (response.status !== 404) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("에러 발생: ", error);
  }
};

export async function ReadCsv(url: string) {
  const csvFilePath = url;
  const response = await fetch(csvFilePath);
  const reader = response.body?.getReader();
  const result = await reader?.read();
  const decoder = new TextDecoder("utf-8");
  const csvText = decoder.decode(result?.value);
  const parsedCsv = Papa.parse(csvText, {
    header: false,
    newline: "\n",
    fastMode: true,
    dynamicTyping: true,
  });
  return _.dropRight(_.drop(parsedCsv.data, 3), 1);
}
