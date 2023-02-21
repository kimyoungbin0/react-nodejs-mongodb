let startDate: Date;

export const setDateTime = () => {
  startDate = new Date();
};

export const getDateTime = (ms?: number, mode?: string) => {
  let date = startDate || new Date();

  if (ms) {
    date = new Date(date.getTime() + ms);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  if (mode === "time") return `${hour}:${minute}:${second}`;
  else return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
