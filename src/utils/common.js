import moment from "moment";

const MAX_DAY_GENERATION = 3;

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

// Стоимость поездки без опций (offers)
export const getSumPrice = (array) => {
  return array.reduce((total, elem) => total + elem.price, 0);
};

export const getRandomDate = (date) => {
  const targetDate = new Date(date);
  const diffDays = getRandomIntegerNumber(0, MAX_DAY_GENERATION);
  const diffMinutes = getRandomIntegerNumber(0, 60);

  targetDate.setDate(targetDate.getDate() + diffDays);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date, mode = `show`) => {
  let result = ``;
  switch (mode) {
    case `datetime` :
      result = `YYYY-MM-DD-Thh:mm`;
      break;
    case `dayitem` :
      result = `YYYY-MM-DD`;
      break;
    default:
      // result = `${days}/${monthStr}/${years} ${hours}:${minutes}`;
      result = `DD/MM/YYYY hh:mm`;
      break;
  }
  return moment(date).format(result);
};

export const formatTimeDuration = (endDate, startDate) => {
  const date = endDate - startDate;
  const day = moment(date).format(`D`) - 1;
  const hours = moment(date).format(`H`);
  const minutes = moment(date).format(`mm`);

  return `${day > 0 ? day + `D` : ``} ${hours > 0 ? hours + `H` : ``} ${minutes > 0 ? minutes + `M` : ``}`;
};

export const upperCaseFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

